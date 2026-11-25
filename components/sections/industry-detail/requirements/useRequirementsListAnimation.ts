"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, REVEAL_START, dirX } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Requirements (list)
 * Rows slide in; the card rises. On desktop the active row follows scroll
 * through the list; hover/click selects. On change the card copy re-enters
 * and the photo eases from 1.08 scale.
 */
export function useRequirementsListAnimation(scope: RefObject<HTMLElement | null>, active: number, setActive: (i: number) => void) {
  const first = useRef(true);

  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const rows = q("[data-row]");
    revealUp(rows, rows[0], { x: dirX(-40), y: 0, stagger: 0.1 });
    const card = q("[data-card]")[0];
    gsap.from(card, { y: 60, autoAlpha: 0, duration: 1, ease: EASE.soft, scrollTrigger: { trigger: card, start: REVEAL_START, once: true } });
    if (conditions.desktop) {
      ScrollTrigger.create({
        trigger: rows[0],
        start: "top 65%",
        end: "+=360",
        onUpdate: (self) => setActive(Math.min(rows.length - 1, Math.floor(self.progress * rows.length))),
      });
    }
  });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-swap] > *"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.05, ease: EASE.soft, overwrite: true });
    gsap.fromTo(root.querySelector("[data-swap-image]"), { scale: 1.08 }, { scale: 1, duration: 0.9, ease: EASE.out, overwrite: true });
  }, [active, scope]);
}
