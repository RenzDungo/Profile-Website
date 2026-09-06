import { useCallback, useEffect, useRef, useState } from "react";

export interface PCBLink {
  from: React.RefObject<HTMLElement>;
  to: React.RefObject<HTMLElement>;
}

interface PCBTracesProps {
  containerRef: React.RefObject<HTMLElement>;
  links: PCBLink[];
}

interface TracePath {
  id: string;
  d: string;
}

const CHAMFER = 14;

// Right-angle "PCB trace" with 45-degree chamfered bends, routed vertically:
// drop from the source, jog across a shared trunk line, drop into the target.
function buildVerticalPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  if (Math.abs(dx) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const trunkY = y1 + (y2 - y1) / 2;
  const dir = dx > 0 ? 1 : -1;
  const c = Math.min(CHAMFER, Math.abs(trunkY - y1), Math.abs(y2 - trunkY), Math.abs(dx) / 2);
  return [
    `M ${x1} ${y1}`,
    `L ${x1} ${trunkY - c}`,
    `L ${x1 + c * dir} ${trunkY}`,
    `L ${x2 - c * dir} ${trunkY}`,
    `L ${x2} ${trunkY + c}`,
    `L ${x2} ${y2}`,
  ].join(" ");
}

// Same idea, routed horizontally: across from the source, jog up/down a
// shared trunk line, across into the target. Used for side-by-side chips.
function buildHorizontalPath(x1: number, y1: number, x2: number, y2: number) {
  const dy = y2 - y1;
  if (Math.abs(dy) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const trunkX = x1 + (x2 - x1) / 2;
  const dir = dy > 0 ? 1 : -1;
  const c = Math.min(CHAMFER, Math.abs(trunkX - x1), Math.abs(x2 - trunkX), Math.abs(dy) / 2);
  return [
    `M ${x1} ${y1}`,
    `L ${trunkX - c} ${y1}`,
    `L ${trunkX} ${y1 + c * dir}`,
    `L ${trunkX} ${y2 - c * dir}`,
    `L ${trunkX + c} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(" ");
}

const LAYER_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  pointerEvents: "none",
  overflow: "visible",
};

// Functional (animated) copper traces that connect a hub chip to the ICs it
// drives. Each trace is drawn twice: first as a wide board-coloured stroke
// that acts as a solder-mask clearance over the decorative background
// copper, then as the glowing signal trace itself.
//
// Performance notes: the glowing traces carry a drop-shadow filter, and the
// travelling pulses animate forever. Keeping the pulses in their own <svg>
// means the browser only repaints a few tiny circles each frame instead of
// re-rasterising every filtered trace. Pulses are not created until the
// board has scrolled into view, and their clock is paused whenever the board
// is off-screen, so hidden boards cost nothing per frame.
export default function PCBTraces({ containerRef, links }: PCBTracesProps) {
  const [paths, setPaths] = useState<TracePath[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState(false);
  const pulseSvgRef = useRef<SVGSVGElement>(null);

  // Pages pass a fresh `links` array literal on every render. Reading it
  // through a ref keeps the measuring effect below from re-running (and
  // forcing layout) each time the parent page re-renders.
  const linksRef = useRef(links);
  useEffect(() => {
    linksRef.current = links;
  });

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerBox = container.getBoundingClientRect();
    setSize((prev) =>
      prev.width === containerBox.width && prev.height === containerBox.height
        ? prev
        : { width: containerBox.width, height: containerBox.height }
    );

    const newPaths: TracePath[] = [];
    linksRef.current.forEach((link, i) => {
      const source = link.from.current;
      const target = link.to.current;
      if (!source || !target) return;

      const sBox = source.getBoundingClientRect();
      const tBox = target.getBoundingClientRect();
      const sCenter = {
        x: sBox.left + sBox.width / 2 - containerBox.left,
        y: sBox.top + sBox.height / 2 - containerBox.top,
      };
      const tCenter = {
        x: tBox.left + tBox.width / 2 - containerBox.left,
        y: tBox.top + tBox.height / 2 - containerBox.top,
      };
      const dx = tCenter.x - sCenter.x;
      const dy = tCenter.y - sCenter.y;

      let d: string;
      if (Math.abs(dy) >= Math.abs(dx)) {
        const goingDown = dy >= 0;
        const x1 = sCenter.x;
        const y1 = goingDown ? sBox.bottom - containerBox.top : sBox.top - containerBox.top;
        const x2 = tCenter.x;
        const y2 = goingDown ? tBox.top - containerBox.top : tBox.bottom - containerBox.top;
        d = buildVerticalPath(x1, y1, x2, y2);
      } else {
        const goingRight = dx >= 0;
        const x1 = goingRight ? sBox.right - containerBox.left : sBox.left - containerBox.left;
        const y1 = sCenter.y;
        const x2 = goingRight ? tBox.left - containerBox.left : tBox.right - containerBox.left;
        const y2 = tCenter.y;
        d = buildHorizontalPath(x1, y1, x2, y2);
      }
      newPaths.push({ id: `trace-${i}`, d });
    });
    setPaths((prev) => {
      if (prev.length === newPaths.length && prev.every((p, i) => p.d === newPaths[i].d)) return prev;
      return newPaths;
    });
  }, [containerRef]);

  useEffect(() => {
    recompute();
    const container = containerRef.current;
    const ro = new ResizeObserver(recompute);
    if (container) ro.observe(container);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute, containerRef]);

  // Light the traces the first time the board comes into view.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(container);
    return () => io.disconnect();
  }, [containerRef]);

  // Freeze the pulse animation while the board is off-screen (another board
  // is showing, or this region is scrolled away) and resume when it returns.
  useEffect(() => {
    const container = containerRef.current;
    const svg = pulseSvgRef.current;
    if (!container || !svg || !active) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    io.observe(container);
    return () => io.disconnect();
  }, [containerRef, active]);

  return (
    <>
      <svg className="pcb-traces" width={size.width} height={size.height} style={LAYER_STYLE} aria-hidden="true">
        <g className="pcb-traces-clearance">
          {paths.map((p) => (
            <path key={p.id} d={p.d} className="pcb-trace-clear" />
          ))}
        </g>
        {paths.map((p) => (
          <g key={p.id} className={active ? "pcb-trace pcb-trace-active" : "pcb-trace"}>
            <path d={p.d} className="pcb-trace-path" pathLength={100} />
          </g>
        ))}
      </svg>
      {active && (
        <svg
          ref={pulseSvgRef}
          className="pcb-traces"
          width={size.width}
          height={size.height}
          style={LAYER_STYLE}
          aria-hidden="true"
        >
          {paths.map((p) => (
            <g key={p.id} className="pcb-trace pcb-trace-active">
              <circle r={3} className="pcb-trace-pulse">
                <animateMotion dur="2.4s" begin="0s" repeatCount="indefinite" path={p.d} />
              </circle>
            </g>
          ))}
        </svg>
      )}
    </>
  );
}
