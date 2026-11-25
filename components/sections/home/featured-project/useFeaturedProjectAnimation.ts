"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { countUp, revealHeader } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Featured project
 * Photo parallax (scrubbed, desktop) under a fixed copy column, header reveal,
 * 800,000 counter. (The project cards band was removed in Nov 2026 — the Projects cards follow.)
 */
export function useFeaturedProjectAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, q }) => {
    if (!conditions.motion) return;
    const stage = q("[data-stage]")[0];
    revealHeader(stage);
    countUp(stage, stage, { delay: 0.4 });
    if (conditions.desktop) {
      gsap.fromTo(
        q("[data-image]"),
        { yPercent: -8, scale: 1.12 },
        { yPercent: 8, scale: 1.02, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }
  });
}
