"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, dirX } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Why Namma
 * - The dark "active" plate glides between rows (y + height tween), following
 *   the row that crosses the viewport centre on desktop, or the hovered row.
 * - Row labels slide in from the start edge on first view.
 */
export function useWhyNammaAnimation(
  scope: RefObject<HTMLElement | null>,
  active: number,
  setActive: (i: number) => void,
) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const rows = q("[data-row]");
    revealUp(rows, rows[0], { y: 0, x: dirX(-30), stagger: 0.1 });
    if (conditions.desktop) {
      rows.forEach((row, i) =>
        ScrollTrigger.create({
          trigger: row,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
    }
  });

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const place = (animate: boolean) => {
      const plate = root.querySelector<HTMLElement>("[data-highlight]");
      const row = root.querySelectorAll<HTMLElement>("[data-row]")[active];
      if (!plate || !row) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(plate, { y: row.offsetTop, height: row.offsetHeight, duration: animate && !reduce ? 0.65 : 0, ease: EASE.out, overwrite: true });
    };
    place(true);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, scope]);
}
