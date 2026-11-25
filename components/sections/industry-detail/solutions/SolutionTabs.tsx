"use client";

import clsx from "clsx";
import { serviceLink } from "@/lib/routes";
import Image from "next/image";
import { useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useSolutionTabsAnimation } from "./useSolutionTabsAnimation";
import styles from "./solution-tabs.module.scss";

/** Suited solutions — "tabs" variant (Figma: Energy): dark panel, tab bar, one service at a time. */
export function SolutionTabs({ t, c, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const total = data.solutions.length;
  const go = (i: number) => setActive((i + total) % total);
  useSolutionTabsAnimation(ref, active);
  const s = data.solutions[active];
  const next = data.solutions[(active + 1) % total];
  const short = c.serviceShort as Record<string, string>;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="suited-title">
      <div className={styles.panel}>
        <div className="container">
          <SectionHeader id="suited-title" tone="dark" eyebrow={c.solutionsEyebrow} title={fill(c.solutionsTitle, { industry: name })} intro={c.solutionsIntro} />

          <div className={styles.tabs} role="tablist" data-tabs>
            {data.solutions.map((sol, i) => (
              <button
                key={sol.to}
                role="tab"
                id={`sol-tab-${i}`}
                aria-selected={i === active}
                aria-controls="sol-tabpanel"
                className={clsx(styles.tab, i === active && styles.tabActive)}
                onClick={() => go(i)}
              >
                <span className={styles.tabNum}>{pad2(i + 1)}</span>
                {t.routes[sol.to]}
              </button>
            ))}
          </div>

          <div className={styles.content} id="sol-tabpanel" role="tabpanel" aria-labelledby={`sol-tab-${active}`} data-content>
            <div className={styles.media}>
              <Image key={s.image + active} src={s.image} alt="" fill sizes="(min-width: 992px) 575px, 100vw" className={styles.image} data-swap-image />
            </div>
            <div className={styles.info}>
              <div className={styles.copy} data-swap>
                <span className={styles.num}>{pad2(active + 1)}</span>
                <h3 className={styles.title}>{t.routes[s.to]}</h3>
                <p className={styles.text}>{short[s.to] ?? ""}</p>
                <div>
                  <Button {...serviceLink(s.to)} chip="yellow" size="sm">{fill(c.exploreNamed, { service: t.routes[s.to] })}</Button>
                </div>
              </div>
              <div className={styles.footer}>
                <span>{fill(c.nextService, { service: t.routes[next.to] })}</span>
                <span className={styles.arrows}>
                  <button onClick={() => go(active - 1)} aria-label={t.common.previous}><Icon name="arrow" size={13} flow="back" /></button>
                  <button onClick={() => go(active + 1)} aria-label={t.common.next} className={styles.nextBtn}><Icon name="arrow" size={13} /></button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
