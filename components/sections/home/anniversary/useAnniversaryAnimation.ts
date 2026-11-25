"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * 40 Years
 * The card lifts in; the numerals settle from a large, airy scale while the first
 * photo pushes in behind them; the 1983 → 2026 rule draws. While the banner is in
 * view the photos cross-fade inside the numerals with a slow drift (paused off-screen).
 * Reduced motion: static first photo.
 */
export function useAnniversaryAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    const st = { trigger: root, start: "top 80%", once: true };
    const photos = q("[data-a-photo]");

    const intro = gsap.timeline({ scrollTrigger: st });
    intro
      .from(root, { y: 60, autoAlpha: 0, duration: 1, ease: EASE.soft }, 0)
      .from(q("[data-a-num]"), { scale: 1.3, y: 40, transformOrigin: "50% 60%", duration: 1.8, ease: "expo.out" }, 0.15)
      .from(q("[data-a-photos]"), { scale: 1.25, transformOrigin: "50% 50%", duration: 2.2, ease: "expo.out" }, 0.15)
      .from(q("[data-a-slash]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, ease: EASE.out }, 0.9)
      .from(q("[data-a-years]"), { x: -16, autoAlpha: 0, duration: 0.7, ease: EASE.out }, 1)
      .from(q("[data-a-rule]"), { scaleX: 0, transformOrigin: document.documentElement.dir === "rtl" ? "100% 50%" : "0% 50%", duration: 1.2, ease: "power3.inOut" }, 0.8);
    revealUp(q("[data-a-fade]"), root, { delay: 0.35 });

    // Photo cycle: cross-fade + gentle push-in, looping while visible.
    if (photos.length > 1) {
      const hold = 2.6;
      const cycle = gsap.timeline({ repeat: -1, paused: true, delay: 1 });
      photos.forEach((p, i) => {
        const next = photos[(i + 1) % photos.length];
        cycle
          .set(p, { zIndex: 1 }, i * hold + hold)
          .set(next, { zIndex: 2 }, i * hold + hold)
          .fromTo(p, { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.08, duration: hold + 1.2, ease: "none" }, i * hold)
          .fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" }, i * hold + hold)
          .set(p, { autoAlpha: 0 }, i * hold + hold + 1.2);
      });
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? cycle.play() : cycle.pause()),
      });
    }
  });
}
