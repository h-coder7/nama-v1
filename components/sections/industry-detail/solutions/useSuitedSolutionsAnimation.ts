"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START, dirX } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Featured card wipes up into view; list items slide in from the reading edge. */
export function useSuitedSolutionsAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const card = q("[data-featured]")[0];
    gsap.fromTo(card, { clipPath: "inset(100% 0% 0% 0% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", clearProps: "clipPath", duration: 1.2, ease: EASE.out, scrollTrigger: { trigger: card, start: REVEAL_START, once: true } });
    revealUp(q("[data-item]"), card, { x: dirX(40), y: 0, stagger: 0.1, delay: 0.25 });
  });
}
