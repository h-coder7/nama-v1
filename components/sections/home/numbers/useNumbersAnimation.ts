"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, REVEAL_START } from "@/lib/motion";
import { countUp, loopWhileVisible, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Namma in numbers
 * Card lifts and settles from 0.94, stats stagger + count, the logo slides in
 * on the brand diagonal, the outlined 8M fills from transparent to ink.
 */
export function useNumbersAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    const card = q("[data-card]")[0] as HTMLElement;
    const st = { trigger: card, start: REVEAL_START, once: true };

    gsap.from(card, { scale: 0.94, y: 60, autoAlpha: 0, duration: DUR.slow, ease: EASE.out, scrollTrigger: st });
    revealUp(q("[data-fade]"), card, { delay: 0.3 });
    revealUp(q("[data-item]"), card, { delay: 0.35, stagger: 0.12 });
    // The "N", in four beats: it rises in, its outline draws, five ink slats close in along
    // the brand diagonal (alternating from top and bottom), then a depth shadow slides out
    // and a sheen passes. Afterwards a sheen returns now and then while it is on screen.
    const bands = q("[data-mark-band]") as SVGRectElement[];
    const sheen = q("[data-mark-sheen]");
    const depth = q("[data-mark-depth]");
    const line = q("[data-mark-line]");
    bands.forEach((b, i) => gsap.set(b, { attr: i % 2 ? { y: -10, height: 0 } : { y: 150, height: 0 } }));
    gsap.set(sheen, { attr: { x: -120 } });
    gsap.set(depth, { x: 0, y: 0, autoAlpha: 0 });
    const shine = () => gsap.fromTo(sheen, { attr: { x: -120 }, opacity: 0 }, { keyframes: [{ opacity: 0.6, duration: 0.25 }, { opacity: 0.6, duration: 0.6 }, { opacity: 0, duration: 0.25 }], attr: { x: 360 }, duration: 1.1, ease: "power2.inOut" });
    const mark = gsap.timeline({ scrollTrigger: st, delay: 0.3, defaults: { overwrite: "auto" } });
    mark
      .from(q("[data-logo]"), { y: 36, scale: 0.94, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0)
      .fromTo(line, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power3.inOut" }, 0.05)
      .to(bands, { attr: { y: -10, height: 160 }, duration: 0.75, ease: "power4.inOut", stagger: 0.08 }, 0.7)
      .to(line, { autoAlpha: 0, duration: 0.4 }, 1.35)
      .to(depth, { x: 7, y: 7, autoAlpha: 1, duration: 0.9, ease: "expo.out" }, 1.25)
      .fromTo(q("[data-logo] svg"), { scale: 1 }, { keyframes: [{ scale: 1.035, duration: 0.25, ease: "power2.out" }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }] }, 1.2)
      .add(() => { shine(); }, 1.5)
      .add(() => { loopWhileVisible(gsap.timeline({ repeat: -1, repeatDelay: 4.5, delay: 4 }).add(shine()), card); });
    let untilt = () => {};
    if (conditions.desktop) {
      // Soft 3D tilt toward the pointer while it is over the card.
      const svg = q("[data-logo] svg")[0];
      const rx = gsap.quickTo(svg, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(svg, "rotationY", { duration: 0.8, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 16);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
      };
      const leave = () => { rx(0); ry(0); };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      untilt = () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
    }
    if (conditions.desktop) {
      gsap.to(q("[data-logo] svg"), { yPercent: -6, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    }
    gsap.from(q("[data-highlight]"), { y: 30, autoAlpha: 0, duration: DUR.slow, ease: EASE.out, delay: 0.55, scrollTrigger: st });
    gsap.from(q("[data-year]"), { y: 24, autoAlpha: 0, duration: DUR.slow, ease: EASE.out, delay: 0.7, scrollTrigger: st });
    countUp(root, card, { delay: 0.4 });
    return () => untilt();
  });
}
