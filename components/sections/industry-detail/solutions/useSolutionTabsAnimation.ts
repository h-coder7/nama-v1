"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Solutions (tabs)
 * Tabs underline in sequence, the content panel rises. On tab change the photo
 * wipes in from the bottom and the copy re-enters (outlined number first).
 */
export function useSolutionTabsAnimation(scope: RefObject<HTMLElement | null>, active: number) {
  const first = useRef(true);

  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-tabs] > *"), q("[data-tabs]")[0], { y: 20, stagger: 0.08 });
    const content = q("[data-content]")[0];
    gsap.from(content, { y: 60, autoAlpha: 0, duration: 1, ease: EASE.soft, scrollTrigger: { trigger: content, start: REVEAL_START, once: true } });
  });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelector("[data-swap-image]"), { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, ease: EASE.out });
    gsap.fromTo(root.querySelectorAll("[data-swap] > *"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: EASE.soft, overwrite: true });
  }, [active, scope]);
}
