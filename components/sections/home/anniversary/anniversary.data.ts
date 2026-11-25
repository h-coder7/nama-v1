import { img } from "@/lib/site";

/**
 * 40 Years banner. The numerals are a window onto Namma's heaviest moves:
 * the photos cycle inside the "40" while the banner is in view.
 */
export const anniversaryData = {
  years: "40",
  founded: "1983",
  now: "2026",
  // 1100px copies: SVG <image> bypasses the image optimiser, and the numerals never need more.
  photos: [img("anniversary/a1"), img("anniversary/a2"), img("anniversary/a3"), img("anniversary/a4")],
} as const;
