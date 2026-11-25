"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Solutions (switches)
 * Board rises, switches drop in one by one, then the active switch's light pops on. Changes: count ticks to the new value, detail re-enters.
 */
export function useSolutionSwitchesAnimation(scope: RefObject<HTMLElement | null>, count: number, focus: number) {
  const prev = useRef({ count, focus, first: true });

  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const board = q("[data-board]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: board, start: REVEAL_START, once: true } });
    tl.from(board, { y: 60, autoAlpha: 0, duration: 1, ease: EASE.soft })
      .from(q("[data-switch]"), { y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.09, ease: EASE.soft }, "-=0.6")
      .from(q("[data-readout] > *"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.06, ease: EASE.soft }, "-=0.5")
      .from(q('[aria-checked="true"] [data-led]'), { scale: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.3");
  });

  useEffect(() => {
    const p = prev.current;
    if (p.first) {
      p.first = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.count = count;
      p.focus = focus;
      return;
    }
    const el = root.querySelector<HTMLElement>("[data-scope-count]");
    if (el && p.count !== count) {
      gsap.fromTo(el, { yPercent: count > p.count ? 60 : -60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: EASE.out });
    }
    gsap.fromTo(root.querySelectorAll("[data-detail] > *"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.05, ease: EASE.soft });
    p.count = count;
    p.focus = focus;
  }, [count, focus, scope]);
}
