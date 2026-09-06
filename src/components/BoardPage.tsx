import { useRef } from "react";
import type { ReactNode } from "react";
import BoardBackground from "./BoardBackground";

interface BoardPageProps {
  seed: number;
  children: ReactNode;
}

// One full-height "board": the scrollable page surface, its decorative copper
// and passive components underneath, plated mounting holes in the corners,
// and a silkscreen footer. All page content renders on top of it.
export default function BoardPage({ seed, children }: BoardPageProps) {
  const surfaceRef = useRef<HTMLDivElement>(null!);

  return (
    <div className="pcb-surface" ref={surfaceRef}>
      <BoardBackground surfaceRef={surfaceRef} seed={seed} />
      <span className="pcb-hole pcb-hole--tl" aria-hidden="true" />
      <span className="pcb-hole pcb-hole--tr" aria-hidden="true" />
      <span className="pcb-hole pcb-hole--bl" aria-hidden="true" />
      <span className="pcb-hole pcb-hole--br" aria-hidden="true" />
      <div className="pcb-surface__content">
        {children}
        <p className="pcb-footer">RENZ DUNGO · PORTFOLIO BOARD · REV 2.0 · FR4 2-LAYER · 2026</p>
      </div>
    </div>
  );
}
