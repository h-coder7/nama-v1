"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

type Conditions = { motion: boolean; reduce: boolean; desktop: boolean };
type Setup = (ctx: { q: (sel: string) => Element[]; conditions: Conditions; root: HTMLElement }) => void | (() => void);

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Scoped GSAP setup for one section.
 * - All tweens/triggers are created inside gsap.matchMedia → reverted on unmount,
 *   on locale change and when the reduced-motion preference flips.
 * - Hidden "from" states are set by GSAP (not CSS) so content stays visible
 *   without JS or with reduced motion.
 * - Sections in (or next to) the first viewport are set up immediately. Sections
 *   further down are set up when they come within ~one viewport of the screen or
 *   when the browser is idle, whichever comes first — so hydration does not run
 *   every section's SplitText / ScrollTrigger measurements in one long task.
 *   Until then they are simply visible (their final state).
 */
export function useSectionMotion(scope: RefObject<HTMLElement | null>, setup: Setup, deps: unknown[] = []) {
  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const w = window as IdleWindow;

    let mm: gsap.MatchMedia | null = null;
    let io: IntersectionObserver | null = null;
    let idle: number | null = null;
    let timer: number | null = null;

    const start = () => {
      if (mm) return;
      io?.disconnect();
      if (idle !== null) w.cancelIdleCallback?.(idle);
      if (timer !== null) window.clearTimeout(timer);
      mm = gsap.matchMedia(root);
      mm.add(MQ, (context) => {
        const c = context.conditions as Conditions;
        const q = (sel: string) => gsap.utils.toArray<Element>(sel, root);
        return setup({ q, conditions: c, root });
      });
    };

    const vh = window.innerHeight;
    const r = root.getBoundingClientRect();
    const nearView = r.top < vh * 1.15 && r.bottom > -vh * 0.15;
    if (nearView || typeof IntersectionObserver === "undefined") {
      start();
    } else {
      io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && start(), { rootMargin: "100% 0px 100% 0px" });
      io.observe(root);
      if (w.requestIdleCallback) idle = w.requestIdleCallback(start, { timeout: 4000 });
      else timer = window.setTimeout(start, 1500);
    }

    return () => {
      io?.disconnect();
      if (idle !== null) w.cancelIdleCallback?.(idle);
      if (timer !== null) window.clearTimeout(timer);
      mm?.revert();
    };
  }, deps);
}
