"use client";

import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { DUR, EASE, REVEAL_START, RISE, STAGGER } from "@/lib/motion";

type Targets = gsap.TweenTarget;

/** Fade + rise, once, when the trigger reaches ~25% into the viewport. */
export function revealUp(targets: Targets, trigger: Element | undefined, vars: gsap.TweenVars = {}) {
  if (!trigger || gsap.utils.toArray(targets).length === 0) return;
  return gsap.from(targets, {
    y: RISE,
    autoAlpha: 0,
    duration: DUR.base,
    ease: EASE.soft,
    stagger: STAGGER.base,
    scrollTrigger: { trigger, start: REVEAL_START, once: true },
    ...vars,
  });
}

/** Masked line reveal for display headings. Re-splits on resize / font load. */
export function revealLines(el: Element | null, trigger?: Element, vars: gsap.TweenVars = {}) {
  if (!el) return;
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    linesClass: "split-line",
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: DUR.slow,
        ease: EASE.out,
        stagger: STAGGER.base,
        scrollTrigger: trigger ? { trigger, start: REVEAL_START, once: true } : undefined,
        ...vars,
      });
    },
  });
}

/** Standard section header choreography: eyebrow → title lines → intro. */
export function revealHeader(root: Element) {
  const header = root.querySelector("[data-header]");
  if (!header) return;
  revealUp(header.querySelectorAll("[data-eyebrow]"), header, { duration: DUR.fast * 1.6 });
  revealLines(header.querySelector("[data-title]"), header, { delay: 0.08 });
  revealUp(header.querySelectorAll("[data-intro]"), header, { delay: 0.25 });
}

const fmt = (n: number, grouped: boolean, decimals: number) =>
  grouped
    ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals);

/**
 * Count up every [data-count] element inside `root`.
 * Server HTML already holds the final value, so no-JS / reduced-motion users see it.
 */
export function countUp(root: Element, trigger: Element = root, vars: gsap.TweenVars = {}) {
  root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const raw = el.dataset.count ?? el.textContent ?? "0";
    const target = parseFloat(raw.replace(/,/g, ""));
    if (Number.isNaN(target)) return;
    const grouped = raw.includes(",");
    const decimals = (raw.split(".")[1] ?? "").length;
    const pad = raw.startsWith("0") && raw.length > 1 ? raw.length : 0;
    const state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger, start: REVEAL_START, once: true },
      onUpdate: () => {
        const s = fmt(state.v, grouped, decimals);
        el.textContent = pad ? s.padStart(pad, "0") : s;
      },
      ...vars,
    });
    el.textContent = pad ? "0".padStart(pad, "0") : "0";
  });
}

/**
 * Ambient loops (marquees, floats, pulses) run only while their section is on screen,
 * so off-screen pages do no continuous work. Call inside useSectionMotion (auto-reverted).
 */
export function loopWhileVisible<T extends gsap.core.Animation>(anim: T, trigger: Element | null | undefined): T {
  if (!trigger) return anim;
  ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? anim.resume() : anim.pause()),
    onRefresh: (self) => { if (!self.isActive) anim.pause(); },
  });
  return anim;
}
