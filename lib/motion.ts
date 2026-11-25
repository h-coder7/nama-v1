/** Motion tokens shared by every section hook (GSAP side). */
export const EASE = {
  out: "expo.out",
  soft: "power3.out",
  inOut: "power2.inOut",
  in: "power2.in",
} as const;

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  hero: 1.6,
} as const;

export const STAGGER = { tight: 0.05, base: 0.08, loose: 0.12 } as const;

/** Distance (px) for the default fade + rise entrance. */
export const RISE = 28;

/** Default ScrollTrigger start for section reveals (~25% visible). */
export const REVEAL_START = "top 78%";

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 992px)",
} as const;

/** Horizontal offsets flip in RTL (Arabic) so motion follows reading direction. */
export const isRtl = () => typeof document !== "undefined" && document.documentElement.dir === "rtl";
export const dirX = (px: number) => (isRtl() ? -px : px);

/**
 * True when the pre-hydration safety timeout already revealed the hero (slow device /
 * slow JS). Hero intros then skip their entrance instead of hiding visible content again.
 */
export const INTRO_SAFETY_MS = 3000;
export const introExpired = () =>
  typeof document !== "undefined" &&
  (document.documentElement.dataset.introExpired === "1" ||
    // First load only (the class is gone after any client-side navigation).
    (document.documentElement.classList.contains("is-intro") && performance.now() > INTRO_SAFETY_MS));

/**
 * Resize listener that ignores height-only changes. On phones the browser toolbar
 * shows/hides while scrolling, which resizes the viewport height; pinned sections
 * must not re-measure then (iOS Safari otherwise ends a pin in the wrong place).
 */
export function onWidthResize(fn: () => void): () => void {
  let w = window.innerWidth;
  const h = () => {
    if (window.innerWidth === w) return;
    w = window.innerWidth;
    fn();
  };
  window.addEventListener("resize", h);
  return () => window.removeEventListener("resize", h);
}
