"use client";

import { onWidthResize } from "@/lib/motion";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pad2 } from "@/lib/format";
import { useSectionMotion } from "@/hooks/useSectionMotion";

const STAGES = 9;
/** Horizontal run of the brand diagonal across the film, in % of its width. */
const SLANT = 14;
/** Scroll spent on each cut, as a share of the viewport height. */
const PER_CUT = 0.72;

/**
 * Scroll length of the pinned film, shared with the layout reservation in Process.
 * Measured from the pin (100svh: steady while a phone's toolbar slides), not innerHeight.
 */
export const pinLength = (root?: HTMLElement | null) => {
  const pin = root?.querySelector<HTMLElement>("[data-pin]");
  return Math.round((pin?.offsetHeight || window.innerHeight) * PER_CUT * (STAGES - 1));
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The journey film.
 * The section pins for the length of the route; scroll position p runs 0 → 8 (one unit
 * per stage). Each frame after the first cuts in along the brand diagonal over the
 * middle of its unit (the ends are holds), a yellow seam riding its leading edge and
 * the photo settling from a slight push-in. From p we derive the stage (caption swap,
 * rail dots), the rail fill and the travelling Namma box. RTL: frames cut in from the
 * left, the direction of reading. Reduced motion: no pin, every frame listed.
 */
export function useProcessAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) {
      root.classList.add("is-static");
      return () => root.classList.remove("is-static");
    }
    const rtl = document.documentElement.dir === "rtl";
    const frames = q("[data-frame]") as HTMLElement[];
    const imgs = frames.map((f) => f.querySelector("img") as HTMLImageElement);
    const seam = q("[data-seam]")[0] as SVGLineElement;
    const rail = q("[data-rail]")[0] as HTMLElement;
    const dots = q("[data-dot]") as HTMLElement[];
    const capNum = q("[data-cap-num]")[0] as HTMLElement;
    const capAct = q("[data-cap-act]")[0] as HTMLElement;
    const capTitle = q("[data-cap-title]")[0] as HTMLElement;
    const capLine = q("[data-cap-line]")[0] as HTMLElement;
    const caps = frames.map((f) => Array.from(f.querySelectorAll("figcaption span")).map((s) => s.textContent ?? ""));
    const acts = (root.dataset.acts ?? "").split("|");
    const actOf = [0, 0, 0, 0, 1, 1, 2, 2, 2];
    const actLabels = q("[data-act]") as HTMLElement[];

    // Leading-edge position e (0 → 100 + SLANT) of a frame mid-cut, as a clip polygon.
    const clip = (t: number) => {
      const e = t * (100 + SLANT);
      return rtl
        ? `polygon(0% 0%, ${e}% 0%, ${e - SLANT}% 100%, 0% 100%)`
        : `polygon(${100 - e + SLANT}% 0%, 100% 0%, 100% 100%, ${100 - e}% 100%)`;
    };

    let cur = -1;
    const setStage = (i: number) => {
      if (i === cur) return;
      const first = cur < 0;
      cur = i;
      dots.forEach((d, k) => { d.classList.toggle("is-reached", k <= i); d.classList.toggle("is-now", k === i); });
      // The act the film is in lights up yellow: origin · on the way · destination.
      actLabels.forEach((a, k) => a.classList.toggle("is-on", k === actOf[i]));
      const swap = () => {
        capNum.textContent = pad2(i + 1);
        if (acts[actOf[i]]) capAct.textContent = acts[actOf[i]];
        capTitle.textContent = caps[i][0] ?? "";
        capLine.textContent = caps[i][1] ?? "";
      };
      if (first) return swap();
      gsap.timeline()
        .to([capTitle, capLine], { y: -16, autoAlpha: 0, duration: 0.2, ease: "power2.in", stagger: 0.04, overwrite: true })
        .add(swap)
        .fromTo([capTitle, capLine], { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", stagger: 0.07 });
    };

    const render = (p: number) => {
      let seamT = -1;
      frames.forEach((f, i) => {
        if (i === 0) {
          // The first frame breathes in slowly while it holds.
          gsap.set(imgs[0], { scale: 1.06 - 0.06 * clamp01(p) });
          return;
        }
        // The cut occupies the middle 70% of the unit before the stage; both ends hold.
        const t = clamp01((p - (i - 1) - 0.15) / 0.7);
        const eased = gsap.parseEase("power2.inOut")(t);
        gsap.set(f, { clipPath: clip(eased), visibility: t > 0 ? "visible" : "hidden" });
        gsap.set(imgs[i], { scale: 1.16 - 0.16 * eased });
        if (t > 0 && t < 1) seamT = eased;
      });
      if (seamT >= 0) {
        const e = seamT * (100 + SLANT);
        const top = rtl ? e : 100 - e + SLANT;
        const bottom = rtl ? e - SLANT : 100 - e;
        gsap.set(seam, { attr: { x1: top, x2: bottom }, opacity: 1 });
      } else gsap.set(seam, { opacity: 0 });
      setStage(Math.min(STAGES - 1, Math.max(0, Math.round(p))));
      rail.style.setProperty("--p", String(p / (STAGES - 1)));
    };

    render(0);
    const st = { p: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${pinLength(root)}`,
        pin: q("[data-pin]")[0],
        pinSpacing: false,
        scrub: 0.5,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    tl.to(st, { p: STAGES - 1, ease: "none", onUpdate: () => render(st.p) });
    // The contact sheet: a thumbnail jumps the film to its stage (held frame).
    const jumps = (q("[data-goto]") as HTMLButtonElement[]).map((btn) => {
      const go = () => {
        const s = tl.scrollTrigger;
        if (!s) return;
        const i = Number(btn.dataset.goto);
        window.scrollTo({ top: s.start + (s.end - s.start) * (i / (STAGES - 1)), behavior: "smooth" });
      };
      btn.addEventListener("click", go);
      return () => btn.removeEventListener("click", go);
    });
    gsap.to(q("[data-hint]"), { autoAlpha: 0, scrollTrigger: { trigger: root, start: "top top", end: "+=240", scrub: true } });

    // Arrival: the film opens from the brand diagonal, then the caption and rail rise.
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } })
      .from(q("[data-film]"), {
        clipPath: rtl ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        duration: 1.2, ease: "expo.inOut", clearProps: "clipPath",
      })
      .from([capTitle, capLine], { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, "-=0.4")
      .from(dots, { y: 10, autoAlpha: 0, duration: 0.45, stagger: 0.04, ease: "power2.out" }, "-=0.5");

    // Width changes only: re-reserve the pin length, then re-measure the triggers.
    const offResize = onWidthResize(() => {
      root.style.setProperty("--pin-len", `${pinLength(root)}px`);
      ScrollTrigger.refresh();
    });
    return () => { offResize(); jumps.forEach((off) => off()); };
  });
}
