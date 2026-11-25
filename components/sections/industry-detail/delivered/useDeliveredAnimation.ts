"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { countUp, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Delivered
 * Outlined year counts up from 1983 (Namma's founding year) to the project
 * year; the photo frame rises, the badge spins in to its resting tilt and
 * floats slightly with scroll; freight tons count up.
 */
export function useDeliveredAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    const st = { trigger: root, start: REVEAL_START, once: true };
    revealUp(q("[data-fade]"), root, { stagger: 0.1 });

    const year = root.querySelector<HTMLElement>("[data-year]");
    if (year) {
      const target = Number(year.dataset.year);
      const s = { v: 1983 };
      year.textContent = "1983";
      gsap.to(s, { v: target, duration: 1.6, ease: "power3.out", scrollTrigger: st, onUpdate: () => { year.textContent = String(Math.round(s.v)); } });
    }

    gsap.from(q("[data-frame]"), { y: 80, autoAlpha: 0, duration: 1.1, ease: EASE.soft, scrollTrigger: st });
    gsap.fromTo(q("[data-image]"), { scale: 1.18 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    const badge = q("[data-badge]")[0];
    gsap.fromTo(badge, { scale: 0.4, rotate: -120, autoAlpha: 0 }, { scale: 1, rotate: -8, autoAlpha: 1, duration: 1.1, delay: 0.45, ease: "back.out(1.6)", scrollTrigger: st });
    // gentle float while the section is on screen (y only, so it never fights the rotation)
    gsap.fromTo(badge, { y: 30 }, { y: -30, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    countUp(badge, root, { delay: 0.6 });
  });
}
