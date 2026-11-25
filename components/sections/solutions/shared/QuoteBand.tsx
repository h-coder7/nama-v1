"use client";

import { useRef } from "react";
import type { Messages } from "@/lib/i18n";
import type { RouteKey } from "@/lib/routes";
import { fill } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "./useAutoReveal";
import styles from "./quote-band.module.scss";

/** "Request a … quote" — one large yellow card (service preselected) + track / contact cards. */
export function QuoteBand({ t, title, service }: { t: Messages; title: string; service: RouteKey }) {
  const ref = useRef<HTMLElement>(null);
  useAutoReveal(ref);
  const c = t.solutionPages.common;
  const cards = [
    { to: "requestQuote" as const, query: { service }, label: t.routes[service], title: c.quoteCard, main: true },
    { to: "trackShipment" as const, label: c.existingQ, title: c.trackCard },
    { to: "contact" as const, label: c.assistQ, title: c.contactCard },
  ];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="quote-title">
      <div className="container">
        <div className={styles.header} data-header>
          <div className={styles.lead}>
            <Eyebrow tone="light">{c.quoteEyebrow}</Eyebrow>
            <h2 id="quote-title" className={styles.title} data-title>
              <RichText text={title} accentClass={styles.accent} />
            </h2>
          </div>
          <div className={styles.meta} data-intro>
            <p>{c.quoteIntro}</p>
            <p className={styles.preset}>{fill(c.quotePreselected, { service: t.routes[service] })}</p>
          </div>
        </div>
        <ul className={styles.cards} data-stagger="40">
          {cards.map((card) => (
            <li key={card.to} className={card.main ? styles.mainItem : undefined}>
              <AppLink to={card.to} query={card.query} className={card.main ? `${styles.card} ${styles.main}` : styles.card}>
                <span className={styles.top}>
                  <span className={styles.label}>{card.label}</span>
                  <span className={styles.arrow} aria-hidden="true"><Icon name="arrow" size={13} /></span>
                </span>
                <span className={styles.cardTitle}><RichText text={card.title} /></span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
