"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { serviceLink, type ServiceKey } from "@/lib/routes";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { pad2 } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "./useAutoReveal";
import { SERVICE_IMAGES } from "./services.data";
import styles from "./connected.module.scss";

type Variant = "rows" | "photos" | "tiles" | "cards" | "tabs";
type Props = { t: Messages; services: ServiceKey[]; variant: Variant; intro?: string; tone?: "paper" | "dark" | "yellow";
  /** Overrides "Often combined with". */
  title?: string;
  /** Also show "View all solutions" under the intro (it shows by default only without an intro). */
  viewAll?: boolean;
};

/**
 * "Often combined with" — links to the services that usually travel with this one.
 *   rows   (Freight)      ruled list, description + arrow button
 *   photos (Warehousing)  photo cards in a 2+2 mosaic
 *   tiles  (Customs)      dark / white numbered tiles on yellow
 *   cards  (Air & Sea)    photo cards with icon badges; the hovered one opens
 *   tabs   (Packing)      tab bar + photo / copy panel
 */
export function Connected({ t, services, variant, intro, tone, title, viewAll }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(variant === "cards" ? -1 : 0);
  const c = t.solutionPages.common;
  const desc = c.serviceDesc as Record<string, string>;
  const surface = tone ?? ({ rows: "paper", photos: "paper", tiles: "yellow", cards: "dark", tabs: "dark" } as const)[variant];
  useAutoReveal(ref);

  const pick = (i: number) => {
    if (i === active) return;
    setActive(i);
    const root = ref.current;
    if (variant === "tabs" && root && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(() => {
        gsap.fromTo(root.querySelector("[data-tab-image]"), { autoAlpha: 0, scale: 1.12, filter: "blur(8px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power3.out", clearProps: "filter" });
        gsap.fromTo(root.querySelectorAll("[data-tab-copy] > *"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: EASE.soft });
      });
    }
  };

  const header = (
    <div className={styles.header} data-header>
      <div className={styles.lead}>
        <Eyebrow tone={surface === "dark" ? "dark" : surface === "yellow" ? "yellow" : "light"}>{c.connectedEyebrow}</Eyebrow>
        <h2 className={styles.title} data-title id="connected-title">
          <RichText text={title ?? c.connectedTitle} accentClass={styles.accent} mutedClass={styles.muted} />
        </h2>
      </div>
      {intro ? (
        <div className={styles.introWrap} data-intro>
          <p className={styles.intro}>{intro}</p>
          {viewAll && <Button to="solutions" tone={surface === "dark" ? "light" : "dark"} chip="yellow" size="sm">{c.viewAll}</Button>}
        </div>
      ) : variant !== "tabs" && (
        <div data-intro>
          <Button to="solutions" tone={surface === "dark" ? "light" : "dark"} chip="yellow" size="sm">{c.viewAll}</Button>
        </div>
      )}
    </div>
  );

  return (
    <section ref={ref} className={clsx(styles.section, styles[surface])} aria-labelledby="connected-title" data-tone={surface}>
      <div className="container">
        {header}

        {variant === "rows" && (
          <ul className={styles.rows} data-stagger="20">
            {services.map((s) => (
              <li key={s}>
                <AppLink {...serviceLink(s)} className={styles.row}>
                  <span className={styles.rowTitle}>{t.routes[s]}</span>
                  <span className={styles.rowDesc}>{desc[s]}</span>
                  <span className={styles.rowBtn} aria-hidden="true"><Icon name="arrow" size={13} /></span>
                </AppLink>
              </li>
            ))}
          </ul>
        )}

        {variant === "photos" && (
          <ul className={styles.photos} data-stagger="40">
            {services.map((s) => (
              <li key={s}>
                <AppLink {...serviceLink(s)} className={styles.photo}>
                  <Image src={SERVICE_IMAGES[s] ?? ""} alt="" fill sizes="(min-width: 992px) 600px, 100vw" className={styles.photoImg} />
                  <span className={styles.photoShade} />
                  <span className={styles.photoBody}>
                    <span className={styles.photoTitle}>{t.routes[s]}</span>
                    <span className={styles.photoDesc}>{desc[s]}</span>
                  </span>
                  <span className={styles.photoGo}>{c.explore}<span aria-hidden="true"><Icon name="arrow" size={13} /></span></span>
                </AppLink>
              </li>
            ))}
          </ul>
        )}

        {variant === "tiles" && (
          <ul className={styles.tiles} data-stagger="40">
            {services.map((s, i) => (
              <li key={s}>
                <AppLink {...serviceLink(s)} className={clsx(styles.tile, (i === 0 || i === 3) && styles.tileDark)}>
                  <span className={styles.tileNum}>{pad2(i + 1)}</span>
                  <span className={styles.tileTitle}>{t.routes[s]}</span>
                  <span className={styles.tileDesc}>{desc[s]}</span>
                  <span className={styles.tileGo} aria-hidden="true"><Icon name="arrow" size={14} /></span>
                </AppLink>
              </li>
            ))}
          </ul>
        )}

        {variant === "cards" && (
          <ul className={styles.cards} data-stagger="40" onMouseLeave={() => setActive(-1)}>
            {services.map((s, i) => (
              <li key={s}>
                <AppLink {...serviceLink(s)} className={clsx(styles.card, i === active && styles.cardOn)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(-1)}>
                  <span className={styles.cardMedia}>
                    <Image src={SERVICE_IMAGES[s] ?? ""} alt="" fill sizes="300px" className={styles.cardImg} />
                  </span>
                  <span className={styles.cardBody}>
                    <span className={styles.cardNum}>{pad2(i + 1)}</span>
                    <span className={styles.cardLabel}>{c.relatedService}</span>
                    <span className={styles.cardTitle}>{t.routes[s]}</span>
                    <span className={styles.cardDesc}>{desc[s]}</span>
                  </span>
                </AppLink>
              </li>
            ))}
          </ul>
        )}

        {variant === "tabs" && (
          <div className={styles.tabsWrap} data-rise>
            <div className={styles.tabBar} role="tablist">
              {services.map((s, i) => (
                <button key={s} role="tab" aria-selected={i === active} aria-controls="connected-panel" className={clsx(styles.tab, i === active && styles.tabOn)} onClick={() => pick(i)}>
                  <span className={styles.tabNum}>{pad2(i + 1)}</span>
                  {t.routes[s]}
                </button>
              ))}
            </div>
            <div className={styles.panel} id="connected-panel" role="tabpanel">
              <div className={styles.panelMedia}>
                <Image key={services[active]} src={SERVICE_IMAGES[services[active]] ?? ""} alt="" fill sizes="(min-width: 992px) 500px, 100vw" className={styles.panelImg} data-tab-image />
              </div>
              <div className={styles.panelCopy} data-tab-copy>
                <h3 className={styles.panelTitle}>{t.routes[services[active]]}</h3>
                <p>{desc[services[active]]}</p>
                <div className={styles.panelCtas}>
                  <Button {...serviceLink(services[active])} tone="dark" chip="light" size="sm">{c.explore}</Button>
                  <Button to="solutions" ghost size="sm" className={styles.panelGhost}>{c.viewAll}</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
