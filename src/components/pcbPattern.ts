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

interface Point {
  x: number;
  y: number;
}

// Turns a grid-walked polyline into a path with 45-degree chamfered corners,
// matching the look of the functional traces drawn by PCBTraces.
function chamferPolyline(points: Point[], chamfer: number): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const segs: string[] = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    if (!next) {
      segs.push(`L ${curr.x} ${curr.y}`);
      continue;
    }
    const inDx = curr.x - prev.x;
    const inDy = curr.y - prev.y;
    const inLen = Math.hypot(inDx, inDy) || 1;
    const outDx = next.x - curr.x;
    const outDy = next.y - curr.y;
    const outLen = Math.hypot(outDx, outDy) || 1;
    const c = Math.min(chamfer, inLen / 2, outLen / 2);
    segs.push(`L ${curr.x - (inDx / inLen) * c} ${curr.y - (inDy / inLen) * c}`);
    segs.push(`L ${curr.x + (outDx / outLen) * c} ${curr.y + (outDy / outLen) * c}`);
  }
  return segs.join(" ");
}

export interface CircuitPattern {
  width: number;
  height: number;
  paths: string[];
  vias: { x: number; y: number; r: number }[];
}

// Real PCB traces on one copper layer never touch or cross -- they keep a
// clearance gap comparable to their own width, and any two nets that must
// cross do so via a via to another layer. We approximate that here with a
// shared occupancy grid: each walker's segments are checked against every
// previously-committed trace before being accepted, so the whole board
// routes like a rat's nest that never actually overlaps itself.
const GRID = 6; // px per occupancy cell
const CLEARANCE = 1; // keep-out radius in cells (~12px total gap -- several times the 2px stroke width)

function cellKey(gx: number, gy: number) {
  return gx * 100000 + gy;
}

function sample(x1: number, y1: number, x2: number, y2: number, skipStart: boolean, fn: (x: number, y: number) => void) {
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

function segmentBlocked(occupied: Set<number>, x1: number, y1: number, x2: number, y2: number): boolean {
  let blocked = false;
  // Skip the shared joint with the previous point -- only the new ground
  // this segment covers needs to be clear of *other* traces.
  sample(x1, y1, x2, y2, true, (x, y) => {
    if (blocked) return;
    const gx = Math.round(x / GRID);
    const gy = Math.round(y / GRID);
    if (occupied.has(cellKey(gx, gy))) blocked = true;
  });
  return blocked;
}

// Every walker runs from the top edge toward the bottom, alternating long
// straight vertical runs with true 45-degree diagonal runs and the
// occasional lateral dogleg -- the same move types a real autorouter uses --
// while checking each candidate move against the shared occupancy grid so
// it never crosses a trace laid down by an earlier walker. A walker that
// gets boxed in simply stops there, same as a real trace terminating at a
// pad, rather than cutting through a neighbor.
function generateCircuitPattern(width: number, height: number, seed: number, walkerCount: number): CircuitPattern {
  const rand = mulberry32(seed);
  const paths: string[] = [];
  const vias: CircuitPattern["vias"] = [];
  const occupied = new Set<number>();

  for (let w = 0; w < walkerCount; w++) {
    let x = ((w + rand()) / walkerCount) * width;
    let y = 0;
    const pts: Point[] = [{ x, y }];
    const segments: [number, number, number, number][] = [];

    while (y < height) {
      let placed = false;
      for (let attempt = 0; attempt < 10 && !placed; attempt++) {
        const shrink = 1 - attempt * 0.09;
        const mode = rand();
        let nx = x;
        let ny = y;
        if (mode < 0.78) {
          const dy = (50 + rand() * 170) * shrink;
          ny = Math.min(height, y + Math.max(14, dy));
        } else if (mode < 0.92) {
          const d = (16 + rand() * 34) * shrink;
          const dir = rand() < 0.5 ? -1 : 1;
          nx = Math.min(width, Math.max(0, x + d * dir));
          ny = Math.min(height, y + Math.max(8, d));
        } else {
          const dx = (20 + rand() * 40) * shrink * (rand() < 0.5 ? -1 : 1);
          nx = Math.min(width, Math.max(0, x + dx));
          ny = Math.min(height, y + 4);
        }

        if (!segmentBlocked(occupied, x, y, nx, ny)) {
          pts.push({ x: nx, y: ny });
          segments.push([x, y, nx, ny]);
          x = nx;
          y = ny;
          placed = true;
        }
      }

      // Last resort: a straight, minimal step forward never drifts any
      // closer to whatever boxed us in, so it almost always has room even
      // when every other candidate move above was rejected.
      if (!placed) {
        const ny = Math.min(height, y + 12);
        if (!segmentBlocked(occupied, x, y, x, ny)) {
          pts.push({ x, y: ny });
          segments.push([x, y, x, ny]);
          y = ny;
          placed = true;
        }
      }

      if (!placed) break; // truly boxed in on all sides -- terminate here
    }

    if (pts.length < 2) continue;
    paths.push(chamferPolyline(pts, 9));
    for (const [x1, y1, x2, y2] of segments) markSegment(occupied, x1, y1, x2, y2);

    for (let i = 1; i < pts.length - 1; i++) {
      if (rand() < 0.2) vias.push({ x: pts[i].x, y: pts[i].y, r: 2 });
    }
  }

  return { width, height, paths, vias };
}

// Generated once at module load and reused by every board so the decoration
// stays cheap and visually consistent across the site.
export const boardDecorPattern = generateCircuitPattern(1400, 900, 1337, 50);
