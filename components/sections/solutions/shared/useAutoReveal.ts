"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START, STAGGER } from "@/lib/motion";
import { countUp, revealLines, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

type Ctx = Parameters<Parameters<typeof useSectionMotion>[1]>[0];

const CLIP_FROM: Record<string, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  side: "inset(0% 100% 0% 0%)",
};

/**
 * Declarative scroll reveals for the solution pages, driven by data attributes,
 * so each section only scripts what is unique to it.
 *   [data-header]        eyebrow → masked title lines → intro
 *   [data-stagger="y"]   children fade + rise in sequence
 *   [data-rise="delay"]  element fades + rises
 *   [data-clip="up|down|side"] element wipes open (never on a notched element: both use clip-path)
 *   [data-line]          rule draws from the reading-start side
 *   [data-parallax="%"]  image drifts while the section crosses the viewport
 *   [data-draw]          SVG strokes inside draw on
 *   [data-count]         numbers count up
 * Everything is set up only with motion allowed; content is visible without JS.
 */
export function useAutoReveal(scope: RefObject<HTMLElement | null>, extra?: (ctx: Ctx) => void, deps: unknown[] = []) {
  useSectionMotion(
    scope,
    (ctx) => {
      const { conditions, root, q } = ctx;
      if (!conditions.motion) return;
      q("[data-header]").forEach((h) => {
        revealUp(h.querySelectorAll("[data-eyebrow]"), h, { duration: 0.56 });
        revealLines(h.querySelector("[data-title]"), h, { delay: 0.08 });
        revealUp(h.querySelectorAll("[data-intro]"), h, { delay: 0.25 });
      });
      q("[data-stagger]").forEach((g) => {
        const y = Number((g as HTMLElement).dataset.stagger) || 32;
        revealUp(g.children, g, { y, stagger: STAGGER.base });
      });
      q("[data-rise]").forEach((el) => revealUp(el, el, { delay: Number((el as HTMLElement).dataset.rise) || 0 }));
      q("[data-clip]").forEach((el) => {
        const from = CLIP_FROM[(el as HTMLElement).dataset.clip || "up"] ?? CLIP_FROM.up;
        gsap.fromTo(el, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE.out, clearProps: "clipPath", scrollTrigger: { trigger: el, start: REVEAL_START, once: true } });
      });
      q("[data-line]").forEach((el) => gsap.from(el, { scaleX: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
      if (conditions.desktop) {
        q("[data-parallax]").forEach((el) => {
          const p = Number((el as HTMLElement).dataset.parallax) || 8;
          gsap.fromTo(el, { yPercent: -p, scale: 1.12 }, { yPercent: p, scale: 1.12, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
      }
      q("[data-draw]").forEach((el) => {
        const paths = el.querySelectorAll("path, line, circle, rect, polyline");
        gsap.from(paths, { drawSVG: "0%", duration: 1.4, ease: "power2.inOut", stagger: 0.04, scrollTrigger: { trigger: el, start: REVEAL_START, once: true } });
      });
      if (root.querySelector("[data-count]")) countUp(root);
      extra?.(ctx);
    },
    deps,
  );
}
