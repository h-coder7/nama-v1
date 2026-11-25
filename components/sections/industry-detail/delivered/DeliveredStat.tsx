"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { SectionProps } from "../types";
import { useDeliveredStatAnimation } from "./useDeliveredStatAnimation";
import styles from "./delivered-stat.module.scss";

/** Delivered — "stat" variant (Figma: Energy): giant freight-ton figure, photo + copy below. */
export function DeliveredStat({ t, c, copy, data }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useDeliveredStatAnimation(ref);
  const d = data.delivered;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="delivered-title">
      <div className="container">
        <div data-header>
          <Eyebrow tone="light">{c.deliveredEyebrow}</Eyebrow>
        </div>
        <h2 id="delivered-title" className={styles.heading} data-fade>
          <span className={styles.year}>{d.year}</span>
          <span>{copy.delivered.title}</span>
        </h2>
        <div className={styles.statRow}>
          <p className={styles.stat} aria-label={`${d.freightTons} ${c.freightTons}`}>
            <span data-count={d.freightTons}>{d.freightTons}</span>
          </p>
          <p className={styles.unit} data-fade>
            <strong>{c.freightTons}</strong>
            <span>{c.approx}</span>
          </p>
        </div>
        <span className={styles.rule} data-rule aria-hidden="true" />
        <div className={styles.bottom}>
          <div className={styles.media} data-media>
            <Image src={d.image} alt={t.routes[d.project]} fill sizes="(min-width: 992px) 575px, 100vw" className={styles.image} data-image />
          </div>
          <div className={styles.copy}>
            <p className={styles.body} data-fade>{copy.delivered.body}</p>
            <div className={styles.ctas} data-fade>
              <Button to={d.project} chip="yellow" size="sm">{c.viewProjectDetails}</Button>
              <Button to="projects" ghost size="sm" className={styles.ghost}>{c.viewProjects}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
