"use client";

import { useId, useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { numbersData } from "./numbers.data";
import { useNumbersAnimation } from "./useNumbersAnimation";
import styles from "./numbers.module.scss";

const N_PATH = "M225 3H182L141 42L140 3L96 4L0 96V127H49L95 84L97 127H137L225 42Z";

export function Numbers({ t, units, companyName }: { t: Messages["numbers"]; units: Messages["units"]; companyName: string }) {
  const ref = useRef<HTMLElement>(null);
  const clipId = `nclip-${useId().replace(/:/g, "")}`;
  useNumbersAnimation(ref);

  return (
    <section ref={ref} className={styles.section} aria-label={t.eyebrow}>
      <div className="container">
        <div className={styles.card} data-card>
          <div className={styles.top}>
            <span className={styles.eyebrowWrap} data-fade>
              <Eyebrow tone="light" className={styles.eyebrow}>{t.eyebrow}</Eyebrow>
            </span>
            <p className={styles.intro} data-fade>{t.intro}</p>
          </div>

          <dl className={styles.list}>
            {t.items.map((it, i) => (
              <div key={it.label} className={styles.item} data-item>
                <dt className={styles.value}>
                  <span data-count={numbersData.items[i].value}>{numbersData.items[i].value}</span>
                  <span className={styles.suffix}>{units[numbersData.items[i].suffix]}</span>
                  <span className={styles.plus}>+</span>
                </dt>
                <dd>{it.label}</dd>
              </div>
            ))}
          </dl>

          {/* The Namma "N": outline draws, ink slats close in on the brand diagonal, a depth
              shadow slides out, then a sheen passes; it tilts gently with the pointer. */}
          <div className={styles.logo} data-logo>
            <svg className={styles.mark} viewBox="-2 -2 240 145" role="img" aria-label={companyName}>
              <defs>
                <clipPath id={clipId}>
                  <path d={N_PATH} />
                </clipPath>
              </defs>
              <path d={N_PATH} className={styles.markDepth} data-mark-depth />
              <path d={N_PATH} className={styles.markLine} pathLength={1} data-mark-line />
              <g clipPath={`url(#${clipId})`}>
                <g transform="skewX(-38)">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <rect key={k} x={k * 72 - 2} y="-10" width="74" height="160" className={styles.markFill} data-mark-band={k} />
                  ))}
                </g>
                <rect x="-120" y="-10" width="36" height="160" transform="skewX(-38)" className={styles.markSheen} data-mark-sheen />
              </g>
            </svg>
          </div>

          <div className={styles.highlight} data-highlight>
            <p className={styles.big}>
              <span className={styles.outline}>
                <span data-count={numbersData.highlight.value}>{numbersData.highlight.value}</span>
                <span className={styles.suffix}>{units[numbersData.highlight.suffix]}</span>
              </span>
              <span className={styles.unit}>+ {units[numbersData.highlight.unit]}</span>
            </p>
            <p className={styles.highlightLabel}>{t.highlightLabel}</p>
          </div>

          <div className={styles.year} data-year>
            <p className={styles.yearHead}>
              <strong>{t.yearTitle}</strong>
              <span>{t.yearNote}</span>
            </p>
            <dl className={styles.yearList}>
              {t.yearItems.map((it, i) => (
                <div key={it.label} className={styles.yearItem}>
                  <dt className={styles.yearValue}>
                    <span data-count={numbersData.year[i].value}>{numbersData.year[i].value}</span>
                    {"plus" in numbersData.year[i] && <span className={styles.plus}>+</span>}
                  </dt>
                  <dd>{it.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
