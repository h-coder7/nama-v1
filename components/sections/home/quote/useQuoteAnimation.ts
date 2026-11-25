"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, dirX } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Quote
 * Options slide in from the start edge; the form panel rises and its fields
 * cascade in. The success state replaces the form with a short scale-in.
 */
export function useQuoteAnimation(scope: RefObject<HTMLElement | null>, sent: boolean) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-option]"), q("[data-option]")[0], { x: dirX(-24), y: 0, stagger: 0.1, delay: 0.2 });
    const panel = q("[data-panel]")[0];
    revealUp(panel, panel, { y: 60, duration: 1 });
    revealUp(q("[data-field]"), panel, { y: 14, stagger: 0.04, delay: 0.3, duration: 0.5 });
  });

  useEffect(() => {
    if (!sent || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = scope.current?.querySelector("[data-success]");
    if (el) gsap.from(el.children, { y: 16, autoAlpha: 0, scale: 0.98, stagger: 0.08, duration: 0.6, ease: EASE.soft });
  }, [sent, scope]);
}
