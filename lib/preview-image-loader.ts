/**
 * Image loader for the static review export only (production uses Next's optimiser).
 * Every /assets/namma/images/*.webp has pre-built width variants (name.w1080.webp
 * .w1080, .w1920 — see scripts/make-image-variants.py), so phones stop downloading
 * full-size originals.
 */
const BUCKETS = [1080];

export default function previewImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/assets/namma/images/") || !src.endsWith(".webp")) return src;
  const b = BUCKETS.find((x) => width <= x);
  return b ? src.replace(/\.webp$/, `.w${b}.webp`) : src;
}
