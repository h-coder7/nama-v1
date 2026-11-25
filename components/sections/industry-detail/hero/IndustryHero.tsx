"use client";

import Image from "next/image";
import { useRef } from "react";
import { fill, pad2 } from "@/lib/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { SectionProps } from "../types";
import { useIndustryHeroAnimation } from "./useIndustryHeroAnimation";
import styles from "./industry-hero.module.scss";

export function IndustryHero({ t, c, copy, data, name, index, total }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useIndustryHeroAnimation(ref);

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="industry-title" data-hero-intro>
      <div className={styles.media}>
        <Image src={data.heroImage} alt="" fill priority sizes="100vw" className={styles.image} data-image />
        <div className={styles.shade} />
      </div>
      <div className={`container ${styles.content}`}>
        <div data-intro data-hero-fade>
          <Breadcrumb current={data.key} t={t} className={styles.crumbs} />
        </div>
        <div className={styles.copy}>
          <div data-intro data-hero-fade>
            <Eyebrow tone="dark">{fill(c.industryOf, { n: pad2(index + 1), total: pad2(total) })}</Eyebrow>
          </div>
          <h1 id="industry-title" className={styles.title}>
            <span className={styles.line}>
              <span data-intro data-hero-line>{name}</span>
            </span>
          </h1>
          <p className={styles.body} data-intro data-hero-fade>{copy.body}</p>
          <div className={styles.ctas} data-intro data-hero-fade>
            <Button to="requestQuote" query={{ industry: data.key, service: data.preselect }} size="sm">
              {fill(c.discussCta, { industry: name })}
            </Button>
            <Button to="projects" ghost size="sm">{c.viewProjects}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
