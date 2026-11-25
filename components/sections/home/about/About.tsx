"use client";

import clsx from "clsx";
import { useRef, useState, type PointerEvent } from "react";
import type { Messages } from "@/lib/i18n";
import { pad2 } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { aboutData } from "./about.data";
import { useAboutAnimation } from "./useAboutAnimation";
import styles from "./about.module.scss";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Home "About": the milestone stage (big rolling year + that year's story) on top,
 * the scrubbable years rail under it, and the company copy + CTAs below the rail.
 */
export function About({ t, common }: { t: Messages["about"]; common: Messages["common"] }) {
  const ref = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(aboutData.initialMilestone);
  const total = t.milestones.length;
  const { setDirection } = useAboutAnimation(ref, active, t.milestones.map((m) => m.year).join(","));

  const go = (i: number) => {
    const next = (i + total) % total;
    if (next === active) return;
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  /** Hover (or drag on touch) along the rail selects the nearest year. */
  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" && e.buttons === 0) return;
    const rail = railRef.current;
    if (!rail) return;
    let best = active;
    let dist = Infinity;
    rail.querySelectorAll<HTMLElement>("[data-tick]").forEach((tick, i) => {
      const r = tick.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - e.clientX);
      if (d < dist) { dist = d; best = i; }
    });
    go(best);
  };

  const m = t.milestones[active];
  const year = m.year.split("");

  return (
    <section ref={ref} id="about" className={styles.section} aria-labelledby="about-title">
      <div className="container">
        <div className={styles.head} data-header>
          <Eyebrow tone="light">{t.eyebrow}</Eyebrow>
          <h2 id="about-title" className={styles.title} data-title>
            <RichText text={t.title} accentClass={styles.accent} />
          </h2>
        </div>

        {/* Stage: rolling year + the selected milestone */}
        <div className={styles.stage} data-stage>
          <div className={styles.yearBlock}>
            <span className={styles.year} dir="ltr" aria-hidden="true" data-year>
              {year.map((ch, i) => (
                <span key={i} className={styles.digit} data-digit>
                  <span className={styles.roll} data-roll>
                    <span className={styles.strip} style={{ ["--d" as string]: Number(ch), transitionDelay: `${i * 70}ms` }}>
                      {DIGITS.map((d) => <span key={d}>{d}</span>)}
                    </span>
                  </span>
                </span>
              ))}
            </span>
            <span className={styles.counter}>
              <b dir="ltr">{pad2(active + 1)}</b>
              <span className={styles.counterBar} aria-hidden="true">
                <span style={{ transform: `scaleX(${(active + 1) / total})` }} />
              </span>
              <span dir="ltr">{pad2(total)}</span>
            </span>
          </div>
          <div className={styles.story} aria-live="polite">
            <span className="visually-hidden">{m.year}</span>
            <h3 className={styles.storyTitle} key={`t-${active}`} data-story-title>
              {m.title.replace(/\n/g, " ")}
            </h3>
            <p className={styles.storyBody} key={`b-${active}`} data-story-body>
              {m.body}
            </p>
          </div>
        </div>

        {/* Years rail */}
        <div className={styles.timeline} data-timeline role="group" aria-label={t.timelineLabel}>
          <div className={styles.track}>
            <button className={styles.nav} onClick={() => go(active - 1)} aria-label={common.prevMilestone}>
              <Icon name="arrow" size={13} flow="back" />
            </button>
            <div ref={railRef} className={styles.rail} data-rail onPointerMove={scrub} onPointerDown={scrub}>
              {t.milestones.map((ms, i) => (
                <button
                  key={ms.year}
                  className={clsx(styles.stop, i === active && styles.stopActive, i < active && styles.stopPast)}
                  onClick={() => go(i)}
                  onFocus={() => go(i)}
                  aria-pressed={i === active}
                  aria-label={`${ms.year}: ${ms.title.replace(/\n/g, " ")}`}
                  data-stop
                >
                  <span className={styles.stopYear} aria-hidden="true">{ms.year}</span>
                  <span className={styles.ticks} aria-hidden="true">
                    <span className={styles.seg} />
                    <i data-tick /><i /><i /><i />
                    {i === active && <span className={styles.pill} data-pill>{ms.year}</span>}
                  </span>
                </button>
              ))}
            </div>
            <button className={styles.nav} onClick={() => go(active + 1)} aria-label={common.nextMilestone}>
              <Icon name="arrow" size={13} />
            </button>
          </div>
        </div>

        {/* Company copy (static) */}
        <div className={styles.copy}>
          <p className={styles.lead} data-lead>{t.lead}</p>
          <div className={styles.copySide}>
            {t.body.map((p) => (
              <p key={p} className={styles.body} data-fade>{p}</p>
            ))}
            <div className={styles.ctas} data-fade>
              <Button to={aboutData.ctas.primary} tone="yellow" chip="dark">{t.primary}</Button>
              <Button href={aboutData.ctas.profile} ghost className={styles.ghost}>{t.secondary}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
