"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { revealHeader, loopWhileVisible } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Next move ribbons
 * Two endless marquees moving in opposite directions (GSAP, not CSS, so the
 * speed reacts to scroll velocity: scrolling gives them a short push, then they
 * ease back). Hover on the yellow ribbon slows it down. Each ribbon also
 * slides in from its side when the section enters.
 * Reduced motion: static ribbons.
 */
export function useNextMoveAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);

    const rtl = false; // ribbons are laid out LTR in both languages (see next-move.module.scss)
    const loops = q("[data-rail]").map((rail, i) => {
      // dark ribbon runs toward the end, yellow toward the start (mirrored in RTL)
      const toStart = (i === 1) !== rtl;
      return loopWhileVisible(
        gsap.fromTo(
          rail,
          { xPercent: toStart ? 0 : -50 },
          { xPercent: toStart ? -50 : 0, duration: i === 0 ? 38 : 30, ease: "none", repeat: -1 },
        ),
        root,
      );
    });

    const ribbons = q("[data-rail]").map((r) => r.parentElement!);
    gsap.from(ribbons[0], { xPercent: rtl ? 12 : -12, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    gsap.from(ribbons[1], { xPercent: rtl ? -12 : 12, autoAlpha: 0, duration: 1.2, delay: 0.1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });

    // Scroll velocity → temporary speed boost.
    const boost = { v: 1 };
    const apply = () => loops.forEach((l) => l.timeScale(boost.v));
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5);
        gsap.to(boost, { v, duration: 0.2, overwrite: true, onUpdate: apply, onComplete: () => {
          gsap.to(boost, { v: 1, duration: 1.2, ease: "power2.out", onUpdate: apply });
        } });
      },
    });

    const yellow = ribbons[1];
    const slow = () => gsap.to(loops[1], { timeScale: 0.25, duration: 0.4 });
    const resume = () => gsap.to(loops[1], { timeScale: 1, duration: 0.6 });
    yellow.addEventListener("mouseenter", slow);
    yellow.addEventListener("mouseleave", resume);
    return () => {
      yellow.removeEventListener("mouseenter", slow);
      yellow.removeEventListener("mouseleave", resume);
    };
  });
}
