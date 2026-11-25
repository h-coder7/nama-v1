"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { networkData } from "./network.data";

/**
 * Office cycle for the interactive map (home "Our network" + /network hero).
 * The three offices take turns (KHB → RUH → JED) while `scope` is on screen.
 * Hover/focus holds the current one; a click pins it and stops the cycle.
 * Reduced motion: no cycle.
 */
export function useOfficeCycle(scope: RefObject<HTMLElement | null>, setActive: (code: string) => void) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const inView = useRef(false);
  const held = useRef(false);
  const stopped = useRef(false);
  const index = useRef(0);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  const start = useCallback(() => {
    stop();
    if (stopped.current || held.current || !inView.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => {
      index.current = (index.current + 1) % networkData.pins.length;
      setActive(networkData.pins[index.current].code);
    }, networkData.cycleMs);
  }, [setActive, stop]);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 25%",
      onToggle: (self) => {
        inView.current = self.isActive;
        if (self.isActive) start();
        else stop();
      },
    });
    return () => {
      st.kill();
      stop();
    };
  }, [scope, start, stop]);

  const sync = (code: string) => {
    index.current = Math.max(0, networkData.pins.findIndex((p) => p.code === code));
  };
  const hold = useCallback((code?: string) => {
    held.current = true;
    stop();
    if (code) {
      sync(code);
      setActive(code);
    }
  }, [setActive, stop]);
  const release = useCallback(() => {
    held.current = false;
    start();
  }, [start]);
  const pick = useCallback((code: string) => {
    stopped.current = true;
    stop();
    sync(code);
    setActive(code);
  }, [setActive, stop]);

  return { hold, release, pick };
}
