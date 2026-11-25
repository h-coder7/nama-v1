"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Steps through `count` items while the section is on screen (e.g. stage lists),
 * pausing on hover / focus and stopping for good once the visitor picks an item.
 * Off when the visitor prefers reduced motion.
 */
export function useAutoCycle(scope: RefObject<HTMLElement | null>, count: number, interval = 3500) {
  const [active, setActive] = useState(0);
  const state = useRef({ visible: false, paused: false, stopped: false });

  useEffect(() => {
    const el = scope.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (state.current.visible = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const id = window.setInterval(() => {
      const s = state.current;
      if (s.visible && !s.paused && !s.stopped && !document.hidden) setActive((a) => (a + 1) % count);
    }, interval);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [scope, count, interval]);

  const select = useCallback((i: number) => {
    state.current.stopped = true;
    setActive(i);
  }, []);

  const bind = {
    onMouseEnter: () => (state.current.paused = true),
    onMouseLeave: () => (state.current.paused = false),
    onFocusCapture: () => (state.current.paused = true),
    onBlurCapture: () => (state.current.paused = false),
  };

  return { active, select, bind };
}
