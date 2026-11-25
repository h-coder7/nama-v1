"use client";

import { onWidthResize } from "@/lib/motion";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pad2 } from "@/lib/format";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { RAIL_END, SEA, STAGE_W } from "./JourneyScene";
import { LANE } from "./Carriers";

const STAGES = 9;
const C0 = STAGE_W / 2;
const CN = STAGE_W * (STAGES - 1) + STAGE_W / 2;

/** Scroll length of the pinned journey, shared with the layout reservation in Process. */
export const pinLength = (root: HTMLElement) => {
  const stage = root.querySelector("[data-stage]") as HTMLElement | null;
  return Math.round((CN - C0) * ((stage?.offsetHeight ?? 300) / 400) * 1.05);
};

/** Carrier for a point on the route: pallet at the start, ship over the sea, train on the rails, truck elsewhere. */
const carrierAt = (pos: number) => (pos < 560 ? 0 : pos >= SEA[0] && pos <= SEA[1] ? 2 : pos > SEA[1] + 40 && pos < RAIL_END ? 3 : 1);

/**
 * One box, one journey.
 * The section pins for the length of the route. Scroll drives the landscape under the
 * box (scrubbed), and from the box's position on the route we derive: the stage (caption
 * swap, rail), the carrier (cross-fade), wheel spin (distance travelled) and a gentle
 * swell while it is at sea. Reduced motion: static, hand-scrollable scene and full list.
 */
