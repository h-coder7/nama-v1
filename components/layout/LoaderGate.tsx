"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/gsap";
import { LOADER_DONE, LOADER_START, isLoaderActive } from "@/lib/loader";
import { useLenis } from "@/providers/LenisProvider";

/**
 * Holds every GSAP timeline (hero intros, reveals) and the smooth scroll while the
 * loading screen is up, on the first load and on every page change, so each page
 * starts its entrance the moment the screen lifts. Rendered before the page content,
 * so its layout effect runs before the sections create their timelines.
 */
export function LoaderGate() {
  const lenis = useLenis();

  useLayoutEffect(() => {
    const hold = () => {
      gsap.globalTimeline.pause();
      lenis?.stop();
    };
    const release = () => {
      gsap.globalTimeline.resume();
      lenis?.start();
    };
    if (isLoaderActive()) hold();
    window.addEventListener(LOADER_START, hold);
    window.addEventListener(LOADER_DONE, release);
    return () => {
      window.removeEventListener(LOADER_START, hold);
      window.removeEventListener(LOADER_DONE, release);
    };
  }, [lenis]);

  return null;
}
