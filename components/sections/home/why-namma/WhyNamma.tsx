"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Anniversary } from "../anniversary/Anniversary";
import { whyData } from "./why-namma.data";
import { useWhyNammaAnimation } from "./useWhyNammaAnimation";
import styles from "./why-namma.module.scss";

export function WhyNamma({ t, anniversary }: { t: Messages["why"]; anniversary: Messages["anniversary"] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number>(whyData.initialActive);
  useWhyNammaAnimation(ref, active, setActive);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="why-title">
      <div className="container">
        <div className={styles.header} data-header>
          <div className={styles.lead}>
            <Eyebrow tone="yellow">{t.eyebrow}</Eyebrow>
            <h2 id="why-title" className={styles.title} data-title>
              {t.titleLines.map((l, i) => (
                <span key={l} className={clsx(i === t.titleLines.length - 1 && styles.titleLast)}>
                  {l}
                  {i < t.titleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.intro} data-intro>{t.intro}</p>
        </div>

        <ol className={styles.rows} data-rows>
          <li className={styles.highlight} data-highlight aria-hidden="true" />
          {t.items.map((it, i) => (
            <li
              key={it.label}
              className={clsx(styles.row, i === active && styles.active)}
              data-row
              onMouseEnter={() => setActive(i)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.label}>{it.label}</h3>
              <div className={styles.copy}>
                <p className={styles.copyTitle}>{it.title}</p>
                <p className={styles.copyBody}>{it.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <Anniversary t={anniversary} />
      </div>
    </section>
  );
}
