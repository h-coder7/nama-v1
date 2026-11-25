"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./start-art.module.scss";

/**
 * One piece of equipment, assessed five ways ("We start with the equipment").
 * The same machine stays in frame while the drawing around it changes with the step:
 *   0 Type      — the machine itself, with a sensitivity marker
 *   1 Size      — a crate outline fitted round it, width/height callouts
 *   2 Weight    — centre of gravity and load arrow over a skid base
 *   3 Handling  — crated, slung from a crane hook that sways gently
 *   4 Route     — on a trailer, the road running underneath to a destination pin
 * Line-work draws on each change; a small loop runs while the step is shown.
 */
export function StartArt({ index }: { index: number }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = (s: string) => svg.querySelectorAll(s);
    const ctx = gsap.context(() => {
      gsap.from(q("[data-machine]"), { y: -14, autoAlpha: 0, duration: 0.6, ease: "power3.out" });
      gsap.fromTo(q("[data-l]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.85, stagger: 0.06, ease: "power2.inOut", delay: 0.1 });
      gsap.from(q("[data-pop]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.08, ease: "back.out(2.2)", delay: 0.55 });
      const sway = q("[data-sway]");
      if (sway.length) gsap.fromTo(sway, { rotation: -2.5 }, { rotation: 2.5, svgOrigin: "180 8", duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 });
      const bob = q("[data-bob]");
      if (bob.length) gsap.to(bob, { y: 6, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 });
      const road = q("[data-road]");
      if (road.length) gsap.fromTo(road, { strokeDashoffset: 0 }, { strokeDashoffset: -48, duration: 0.9, ease: "none", repeat: -1 });
    }, svg);
    return () => ctx.revert();
  }, [index]);

  // The machine (a motor-pump skid), drawn once and positioned per step.
  const machine = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`} data-machine>
      <rect x="0" y="36" width="120" height="10" rx="2" className={styles.fill} />
      <rect x="8" y="6" width="58" height="30" rx="6" className={styles.body} />
      <path d="M18 6 v30 M30 6 v30 M42 6 v30 M54 6 v30" className={styles.rib} />
      <rect x="66" y="14" width="12" height="14" rx="2" className={styles.body} />
      <circle cx="96" cy="21" r="15" className={styles.body} />
      <circle cx="96" cy="21" r="6" className={styles.rib} />
      <path d="M96 6 v-8 h14" className={styles.rib} />
    </g>
  );

  return (
    <svg ref={ref} key={index} className={styles.art} viewBox="0 0 360 230" aria-hidden="true">
      {index === 0 && (
        <g>
          {machine(120, 96)}
          <path d="M110 170 H250" className={styles.thin} data-l />
          {/* sensitivity marker: glass + "handle with care" ring */}
          <g data-pop>
            <circle cx="270" cy="70" r="24" className={styles.badge} />
            <path d="M262 58 h16 l-2 14 a6 6 0 0 1 -12 0 z M270 78 v8 M264 86 h12" className={styles.badgeLine} />
          </g>
          <path d="M246 78 L222 96" className={styles.dash} data-l />
        </g>
      )}
      {index === 1 && (
        <g>
          {machine(120, 110)}
          <rect x="106" y="86" width="148" height="80" rx="4" className={styles.crate} data-l />
          <path d="M106 190 H254 M106 184 v12 M254 184 v12" className={styles.dim} data-l />
          <path d="M278 86 V166 M272 86 h12 M272 166 h12" className={styles.dim} data-l />
          <rect x="160" y="182" width="40" height="16" rx="8" className={styles.pill} data-pop />
          <rect x="266" y="116" width="24" height="20" rx="8" className={styles.pill} data-pop />
        </g>
      )}
      {index === 2 && (
        <g>
          {machine(120, 110)}
          <path d="M104 166 H256 M112 166 v14 M180 166 v14 M248 166 v14 M104 180 H256" className={styles.line} data-l />
          <g data-pop>
            <circle cx="170" cy="128" r="11" className={styles.cog} />
            <path d="M170 117 v22 M159 128 h22" className={styles.cogLine} />
          </g>
          <g data-bob>
            <path d="M170 40 V92 M160 80 l10 14 l10 -14" className={styles.arrow} data-l />
          </g>
          <path d="M210 34 h60 M210 34 v-6 M230 34 v-4 M250 34 v-4 M270 34 v-6" className={styles.thin} data-l />
        </g>
      )}
      {index === 3 && (
        <g data-sway>
          <path d="M180 8 V40" className={styles.line} data-l />
          <path d="M172 40 a8 8 0 1 0 16 0 v-4" className={styles.arrow} data-l />
          <path d="M180 52 L116 104 M180 52 L244 104" className={styles.sling} data-l />
          <rect x="106" y="104" width="148" height="80" rx="4" className={styles.crateFill} data-l />
          <path d="M106 104 L254 184 M254 104 L106 184" className={styles.brace} data-l />
          <circle cx="116" cy="104" r="4" className={styles.point} data-pop />
          <circle cx="244" cy="104" r="4" className={styles.point} data-pop />
        </g>
      )}
      {index === 4 && (
        <g>
          <rect x="70" y="92" width="130" height="66" rx="4" className={styles.crateFill} data-l />
          <path d="M70 92 L200 158 M200 92 L70 158" className={styles.brace} data-l />
          <path d="M60 158 H230 M230 158 V122 h38 l16 18 v18 h-54" className={styles.line} data-l />
          <circle cx="96" cy="170" r="10" className={styles.wheel} />
          <circle cx="134" cy="170" r="10" className={styles.wheel} />
          <circle cx="252" cy="170" r="10" className={styles.wheel} />
          <path d="M20 192 H340" className={styles.roadEdge} />
          <path d="M20 204 H340" className={styles.road} data-road />
          <g data-pop>
            <path d="M318 96 a14 14 0 1 0 -28 0 c0 10 14 22 14 22 s14 -12 14 -22 z" className={styles.badge} />
            <circle cx="304" cy="96" r="5" className={styles.badgeDot} />
          </g>
        </g>
      )}
    </svg>
  );
}
