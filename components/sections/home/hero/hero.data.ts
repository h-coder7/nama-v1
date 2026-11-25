import type { RouteKey } from "@/lib/routes";
import { img } from "@/lib/site";

type Unit = "million" | "thousand" | "frt";

/** Which message label each beat uses (keys of messages.hero.film). */
type BeatLabel = "beatOne" | "trucks" | "air" | "projects" | "sea" | "freight";

/**
 * "The Rhythm of Giants" — 18 s hero film (Higgsfield / Kling 4.0, assembled in edit).
 * Six shots, one figure per shot. `at` is the cut where the shot starts on screen (s);
 * the figure enters just after it on the same move as the transition into the shot.
 */
export const heroData: {
  image: string;
  video: { mp4: string; mobile: string; portrait: string; duration: number };
  beats: { at: number; label: BeatLabel; value: string; suffix?: Unit; unit?: Unit; plus?: boolean; year?: boolean }[];
  ctaAt: number;
  ctas: { primary: RouteKey; secondary: RouteKey; link: RouteKey };
} = {
  /** Poster = first frame of the film, so the switch from image to video is seamless. */
  image: img("hero-film-poster"),
  /** No audio. Full HD 1920×1040 from the 1080p master (H.264 CRF 20 ≈10.9 MB, SSIM 0.991 vs master);
   *  1280×694 under 900px wide (≈5.5 MB). Nov 2026: replaces the 1476×800 / 1.5 Mbps encode, which showed blocking. */
  video: {
    mp4: "/assets/namma/video/hero-rhythm-of-giants-1920.mp4",
    mobile: "/assets/namma/video/hero-rhythm-of-giants-1280.mp4",
    // Phones in portrait only ever see the centre of the frame, so they get a centre-cut film (~4× lighter).
    portrait: "/assets/namma/video/hero-rhythm-of-giants-portrait.mp4",
    duration: 18,
  },
  beats: [
    { at: 0, label: "beatOne", value: "1983", year: true },                   // 01 Haramain train on SPMT, wide (Nov 2026: was the close-up)
    { at: 2.75, label: "trucks", value: "90", suffix: "thousand", plus: true }, // 02 convoy
    { at: 5.58, label: "air", value: "200", suffix: "thousand", plus: true },   // 03 aircraft
    { at: 8.58, label: "projects", value: "70", plus: true },                  // 04 hydrogenation reactor on SPMT (Nov 2026: replaces the second train shot)
    { at: 11.58, label: "sea", value: "130", suffix: "thousand", plus: true },  // 05 port lift
    { at: 14.58, label: "freight", value: "8", suffix: "million", unit: "frt", plus: true }, // 06 finale
  ],
  /** The buttons arrive with the finale and stay from then on. */
  ctaAt: 14.9,
  ctas: { primary: "requestQuote", secondary: "solutions", link: "trackShipment" },
};
