"use client";

import clsx from "clsx";
import { useRef } from "react";
import { pad2 } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRY_ORDER } from "../industry-detail.data";
import type { SectionProps } from "../types";
import { useExploreAnimation } from "./useExploreAnimation";
import styles from "./explore-tiles.module.scss";

/** Explore other industries — "tiles" variant (Figma: Mining): striped dark tiles, current in yellow. */
export function ExploreTiles({ t, c, index }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useExploreAnimation(ref);
  const prev = INDUSTRY_ORDER[index - 1];
  // Wraps to the first industry on the last page.
  const next = INDUSTRY_ORDER[(index + 1) % INDUSTRY_ORDER.length];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="explore-title">
      <div className="container">
        <SectionHeader id="explore-title" tone="light" eyebrow={c.exploreEyebrow} title={c.exploreTitle} intro={c.exploreIntro} />

        <ul className={styles.tiles}>
          {INDUSTRY_ORDER.map((ind, i) => {
            const current = i === index;
            const isNext = i === (index + 1) % INDUSTRY_ORDER.length;
            return (
              <li key={ind.key} data-card>
                <AppLink to={ind.key} className={clsx(styles.tile, current && styles.current, (current || isNext) && styles.tagged)} aria-current={current ? "page" : undefined}>
                  <span className={styles.code}>NC-{pad2(i + 1)}</span>
                  <Icon name={ind.icon} size={26} strokeWidth={2.5} className={styles.icon} />
                  <span className={styles.name}>{t.routes[ind.key]}</span>
                  {current ? (
                    <span className={styles.here}>{c.youAreHere}</span>
                  ) : isNext ? (
                    <span className={styles.next}>{c.nextTag}</span>
                  ) : (
                    <Icon name="arrow" size={13} className={styles.arrow} />
                  )}
                </AppLink>
              </li>
            );
          })}
        </ul>
        <span className={styles.rule} aria-hidden="true" data-rule />

        <nav className={styles.pager} aria-label={c.exploreEyebrow} data-pager>
          {prev ? (
            <AppLink to={prev.key} className={styles.prev}>
              <span className={styles.prevIcon}><Icon name="arrow" size={14} flow="back" /></span>
              <span>{c.previousIndustry} · {t.routes[prev.key]}</span>
            </AppLink>
          ) : (
            <span />
          )}
          {next && (
            <AppLink to={next.key} className={styles.nextLink}>
              <span>{c.nextIndustry} · {t.routes[next.key]}</span>
              <span className={styles.nextIcon}><Icon name="arrow" size={14} /></span>
            </AppLink>
          )}
        </nav>
      </div>
    </section>
  );
}
