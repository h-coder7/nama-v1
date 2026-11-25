"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { fill } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRY_ORDER } from "../industry-detail.data";
import type { SectionProps } from "../types";
import { useExploreTabsAnimation } from "./useExploreTabsAnimation";
import styles from "./explore-tabs.module.scss";

/** Explore other industries — "tabs" variant (Figma: Energy): folder tabs + yellow preview panel. */
export function ExploreTabs({ t, c, index }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  // Preview the next industry first (wraps to the first one on the last page).
  const [active, setActive] = useState((index + 1) % INDUSTRY_ORDER.length);
  useExploreTabsAnimation(ref, active);
  const ind = INDUSTRY_ORDER[active];
  const indName = t.routes[ind.key];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="explore-title">
      <div className="container">
        <SectionHeader id="explore-title" tone="light" eyebrow={c.exploreEyebrow} title={c.exploreTitle} intro={c.exploreIntro} />

        <div className={styles.folder} data-folder>
          <div className={styles.tabs} role="tablist">
            {INDUSTRY_ORDER.map((it, i) => (
              <button
                key={it.key}
                role="tab"
                aria-selected={i === active}
                aria-controls="explore-panel"
                disabled={i === index}
                className={clsx(styles.tab, i === active && styles.tabActive, i === index && styles.tabCurrent)}
                onClick={() => setActive(i)}
                onMouseEnter={() => i !== index && window.matchMedia("(hover: hover)").matches && setActive(i)}
              >
                {t.routes[it.key]}
              </button>
            ))}
          </div>
          <div className={styles.panel} id="explore-panel" role="tabpanel">
            <div className={styles.left} data-swap>
              <Icon name={ind.icon} size={40} strokeWidth={2.5} className={styles.icon} />
              <p className={styles.name}>{indName}</p>
              <AppLink to={ind.key} className={styles.open}>
                {fill(c.openIndustry, { industry: indName })}
                <Icon name="arrow" size={13} />
              </AppLink>
            </div>
            <div className={styles.right}>
              <p className={styles.coversLabel}>{c.sectorCovers}</p>
              <ul className={styles.covers}>
                {c.coversItems.map((item) => (
                  <li key={item} data-cover>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
