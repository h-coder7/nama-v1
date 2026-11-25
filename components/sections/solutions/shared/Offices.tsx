"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { REVEAL_START } from "@/lib/motion";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "./useAutoReveal";
import { solutionImg } from "./services.data";
import styles from "./offices.module.scss";

type Props = { t: Messages; variant: "route" | "list" | "cards"; tone?: "yellow" | "paper" };

const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "").replace("+9660", "+966")}`;

/**
 * "Coordinated from three offices" — KHB / RUH / JED with direct numbers.
 *   route: dashed route line that draws between the three stops + container-yard card (Freight)
 *   list:  yard card + stacked rows (Warehousing)
 *   cards: three code cards, head office in yellow (Customs)
 */
export function Offices({ t, variant, tone = "yellow" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const c = t.solutionPages.common;
  useAutoReveal(ref, ({ q }) => {
    const route = q("[data-route]")[0];
    if (!route) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: route, start: REVEAL_START, once: true } });
    tl.from(q("[data-route-line]"), { scaleX: 0, duration: 1.6, ease: "power2.inOut" })
      .from(q("[data-stop]"), { scale: 0, duration: 0.45, ease: "back.out(2.4)", stagger: 0.5 }, 0.05);
  });

  const yard = (
    <div className={styles.yard} data-rise>
      <p className={styles.yardLabel}>{c.yardLabel}</p>
      <p className={styles.yardArea}>
        <span data-count={c.yardArea}>{c.yardArea}</span> {c.yardUnit}
      </p>
      <p className={styles.yardNote}>{c.yardNote}</p>
      <div className={styles.yardImage}>
        <Image src={solutionImg("freight-transport", "container-yard")} alt="" fill sizes="320px" />
      </div>
    </div>
  );

  return (
    <section ref={ref} className={clsx(styles.section, styles[tone])} aria-labelledby="offices-title">
      <div className="container">
        <div className={styles.header} data-header>
          <h2 id="offices-title" className={styles.title} data-title>
            <RichText text={c.officesTitle} accentClass={styles.accent} mutedClass={styles.muted} />
          </h2>
          <p className={styles.intro} data-intro>{c.officesIntro}</p>
        </div>

        {variant === "route" && (
          <div className={styles.routeGrid}>
            <div className={styles.route} data-route>
              <span className={styles.routeLine} data-route-line aria-hidden="true" />
              <ul className={styles.stops}>
                {c.offices.map((o, i) => (
                  <li key={o.code}>
                    <span className={clsx(styles.stop, i === 0 && styles.stopHead)} data-stop aria-hidden="true" />
                    <span className={styles.code} dir="ltr">{o.code}</span>
                    <strong className={styles.city}>{o.city}</strong>
                    <span className={styles.role}>{o.role}</span>
                    <a href={tel(o.phone)} className={styles.phone} dir="ltr">{o.phone}</a>
                  </li>
                ))}
              </ul>
            </div>
            {yard}
          </div>
        )}

        {variant === "list" && (
          <div className={styles.listGrid}>
            {yard}
            <ul className={styles.list} data-stagger="20">
              {c.offices.map((o) => (
                <li key={o.code} className={styles.listRow}>
                  <span className={styles.code} dir="ltr">{o.code}</span>
                  <span className={styles.listCity}>
                    <strong>{o.city}</strong>
                    <small>{o.role}</small>
                  </span>
                  <a href={tel(o.phone)} className={styles.phone} dir="ltr">{o.phone}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {variant === "cards" && (
          <ul className={styles.cards} data-stagger="40">
            {c.offices.map((o, i) => (
              <li key={o.code} className={clsx(styles.card, i === 0 && styles.cardHead)}>
                <span className={styles.cardTop}>
                  <strong>{o.city}</strong>
                  <span className={styles.badge}>{o.role}</span>
                </span>
                <span className={styles.cardCode} dir="ltr">{o.code}</span>
                <a href={tel(o.phone)} className={styles.cardPhone} dir="ltr">{o.phone}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
