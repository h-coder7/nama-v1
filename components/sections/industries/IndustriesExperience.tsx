"use client";

import clsx from "clsx";
import { serviceLink } from "@/lib/routes";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { AppLink } from "@/components/ui/AppLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { industriesPageData } from "./industries-page.data";
import { useIndustriesExperienceAnimation } from "./useIndustriesExperienceAnimation";
import styles from "./industries-experience.module.scss";

/**
 * Industries page — hero (6 illustrated tiles + "Jump to") and the dark
 * "Six industries, one partner" carousel. They share the selected industry:
 * picking a tile updates "Jump to", and jumping scrolls to that card.
 */
export function IndustriesExperience({ t }: { t: Messages }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const p = t.industriesPage;
  const total = industriesPageData.length;
  const { jumpTo, scrollBy, goTo } = useIndustriesExperienceAnimation(ref, active, setActive);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div ref={ref}>
      {/* HERO */}
      <section className={styles.hero} aria-labelledby="industries-title">
        <div className="container">
          <Breadcrumb current="industries" t={t} tone="light" className={styles.crumbs} />
          <div data-header>
            <Eyebrow tone="light">{p.hero.eyebrow}</Eyebrow>
            <h1 id="industries-title" className={styles.title} data-title>
              <RichText text={p.hero.title} accentClass={styles.accent} />
            </h1>
          </div>
          <div className={styles.introRow}>
            <div className={styles.intro} data-fade>
              <p className={styles.lead}>{p.hero.lead}</p>
              <p className={styles.body}>{p.hero.body}</p>
            </div>
            <button className={styles.jump} onClick={jumpTo} data-fade>
              <span className={styles.jumpLabel}>{p.hero.jumpTo}</span>
              <span className={styles.jumpName} aria-live="polite">{t.routes[industriesPageData[active].key]}</span>
              <span className={styles.jumpIcon} aria-hidden="true">
                <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3.75V14.25M13.5 9.75L9 14.25L4.5 9.75" /></svg>
              </span>
            </button>
          </div>

          <ul className={styles.tiles} aria-label={p.hero.tilesLabel}>
            {industriesPageData.map((d, i) => (
              <li key={d.key} data-tile>
                <button
                  className={clsx(styles.tile, i === active && styles.tileActive)}
                  aria-pressed={i === active}
                  onClick={() => goTo(i, true)}
                >
                  <svg className={styles.drawing} viewBox="0 0 142 112" fill="none" aria-hidden="true">
                    <path d={d.drawing} stroke="currentColor" strokeWidth="1.42" strokeLinecap="round" strokeLinejoin="round" data-draw />
                  </svg>
                  <span className={styles.tileLabel}>{t.routes[d.key]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className={styles.showcase} id="industries-showcase" aria-labelledby="showcase-title" data-showcase>
        <div className={`container ${styles.showHead}`} data-header>
          <div className={styles.showLead}>
            <Eyebrow tone="dark">{p.showcase.eyebrow}</Eyebrow>
            <h2 id="showcase-title" className={styles.showTitle} data-title>
              <RichText text={p.showcase.title} accentClass={styles.accent} />
            </h2>
          </div>
          <div className={styles.arrows}>
            <button className={styles.prev} onClick={() => scrollBy(-1)} aria-label={t.common.previous}>
              <Icon name="arrow" size={16} flow="back" />
            </button>
            <button className={styles.next} onClick={() => scrollBy(1)} aria-label={t.common.next}>
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>

        <ul className={styles.track} data-track tabIndex={0} aria-label={p.showcase.eyebrow}>
          {industriesPageData.map((d, i) => {
            const it = p.items[i];
            return (
              <li key={d.key} className={styles.card} data-card id={`industry-${d.key}`}>
                <AppLink to={d.key} className={styles.media} tabIndex={-1} aria-hidden="true">
                  <Image src={d.image} alt="" fill sizes="(min-width: 992px) 466px, 84vw" className={styles.image} />
                  <span className={styles.badge}>{pad(i + 1)} / {pad(total)}</span>
                </AppLink>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>
                    <AppLink to={d.key}>{t.routes[d.key]}</AppLink>
                  </h3>
                  <p className={styles.cardText}>{it.body}</p>
                  <ul className={styles.services}>
                    {it.services.map((s, si) => (
                      <li key={`${s}-${si}`}>
                        <AppLink {...serviceLink(d.services[si])} className={styles.service}>
                          <strong>{s}</strong>
                          <small>{t.routes[d.services[si]]}</small>
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <div className={`container ${styles.progressRow}`}>
          <span className={styles.progress} aria-hidden="true"><span data-progress /></span>
          <span className={styles.counter} aria-live="polite">
            <b data-counter>{pad(active + 1)}</b> / {pad(total)}
          </span>
        </div>
      </section>
    </div>
  );
}
