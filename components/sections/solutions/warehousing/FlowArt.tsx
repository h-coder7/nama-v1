"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./flow-art.module.scss";

/**
 * Bespoke line illustrations for the four "How do your goods move?" stages
 * (white line-work on ink, yellow for what the stage acts on). Each one draws itself
 * when its stage opens, then keeps a small loop running while it is shown.
 *   0 Understand your needs   — spec sheet being checked beside goods of different sizes
 *   1 Define storage          — rack whose bays are allotted one by one, with a time arc
 *   2 Manage the flow         — receipt → storage → preparation lane with a box travelling it
 *   3 Prepare for next stage  — wrapped pallet tagged ready, rolling out of the dock door
 */
export function FlowArt({ index }: { index: number }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = (s: string) => svg.querySelectorAll(s);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(q("[data-l]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, stagger: 0.05, ease: "power2.inOut" }, 0)
        .from(q("[data-pop]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.08, ease: "back.out(2.2)" }, 0.45)
        .from(q("[data-fill]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.45, stagger: 0.12, ease: "power3.out" }, 0.6);
      // Loops while this stage is on screen.
      const move = q("[data-move]");
      if (move.length) gsap.fromTo(move, { x: 0 }, { x: Number((move[0] as SVGElement).dataset.move), duration: 2.6, ease: "power1.inOut", repeat: -1, repeatDelay: 0.4, delay: 1.1 });
      const blink = q("[data-blink]");
      if (blink.length) gsap.to(blink, { opacity: 0.25, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.2 });
      const spin = q("[data-spin]");
      if (spin.length) gsap.fromTo(spin, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 3, ease: "none", repeat: -1, delay: 0.8 });
    }, svg);
    return () => ctx.revert();
  }, [index]);

  return (
    <svg ref={ref} key={index} className={styles.art} viewBox="0 0 260 190" aria-hidden="true" data-flow-art>
      {index === 0 && (
        <g>
          {/* spec sheet */}
          <rect x="18" y="18" width="104" height="140" rx="8" className={styles.line} data-l />
          <rect x="48" y="10" width="44" height="16" rx="5" className={styles.ink} />
          <rect x="48" y="10" width="44" height="16" rx="5" className={styles.line} data-l />
          {[52, 80, 108, 136].map((y, i) => (
            <g key={y}>
              <rect x="32" y={y - 7} width="12" height="12" rx="3" className={styles.line} data-l />
              <path d={`M34 ${y - 1} l3.5 3.5 l6 -7`} className={styles.tick} data-l />
              <path d={`M54 ${y - 1} H${[106, 96, 110, 88][i]}`} className={styles.thin} data-l />
            </g>
          ))}
          {/* goods of different sizes + measuring line */}
          <rect x="146" y="112" width="44" height="44" rx="3" className={styles.box} data-fill />
          <rect x="196" y="126" width="30" height="30" rx="3" className={styles.boxLine} data-fill />
          <rect x="160" y="70" width="58" height="38" rx="3" className={styles.boxLine} data-fill />
          <path d="M146 170 H226" className={styles.thin} data-l />
          <path d="M146 166 v8 M226 166 v8" className={styles.thin} data-l />
          <path d="M238 70 V156" className={styles.thin} data-l />
          <path d="M234 70 h8 M234 156 h8" className={styles.thin} data-l />
          <circle cx="168" cy="134" r="5" className={styles.dot} data-pop />
        </g>
      )}
      {index === 1 && (
        <g>
          {/* rack */}
          <path d="M24 170 V30 M128 170 V30 M232 170 V30" className={styles.line} data-l />
          <path d="M24 62 H232 M24 108 H232 M24 154 H232" className={styles.line} data-l />
          {[
            [32, 70, 1], [80, 70, 0], [136, 70, 1], [184, 70, 1],
            [32, 116, 1], [80, 116, 1], [136, 116, 0], [184, 116, 1],
            [136, 24, 1], [184, 24, 0],
          ].map(([x, y, on], i) => (
            <rect key={i} x={x} y={y} width="40" height="34" rx="3" className={on ? styles.box : styles.boxGhost} data-fill />
          ))}
          {/* storage duration: a clock whose arc keeps sweeping */}
          <circle cx="100" cy="41" r="14" className={styles.thin} data-l />
          <circle cx="100" cy="41" r="14" className={styles.arrow} data-spin transform="rotate(-90 100 41)" />
          <path d="M100 33 V41 L106 45" className={styles.line} data-l />
        </g>
      )}
      {index === 2 && (
        <g>
          {/* three stations */}
          {[30, 130, 230].map((x, i) => (
            <rect key={x} x={x - 26} y="40" width="52" height="52" rx="10" className={i === 1 ? styles.box : styles.line} data-pop />
          ))}
          {/* icons in stations */}
          <path d="M18 66 h24 M30 54 v24" className={styles.thin} data-l />
          <path d="M118 56 h24 v24 h-24 z M118 68 h24" className={styles.inkLine} data-l />
          <path d="M218 58 l12 -6 l12 6 v14 l-12 6 l-12 -6 z M218 58 l12 6 l12 -6 M230 64 v14" className={styles.thin} data-l />
          {/* lane */}
          <path d="M20 140 H240" className={styles.line} data-l />
          <path d="M20 152 H240" className={styles.thin} data-l />
          {[40, 70, 100, 130, 160, 190, 220].map((x) => <circle key={x} cx={x} cy="146" r="2.5" className={styles.dotGhost} data-pop />)}
          <path d="M56 66 h40 m-8 -6 l8 6 l-8 6 M156 66 h40 m-8 -6 l8 6 l-8 6" className={styles.arrow} data-l />
          <g data-move="176">
            <rect x="24" y="116" width="26" height="22" rx="3" className={styles.box} />
          </g>
        </g>
      )}
      {index === 3 && (
        <g>
          {/* dock door */}
          <path d="M150 170 V30 H246 V170" className={styles.line} data-l />
          {[46, 58, 70, 82].map((y) => <path key={y} d={`M154 ${y} H242`} className={styles.thin} data-l />)}
          {/* wrapped pallet */}
          <g data-move="56">
            <rect x="30" y="74" width="80" height="80" rx="4" className={styles.box} data-fill />
            <path d="M30 96 L110 84 M30 120 L110 106 M30 142 L110 130" className={styles.wrap} data-l />
            <path d="M26 154 H114 M34 154 v10 M70 154 v10 M106 154 v10 M26 164 H114" className={styles.line} data-l />
            {/* ready tag */}
            <g data-pop>
              <rect x="82" y="50" width="40" height="26" rx="6" className={styles.ink} />
              <rect x="82" y="50" width="40" height="26" rx="6" className={styles.tag} />
              <path d="M93 63 l5 5 l10 -10" className={styles.tickInk} />
            </g>
          </g>
          <path d="M126 176 h34 m-8 -6 l8 6 l-8 6" className={styles.arrow} data-l />
          <circle cx="198" cy="110" r="4" className={styles.dot} data-blink />
        </g>
      )}
    </svg>
  );
}
