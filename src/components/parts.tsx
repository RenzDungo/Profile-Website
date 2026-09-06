import { AXIAL, CAP, SMD } from "./pcbPattern";
import type { CapPart, ResistorPart, SmdPart } from "./pcbPattern";

// Standard 4-band resistor colour code: digit colours 0-9, then a gold
// tolerance band. Values are decoded into two significant digits and a
// power-of-ten multiplier exactly the way you would read a real part.
const BAND_COLORS = [
  "#111111", // 0 black
  "#7a3b12", // 1 brown
  "#d42020", // 2 red
  "#f07a1e", // 3 orange
  "#f3d21b", // 4 yellow
  "#1f9d3a", // 5 green
  "#2560d8", // 6 blue
  "#8a3fc9", // 7 violet
  "#8c8c8c", // 8 grey
  "#f4f4f4", // 9 white
];
const GOLD = "#c9a13a";

function resistorBands(ohms: number): [string, string, string] {
  let v = ohms;
  let exp = 0;
  while (v >= 100) {
    v /= 10;
    exp++;
  }
  while (v < 10 && v > 0) {
    v *= 10;
    exp--;
  }
  const d1 = Math.floor(v / 10);
  const d2 = Math.round(v % 10);
  return [BAND_COLORS[d1], BAND_COLORS[d2], exp >= 0 ? BAND_COLORS[exp] : GOLD];
}

function formatOhms(ohms: number) {
  if (ohms >= 1e6) return `${ohms / 1e6}M`;
  if (ohms >= 1e3) return `${ohms / 1e3}k`;
  return `${ohms}`;
}

// Shared gradient definitions, rendered once per SVG.
export function PartDefs() {
  return (
    <defs>
      <linearGradient id="pcb-res-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#efdcb3" />
        <stop offset="0.45" stopColor="#d6bb8a" />
        <stop offset="1" stopColor="#a9885a" />
      </linearGradient>
      <linearGradient id="pcb-smd-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2d31" />
        <stop offset="1" stopColor="#0f1114" />
      </linearGradient>
      <linearGradient id="pcb-cap-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3a4a6a" />
        <stop offset="1" stopColor="#1a2436" />
      </linearGradient>
      <linearGradient id="pcb-lead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d5dae0" />
        <stop offset="1" stopColor="#7d858d" />
      </linearGradient>
      <radialGradient id="pcb-pad" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#f6d98a" />
        <stop offset="0.75" stopColor="#d9a84b" />
        <stop offset="1" stopColor="#8a6a2e" />
      </radialGradient>
    </defs>
  );
}

function ThroughHolePad({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="url(#pcb-pad)" />
      <circle cx={x} cy={y} r={r * 0.42} fill="#06261c" />
    </g>
  );
}

function Designator({ x, y, label, anchor = "middle" }: { x: number; y: number; label: string; anchor?: "middle" | "start" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="pcb-silk-ref">
      {label}
    </text>
  );
}

