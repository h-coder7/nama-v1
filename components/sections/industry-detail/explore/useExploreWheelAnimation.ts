"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Drum rises and spins once into place (a full turn of the band of names);
 * each later turn is a CSS transform transition. The selected label pulses.
 */
export function useExploreWheelAnimation(scope: RefObject<HTMLElement | null>, sel: number) {
  const first = useRef(true);
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const drum = q("[data-drum]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: drum, start: REVEAL_START, once: true } });
    tl.from(drum, { y: 60, autoAlpha: 0, duration: 1, ease: EASE.soft })
      .from(q("[data-drum] ul"), { yPercent: -60, rotateX: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0.3);
    revealUp(q("[data-fade]"), drum, { delay: 0.4 });
  });
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelector("[data-fade] strong"), { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: EASE.soft });
  }, [sel, scope]);
}
