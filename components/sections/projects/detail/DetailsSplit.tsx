"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { PROJECT_PAGES, rowById } from "../projects.data";
import { num, siteOf } from "../projects.copy";
import type { DetailProps } from "./ProjectDetail";
import styles from "./project-detail.module.scss";

/** Layout "split": facts card beside the photo and the client's other projects. */
export function DetailsSplit({ t, k }: DetailProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.projectsPage;
  const d = p.detail;
  const page = PROJECT_PAGES[k];
  const row = rowById(page.row);
  useAutoReveal(ref);

  const facts: [string, string, boolean?][] = [
    [d.name, row.name, true],
    [d.site, siteOf(p, row)],
    [d.services, p.serviceLong[row.services]],
    [d.type, p.categories[row.category]],
  ];

  return (
    <section ref={ref} className={styles.split} aria-labelledby="details-title">
      <div className={`container ${styles.splitGrid}`}>
        <div className={styles.factCard} data-tone="dark" data-rise>
          <Eyebrow tone="dark">{d.detailsEyebrow}</Eyebrow>
          <h2 id="details-title" className={styles.factTitle}>
            <RichText text={p.projects[k].short} />
          </h2>
          <span className={styles.rule} data-line />
          <p className={styles.factVolume}>
            <small>{d.volume}</small>
            <span data-count={num(row.volume ?? 0)}>{num(row.volume ?? 0)}</span>
          </p>
          <dl className={styles.factList} data-stagger="16">
            {facts.map(([dt, dd, ltr]) => (
              <div key={dt}>
                <dt>{dt}</dt>
                <dd dir={ltr ? "ltr" : undefined}>{dd}</dd>
              </div>
            ))}
          </dl>
          <Button to="requestQuote" query={{ service: "projectLogistics" }} chip="yellow" size="sm">{d.requestQuote}</Button>
        </div>

        <div className={styles.splitSide}>
          <div className={styles.splitPhoto} data-rise="0.1">
            <div className={styles.parallax} data-parallax="6">
              <Image src={page.detailImage} alt="" fill sizes="(min-width: 992px) 700px, 100vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
