"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { industriesPageData } from "@/components/sections/industries/industries-page.data";
import { INDUSTRY_ORDER } from "../industry-detail.data";
import type { SectionProps } from "../types";
import { useExploreFeatureAnimation } from "./useExploreFeatureAnimation";
import styles from "./explore-feature.module.scss";

/** Explore other industries — "feature" variant (Figma: Construction): preview card + numbered index. */
export function ExploreFeature({ t, c, index }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const total = INDUSTRY_ORDER.length;
  const nextIdx = (index + 1) % total;
  const [active, setActive] = useState(nextIdx);
  useExploreFeatureAnimation(ref, active);
  const ind = INDUSTRY_ORDER[active];
  const image = industriesPageData.find((d) => d.key === ind.key)?.image ?? "";
  const label = active === nextIdx ? c.nextIndustryOf : c.industryOf;
  const preview = (i: number) => i !== index && setActive(i);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="explore-title">
      <div className="container">
        <SectionHeader id="explore-title" tone="light" eyebrow={c.exploreEyebrow} title={c.exploreTitle} intro={c.exploreIntro} />

        <div className={styles.grid}>
          <div className={styles.card} data-card>
            <div className={styles.cardCopy} data-swap>
              <p className={styles.cardLabel}>{fill(label, { n: pad2(active + 1), total: pad2(total) })}</p>
              <Icon name={ind.icon} size={44} strokeWidth={2.5} className={styles.cardIcon} />
              <p className={styles.cardName}>{t.routes[ind.key]}</p>
              <AppLink to={ind.key} className={styles.open}>
                {c.openSector}
                <span className={styles.openIcon}><Icon name="arrow" size={13} /></span>
              </AppLink>
            </div>
            <div className={styles.media}>
              <Image key={image} src={image} alt="" fill sizes="(min-width: 992px) 360px, 100vw" className={styles.image} data-swap-image />
            </div>
          </div>

          <ol className={styles.index}>
            {INDUSTRY_ORDER.map((it, i) => {
              const current = i === index;
              return (
                <li key={it.key} data-row>
                  <AppLink
                    to={it.key}
                    className={clsx(styles.row, current && styles.current, i === active && styles.rowActive)}
                    aria-current={current ? "page" : undefined}
                    onMouseEnter={() => preview(i)}
                    onFocus={() => preview(i)}
                  >
                    <span className={styles.num}>{pad2(i + 1)}</span>
                    <Icon name={it.icon} size={20} strokeWidth={2.5} className={styles.rowIcon} />
                    <span className={styles.rowName}>{t.routes[it.key]}</span>
                    {current ? <span className={styles.here}>{c.youAreHere}</span> : i === nextIdx ? <span className={styles.next}>{c.nextTag}</span> : null}
                  </AppLink>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
