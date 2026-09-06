import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import Navigationbar from "./components/Navbar";
import BoardPage from "./components/BoardPage";
import Home from "./Pages/Home";
import Projectpage from "./Pages/Projects";
import ContactPage from "./Pages/Contact";

const PAGE_COUNT = 3;
const PAGE_KEYS = ["home", "projects", "contact"];

function indexFromHash() {
  const key = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  const i = PAGE_KEYS.indexOf(key);
  return i === -1 ? 0 : i;
}

function App() {
  const [activeIndex, setActiveIndex] = useState(indexFromHash);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Only the board being looked at is rendered in the first pass, so its
  // content (and the LCP portrait) paints as early as possible. The two
  // off-screen boards mount right after, in a low-priority transition that
  // yields to input instead of one long blocking task. They sit outside the
  // viewport, so nothing visible changes.
  const [mountAll, setMountAll] = useState(false);
  useEffect(() => {
    startTransition(() => setMountAll(true));
  }, []);

  const go = useCallback((index: number) => {
    setActiveIndex(Math.min(PAGE_COUNT - 1, Math.max(0, index)));
  }, []);

  // Keep the URL hash in sync so each board is deep-linkable, and follow
  // back/forward navigation between boards.
  useEffect(() => {
    const key = PAGE_KEYS[activeIndex];
    if (window.location.hash !== `#${key}`) {
      window.history.replaceState(null, "", `#${key}`);
    }
  }, [activeIndex]);

  useEffect(() => {
    const onHash = () => setActiveIndex(indexFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Keyboard: left/right arrows step between boards (ignored while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "ArrowRight") go(activeIndex + 1);
      if (e.key === "ArrowLeft") go(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, go]);

  // Touch: a clearly horizontal swipe slides to the next/previous board,
  // while vertical drags are left alone so page scrolling keeps working.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) {
      go(activeIndex + (dx < 0 ? 1 : -1));
    }
  };

  const pages = [
    { key: "home", seed: 1337, node: <Home /> },
    { key: "projects", seed: 2025, node: <Projectpage /> },
    { key: "contact", seed: 4242, node: <ContactPage /> },
  ];

  return (
    <div className="pcb-app">
      <Navigationbar active={activeIndex} onSelect={go} />
      <div className="pcb-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="pcb-track" style={{ transform: `translateX(-${activeIndex * (100 / PAGE_COUNT)}%)` }}>
          {pages.map((page, i) => (
            <section
              key={page.key}
              className="pcb-page"
              aria-hidden={activeIndex !== i}
              // Keep off-screen boards out of the tab order.
              inert={activeIndex !== i}
            >
              {(mountAll || i === activeIndex) && <BoardPage seed={page.seed}>{page.node}</BoardPage>}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
