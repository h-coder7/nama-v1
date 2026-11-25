"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Requirements
 * - Banner photo opens from the centre (clip-path), then pans slowly through the whole
 *   picture and breathes in scale while on screen; a soft light sweep passes over it (CSS).
 * - Columns rise in sequence; the active requirement follows scroll progress
 *   through the list on desktop (01 → 02 → 03) and hover/focus anywhere.
 *   Active = yellow bar grows, outlined number fills (CSS).
 */
export function useRequirementsAnimation(scope: RefObject<HTMLElement | null>, setActive: (i: number) => void, slider = false) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const banner = q("[data-banner]")[0];
    gsap.fromTo(banner, { clipPath: "inset(0% 50% 0% 50% round 16px)" }, { clipPath: "inset(0% 0% 0% 0% round 16px)", clearProps: "clipPath", duration: 1.3,
      ease: EASE.out,
      scrollTrigger: { trigger: banner, start: REVEAL_START, once: true } });
    // The photo is taller than the band, so it travels slowly top → bottom and back
    // (the whole picture is seen in turn) while breathing in scale; paused off-screen.
    const img = q("[data-banner-image]")[0];
    const pan = gsap.timeline({ paused: true })
      .fromTo(img, { objectPosition: "50% 0%" }, { objectPosition: "50% 100%", duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true }, 0)
      .fromTo(img, { scale: 1 }, { scale: 1.07, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true }, 0);
    ScrollTrigger.create({ trigger: banner, start: "top bottom", end: "bottom top", onToggle: (st) => (st.isActive ? pan.play() : pan.pause()) });
    const items = q("[data-req]");
    revealUp(items, items[0], { y: 40, stagger: 0.12 });
    revealUp(q("[data-foot]"), items[0], { delay: 0.4 });

    // In slider mode the active card follows the slider instead of page scroll.
    if (conditions.desktop && !slider) {
      ScrollTrigger.create({
        trigger: items[0],
        start: "top 70%",
        end: "+=420",
        onUpdate: (self) => setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
      });
    }
  });
}
