"use client";

import clsx from "clsx";
import { useRef } from "react";
import type { Messages } from "@/lib/i18n";
import type { ServiceKey } from "@/lib/routes";
import { fill } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "./useAutoReveal";
import styles from "./solution-closing.module.scss";

type Props = {
  t: Messages;
  topic: string;
  /** Service carried to the quote form. */
  service?: ServiceKey;
  /** Replaces the "Discuss your … requirements" title. */
  title?: string;
  /** Show the authorities disclaimer (customs-related pages). */
  authorityNote?: boolean;
  tone?: "dark" | "light";
};

/**
 * "Next step" block that closes a solution page: title on the left, a yellow card
 * that hands off to the quote form (service preselected), and tracking / contact rows.
 */
export function SolutionClosing({ t, topic, service, title, authorityNote, tone = "dark" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useAutoReveal(ref);
  const c = t.solutionPages.common;
  const heading = title ?? fill(c.discussTitle, { topic });

  return (
    <section ref={ref} className={clsx(styles.section, styles[tone])} aria-labelledby="closing-title" data-tone={tone}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.lead} data-header>
          <Eyebrow tone={tone === "dark" ? "dark" : "light"}>{c.discussEyebrow}</Eyebrow>
          <h2 id="closing-title" className={styles.title} data-title>
            <RichText text={heading} accentClass={styles.accent} mutedClass={styles.muted} />
          </h2>
          {authorityNote && <p className={styles.note} data-intro>{c.authorityNote}</p>}
        </div>
        <div className={styles.side}>
          <div className={styles.card} data-rise>
            <p>{c.discussBody}</p>
            <Button to="requestQuote" query={service ? { service } : undefined} size="sm">{c.discussCta}</Button>
            {service && <p className={styles.preset}>{fill(c.quotePreselected, { service: t.routes[service] })}</p>}
          </div>
          <ul className={styles.rows} data-stagger="16">
            {([["trackShipment", c.existingQ, c.trackBody], ["contact", c.assistQ, c.contactBody]] as const).map(([to, q, body]) => (
              <li key={to}>
                <AppLink to={to} className={styles.row}>
                  <span>
                    <strong>{q}</strong>
                    <small>{body}</small>
                  </span>
                  <span className={styles.rowArrow} aria-hidden="true"><Icon name="arrow" size={12} /></span>
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
