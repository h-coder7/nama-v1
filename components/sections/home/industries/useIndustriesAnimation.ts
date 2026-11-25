"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Industries
 * Panels rise with a stagger; the open panel width is a CSS flex transition
 * (cheap, interruptible). When a panel opens, its copy enters after the
 * width settles so text never reflows in view.
 */
export function useIndustriesAnimation(scope: RefObject<HTMLElement | null>, active: number) {
  const first = useRef(true);

  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-panel]"), q("[data-panel]")[0], { y: 60, stagger: 0.07, duration: 0.9 });
  });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const copy = root.querySelectorAll("[data-body] > *");
    gsap.fromTo(copy, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, delay: 0.22, stagger: 0.06, ease: EASE.soft, overwrite: true });
  }, [active, scope]);
}
