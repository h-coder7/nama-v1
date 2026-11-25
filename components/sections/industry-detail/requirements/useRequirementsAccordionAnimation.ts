"use client";

import type { RefObject } from "react";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Header + items rise in; opening/closing is a CSS grid-row transition (interruptible). */
export function useRequirementsAccordionAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const items = q("[data-item]");
    revealUp(items, items[0], { y: 30, stagger: 0.1 });
    revealUp(q("[data-fade]"), items[0], { delay: 0.3 });
  });
}
