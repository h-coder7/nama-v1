"use client";

import clsx from "clsx";
import { serviceLink } from "@/lib/routes";
import { useRef, useState } from "react";
import { fill } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useSolutionTypesetAnimation } from "./useSolutionTypesetAnimation";
import styles from "./solution-typeset.module.scss";

const TONES = ["ink", "stripe", "yellow", "outline"] as const;

/**
 * Suited solutions — "typeset" variant (Figma: Industrial Operations).
 * 2×2 tiles, each carrying the service's key word as giant cropped type.
 * Hover/focus opens a tile's description and lifts its word.
 */
export function SolutionTypeset({ t, c, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useSolutionTypesetAnimation(ref);
  const short = c.serviceShort as Record<string, string>;
  const word = c.serviceWord as Record<string, string>;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="suited-title">
      <div className="container">
        <SectionHeader id="suited-title" tone="light" eyebrow={c.solutionsEyebrow} title={fill(c.solutionsTitle, { industry: name })} intro={c.solutionsIntro} />

        <ul className={styles.grid} data-grid>
          {data.solutions.map((s, i) => (
            <li key={s.to} className={clsx(styles.cell, styles[TONES[i % TONES.length]], i === active && styles.active)} data-tile>
              <AppLink {...serviceLink(s.to)} className={styles.tile} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                <span className={styles.head}>
                  <span className={styles.text}>
                    <span className={styles.title}>{t.routes[s.to]}</span>
                    <span className={styles.body}>{short[s.to] ?? ""}</span>
                  </span>
                  <span className={styles.go} aria-hidden="true"><Icon name="arrow" size={14} /></span>
                </span>
                <span className={styles.word} aria-hidden="true"><span data-word>{word[s.to] ?? t.routes[s.to]}</span></span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
