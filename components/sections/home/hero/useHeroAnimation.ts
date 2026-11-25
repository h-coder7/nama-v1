"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { heroData } from "./hero.data";

/** The film plays unless the visitor asked for less motion or less data. */
export function filmEnabled() {
  if (typeof window === "undefined") return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !reduce && !saveData;
}

/**
 * How each figure enters and leaves, matching the transition into and out of its shot
 * (cut list in hero.data.ts). Screen direction follows the film, so it does not flip in Arabic.
 */
const MOVES: { from: gsap.TweenVars; out: gsap.TweenVars }[] = [
  { from: { y: 24 }, out: { x: 60 } },                                              // 01 → light sweep L>R
  { from: { x: -60, clipPath: "inset(0% 100% 0% 0%)" }, out: { x: 90, filter: "blur(10px)" } }, // 02 → whip
  { from: { x: -90, filter: "blur(10px)" }, out: { x: 40 } },                       // 03 → line cut
  { from: { clipPath: "inset(0% 100% 0% 0%)" }, out: { y: -70, filter: "blur(10px)" } },       // 04 → whip up
  { from: { y: 70, filter: "blur(10px)" }, out: { filter: "brightness(2.2)" } },    // 05 → gold flash
  { from: { y: -18, filter: "brightness(2)" }, out: {} },                            // 06 → loop
];

/**
 * Hero film timeline.
 * The copy is driven by the video's own clock (currentTime), not by wall time, so it
 * stays in sync when the video buffers, is paused, or loops. First play: one figure per
 * shot, buttons + kicker arrive with the finale. From the first loop on, buttons and
 * kicker stay and the figures keep cycling at a smaller size ([data-looped]).
 * Reduced motion / data saver / no JS: nothing is hidden — the CSS shows the finale.
 */
export function useHeroAnimation(scope: RefObject<HTMLElement | null>, videoRef: RefObject<HTMLVideoElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    // The home hero hides nothing before hydration; release the shared intro flag at once.
    document.documentElement.classList.remove("is-intro");
    if (!conditions.motion || !filmEnabled()) return;
    const video = videoRef.current;
    if (!video) return;

    const beats = q("[data-beat]") as HTMLElement[];
    const pinned = [...q("[data-hero-ctas]"), ...q("[data-hero-kicker]")];
    const rail = q("[data-rail] i") as HTMLElement[];
    const cuts = [...heroData.beats.map((b) => b.at), heroData.video.duration];

    gsap.set(beats, { autoAlpha: 0 });
    gsap.set(pinned, { autoAlpha: 0 });

    const tl = gsap.timeline({ paused: true });
    beats.forEach((el, i) => {
      const s = cuts[i] + 0.12;
      const e = cuts[i + 1] - 0.38;
      const m = MOVES[i];
      tl.fromTo(
        el,
        { autoAlpha: 0, x: 0, y: 0, filter: "blur(0px) brightness(1)", clipPath: "inset(0% 0% 0% 0%)", ...m.from },
        { autoAlpha: 1, x: 0, y: 0, filter: "blur(0px) brightness(1)", clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.out" },
        s,
      );
      // Odometer: digits roll from 0 to their value, last digit first so the figure "settles";
      // then the unit and + pop in, a gold glint crosses the figure and the label rises.
      const strips = [...el.querySelectorAll<HTMLElement>("[data-digit]")];
      strips.forEach((st, k) => {
        const d = Number(st.dataset.digit);
        tl.fromTo(st, { y: 0, yPercent: 0 }, { y: 0, yPercent: -d * 10, duration: 1.15 + (strips.length - k) * 0.08, ease: "expo.out" }, s + 0.04 + k * 0.07);
      });
      tl.fromTo(el.querySelectorAll("[data-pop]"), { autoAlpha: 0, scale: 0.4, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(2.2)", stagger: 0.07 }, s + 0.45);
      tl.fromTo(el.querySelectorAll("[data-glint]"), { xPercent: -120, autoAlpha: 1 }, { xPercent: 220, autoAlpha: 0, duration: 0.9, ease: "power2.inOut" }, s + 0.75);
      tl.fromTo(el.querySelectorAll("[data-beat-label]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, s + 0.3);
      tl.to(el, { autoAlpha: 0, ...m.out, duration: 0.32, ease: "power2.in" }, e);
    });
    tl.set({}, {}, heroData.video.duration);

    let last = 0;
    let looped = false;
    let pinnedShown = false;
    const showPinned = () => {
      if (pinnedShown) return;
      pinnedShown = true;
      gsap.fromTo(pinned, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 });
    };
    // If the film cannot play, fall back to the visible finale.
    const fail = () => {
      gsap.ticker.remove(tick);
      tl.progress(1).kill();
      gsap.set(beats, { autoAlpha: 0 });
      gsap.set(beats[beats.length - 1], { autoAlpha: 1, clearProps: "filter,clipPath,transform" });
      showPinned();
    };

    function tick() {
      const t = video!.currentTime || 0;
      if (t < last - 1 && !looped) {
        looped = true;
        root.dataset.looped = "";
      }
      last = t;
      tl.time(Math.min(t, heroData.video.duration - 0.01));
      if (t >= heroData.ctaAt || looped) showPinned();
      rail.forEach((r, i) => r.style.setProperty("--p", String(gsap.utils.clamp(0, 1, (t - cuts[i]) / (cuts[i + 1] - cuts[i])))));
    }

    gsap.ticker.add(tick);
    video.addEventListener("error", fail);
    return () => {
      gsap.ticker.remove(tick);
      video.removeEventListener("error", fail);
      delete root.dataset.looped;
    };
  });
}
