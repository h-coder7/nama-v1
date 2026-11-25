"use client";

import Image from "next/image";
import { useRef } from "react";
import { fill } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import type { SectionProps } from "../types";
import { useDeliveredSplitAnimation } from "./useDeliveredSplitAnimation";
import styles from "./delivered-split.module.scss";

/** Delivered — "split" variant (Figma: Mining): photo half + dark panel with a facts table. */
export function DeliveredSplit({ t, c, copy, data }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useDeliveredSplitAnimation(ref);
  const d = data.delivered;
  const facts: [string, string, boolean?][] = [
    [c.factYear, d.year],
    [c.factSector, t.routes[d.sector]],
    [c.factVolume, fill(c.volumeValue, { n: d.freightTons }), true],
    [c.factRole, copy.delivered.role],
  ];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="delivered-title">
      <div className={styles.panel} data-panel>
        <div className={styles.media}>
          {/* The whole photo is shown (zoomed out to fit); a soft blurred copy fills the frame around it. */}
          <Image src={d.image} alt="" aria-hidden fill sizes="(min-width: 992px) 25vw, 50vw" className={styles.backdrop} />
          <Image src={d.image} alt={t.routes[d.project]} fill sizes="(min-width: 992px) 50vw, 100vw" className={styles.image} data-image />
          {d.yearOnImage && <span className={styles.year} aria-hidden="true" data-year>{d.year}</span>}
        </div>
        <div className={styles.content}>
          <div data-header>
            <Eyebrow tone="dark">{c.deliveredEyebrow}</Eyebrow>
            <h2 id="delivered-title" className={styles.title} data-title>
              <RichText text={copy.delivered.title} accentClass={styles.accent} />
            </h2>
          </div>
          <p className={styles.body} data-fade>{copy.delivered.body}</p>
          <dl className={styles.facts}>
            {facts.map(([k, v, hi]) => (
              <div key={k} className={styles.fact} data-fact>
                <dt>{k}</dt>
                <dd className={hi ? styles.highlight : undefined}>{v}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.ctas} data-fade>
            <Button to={d.project} chip="yellow" size="sm">{c.viewProjectDetails}</Button>
            <Button to="projects" ghost size="sm">{c.viewProjects}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
