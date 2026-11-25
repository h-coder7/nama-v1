"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { countUp, revealHeader, revealUp } from "@/lib/reveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";

/** Big figure counts up, the rule draws across, the photo opens upward with a slow parallax. */
export function useDeliveredStatAnimation(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) return;
    revealHeader(root);
    revealUp(q("[data-fade]"), root, { stagger: 0.08 });
    countUp(root, root, { duration: 2 });
    gsap.from(q("[data-rule]"), { scaleX: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: REVEAL_START, once: true } });
    const media = q("[data-media]")[0];
    gsap.fromTo(media, { clipPath: "inset(100% 0% 0% 0% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", clearProps: "clipPath", duration: 1.2, ease: EASE.out, scrollTrigger: { trigger: media, start: "top 85%", once: true } });
    gsap.fromTo(q("[data-image]"), { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true } });
  });
}
