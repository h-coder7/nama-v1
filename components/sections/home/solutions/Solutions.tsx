"use client";

import clsx from "clsx";
import { serviceLink } from "@/lib/routes";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { solutionsData } from "./solutions.data";
import { useSolutionsAnimation } from "./useSolutionsAnimation";
import styles from "./solutions.module.scss";

export function Solutions({ t }: { t: Messages["solutions"] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { swap } = useSolutionsAnimation(ref);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    swap();
  };

  const item = t.items[active];

  return (
    <section ref={ref} id="solutions" className={styles.section} aria-labelledby="solutions-title">
      <div className="container">
        <SectionHeader id="solutions-title" tone="dark" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <div className={styles.grid}>
          <ul className={styles.list} role="tablist" aria-label={t.eyebrow} aria-orientation="vertical">
            {t.items.map((s, i) => (
              <li key={s.title} data-row>
                <button
                  role="tab"
                  id={`sol-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="sol-panel"
                  className={clsx(styles.row, i === active && styles.active)}
                  onClick={() => select(i)}
                  onMouseEnter={() => window.matchMedia("(hover: hover)").matches && select(i)}
                >
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.rowText}>
                    <span className={styles.tag}>{s.tag}</span>
                    <span className={styles.rowTitle}>{s.title}</span>
                  </span>
                  <span className={styles.rowArrow} aria-hidden="true">
                    <Icon name="arrow" size={13} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.card} id="sol-panel" role="tabpanel" aria-labelledby={`sol-tab-${active}`} data-card>
            {solutionsData.map((d, i) => (
              <Image
                key={d.id}
                src={d.image}
                alt=""
                fill
                sizes="(min-width: 992px) 600px, 100vw"
                className={clsx(styles.cardImage, i === active && styles.cardImageActive)}
                data-card-image={i === active || undefined}
              />
            ))}
            <div className={styles.cardShade} />
            <div className={styles.cardBody} data-card-body key={active}>
              <span className={styles.tag} data-swap>
                {item.tag}
              </span>
              <h3 className={styles.cardTitle} data-swap>
                {item.title}
              </h3>
              <p className={styles.cardText} data-swap>
                {item.body}
              </p>
              <ul className={styles.chips} data-swap>
                {item.chips.map((c, ci) => {
                  const to = solutionsData[active].chips[ci];
                  return <li key={c}>{to ? <AppLink to={to}>{c}</AppLink> : <span>{c}</span>}</li>;
                })}
              </ul>
              <div data-swap>
                <Button {...serviceLink(solutionsData[active].to)} size="sm">
                  {item.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
