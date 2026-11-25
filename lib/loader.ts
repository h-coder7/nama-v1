/**
 * Loading screen (components/layout/Preloader.tsx).
 * While it is on screen, page intros wait: GSAP is paused by LoaderGate and
 * anything that starts on its own (the hero film) calls whenLoaderDone().
 */
export const LOADER_START = "namma:loading";
export const LOADER_DONE = "namma:loaded";

declare global {
  interface Window {
    __nammaLoading?: boolean;
  }
}

export const isLoaderActive = () => typeof window !== "undefined" && window.__nammaLoading === true;

/** Runs fn now, or right after the loading screen leaves. Returns a cancel function. */
export function whenLoaderDone(fn: () => void): () => void {
  if (!isLoaderActive()) {
    fn();
    return () => {};
  }
  const on = () => fn();
  window.addEventListener(LOADER_DONE, on, { once: true });
  return () => window.removeEventListener(LOADER_DONE, on);
}
