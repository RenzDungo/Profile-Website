// Deterministic pseudo-random generator so the decorative pattern is stable
// across renders instead of reshuffling every time a component re-mounts.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;

interface Point {
  x: number;
  y: number;
}

export type Orientation = "h" | "v";

export interface Via {
  x: number;
  y: number;
  r: number;
}

export interface ResistorPart {
  kind: "resistor";
  x: number;
  y: number;
  o: Orientation;
  ohms: number;
  ref: string;
}

export interface SmdPart {
  kind: "smd";
  x: number;
  y: number;
  o: Orientation;
  code: string;
  ref: string;
}

export interface CapPart {
  kind: "cap";
  x: number;
  y: number;
  o: Orientation;
  ref: string;
}

export type Part = ResistorPart | SmdPart | CapPart;

export interface CircuitPattern {
  width: number;
  height: number;
  paths: string[];
  vias: Via[];
  parts: Part[];
}

// Footprint geometry (px). Shared with the SVG renderers in parts.tsx so the
// occupancy grid and the drawn component always agree.
export const AXIAL = { pitch: 64, bodyW: 30, bodyH: 11, padR: 4.5 };
export const SMD = { pitch: 22, bodyW: 18, bodyH: 9, padW: 6, padH: 10 };
export const CAP = { pitch: 14, r: 9, padR: 3.2 };

const RESISTOR_VALUES = [100, 220, 330, 470, 1000, 2200, 4700, 10000, 22000, 47000, 100000, 1000000];
const SMD_CODES = ["103", "472", "1R0", "221", "4R7", "102", "0R0", "331", "104"];

// ---------------------------------------------------------------------------
// Occupancy grid. Real PCB traces on one copper layer never touch or cross --
// they keep a clearance gap comparable to their own width. Every trace and
// component footprint is stamped into this grid before anything else routes
// near it, so the whole board looks like it was autorouted without overlaps.
// ---------------------------------------------------------------------------
const GRID = 6; // px per occupancy cell
const CLEARANCE = 1; // keep-out radius in cells

function cellKey(gx: number, gy: number) {
  return gx * 100000 + gy;
}

