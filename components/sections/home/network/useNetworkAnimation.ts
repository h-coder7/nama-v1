"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { countUp, revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Network (home) reveal: header + table rows; the map card rises, the routes draw,
 * pins drop in, the office card slides up; stats count; the agency strip last.
 * The office cycle itself lives in useOfficeCycle (shared with /network).
 */
export function useNetworkAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-row]"), q("[data-table]")[0], { stagger: 0.1 });
    const map = q("[data-map]")[0];
    const st = { trigger: map, start: REVEAL_START, once: true };
    gsap.from(map, { y: 60, autoAlpha: 0, duration: 1, ease: EASE.soft, scrollTrigger: st });
    gsap.fromTo(q("[data-route]"), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.25, delay: 0.5, ease: "power2.inOut", scrollTrigger: st, clearProps: "strokeDashoffset" });
    gsap.from(q("[data-pin]"), { y: -24, autoAlpha: 0, duration: 0.6, stagger: 0.18, delay: 0.4, ease: "back.out(2.4)", scrollTrigger: st, clearProps: "transform,opacity,visibility" });
    gsap.from(q("[data-card]"), { y: 16, autoAlpha: 0, duration: 0.6, delay: 1, ease: EASE.out, scrollTrigger: st });
    revealUp(q("[data-stat]"), map, { delay: 0.4 });
    countUp(map, map, { delay: 0.5 });
    revealUp(q("[data-agency]"), q("[data-agency]")[0], { y: 16 });
  });
}