export function useJourneyMotion(scope: RefObject<HTMLElement | null>) {
  useSectionMotion(scope, ({ conditions, root, q }) => {
    if (!conditions.motion) {
      root.classList.add("is-static");
      q("[data-dot]").forEach((d) => d.classList.add("is-reached"));
      return () => root.classList.remove("is-static");
    }
    const stage = q("[data-stage]")[0] as HTMLElement;
    const world = q("[data-world]")[0] as HTMLElement;
    const unit = q("[data-unit]")[0] as SVGSVGElement;
    const carriers = q("[data-carrier]") as SVGGElement[];
    const wheels = q("[data-wheel]") as SVGGElement[];
    const dots = q("[data-dot]") as HTMLElement[];
    const fill = q("[data-rail-fill]")[0] as HTMLElement;
    const capNum = q("[data-cap-num]")[0] as HTMLElement;
    const capAct = q("[data-cap-act]")[0] as HTMLElement;
    const capTitle = q("[data-cap-title]")[0] as HTMLElement;
    const capLine = q("[data-cap-line]")[0] as HTMLElement;
    const titles = dots.map((d) => d.querySelector("[class*=dotTitle]")?.textContent ?? "");
    const lines = dots.map((d) => d.querySelector("[class*=srLine]")?.textContent ?? "");
    const acts = (root.dataset.acts ?? "").split("|");
    const actOf = [0, 0, 0, 0, 1, 1, 2, 2, 2];

    const scale = () => stage.offsetHeight / 400;
    // Arabic mirrors the whole stage (CSS), so the journey runs right → left; rects are visual, so flip back.
    const mirrored = document.documentElement.dir === "rtl";
    const boxX = () => {
      const s = stage.getBoundingClientRect(), u = unit.getBoundingClientRect();
      const c = u.left + u.width / 2 - s.left;
      return mirrored ? s.width - c : c;
    };
    const xAt = (pos: number) => boxX() - pos * scale();

    let curStage = -1;
    let curCarrier = 0;
    const swell = gsap.to(unit, { y: -5, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });

    const setStage = (i: number) => {
      if (i === curStage) return;
      const first = curStage < 0;
      curStage = i;
      dots.forEach((d, k) => { d.classList.toggle("is-reached", k <= i); d.classList.toggle("is-now", k === i); });
      const swap = () => {
        capNum.textContent = pad2(i + 1);
        if (acts[actOf[i]]) capAct.textContent = acts[actOf[i]];
        capTitle.textContent = titles[i];
        capLine.textContent = lines[i];
      };
      if (first) return swap();
      gsap.timeline()
        .to([capTitle, capLine], { y: -14, autoAlpha: 0, duration: 0.22, ease: "power2.in", stagger: 0.04, overwrite: true })
        .add(swap)
        .fromTo([capTitle, capLine], { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out", stagger: 0.06 });
    };
    const setCarrier = (k: number) => {
      if (k === curCarrier) return;
      curCarrier = k;
      carriers.forEach((c) => gsap.to(c, { opacity: Number(c.dataset.carrier) === k ? 1 : 0, duration: 0.35, overwrite: true }));
      gsap.fromTo(q("[data-box]"), { y: -10 }, { y: 0, duration: 0.5, ease: "bounce.out" });
      // Road vehicles drive in the far lane of the asphalt; ship and train sit on the line.
      gsap.to(q("[data-lane]"), { y: LANE[k], duration: 0.45, ease: "power2.out", overwrite: true });
      if (k === 2) swell.play(); else { swell.pause(); gsap.to(unit, { y: 0, duration: 0.3 }); }
    };
    const update = (pos: number) => {
      setStage(Math.min(STAGES - 1, Math.max(0, Math.round((pos - C0) / STAGE_W))));
      setCarrier(carrierAt(pos));
      wheels.forEach((w) => gsap.set(w, { rotation: pos * 4.4, svgOrigin: w.dataset.c }));
      gsap.set(fill, { scaleX: (pos - C0) / (CN - C0) });
    };

    gsap.set(q("[data-lane]"), { y: LANE[0] });
    gsap.set(world, { x: () => xAt(C0) });
    update(C0);

    const st = { pos: C0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${pinLength(root)}`,
        pin: q("[data-pin]")[0],
        pinSpacing: false,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    tl.to(st, {
      pos: CN,
      ease: "none",
      onUpdate: () => {
        gsap.set(world, { x: xAt(st.pos) });
        update(st.pos);
      },
    });
    gsap.to(q("[data-hint]"), { autoAlpha: 0, scrollTrigger: { trigger: root, start: "top top", end: "+=200", scrub: true } });

    // Intro: the line-work draws on as the section arrives.
    gsap.from(q("[data-scene] > g > *"), { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.04, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    gsap.from(unit, { x: -60, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%", once: true } });

    // Ambient life at the port, only while the section is on screen: the cranes lower a
    // container (ropes stretch with the load) and the freighter flies across the sky.
    const ambient = gsap.timeline({ paused: true });
    q("[data-crane-load]").forEach((load, i) => {
      const rope = load.previousElementSibling as SVGPathElement;
      const hoist = gsap.timeline({ repeat: -1, repeatDelay: 0.8, delay: i * 1.6 })
        .to(load, { y: 62, duration: 2.2, ease: "power2.inOut" })
        .to(rope, { scaleY: 2.6, transformOrigin: "50% 0%", duration: 2.2, ease: "power2.inOut" }, "<")
        .to({}, { duration: 0.7 })
        .to(load, { y: 0, duration: 2, ease: "power2.inOut" })
        .to(rope, { scaleY: 1, duration: 2, ease: "power2.inOut" }, "<");
      ambient.add(hoist, 0);
    });
    const plane = q("[data-plane]")[0];
    if (plane) {
      ambient.add(gsap.timeline({ repeat: -1 })
        .fromTo(plane, { x: -420, y: 70, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 3.2, ease: "none" })
        .to(plane, { x: 420, y: -70, autoAlpha: 0, duration: 3.2, ease: "none" })
        .to({}, { duration: 1.2 }), 0);
    }
    ScrollTrigger.create({ trigger: root, start: "top bottom", end: () => `+=${pinLength(root) + window.innerHeight * 2}`, onToggle: (self) => (self.isActive ? ambient.play() : ambient.pause()) });

    const offResize = onWidthResize(() => {
      root.style.setProperty("--pin-len", `${pinLength(root)}px`);
      ScrollTrigger.refresh();
    });
    return () => { offResize(); swell.kill(); ambient.kill(); };
  });
}
