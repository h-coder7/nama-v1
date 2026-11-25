"use client";

import Image from "next/image";
import { serviceLink } from "@/lib/routes";
import { useRef } from "react";
import { fill, pad2 } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useSuitedSolutionsAnimation } from "./useSuitedSolutionsAnimation";
import styles from "./suited-solutions.module.scss";

/** Featured solution (large photo card) + the other suited services as a list. */
export function SuitedSolutions({ t, c, copy, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useSuitedSolutionsAnimation(ref);
  const [featured, ...rest] = data.solutions;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="suited-title">
      <div className="container">
        <SectionHeader id="suited-title" tone="light" eyebrow={c.solutionsEyebrow} title={fill(c.solutionsTitle, { industry: name })} intro={c.solutionsIntro} />

        <div className={styles.grid}>
          <AppLink {...serviceLink(featured.to)} className={styles.featured} data-featured>
            <Image src={featured.image} alt="" fill sizes="(min-width: 992px) 575px, 100vw" className={styles.featuredImage} />
            <div className={styles.panel}>
              <span className={styles.num}>01</span>
              <h3 className={styles.featuredTitle}>{t.routes[featured.to]}</h3>
              <div className={styles.panelRow}>
                <p className={styles.featuredBody}>{copy.featuredSolutionBody}</p>
                <span className={styles.go} aria-hidden="true"><Icon name="arrow" size={14} /></span>
              </div>
            </div>
          </AppLink>

          <ul className={styles.list}>
            {rest.map((s, i) => (
              <li key={s.to} data-item>
                <AppLink {...serviceLink(s.to)} className={styles.item}>
                  <span className={styles.thumb}>
                    <Image src={s.image} alt="" fill sizes="80px" className={styles.thumbImage} />
                  </span>
                  <span className={styles.itemText}>
                    <span className={styles.itemNum}>{pad2(i + 2)}</span>
                    <span className={styles.itemTitle}>{t.routes[s.to]}</span>
                  </span>
                  <Icon name="arrow" size={14} className={styles.itemArrow} />
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
