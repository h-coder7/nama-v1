"use client";

import clsx from "clsx";
import { serviceLink } from "@/lib/routes";
import Image from "next/image";
import { useRef } from "react";
import { fill, pad2 } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useSolutionCardsAnimation } from "./useSolutionCardsAnimation";
import styles from "./solution-cards.module.scss";

/** Suited solutions — "cards" variant (Figma: Mining): 4 photo cards, first one "in scope". */
export function SolutionCards({ t, c, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useSolutionCardsAnimation(ref);
  const total = data.solutions.length;
  const short = c.serviceShort as Record<string, string>;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="suited-title">
      <div className="container">
        <SectionHeader id="suited-title" tone="light" eyebrow={c.solutionsEyebrow} title={fill(c.solutionsTitle, { industry: name })} intro={c.solutionsIntro} />
        <ul className={styles.cards}>
          {data.solutions.map((s, i) => (
            <li key={s.to} data-card>
              <AppLink {...serviceLink(s.to)} className={clsx(styles.card, i === 0 && styles.inScope)}>
                <span className={styles.media}>
                  <Image src={s.image} alt="" fill sizes="(min-width: 992px) 280px, 50vw" className={styles.image} />
                </span>
                <span className={styles.body}>
                  <span className={styles.meta}>
                    <span className={styles.num}>{pad2(i + 1)} / {pad2(total)}</span>
                    <span className={styles.tag}>{i === 0 ? c.inScope : c.addToScope}</span>
                  </span>
                  <span className={styles.title}>{t.routes[s.to]}</span>
                  <span className={styles.text}>{short[s.to] ?? ""}</span>
                  <span className={styles.more}>
                    {c.exploreService}
                    <Icon name="arrow" size={13} />
                  </span>
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
