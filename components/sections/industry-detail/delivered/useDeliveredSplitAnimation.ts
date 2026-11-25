"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Delivered (split)
 * The panel expands from a narrower card to full width while the photo
 * settles; fact rows draw in one by one (line + text).
 */
export function useDeliveredSplitAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    const panel = q("[data-panel]")[0];
    gsap.fromTo(panel, { clipPath: "inset(6% 6% 6% 6% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", clearProps: "clipPath", duration: 1.3,
      ease: EASE.out,
      scrollTrigger: { trigger: panel, start: "top 80%", once: true } });
    gsap.fromTo(q("[data-image]"), { scale: 1.06 }, { scale: 1, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } });
    revealHeader(root);
    const year = q("[data-year]")[0];
    if (year) gsap.from(year, { yPercent: 40, autoAlpha: 0, duration: 1.4, ease: "expo.out", delay: 0.3, scrollTrigger: { trigger: root, start: REVEAL_START, once: true } });
    revealUp(q("[data-fade]"), panel, { delay: 0.3 });
    revealUp(q("[data-fact]"), q("[data-fact]")[0], { y: 12, stagger: 0.08 });
  });
}
