"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Messages } from "@/lib/i18n";
import type { RouteKey } from "@/lib/routes";
import { SITE } from "@/lib/site";
import { pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/providers/LenisProvider";
import { CopyButton } from "@/components/ui/CopyButton";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Quote } from "@/components/sections/home/quote/Quote";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { PageHero } from "../shared/PageHero";
import { telHref } from "../shared/forms";
import styles from "./legal.module.scss";

type P = { t: Messages };
type Section = { title: string; body: ReactNode };

const HEAD_PHONE = "+966 13 330 8800";

/**
 * "On this page" index + numbered cards (Figma: Privacy policy, Terms of Use, Support).
 * The index follows the reading position and scrolls to a card on click.
 */
export function SectionsLayout({ t, sections, after }: P & { sections: Section[]; after?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  useAutoReveal(ref);

  useEffect(() => {
    const cards = ref.current?.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards?.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.card))),
      { rootMargin: "-35% 0px -55% 0px" },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = document.getElementById(`section-${i + 1}`);
    if (!el) return;
    setActive(i);
    if (lenis) lenis.scrollTo(el, { offset: -110 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      el.focus({ preventScroll: true });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.fromTo(el, { boxShadow: "0 0 0 2px rgba(255,197,74,0.9)" }, { boxShadow: "0 0 0 0px rgba(255,197,74,0)", duration: 1.2, delay: 0.5 });
    }, 50);
  };

  return (
    <section ref={ref} className={styles.layout} aria-label={t.legal.onThisPage}>
      <div className={`container ${styles.grid}`}>
        <nav className={styles.index} aria-label={t.legal.onThisPage} data-rise>
          <p>{t.legal.onThisPage}</p>
          <ol>
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#section-${i + 1}`} className={clsx(i === active && styles.indexOn)} aria-current={i === active ? "true" : undefined} onClick={(e) => { e.preventDefault(); go(i); }}>
                  <span>{pad2(i + 1)}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.cards}>
          <ol data-stagger="26">
            {sections.map((s, i) => (
              <li key={s.title} id={`section-${i + 1}`} className={styles.card} data-card={i} tabIndex={-1}>
                <span className={styles.num}>{pad2(i + 1)}</span>
                <div>
                  <h2>{s.title}</h2>
                  <div className={styles.body}>{s.body}</div>
                </div>
              </li>
            ))}
          </ol>
          {after}
        </div>
      </div>
    </section>
  );
}

function ContactLine({ t }: P) {
  return (
    <ul className={styles.contactLine}>
      <li>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
        <a href={telHref(HEAD_PHONE)} dir="ltr">{HEAD_PHONE}</a>
        <CopyButton value={HEAD_PHONE} label={t.common.copy} done={t.common.copied} className={styles.copy} doneClassName={styles.copied} />
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 6h18v12H3zM3 6l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
        <a href={`mailto:${SITE.email}`} dir="ltr">{SITE.email}</a>
        <CopyButton value={SITE.email} label={t.common.copy} done={t.common.copied} className={styles.copy} doneClassName={styles.copied} />
      </li>
    </ul>
  );
}

function LegalPage({ t, kind, route }: P & { kind: "privacy" | "terms"; route: RouteKey }) {
  const l = t.legal[kind];
  const sections = l.sections.map((s) => ({ title: s.title, body: s.body ? <p>{s.body}</p> : <ContactLine t={t} /> }));
  return (
    <>
      <PageHero t={t} route={route} eyebrow={t.legal.eyebrow} title={l.title} aside={l.body} image="/assets/namma/images/company/legal-hero.webp" focus="72% 50%" />
      <SectionsLayout t={t} sections={sections} />
      <SiteClosing t={t}>
        <Quote t={t.quote} />
      </SiteClosing>
    </>
  );
}

/** /privacy-policy — Figma "Privacy policy". */
export const PrivacyPage = ({ t }: P) => <LegalPage t={t} kind="privacy" route="privacyPolicy" />;
/** /terms-of-use — Figma "Terms of Use". */
export const TermsPage = ({ t }: P) => <LegalPage t={t} kind="terms" route="termsOfUse" />;
