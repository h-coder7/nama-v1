"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START, dirX, isRtl } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { useLenis } from "@/providers/LenisProvider";

/**
 * Industries page
 * - Hero: title lines rise, tiles stagger in while each line illustration
 *   draws itself (DrawSVG). Selecting a tile re-draws its illustration.
 * - Carousel: cards enter from the reading edge; the active card follows the
 *   track scroll; arrows/“Jump to” glide the track (scrollLeft tween), and the
 *   progress line + counter mirror its position.
 * Reduced motion: no drawing, instant scrolls, everything visible.
 */
export function useIndustriesExperienceAnimation(
  scope: RefObject<HTMLElement | null>,
  active: number,
  setActive: (i: number) => void,
) {
  const lenis = useLenis();
  const programmatic = useRef(false);

  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    const hero = root.querySelector("section")!;
    revealHeader(hero);
    revealUp(q("[data-fade]"), hero, { delay: 0.3 });
    const tiles = q("[data-tile]");
    revealUp(tiles, tiles[0], { y: 40, stagger: 0.07, delay: 0.2 });
    gsap.from(q("[data-tile] [data-draw]"), {
      drawSVG: "0%",
      duration: 1.6,
      ease: "power2.inOut",
      stagger: 0.1,
      delay: 0.45,
      scrollTrigger: { trigger: tiles[0], start: REVEAL_START, once: true },
    });

    const show = q("[data-showcase]")[0];
    revealHeader(show);
    revealUp(q("[data-card]"), q("[data-track]")[0], { x: dirX(90), y: 0, stagger: 0.1, duration: 0.9 });
  });

  // Track ↔ progress / active card
  useEffect(() => {
    const root = scope.current;
    const track = root?.querySelector<HTMLElement>("[data-track]");
    const bar = root?.querySelector<HTMLElement>("[data-progress]");
    if (!track || !bar) return;
    const cards = () => Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pos = Math.abs(track.scrollLeft);
      const p = max > 0 ? pos / max : 0;
      const visible = Math.max(track.clientWidth / track.scrollWidth, 0.16);
      bar.style.width = `${visible * 100}%`;
      bar.style.transform = `translateX(${dirX(p * (1 / visible - 1) * 100)}%)`;
      if (programmatic.current) return;
      const list = cards();
      const step = list[1] ? Math.abs(list[1].offsetLeft - list[0].offsetLeft) : 1;
      const idx = Math.min(list.length - 1, Math.round(pos / step));
      setActive(idx);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scope, setActive]);

  // Re-draw the active tile illustration
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const root = scope.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const path = root.querySelectorAll("[data-tile] [data-draw]")[active];
    if (path) gsap.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", overwrite: true });
    const counter = root.querySelector("[data-counter]");
    if (counter) gsap.fromTo(counter, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: EASE.soft });
  }, [active, scope]);

  const slideTrack = useCallback(
    (i: number) => {
      const track = scope.current?.querySelector<HTMLElement>("[data-track]");
      const card = track?.querySelectorAll<HTMLElement>("[data-card]")[i];
      const first = track?.querySelector<HTMLElement>("[data-card]");
      if (!track || !card || !first) return;
      const offset = Math.abs(card.offsetLeft - first.offsetLeft);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      programmatic.current = true;
      gsap.to(track, {
        scrollLeft: isRtl() ? -offset : offset,
        duration: reduce ? 0 : 0.9,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: () => {
          programmatic.current = false;
        },
      });
    },
    [scope],
  );

  /** Select an industry (tile click). `scroll` keeps the carousel in sync. */
  const goTo = useCallback(
    (i: number, sync = false) => {
      setActive(i);
      if (sync) slideTrack(i);
    },
    [setActive, slideTrack],
  );

  const scrollBy = useCallback(
    (dir: 1 | -1) => {
      const total = scope.current?.querySelectorAll("[data-card]").length ?? 1;
      const next = Math.max(0, Math.min(total - 1, active + dir));
      setActive(next);
      slideTrack(next);
    },
    [active, scope, setActive, slideTrack],
  );

  const jumpTo = useCallback(() => {
    const target = scope.current?.querySelector<HTMLElement>("[data-showcase]");
    if (!target) return;
    slideTrack(active);
    if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.2 });
    else target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active, lenis, scope, slideTrack]);

  return { jumpTo, scrollBy, goTo };
}
