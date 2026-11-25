"use client";

import { useCallback, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, STAGGER, dirX } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Solutions
 * - Reveal: header choreography, rows slide in from the start edge, the image
 *   card rises in while its photo settles from a soft zoom.
 * - Swap (tab change): new photo settles from 1.08 scale (CSS cross-fade), card
 *   copy re-enters with a short stagger.
 */
export function useSolutionsAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-row]"), root.querySelector("[data-row]")!, { x: dirX(-24), y: 0, stagger: STAGGER.base });
    // The card keeps its cut-corner clip-path, so the reveal never animates clip-path
    // (polygon ↔ inset can't interpolate and made the photo blink). It rises in and the
    // photo settles from a gentle zoom instead.
    const card = q("[data-card]")[0];
    const st = { trigger: card, start: "top 88%", once: true } as const;
    gsap.from(card, { y: 70, autoAlpha: 0, duration: 1.2, ease: EASE.out, scrollTrigger: st });
    gsap.from(q("[data-card-image]"), { scale: 1.18, duration: 1.8, ease: "power3.out", scrollTrigger: st });
    gsap.from(q("[data-card-body] [data-swap]"), {
      y: 18,
      autoAlpha: 0,
      duration: DUR.base,
      stagger: STAGGER.tight,
      delay: 0.5,
      ease: EASE.soft,
      scrollTrigger: st,
    });
  });

  const swap = useCallback(() => {
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Wait for React to commit the new tab content.
    requestAnimationFrame(() => {
      gsap.fromTo(root.querySelectorAll("[data-card-body] [data-swap]"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.04, ease: EASE.soft, overwrite: true });
      gsap.fromTo(root.querySelectorAll("[data-card-image]"), { scale: 1.08 }, { scale: 1, duration: 1.2, ease: EASE.out, overwrite: true });
    });
  }, [scope]);

  return { swap };
}
