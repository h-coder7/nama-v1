"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Card opens (clip), index rows slide in with their icons drawing; hovering a row swaps the card. */
export function useExploreFeatureAnimation(scope: RefObject<HTMLElement | null>, active: number) {
  const first = useRef(true);
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const card = q("[data-card]")[0];
    gsap.fromTo(card, { clipPath: "inset(0% 100% 0% 0% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", clearProps: "clipPath", duration: 1.2, ease: EASE.out, scrollTrigger: { trigger: card, start: REVEAL_START, once: true } });
    const rows = q("[data-row]");
    revealUp(rows, rows[0], { y: 20, stagger: 0.07 });
    gsap.from(q("[data-row] svg:not([data-dir]) path, [data-swap] svg:not([data-dir]) path"), {
      drawSVG: "0%", duration: 1.2, ease: "power2.inOut", stagger: 0.03, delay: 0.3,
      scrollTrigger: { trigger: rows[0], start: REVEAL_START, once: true },
    });
  });
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-swap] > *"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.05, ease: EASE.soft, overwrite: true });
    gsap.fromTo(root.querySelector("[data-swap-image]"), { scale: 1.12, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: EASE.out });
  }, [active, scope]);
}