function sample(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  skipStart: boolean,
  fn: (x: number, y: number) => void
) {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.max(1, Math.ceil(dist / (GRID / 2)));
  for (let s = skipStart ? 1 : 0; s <= steps; s++) {
    const t = s / steps;
    fn(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
  }
}

function markSegment(occupied: Set<number>, x1: number, y1: number, x2: number, y2: number) {
  sample(x1, y1, x2, y2, false, (x, y) => {
    const gx = Math.round(x / GRID);
    const gy = Math.round(y / GRID);
    for (let dx = -CLEARANCE; dx <= CLEARANCE; dx++) {
      for (let dy = -CLEARANCE; dy <= CLEARANCE; dy++) {
        occupied.add(cellKey(gx + dx, gy + dy));
      }
    }
  });
}

function markRect(occupied: Set<number>, cx: number, cy: number, halfW: number, halfH: number) {
  const gx1 = Math.floor((cx - halfW) / GRID) - CLEARANCE;
  const gx2 = Math.ceil((cx + halfW) / GRID) + CLEARANCE;
  const gy1 = Math.floor((cy - halfH) / GRID) - CLEARANCE;
  const gy2 = Math.ceil((cy + halfH) / GRID) + CLEARANCE;
  for (let gx = gx1; gx <= gx2; gx++) {
    for (let gy = gy1; gy <= gy2; gy++) occupied.add(cellKey(gx, gy));
  }
}

function rectBlocked(occupied: Set<number>, cx: number, cy: number, halfW: number, halfH: number) {
  const gx1 = Math.floor((cx - halfW) / GRID) - CLEARANCE;
  const gx2 = Math.ceil((cx + halfW) / GRID) + CLEARANCE;
  const gy1 = Math.floor((cy - halfH) / GRID) - CLEARANCE;
  const gy2 = Math.ceil((cy + halfH) / GRID) + CLEARANCE;
  for (let gx = gx1; gx <= gx2; gx++) {
    for (let gy = gy1; gy <= gy2; gy++) {
      if (occupied.has(cellKey(gx, gy))) return true;
    }
  }
  return false;
}

// The optional ignore circle lets a trace that starts on a component pad
// leave that pad's own keep-out zone without counting as a self-collision.
function segmentBlocked(
  occupied: Set<number>,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  ignore?: { x: number; y: number; r: number }
): boolean {
  let blocked = false;
  sample(x1, y1, x2, y2, true, (x, y) => {
    if (blocked) return;
    if (ignore && Math.hypot(x - ignore.x, y - ignore.y) <= ignore.r) return;
    const gx = Math.round(x / GRID);
    const gy = Math.round(y / GRID);
    if (occupied.has(cellKey(gx, gy))) blocked = true;
  });
  return blocked;
}

function r1(n: number) {
  return Math.round(n * 10) / 10;
}

// Turns a grid-walked polyline into a path with 45-degree chamfered corners,
// matching the look of the functional traces drawn by PCBTraces.
function chamferPolyline(points: Point[], chamfer: number): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${r1(points[0].x)} ${r1(points[0].y)}`;

  const segs: string[] = [`M ${r1(points[0].x)} ${r1(points[0].y)}`];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    if (!next) {
      segs.push(`L ${r1(curr.x)} ${r1(curr.y)}`);
      continue;
    }
    const inDx = curr.x - prev.x;
    const inDy = curr.y - prev.y;
    const inLen = Math.hypot(inDx, inDy) || 1;
    const outDx = next.x - curr.x;
    const outDy = next.y - curr.y;
    const outLen = Math.hypot(outDx, outDy) || 1;
    const c = Math.min(chamfer, inLen / 2, outLen / 2);
    segs.push(`L ${r1(curr.x - (inDx / inLen) * c)} ${r1(curr.y - (inDy / inLen) * c)}`);
    segs.push(`L ${r1(curr.x + (outDx / outLen) * c)} ${r1(curr.y + (outDy / outLen) * c)}`);
  }
  return segs.join(" ");
}

// ---------------------------------------------------------------------------
// Trace walker. Runs from a start point in a primary cardinal direction,
// mixing long straight runs, true 45-degree jogs and the occasional lateral
// dogleg -- the same move set a real autorouter uses -- and checks every
// candidate move against the shared occupancy grid. A walker that gets
// boxed in terminates on a via, like a net dropping to another layer.
// ---------------------------------------------------------------------------
interface Dir {
  dx: number;
  dy: number;
}

interface WalkOptions {
  start: Point;
  dir: Dir;
  maxLen: number;
  width: number;
  height: number;
  // First move must be a straight run of at least this length (leaving a pad).
  leadOut?: number;
  ignore?: { x: number; y: number; r: number };
}

interface WalkResult {
  pts: Point[];
  segments: [number, number, number, number][];
  hitEdge: boolean;
}

const EDGE = 4;

function walk(rand: Rand, occupied: Set<number>, opt: WalkOptions): WalkResult {
  const { dir, width, height } = opt;
  const perp: Dir = { dx: -dir.dy, dy: dir.dx };
  let x = opt.start.x;
  let y = opt.start.y;
  const pts: Point[] = [{ x, y }];
  const segments: WalkResult["segments"] = [];
  let budget = opt.maxLen;
  let hitEdge = false;
  let first = true;

  const clamp = (nx: number, ny: number): [number, number, boolean] => {
    const cx = Math.min(width - EDGE, Math.max(EDGE, nx));
    const cy = Math.min(height - EDGE, Math.max(EDGE, ny));
    return [cx, cy, cx !== nx || cy !== ny];
  };

  while (budget > 0) {
    let placed = false;
    for (let attempt = 0; attempt < 8 && !placed; attempt++) {
      const shrink = 1 - attempt * 0.1;
      const mode = first ? 0 : rand();
      let len: number;
      let mx: number;
      let my: number;
      if (mode < 0.66) {
        len = first ? (opt.leadOut ?? 12) + rand() * 30 : (36 + rand() * 130) * shrink;
        mx = dir.dx;
        my = dir.dy;
      } else if (mode < 0.9) {
        len = (12 + rand() * 34) * shrink;
        const side = rand() < 0.5 ? -1 : 1;
        // 45-degree move: unit diagonal so the run stays a true diagonal.
        mx = (dir.dx + perp.dx * side) * Math.SQRT1_2;
        my = (dir.dy + perp.dy * side) * Math.SQRT1_2;
      } else {
        len = (14 + rand() * 40) * shrink;
        const side = rand() < 0.5 ? -1 : 1;
        mx = perp.dx * side;
        my = perp.dy * side;
      }
      len = Math.max(8, Math.min(len, budget));
      const [nx, ny, clamped] = clamp(x + mx * len, y + my * len);
      const segLen = Math.hypot(nx - x, ny - y);
      if (segLen < 6) {
        if (clamped) hitEdge = true;
        continue;
      }
      if (!segmentBlocked(occupied, x, y, nx, ny, first ? opt.ignore : undefined)) {
        pts.push({ x: nx, y: ny });
        segments.push([x, y, nx, ny]);
        x = nx;
        y = ny;
        budget -= segLen;
        placed = true;
        first = false;
        if (clamped) hitEdge = true;
      }
    }
    if (!placed || hitEdge) break;
  }

  return { pts, segments, hitEdge };
}

// ---------------------------------------------------------------------------
// Component placement.
// ---------------------------------------------------------------------------
function footprint(part: Part): { halfW: number; halfH: number } {
  let w: number;
  let h: number;
  if (part.kind === "resistor") {
    w = AXIAL.pitch / 2 + AXIAL.padR + 1;
    h = AXIAL.bodyH / 2 + 2;
  } else if (part.kind === "smd") {
    w = SMD.pitch / 2 + SMD.padW / 2 + 1;
    h = SMD.padH / 2 + 1;
  } else {
    w = CAP.r + 2;
    h = CAP.r + 2;
  }
  return part.o === "h" ? { halfW: w, halfH: h } : { halfW: h, halfH: w };
}

// Pad centres of a part in board coordinates, plus the outward direction a
// trace should leave each pad in.
function pads(part: Part): { x: number; y: number; dir: Dir; r: number }[] {
  const pitch = part.kind === "resistor" ? AXIAL.pitch : part.kind === "smd" ? SMD.pitch : CAP.pitch;
  const padR = part.kind === "resistor" ? AXIAL.padR : part.kind === "smd" ? SMD.padH / 2 : CAP.padR;
  const half = pitch / 2;
  if (part.o === "h") {
    return [
      { x: part.x - half, y: part.y, dir: { dx: -1, dy: 0 }, r: padR },
      { x: part.x + half, y: part.y, dir: { dx: 1, dy: 0 }, r: padR },
    ];
  }
  return [
    { x: part.x, y: part.y - half, dir: { dx: 0, dy: -1 }, r: padR },
    { x: part.x, y: part.y + half, dir: { dx: 0, dy: 1 }, r: padR },
  ];
}

export function generateCircuitPattern(width: number, height: number, seed: number): CircuitPattern {
  const rand = mulberry32(seed);
  const occupied = new Set<number>();
  const paths: string[] = [];
  const vias: Via[] = [];
  const parts: Part[] = [];
  const area = width * height;

  // --- 1. Drop components onto free board space -------------------------
  const wantResistors = Math.max(6, Math.round(area / 42000));
  const wantSmd = Math.max(4, Math.round(area / 58000));
  const wantCaps = Math.max(2, Math.round(area / 160000));
  const margin = 40;

  let rIndex = 1;
  let cIndex = 1;
  const tryPlace = (make: (x: number, y: number, o: Orientation) => Part, count: number) => {
    let placed = 0;
    for (let attempt = 0; attempt < count * 12 && placed < count; attempt++) {
      const x = margin + rand() * (width - margin * 2);
      const y = margin + rand() * (height - margin * 2);
      const o: Orientation = rand() < 0.5 ? "h" : "v";
      const part = make(x, y, o);
      const fp = footprint(part);
      if (rectBlocked(occupied, x, y, fp.halfW, fp.halfH)) continue;
      // Leave room for the silkscreen designator as well.
      markRect(occupied, x, y, fp.halfW + (o === "v" ? 10 : 0), fp.halfH + (o === "h" ? 10 : 0));
      parts.push(part);
      placed++;
    }
  };

  tryPlace(
    (x, y, o) => ({
      kind: "resistor",
      x: Math.round(x),
      y: Math.round(y),
      o,
      ohms: RESISTOR_VALUES[Math.floor(rand() * RESISTOR_VALUES.length)],
      ref: `R${rIndex++}`,
    }),
    wantResistors
  );
  tryPlace(
    (x, y, o) => ({
      kind: "smd",
      x: Math.round(x),
      y: Math.round(y),
      o,
      code: SMD_CODES[Math.floor(rand() * SMD_CODES.length)],
      ref: `R${rIndex++}`,
    }),
    wantSmd
  );
  tryPlace(
    (x, y, o) => ({ kind: "cap", x: Math.round(x), y: Math.round(y), o, ref: `C${cIndex++}` }),
    wantCaps
  );

  const commit = (res: WalkResult, viaChance: number) => {
    if (res.pts.length < 2) return;
    paths.push(chamferPolyline(res.pts, 9));
    for (const [x1, y1, x2, y2] of res.segments) markSegment(occupied, x1, y1, x2, y2);
    for (let i = 1; i < res.pts.length - 1; i++) {
      if (rand() < 0.07) vias.push({ x: res.pts[i].x, y: res.pts[i].y, r: 2.4 });
    }
    const end = res.pts[res.pts.length - 1];
    if (!res.hitEdge && rand() < viaChance) vias.push({ x: end.x, y: end.y, r: 3 });
  };

  // --- 2. Wire every component pad out into the board -------------------
  for (const part of parts) {
    for (const pad of pads(part)) {
      if (rand() < 0.12) continue; // the odd unconnected pad looks natural
      const res = walk(rand, occupied, {
        start: { x: pad.x, y: pad.y },
        dir: pad.dir,
        maxLen: 60 + rand() * 220,
        width,
        height,
        leadOut: pad.r + 10,
        ignore: { x: pad.x, y: pad.y, r: pad.r + CLEARANCE * GRID + 3 },
      });
      commit(res, 0.85);
    }
  }

  // --- 3. Fill the remaining space with long bus-style runs from the edges
  const edgeWalkers: WalkOptions[] = [];
  const topCount = Math.round(width / 44);
  for (let i = 0; i < topCount; i++) {
    edgeWalkers.push({
      start: { x: ((i + rand()) / topCount) * width, y: EDGE },
      dir: { dx: 0, dy: 1 },
      maxLen: height * (0.25 + rand() * 0.7),
      width,
      height,
    });
  }
  const bottomCount = Math.round(width / 90);
  for (let i = 0; i < bottomCount; i++) {
    edgeWalkers.push({
      start: { x: ((i + rand()) / bottomCount) * width, y: height - EDGE },
      dir: { dx: 0, dy: -1 },
      maxLen: height * (0.15 + rand() * 0.4),
      width,
      height,
    });
  }
  const sideCount = Math.round(height / 140);
  for (let i = 0; i < sideCount; i++) {
    const fromLeft = rand() < 0.5;
    edgeWalkers.push({
      start: { x: fromLeft ? EDGE : width - EDGE, y: ((i + rand()) / sideCount) * height },
      dir: { dx: fromLeft ? 1 : -1, dy: 0 },
      maxLen: width * (0.1 + rand() * 0.35),
      width,
      height,
    });
  }
  for (const opt of edgeWalkers) commit(walk(rand, occupied, opt), 0.7);

  return { width, height, paths, vias, parts };
}
