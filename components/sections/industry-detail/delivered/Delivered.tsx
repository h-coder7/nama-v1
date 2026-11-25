"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import type { SectionProps } from "../types";
import { useDeliveredAnimation } from "./useDeliveredAnimation";
import styles from "./delivered.module.scss";

/** Yellow "Delivered in this sector" band — year, project, photo + freight-ton badge. */
export function Delivered({ t, c, copy, data }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useDeliveredAnimation(ref);
  const d = data.delivered;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="delivered-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className={styles.pill} data-fade>{c.deliveredEyebrow}</span>
          <p className={styles.year} aria-hidden="true">
            <span data-year={d.year}>{d.year}</span>
          </p>
          <h2 id="delivered-title" className={styles.title} data-fade>
            <span className="visually-hidden">{d.year}: </span>
            <RichText text={copy.delivered.title} />
          </h2>
          <p className={styles.body} data-fade>{copy.delivered.body}</p>
          <div className={styles.ctas} data-fade>
            <Button to={d.project} tone="dark" chip="dark" size="sm">{c.viewProjectDetails}</Button>
            <Button to="projects" ghost size="sm" className={styles.ghost}>{c.viewProjects}</Button>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.frame} data-frame>
            <Image src={d.image} alt={t.routes[d.project]} fill sizes="(min-width: 992px) 470px, 90vw" className={styles.image} data-image />
          </div>
          <div className={styles.badge} data-badge>
            <span className={styles.badgeValue} data-count={d.freightTons}>{d.freightTons}</span>
            <span className={styles.badgeUnit}>{c.freightTons}</span>
            <span className={styles.badgeApprox}>{c.approx}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