export function AxialResistor({ part }: { part: ResistorPart }) {
  const [b1, b2, b3] = resistorBands(part.ohms);
  const half = AXIAL.pitch / 2;
  const bw = AXIAL.bodyW;
  const bh = AXIAL.bodyH;
  const rot = part.o === "v" ? 90 : 0;
  return (
    <g className="pcb-part pcb-part--resistor">
      <g transform={`translate(${part.x} ${part.y}) rotate(${rot})`}>
        <ThroughHolePad x={-half} y={0} r={AXIAL.padR} />
        <ThroughHolePad x={half} y={0} r={AXIAL.padR} />
        <line x1={-half} y1={0} x2={half} y2={0} stroke="url(#pcb-lead)" strokeWidth={1.8} strokeLinecap="round" />
        <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={bh / 2} fill="url(#pcb-res-body)" stroke="#7d6237" strokeWidth={0.6} />
        {/* Bands sit toward pin 1; the tolerance band sits alone at the far end. */}
        <rect x={-bw / 2 + 5} y={-bh / 2} width={3} height={bh} fill={b1} />
        <rect x={-bw / 2 + 10} y={-bh / 2} width={3} height={bh} fill={b2} />
        <rect x={-bw / 2 + 15} y={-bh / 2} width={3} height={bh} fill={b3} />
        <rect x={bw / 2 - 8} y={-bh / 2} width={3} height={bh} fill={GOLD} />
        {/* Glossy highlight along the top of the body. */}
        <rect x={-bw / 2 + 2} y={-bh / 2 + 1.2} width={bw - 4} height={2} rx={1} fill="rgba(255,255,255,0.28)" />
      </g>
      {part.o === "h" ? (
        <Designator x={part.x} y={part.y - 11} label={`${part.ref} ${formatOhms(part.ohms)}`} />
      ) : (
        <Designator x={part.x + 11} y={part.y + 3} label={`${part.ref} ${formatOhms(part.ohms)}`} anchor="start" />
      )}
    </g>
  );
}

export function SmdResistor({ part }: { part: SmdPart }) {
  const half = SMD.pitch / 2;
  const bw = SMD.bodyW;
  const bh = SMD.bodyH;
  const rot = part.o === "v" ? 90 : 0;
  return (
    <g className="pcb-part pcb-part--smd">
      <g transform={`translate(${part.x} ${part.y}) rotate(${rot})`}>
        <rect x={-half - SMD.padW / 2} y={-SMD.padH / 2} width={SMD.padW} height={SMD.padH} rx={1} fill="#d9a84b" opacity={0.9} />
        <rect x={half - SMD.padW / 2} y={-SMD.padH / 2} width={SMD.padW} height={SMD.padH} rx={1} fill="#d9a84b" opacity={0.9} />
        <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={1} fill="url(#pcb-smd-body)" stroke="#000" strokeWidth={0.5} />
        <rect x={-bw / 2} y={-bh / 2} width={3} height={bh} fill="#c8ccd1" />
        <rect x={bw / 2 - 3} y={-bh / 2} width={3} height={bh} fill="#c8ccd1" />
        <text x={0} y={2.2} textAnchor="middle" className="pcb-smd-code">
          {part.code}
        </text>
      </g>
      {part.o === "h" ? (
        <Designator x={part.x} y={part.y - 9} label={part.ref} />
      ) : (
        <Designator x={part.x + 9} y={part.y + 3} label={part.ref} anchor="start" />
      )}
    </g>
  );
}

export function Capacitor({ part }: { part: CapPart }) {
  const half = CAP.pitch / 2;
  const rot = part.o === "v" ? 90 : 0;
  return (
    <g className="pcb-part pcb-part--cap">
      <g transform={`translate(${part.x} ${part.y}) rotate(${rot})`}>
        <ThroughHolePad x={-half} y={0} r={CAP.padR} />
        <ThroughHolePad x={half} y={0} r={CAP.padR} />
        <circle cx={0} cy={0} r={CAP.r} fill="url(#pcb-cap-body)" stroke="#0d1420" strokeWidth={0.8} />
        {/* Electrolytic polarity stripe and vent cross on the can top. */}
        <path d={`M ${-CAP.r + 1.5} -3 A ${CAP.r} ${CAP.r} 0 0 0 ${-CAP.r + 1.5} 3`} stroke="#e6e9ee" strokeWidth={2.2} fill="none" />
        <path d="M -3 0 H 3 M 0 -3 V 3" stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} />
        <circle cx={0} cy={0} r={CAP.r - 2.5} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.6} />
      </g>
      {part.o === "h" ? (
        <Designator x={part.x} y={part.y - CAP.r - 4} label={part.ref} />
      ) : (
        <Designator x={part.x + CAP.r + 4} y={part.y + 3} label={part.ref} anchor="start" />
      )}
    </g>
  );
}
