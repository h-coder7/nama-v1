"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { DUR, EASE, dirX } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Home About
 * - Entrance: header lines, the year's digits rise out of their masks one by one,
 *   the story and rail follow; the lead's words fill with scroll (reading pace).
 * - Change of year: each digit strip rolls to its new value (CSS transform on --d,
 *   staggered left → right) while GSAP adds a short stretch (transform only) to the
 *   digits that actually change; the story title re-reveals line by line from the
 *   travel direction; the pill and the progress fill glide to the new tick.
 */
export function useAboutAnimation(scope: RefObject<HTMLElement | null>, active: number, yearList: string) {
  const dir = useRef(1);
  const prev = useRef(active);
  const first = useRef(true);

  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);

    const stage = q("[data-stage]")[0];
    if (stage) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 82%", once: true } });
      tl.from(q("[data-roll]"), { yPercent: 105, duration: 1.2, ease: EASE.out, stagger: 0.09 }, 0)
        .from(q("[data-stage] [data-story-title], [data-stage] [data-story-body]"), { y: 24, autoAlpha: 0, duration: DUR.base, ease: EASE.soft, stagger: 0.1 }, 0.35);
    }

    const lead = root.querySelector("[data-lead]");
    if (lead) {
      SplitText.create(lead, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.22 },
            { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: lead, start: "top 82%", end: "bottom 50%", scrub: 0.6 } },
          );
        },
      });
    }
    revealUp(q("[data-timeline]"), q("[data-timeline]")[0], { y: 40 });
    revealUp(q("[data-fade]"), q("[data-fade]")[0]);
  });

  // Pill lives inside the active stop; FLIP it from where it was. Keep the active year in view when the rail scrolls.
  const pillAt = useRef<number | null>(null);
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const pill = root.querySelector<HTMLElement>("[data-pill]");
    const rail = root.querySelector<HTMLElement>("[data-rail]");
    const stop = root.querySelectorAll<HTMLElement>("[data-stop]")[active];
    if (rail && stop && rail.scrollWidth > rail.clientWidth + 2) {
      const r = rail.getBoundingClientRect();
      const sr = stop.getBoundingClientRect();
      rail.scrollBy({ left: sr.left + sr.width / 2 - (r.left + r.width / 2), behavior: pillAt.current === null || reduced() ? "auto" : "smooth" });
    }
    if (!pill) return;
    const now = pill.getBoundingClientRect().left;
    if (pillAt.current !== null && !reduced()) {
      gsap.fromTo(pill, { x: pillAt.current - now }, { x: 0, duration: 0.8, ease: EASE.out, overwrite: true });
    }
    pillAt.current = now;
  }, [active, scope]);

  // Year roll accent + story re-reveal on each change.
  useEffect(() => {
    const root = scope.current;
    if (first.current) { first.current = false; prev.current = active; return; }
    if (!root || reduced()) { prev.current = active; return; }

    const years = yearList.split(",");
    const from = years[prev.current] ?? "";
    const to = years[active] ?? "";
    prev.current = active;
    const digits = root.querySelectorAll<HTMLElement>("[data-digit]");
    digits.forEach((el, i) => {
      if (from[i] === to[i]) return;
      gsap.fromTo(
        el,
        { scaleY: 1.12, transformOrigin: dir.current > 0 ? "50% 0%" : "50% 100%" },
        { scaleY: 1, duration: 0.9, delay: i * 0.07, ease: "expo.out", overwrite: true },
      );
    });

    const title = root.querySelector<HTMLElement>("[data-story-title]");
    const body = root.querySelector<HTMLElement>("[data-story-body]");
    let split: SplitText | undefined;
    if (title) {
      split = SplitText.create(title, { type: "lines", mask: "lines" });
      gsap.fromTo(split.lines, { yPercent: 105, x: dirX(18 * dir.current) }, { yPercent: 0, x: 0, duration: 0.85, ease: EASE.out, stagger: 0.07, overwrite: true });
    }
    if (body) gsap.fromTo(body, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, delay: 0.12, ease: EASE.soft, overwrite: true });
    return () => split?.revert();
  }, [active, scope, yearList]);

  const setDirection = useCallback((d: 1 | -1) => {
    dir.current = d;
  }, []);

  return { setDirection };
}
