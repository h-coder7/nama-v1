"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, REVEAL_START, STAGGER, introExpired } from "@/lib/motion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CopyButton } from "@/components/ui/CopyButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText, balanceLines } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Quote } from "@/components/sections/home/quote/Quote";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { NetworkMap } from "@/components/sections/home/network/NetworkMap";
import { networkData } from "@/components/sections/home/network/network.data";
import { useOfficeCycle } from "@/components/sections/home/network/useOfficeCycle";
import { OFFICE_MAPS } from "@/lib/site";
import { telHref } from "../shared/forms";
import styles from "./network.module.scss";

type P = { t: Messages };

/** /network — Figma "Our Network". */
export function NetworkPage({ t }: P) {
  return (
    <>
      <NetworkHero t={t} />
      <Offices t={t} />
      <Coverage t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} />
      </SiteClosing>
    </>
  );
}

/* ---------------------------------------------------------------- hero with map */
function NetworkHero({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const n = t.networkPage;
  const [active, setActive] = useState<string>(networkData.pins[0].code);
  const { hold, release, pick } = useOfficeCycle(ref, setActive);

  useSectionMotion(ref, ({ conditions, q }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion || introExpired()) return release();
    const tl = gsap.timeline({ defaults: { ease: EASE.out }, onStart: release });
    tl.from(q("[data-hero-fade]"), { y: 18, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.base, ease: EASE.soft }, 0.05)
      .from(q("[data-hero-line]"), { yPercent: 110, duration: DUR.slow, stagger: 0.08 }, 0.2)
      .from(q("[data-shape]"), { autoAlpha: 0, scale: 1.08, duration: 1.8 }, 0.1)
      .from(q("[data-route]"), { strokeDashoffset: 100, duration: 1.6, stagger: 0.25, ease: "power2.inOut", clearProps: "strokeDashoffset" }, 0.9)
      .from(q("[data-pin]"), { scale: 0, autoAlpha: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.18, clearProps: "transform,opacity,visibility" }, 1.1)
      .from(q("[data-card]"), { y: 16, autoAlpha: 0, duration: 0.6 }, 1.6);
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="network-title" data-hero-intro data-tone="dark">
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <div data-intro data-hero-fade>
            <Breadcrumb current="network" t={t} />
          </div>
          <div className={styles.heroEyebrow} data-intro data-hero-fade>
            <Eyebrow tone="dark">{n.eyebrow}</Eyebrow>
          </div>
          <h1 id="network-title" className={styles.title}>
            {balanceLines(n.title).map((line, i) => (
              <span key={i} className={styles.line}>
                <span data-intro data-hero-line>
                  <RichText text={line} accentClass={styles.accent} />
                </span>
              </span>
            ))}
          </h1>
          <p className={styles.heroBody} data-intro data-hero-fade>{n.body}</p>
        </div>

        <div data-intro>
          <NetworkMap t={t.network} active={active} hold={hold} release={release} pick={pick} variant="bleed" className={styles.map} sizes="(min-width: 992px) 720px, 100vw" priority />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- office cards */
function Offices({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const n = t.networkPage;
  const offices = t.network.offices;
  useAutoReveal(ref, ({ q }) => {
    const codes = q("[data-code]");
    gsap.from(codes, { yPercent: 60, autoAlpha: 0, duration: 1.4, ease: EASE.out, stagger: 0.12, scrollTrigger: { trigger: codes[0], start: "top 95%", once: true } });
  });
  return (
    <section ref={ref} className={styles.offices} aria-label={t.routes.network}>
      <div className={`container ${styles.officeGrid}`} data-stagger="36">
        {offices.map((o, i) => {
          const head = i === 0;
          return (
            <article key={o.code} className={clsx(styles.office, head && styles.officeHead)}>
              <span className={styles.officeTag}>{head ? n.headOffice : n.office}</span>
              <h2>{o.city}</h2>
              <address className={styles.address}>
                <span className={styles.street}><RichText text={n.addresses[i].street} /></span>
                <span className={styles.national}>
                  <span>{n.nationalAddress}</span> <b dir="ltr">{n.addresses[i].short}</b>
                  <small>{n.addresses[i].parts}</small>
                </span>
              </address>
              <ul className={styles.contacts}>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                  <a href={telHref(o.phone)} dir="ltr">{o.phone}</a>
                  <CopyButton value={o.phone} label={t.common.copy} done={t.common.copied} className={styles.copy} doneClassName={styles.copied} />
                </li>
                {"email" in o && o.email && (
                  <li>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 6h18v12H3zM3 6l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
                    <a href={`mailto:${o.email}`} dir="ltr">{o.email}</a>
                    <CopyButton value={o.email} label={t.common.copy} done={t.common.copied} className={styles.copy} doneClassName={styles.copied} />
                  </li>
                )}
              </ul>
              <a className={styles.directions} href={OFFICE_MAPS[o.code]} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                {n.directions}
                <span aria-hidden="true" className={styles.dirArrow}>↗</span>
              </a>
              <span className={styles.code} aria-hidden="true" data-code>{o.code}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- stats + coverage */
function Coverage({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const n = t.networkPage;
  useAutoReveal(ref, ({ q, conditions }) => {
    const truck = q("[data-truck]")[0];
    if (!truck) return;
    gsap.from(truck, { x: () => (document.documentElement.dir === "rtl" ? 260 : -260), autoAlpha: 0, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: truck, start: REVEAL_START, once: true } });
    gsap.to(q("[data-wheel]"), { rotate: 360, transformOrigin: "50% 50%", duration: 1.2, ease: "none", repeat: 1, scrollTrigger: { trigger: truck, start: REVEAL_START, once: true } });
    if (conditions.desktop) gsap.to(truck, { y: -3, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 7, delay: 0.2, scrollTrigger: { trigger: truck, start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.coverage} aria-labelledby="coverage-title">
      <div className="container">
        <div className={styles.statTop}>
          <p className={styles.bigStat} data-rise>
            <strong><span data-count="90">90</span>K<sup>+</sup></strong>
            <span>{n.statBig}</span>
          </p>
          <svg className={styles.truck} viewBox="0 0 486 170" aria-hidden="true" data-truck>
            <path d="M80 30H332C334.209 30 336 31.7909 336 34V126C336 128.209 334.209 130 332 130H80C77.7909 130 76 128.209 76 126V34C76 31.7909 77.7909 30 80 30Z" />
            {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${96 + i * 20} 36V124`} className={styles.rib} />)}
            <path d="M336 60H406L446 100V130H336V60Z" />
            <path d="M356 70H396L422 98H356V70Z" className={styles.window} />
            {[126, 176, 396].map((cx) => <circle key={cx} cx={cx} cy={140} r={18} className={styles.wheel} data-wheel />)}
            <path d="M66 160H486" />
          </svg>
        </div>
        <dl className={styles.stats} data-stagger="24">
          {n.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value.endsWith("+") ? <><span data-count={s.value.slice(0, -1)}>{s.value.slice(0, -1)}</span>+</> : s.value}</dd>
            </div>
          ))}
        </dl>
        <SectionHeader eyebrow={n.coverageEyebrow} title={n.coverageTitle} intro={n.coverageBody} tone="yellow" id="coverage-title" className={styles.coverageHead} />
      </div>
    </section>
  );
}
