"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import type { RouteKey } from "@/lib/routes";
import { pad2 } from "@/lib/format";
import { useLenis } from "@/providers/LenisProvider";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Quote } from "@/components/sections/home/quote/Quote";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { PageHero } from "../shared/PageHero";
import styles from "./contact.module.scss";

type P = { t: Messages };
const OPTION_LINKS: (RouteKey | "form")[] = ["requestQuote", "trackShipment", "network", "form"];

/** /contact — Figma "Contact": the four routes, then the site's one form in contact mode (#contact-form). */
export function ContactPage({ t }: P) {
  const c = t.contactPage;
  return (
    <>
      <PageHero t={t} route="contact" eyebrow={c.eyebrow} title={c.title} aside={c.body} image="/assets/namma/images/company/contact-hero.webp" focus="72% 50%" />
      <Options t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} mode="contact" />
      </SiteClosing>
    </>
  );
}

function Options({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const c = t.contactPage;
  const lenis = useLenis();
  const [hover, setHover] = useState<number | null>(null);
  useAutoReveal(ref);

  const toForm = () => {
    const el = document.getElementById("contact-form");
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -90 });
    else el.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => (el.querySelector("select") as HTMLElement | null)?.focus({ preventScroll: true }), 700);
  };

  return (
    <section ref={ref} className={styles.options} aria-label={c.eyebrow}>
      <ul className={`container ${styles.optionGrid}`} data-stagger="34" onPointerLeave={() => setHover(null)}>
        {c.options.map((o, i) => {
          const on = hover === null ? i === 0 : hover === i;
          const to = OPTION_LINKS[i];
          const inner = (
            <>
              <span className={styles.optNum}>{pad2(i + 1)}</span>
              <strong>{o.title}</strong>
              <span className={styles.optBody}>{o.body}</span>
              <span className={styles.optFoot}>
                {o.cta}
                <i aria-hidden="true"><Icon name="arrow" size={12} /></i>
              </span>
            </>
          );
          return (
            <li key={o.title} onPointerEnter={() => setHover(i)}>
              {to === "form" ? (
                <button type="button" className={clsx(styles.option, on && styles.optionOn)} onClick={toForm} onFocus={() => setHover(i)}>{inner}</button>
              ) : (
                <AppLink to={to} className={clsx(styles.option, on && styles.optionOn)} onFocus={() => setHover(i)}>{inner}</AppLink>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
