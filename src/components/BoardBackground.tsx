import { useEffect, useMemo, useState } from "react";
import { generateCircuitPattern } from "./pcbPattern";
import { AxialResistor, Capacitor, PartDefs, SmdResistor } from "./parts";

interface BoardBackgroundProps {
  // The scrollable page surface this board decoration should fill.
  surfaceRef: React.RefObject<HTMLElement>;
  seed: number;
}

// Sizes are quantised so a few pixels of content reflow (a modal opening,
// the navbar collapsing) does not re-route the whole board.
const QUANT_W = 80;
const QUANT_H = 240;

// Decorative copper layer that fills the dead space of the board: routed
// traces, vias, and populated passive components (axial resistors, SMD
// resistors and capacitors) with silkscreen designators. Sits behind every
// IC card, so it only shows through in the gaps between them.
export default function BoardBackground({ surfaceRef, seed }: BoardBackgroundProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.ceil(el.clientWidth / QUANT_W) * QUANT_W;
      const h = Math.ceil(el.scrollHeight / QUANT_H) * QUANT_H;
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [surfaceRef]);

  const pattern = useMemo(
    () => (size.w > 0 && size.h > 0 ? generateCircuitPattern(size.w, size.h, seed) : null),
    [size.w, size.h, seed]
  );

  if (!pattern) return <div className="pcb-bg" aria-hidden="true" />;

  return (
    <div className="pcb-bg" aria-hidden="true">
      <svg width={pattern.width} height={pattern.height} viewBox={`0 0 ${pattern.width} ${pattern.height}`}>
        <PartDefs />
        <g className="pcb-bg-traces">
          {pattern.paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g className="pcb-bg-vias">
          {pattern.vias.map((v, i) => (
            <g key={i}>
              <circle cx={v.x} cy={v.y} r={v.r} />
              <circle cx={v.x} cy={v.y} r={v.r * 0.4} className="pcb-bg-via-hole" />
            </g>
          ))}
        </g>
        <g className="pcb-bg-parts">
          {pattern.parts.map((p) =>
            p.kind === "resistor" ? (
              <AxialResistor key={p.ref} part={p} />
            ) : p.kind === "smd" ? (
              <SmdResistor key={p.ref} part={p} />
            ) : (
              <Capacitor key={p.ref} part={p} />
            )
          )}
        </g>
      </svg>
    </div>
  );
}
