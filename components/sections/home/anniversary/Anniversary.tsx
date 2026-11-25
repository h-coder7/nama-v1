"use client";

import { useId, useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { RichText } from "@/components/ui/RichText";
import { anniversaryData } from "./anniversary.data";
import { useAnniversaryAnimation } from "./useAnniversaryAnimation";
import styles from "./anniversary.module.scss";

/**
 * 40 Years — "Four decades, one window".
 * Giant numerals cut out of the ink card show Namma's heaviest moves cycling inside
 * them (multiply knock-out: the photo shows fully through the white "40", and only
 * as a faint shadow outside it). A 1983 → 2026 rule draws under the copy.
 */
export function Anniversary({ t }: { t: Messages["anniversary"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const maskId = `forty-${useId().replace(/:/g, "")}`;
  useAnniversaryAnimation(ref);

  return (
    <div ref={ref} className={styles.banner} data-banner>
      <div className={styles.copy}>
        <p className={styles.kicker} data-a-fade>{t.kicker}</p>
        <p className={styles.title} data-a-fade>
          <RichText text={t.title} accentClass={styles.accent} />
        </p>
        <p className={styles.body} data-a-fade>{t.body}</p>
        <div className={styles.rule} data-a-fade aria-hidden="true">
          <span>{anniversaryData.founded}</span>
          <i className={styles.ruleLine} data-a-rule />
          <span>{anniversaryData.now}</span>
        </div>
      </div>

      <div className={styles.window} role="img" aria-label={`${anniversaryData.years} ${t.years}, ${t.imageAlt}`}>
        <svg className={styles.svg} viewBox="0 0 800 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="460">
              <rect width="800" height="460" fill="#000" />
              <text x="400" y="380" textAnchor="middle" className={styles.numerals} data-a-num>
                {anniversaryData.years}
              </text>
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>
            <g data-a-photos>
              {anniversaryData.photos.map((src, i) => (
                <image
                  key={src}
                  href={src}
                  width="800"
                  height="460"
                  preserveAspectRatio="xMidYMid slice"
                  data-a-photo
                  style={{ opacity: i === 0 ? 1 : 0 }}
                />
              ))}
            </g>
          </g>
        </svg>
        <p className={styles.years} aria-hidden="true">
          <span className={styles.slash} data-a-slash />
          <span data-a-years>{t.years}</span>
        </p>
      </div>
    </div>
  );
}
