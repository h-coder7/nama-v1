"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { dirX } from "@/lib/motion";
import { gsap } from "@/lib/gsap";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Projects
 * Cards enter from the right with a stagger; the progress line mirrors the
 * carousel scroll position; arrows scroll one card at a time.
 */
export function useProjectsAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-card]"), q("[data-track]")[0], { x: dirX(80), y: 0, stagger: 0.1, duration: 0.9 });
  });

  useEffect(() => {
    const root = scope.current;
    const track = root?.querySelector<HTMLElement>("[data-track]");
    const bar = root?.querySelector<HTMLElement>("[data-progress]");
    if (!track || !bar) return;
    // Sizes are read on resize only; scrolling just moves the thumb (transform, one write per frame).
    let visible = 1;
    let span = 0;
    let frame = 0;
    const measure = () => {
      visible = Math.max(track.clientWidth / track.scrollWidth, 0.18);
      span = Math.max(track.scrollWidth - track.clientWidth, 0);
      bar.style.width = `${visible * 100}%`;
      move();
    };
    const move = () => {
      frame = 0;
      const p = span > 0 ? Math.abs(track.scrollLeft) / span : 1;
      bar.style.transform = `translateX(${dirX(p * (1 / visible - 1) * 100)}%)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(move); };
    measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [scope]);

  const scrollBy = useCallback(
    (dir: 1 | -1) => {
      const track = scope.current?.querySelector<HTMLElement>("[data-track]");
      const card = track?.querySelector<HTMLElement>("[data-card]");
      if (!track || !card) return;
      const step = card.offsetWidth + 18;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(track, { scrollLeft: track.scrollLeft + dirX(dir * step), duration: reduce ? 0 : 0.7, ease: "power3.out", overwrite: true });
    },
    [scope],
  );

  return { scrollBy };
}
