"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/**
 * Technology — cinematic route
 * - Reveal: header, the stage rises, the photo settles, thumbnails stagger in.
 * - Autoplay: the active thumbnail's bar fills over `duration`, then the next
 *   tool opens. Runs only while the section is on screen; pauses on hover/focus.
 *   Reduced motion: no autoplay, no reveal.
 * - Each change: the copy block slides in (photos cross-fade in CSS).
 */
export function useTechnologyAnimation(
  scope: RefObject<HTMLElement | null>,
  active: number,
  setActive: (fn: (i: number) => number) => void,
  count: number,
  duration = 6,
) {
  const tween = useRef<gsap.core.Tween | null>(null);
  const inView = useRef(false);
  const hovered = useRef(false);

  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    const stage = q("[data-stage]")[0];
    gsap.from(stage, { y: 60, autoAlpha: 0, duration: 1.2, ease: EASE.out, scrollTrigger: { trigger: stage, start: "top 88%", once: true } });
    gsap.from(q("[data-photos]"), { scale: 1.12, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: stage, start: "top 88%", once: true } });
    revealUp(q("[data-thumb]"), stage, { stagger: 0.07 });
    ScrollTrigger.create({
      trigger: root,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => {
        inView.current = self.isActive;
        if (self.isActive && !hovered.current) tween.current?.play();
        else tween.current?.pause();
      },
    });
  });

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bar = root.querySelector("[data-progress]");
    gsap.set(Array.from(root.querySelectorAll("[data-bar]")).filter((b) => b !== bar), { scaleX: 0 });
    if (reduce) return;

    const copy = root.querySelector("[data-copy]");
    if (copy) {
      gsap.fromTo(copy.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: EASE.out, overwrite: true });
    }
    // Keep the active thumbnail in view on the phone strip.
    const thumbs = root.querySelector<HTMLElement>("[data-thumbs]");
    const current = thumbs?.querySelectorAll<HTMLElement>("[data-thumb]")[active];
    if (thumbs && current && thumbs.scrollWidth > thumbs.clientWidth) {
      thumbs.scrollTo({ left: current.offsetLeft - (thumbs.clientWidth - current.offsetWidth) / 2, behavior: "smooth" });
    }

    if (!bar) return;
    tween.current?.kill();
    tween.current = gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration, ease: "none", paused: !inView.current || hovered.current, onComplete: () => setActive((i) => (i + 1) % count) },
    );
    return () => {
      tween.current?.kill();
    };
  }, [active, scope, count, duration, setActive]);

  const pause = useCallback(() => {
    hovered.current = true;
    tween.current?.pause();
  }, []);
  const resume = useCallback(() => {
    hovered.current = false;
    if (inView.current) tween.current?.play();
  }, []);

  return { pause, resume };
}
