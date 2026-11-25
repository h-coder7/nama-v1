"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Folder rises; on tab change the industry name/icon re-enter and its icon draws. */
export function useExploreTabsAnimation(scope: RefObject<HTMLElement | null>, active: number) {
  const first = useRef(true);
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const folder = q("[data-folder]")[0];
    gsap.from(folder, { y: 60, autoAlpha: 0, duration: 1, ease: EASE.soft, scrollTrigger: { trigger: folder, start: REVEAL_START, once: true } });
    revealUp(q("[data-cover]"), folder, { x: 0, y: 16, stagger: 0.1, delay: 0.4 });
  });
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-swap] > *"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: EASE.soft, overwrite: true });
    gsap.fromTo(root.querySelectorAll("[data-swap] svg:not([data-dir]) path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: "power2.inOut" });
  }, [active, scope]);
}
