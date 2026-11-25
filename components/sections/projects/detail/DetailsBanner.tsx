"use client";

import Image from "next/image";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { PROJECT_PAGES, rowById } from "../projects.data";
import { num, siteOf } from "../projects.copy";
import type { DetailProps } from "./ProjectDetail";
import styles from "./project-detail.module.scss";

/** Layout "banner": big title, wide photo and a four-cell facts bar. */
export function DetailsBanner({ t, k }: DetailProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.projectsPage;
  const d = p.detail;
  const page = PROJECT_PAGES[k];
  const row = rowById(page.row);
  useAutoReveal(ref);

  return (
    <section ref={ref} className={styles.banner} aria-labelledby="details-title">
      <div className="container">
        <div className={styles.bannerHead} data-header>
          <Eyebrow tone="light">{d.detailsEyebrow}</Eyebrow>
          <h2 id="details-title" className={styles.bannerTitle} data-title>
            <RichText text={p.projects[k].title} />
          </h2>
          <p className={styles.bannerSub} data-intro dir="ltr">{row.name}</p>
        </div>

        <div className={styles.bannerFigure} data-rise>
          <div className={styles.bannerPhoto}>
            <div className={styles.parallax} data-parallax="6">
              <Image src={page.detailImage} alt="" fill sizes="(min-width: 1200px) 1152px, 100vw" />
            </div>
          </div>
          <dl className={styles.factsBar} data-stagger="18" data-tone="dark">
            <div>
              <dt>{d.volume}</dt>
              <dd className={styles.factVolume}><span data-count={num(row.volume ?? 0)}>{num(row.volume ?? 0)}</span></dd>
            </div>
            <div>
              <dt>{d.site}</dt>
              <dd>{siteOf(p, row)}</dd>
            </div>
            <div>
              <dt>{d.services}</dt>
              <dd>{p.serviceLong[row.services]}</dd>
            </div>
            <div>
              <dt>{d.type}</dt>
              <dd>{p.categories[row.category]}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
