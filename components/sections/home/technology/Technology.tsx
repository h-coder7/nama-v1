"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { technologyData } from "./technology.data";
import { useTechnologyAnimation } from "./useTechnologyAnimation";
import styles from "./technology.module.scss";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Cinematic route: one full-width photo per tool, the five tools as thumbnails
 * along the route (warehouse floor → shipment delivery). Autoplays while on screen.
 */
export function Technology({ t }: { t: Messages["technology"] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = t.items.length;
  const { pause, resume } = useTechnologyAnimation(ref, active, setActive, count, technologyData.autoplayMs / 1000);
  const item = t.items[active];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="tech-title">
      <div className="container">
        <SectionHeader id="tech-title" tone="dark" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <div className={styles.stage} onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume} data-stage>
          <div className={styles.photos} data-photos>
            {technologyData.items.map((d, i) => (
              <div key={d.image} className={clsx(styles.photo, i === active && styles.photoActive)} aria-hidden={i !== active}>
                <Image
                  src={d.image}
                  alt={t.items[i].imageAlt}
                  fill
                  sizes="(min-width: 1200px) 1200px, 100vw"
                  style={{ objectPosition: d.focus }}
                  className={styles.image}
                />
              </div>
            ))}
            <span className={styles.shade} aria-hidden="true" />
          </div>

          <div className={styles.copy} id="tech-panel" role="tabpanel" aria-live="polite" key={active} data-copy>
            <p className={styles.count}>
              <b>{pad(active + 1)}</b>
              <span>/ {pad(count)} · {item.stage}</span>
            </p>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>{item.body}</p>
            <span className={styles.status}>{item.status}</span>
          </div>

          <div className={styles.route}>
            <div className={styles.line} aria-hidden="true">
              <span style={{ transform: `scaleX(${active / (count - 1)})` }} />
            </div>
            <ul className={styles.thumbs} role="tablist" aria-label={t.eyebrow} data-thumbs>
              {t.items.map((it, i) => (
                <li key={it.title} data-thumb>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-controls="tech-panel"
                    className={clsx(styles.thumb, i === active && styles.thumbActive)}
                    onClick={() => setActive(() => i)}
                  >
                    <span className={styles.thumbImg}>
                      <Image src={technologyData.items[i].image} alt="" fill sizes="72px" className={styles.image} />
                    </span>
                    <span className={styles.thumbText}>
                      <span className={styles.thumbNum}>{pad(i + 1)}</span>
                      <span className={styles.thumbTitle}>{it.title}</span>
                    </span>
                    <span className={styles.progress} aria-hidden="true">
                      <span data-bar data-progress={i === active || undefined} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
