"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, STAGGER, introExpired } from "@/lib/motion";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Industry hero — the photo settles (1.12 → 1), the name rises out of its mask,
 * breadcrumb / eyebrow / copy / CTAs follow; on scroll the photo drifts down
 * and the copy eases away (desktop).
 */
export function useIndustryHeroAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion || introExpired()) return release();
    gsap
      .timeline({ defaults: { ease: EASE.out }, onStart: release })
      .from(q("[data-image]"), { scale: 1.12, duration: 2, ease: "power2.out" }, 0)
      .from(q("[data-hero-line]"), { yPercent: 110, duration: DUR.slow }, 0.35)
      .from(q("[data-hero-fade]"), { y: 18, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.base }, 0.2);

    if (conditions.desktop) {
      gsap.to(q("[data-image]"), { yPercent: 8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    }
  });
}
