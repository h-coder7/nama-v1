"use client";

import type { RefObject } from "react";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Cards rise in a quick stagger (image zoom + lift on hover are CSS). */
export function useSolutionCardsAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const cards = q("[data-card]");
    revealUp(cards, cards[0], { y: 60, stagger: 0.1, duration: 0.9 });
  });
}
