"use client";

import { Fragment, useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { AppLink } from "@/components/ui/AppLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { industriesPageData } from "./industries-page.data";
import { useNextMoveAnimation } from "./useNextMoveAnimation";
import styles from "./next-move.module.scss";

/** "Working in another industry?" — two crossing marquee ribbons. */
export function NextMove({ t }: { t: Messages }) {
  const ref = useRef<HTMLElement>(null);
  useNextMoveAnimation(ref);
  const c = t.industriesPage.cta;
  const names = industriesPageData.map((d) => t.routes[d.key]);

  // One "set" of ribbon items; rendered twice for a seamless loop.
  const darkSet = (
    <>
      {names.slice(0, 3).map((n) => (
        <Fragment key={n}>
          <span className={styles.outline}>{n}</span>
          <i className={styles.dot} />
        </Fragment>
      ))}
      <span className={styles.yours}>{c.yours}</span>
      <i className={styles.dot} />
      {names.slice(3).map((n) => (
        <Fragment key={n}>
          <span className={styles.outline}>{n}</span>
          <i className={styles.dot} />
        </Fragment>
      ))}
    </>
  );
  const yellowSet = (
    <>
      {[0, 1, 2].map((i) => (
        <span key={i} className={styles.cta}>
          {c.ribbon}
          <Icon name="arrow" size={20} />
        </span>
      ))}
    </>
  );

  return (
    <section ref={ref} className={styles.section} aria-labelledby="next-move-title">
      <div className={`container ${styles.head}`} data-header>
        <Eyebrow tone="light">{c.eyebrow}</Eyebrow>
        <h2 id="next-move-title" className={styles.title} data-title>
          <RichText text={c.title} accentClass={styles.accent} />
        </h2>
        <p className={styles.body} data-intro>{c.body}</p>
      </div>

      <div className={styles.ribbons}>
        <div className={`${styles.ribbon} ${styles.dark}`} aria-hidden="true">
          <div className={styles.rail} data-rail="dark">
            <div className={styles.set}>{darkSet}</div>
            <div className={styles.set}>{darkSet}</div>
          </div>
        </div>
        <AppLink to="requestQuote" className={`${styles.ribbon} ${styles.yellow}`} aria-label={c.ribbon}>
          <div className={styles.rail} data-rail="yellow">
            <div className={styles.set}>{yellowSet}</div>
            <div className={styles.set} aria-hidden="true">{yellowSet}</div>
          </div>
        </AppLink>
      </div>
    </section>
  );
}
