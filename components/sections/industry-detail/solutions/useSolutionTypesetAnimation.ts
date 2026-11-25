"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Tiles wipe open in reading order, then each giant word rises up out of its tile's floor. */
export function useSolutionTypesetAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const grid = q("[data-grid]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
    tl.fromTo(q("[data-tile]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath", duration: 0.9, ease: EASE.out, stagger: 0.12 })
      .from(q("[data-word]"), { yPercent: 100, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 0.35);
  });
}
