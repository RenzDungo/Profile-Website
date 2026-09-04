import type { CircuitPattern } from "./pcbPattern";

interface PCBBackgroundProps {
  pattern: CircuitPattern;
  className?: string;
}

// Purely decorative, non-functional trace clutter that fills the dead space
// of a board. Sits behind the real chips and connection traces (z-index in
// index.css), so it only shows through in gaps between cards.
export default function PCBBackground({ pattern, className }: PCBBackgroundProps) {
  return (
    <svg
      className={`pcb-decor${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${pattern.width} ${pattern.height}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <g className="pcb-decor-traces">
        {pattern.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g className="pcb-decor-vias">
        {pattern.vias.map((v, i) => (
          <circle key={i} cx={v.x} cy={v.y} r={v.r} />
        ))}
      </g>
    </svg>
  );
}
