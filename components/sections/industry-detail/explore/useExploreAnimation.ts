"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { REVEAL_START } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Cards rise in sequence while their icons draw; the pager follows. */
export function useExploreAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const cards = q("[data-card]");
    revealUp(cards, cards[0], { y: 40, stagger: 0.07 });
    gsap.from(q("[data-card] svg:not([data-dir]) path"), {
      drawSVG: "0%",
      duration: 1.2,
      ease: "power2.inOut",
      stagger: 0.04,
      delay: 0.3,
      scrollTrigger: { trigger: cards[0], start: REVEAL_START, once: true },
    });
    const rule = q("[data-rule]");
    if (rule.length) gsap.from(rule, { scaleX: 0, duration: 1.2, ease: "expo.out", delay: 0.3, scrollTrigger: { trigger: cards[0], start: REVEAL_START, once: true } });
    revealUp(q("[data-pager]"), cards[0], { delay: 0.4 });
  });
}
