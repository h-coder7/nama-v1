"use client";

import clsx from "clsx";
import { useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { REVEAL_START } from "@/lib/motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { PROJECT_PAGES, PROJECT_ROWS, byVolume, rowById } from "../projects.data";
import { num } from "../projects.copy";
import type { DetailProps } from "./ProjectDetail";
import styles from "./project-detail.module.scss";

const TOP = 5;

/**
 * "From the completed projects list": the project's own record, beside the
 * largest recorded volumes with this project marked (added under them when it
 * is not one of the largest).
 */
export function ProjectRecord({ t, k }: DetailProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.projectsPage;
  const d = p.detail;
  const row = rowById(PROJECT_PAGES[k].row);
  const top = PROJECT_ROWS.filter((r) => r.volume != null).sort(byVolume).slice(0, TOP);
  const inTop = top.some((r) => r.id === row.id);
  const bars = inTop ? top : [...top, row];
  const max = top[0].volume ?? 1;

  useAutoReveal(ref, ({ q }) => {
    const chart = q("[data-chart]")[0];
    gsap.from(q("[data-bar]"), {
      scaleX: 0,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.09,
      scrollTrigger: { trigger: chart, start: REVEAL_START, once: true },
    });
    gsap.from(q("[data-bar-row]"), { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: chart, start: REVEAL_START, once: true } });
  });

  return (
    <section ref={ref} className={styles.record} aria-labelledby="record-title">
      <div className={`container ${styles.recordGrid}`}>
        <div className={styles.recordHead}>
          <SectionHeader eyebrow={d.recordEyebrow} title={d.contextTitle} id="record-title" />
          <p className={styles.recordIntro} data-intro>{d.contextIntro}</p>
        </div>

        <figure className={styles.context} data-chart data-rise="0.1">
          <ol>
            {bars.map((r) => {
              const on = r.id === row.id;
              return (
                <li key={r.id} className={clsx(on && styles.barOn, !inTop && on && styles.barExtra)} data-bar-row aria-current={on ? "true" : undefined}>
                  <span className={styles.barLabel} dir="ltr">{r.short}</span>
                  <span className={styles.barLine}>
                    <span className={styles.bar} style={{ "--w": Math.max(0.03, (r.volume ?? 0) / max) } as CSSProperties} data-bar />
                    <b>{num(r.volume ?? 0)}</b>
                  </span>
                </li>
              );
            })}
          </ol>
        </figure>
      </div>
    </section>
  );
}
