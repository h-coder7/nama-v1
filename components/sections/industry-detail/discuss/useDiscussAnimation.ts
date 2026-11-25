"use client";

import type { RefObject } from "react";
import { revealHeader, revealUp } from "@/lib/reveal";
import { dirX } from "@/lib/motion";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Options slide in from the reading edge; the card rises after them. */
export function useDiscussAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-option]"), q("[data-option]")[0], { x: dirX(-24), y: 0, stagger: 0.1, delay: 0.2 });
    revealUp(q("[data-card]"), q("[data-card]")[0], { y: 50, duration: 1 });
  });
}
