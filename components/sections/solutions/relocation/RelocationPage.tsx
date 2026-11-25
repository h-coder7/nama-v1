"use client";

import { Quote } from "@/components/sections/home/quote/Quote";
import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { AppLink } from "@/components/ui/AppLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { SolutionHero } from "../shared/SolutionHero";
import { useAutoReveal } from "../shared/useAutoReveal";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import styles from "./relocation.module.scss";

const img = (n: string, ext?: string) => solutionImg("relocation-exhibitions", n, ext);

export function RelocationPage({ t }: SolutionPageProps) {
  const r = t.solutionPages.relocation;
  return (
    <>
      <SolutionHero
        t={t}
        route="relocationExhibitions"
        eyebrow={r.eyebrow}
        title={r.title}
        body={r.body}
        primary={{ label: t.common.talkToExpert, to: "contact" }}
        secondary={{ label: r.contact, to: "contact" }}
        visual={
          <div className={styles.collage}>
            {["photo-home", "photo-office", "photo-expo"].map((src, n) => (
              <div key={src} className={clsx(styles.photo, styles[`photo${n + 1}`])} data-photo>
                <div className={styles.photoInner}>
                  <Image src={img(src)} alt="" fill priority sizes="(min-width: 992px) 340px, 50vw" />
                </div>
              </div>
            ))}
          </div>
        }
        intro={(tl, q) => {
          // Prints drop onto the table one by one and settle into their slight angles.
          tl.from(q("[data-photo]"), { y: 90, rotate: (i) => [-10, 9, -7][i], scale: 0.9, autoAlpha: 0, duration: 1.5, stagger: 0.18, ease: "expo.out" }, 0.35)
            .from(q("[data-photo] img"), { scale: 1.25, duration: 2, stagger: 0.18, ease: "expo.out" }, 0.35);
        }}
      />
      <Household t={t} />
      <Office t={t} />
      <Events t={t} />
      <Extra t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={t.solutionPages.relocation.planTitle} service="relocationExhibitions" />
      </SiteClosing>
    </>
  );
}

/* ------------------------------------------------------------------ household goods */
function Household({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const r = t.solutionPages.relocation;
  useAutoReveal(ref, ({ q }) => {
    const list = q("[data-checks]")[0];
    gsap.from(q("[data-check-item]"), { x: () => (document.documentElement.dir === "rtl" ? -24 : 24), autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: EASE.soft, scrollTrigger: { trigger: list, start: REVEAL_START, once: true } });
    gsap.from(q("[data-check-box]"), { scale: 0, rotate: -40, duration: 0.5, stagger: 0.1, delay: 0.25, ease: "back.out(2.4)", scrollTrigger: { trigger: list, start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.home} aria-labelledby="home-title">
      <div className={`container ${styles.split}`}>
        <div className={styles.splitMedia} data-clip="up">
          <Image src={img("household-goods-relocation")} alt="" fill sizes="(min-width: 992px) 520px, 100vw" data-parallax="5" />
        </div>
        <div className={styles.splitCopy}>
          <div data-header className={styles.head}>
            <Eyebrow tone="light">{r.homeEyebrow}</Eyebrow>
            <h2 id="home-title" className={styles.title} data-title><RichText text={r.homeTitle} mutedClass={styles.muted} /></h2>
            <p className={styles.lead} data-intro>{r.homeBody}</p>
          </div>
          <ul className={styles.checks} data-checks>
            {r.home.map((it, i) => (
              <li key={it} className={clsx(styles.check, i === 0 && styles.checkOn)} data-check-item>
                <span className={styles.checkBox} data-check-box aria-hidden="true">
                  <svg viewBox="0 0 12 10" width="12" height="10"><path d="M1 5l3.2 3.2L11 1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ office & facility */
function Office({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const r = t.solutionPages.relocation;
  useAutoReveal(ref, ({ q }) => {
    const steps = q("[data-office]")[0];
    gsap.from(q("[data-office-line]"), { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: steps, start: "top 75%", end: "bottom 60%", scrub: true } });
    gsap.from(q("[data-office-icon]"), { scale: 0.3, autoAlpha: 0, duration: 0.5, stagger: 0.12, ease: "back.out(2)", scrollTrigger: { trigger: steps, start: REVEAL_START, once: true } });
    gsap.from(q("[data-office-text]"), { x: () => (document.documentElement.dir === "rtl" ? -20 : 20), autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: EASE.soft, scrollTrigger: { trigger: steps, start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.office} aria-labelledby="office-title">
      <div className={`container ${styles.officeGrid}`}>
        {/* Title + intro read across the top; the photo and the steps then sit opposite each other. */}
        <div data-header className={clsx(styles.head, styles.officeHead)}>
          <Eyebrow tone="yellow">{r.officeEyebrow}</Eyebrow>
          <h2 id="office-title" className={styles.title} data-title><RichText text={r.officeTitle} mutedClass={styles.mutedYellow} /></h2>
        </div>
        <p className={clsx(styles.leadDark, styles.officeBody)} data-intro>{r.officeBody}</p>
        <div className={styles.officeMedia} data-rise>
          <Image src={img("office-and-facility-relocation")} alt="" fill sizes="(min-width: 992px) 600px, 100vw" />
        </div>
        <ol className={styles.officeSteps} data-office>
          <span className={styles.officeLine} data-office-line aria-hidden="true" />
          {r.office.map((it, i) => (
            <li key={it} className={clsx(i === r.office.length - 1 && styles.officeLast)}>
              <span className={styles.officeIcon} data-office-icon aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(`office-icon-0${i + 1}`, "svg")} alt="" width={24} height={24} />
              </span>
              <span data-office-text>{it}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ exhibitions & events (clock) */
const CLOCK_ICONS = [5, 4, 3, 2, 1];
const R = 236;

function Events({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const r = t.solutionPages.relocation;
  useAutoReveal(ref, ({ q }) => {
    const clock = q("[data-clock]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: clock, start: REVEAL_START, once: true } });
    tl.from(q("[data-ticks]"), { rotate: -30, autoAlpha: 0, transformOrigin: "50% 50%", duration: 1.1, ease: EASE.out })
      .from(q("[data-arc]"), { drawSVG: "0%", duration: 1.8, ease: "power2.inOut" }, 0.2)
      .from(q("[data-hand-long]"), { rotate: -200, svgOrigin: "300 300", duration: 2, ease: "power3.inOut" }, 0.2)
      .from(q("[data-hand-short]"), { rotate: -60, svgOrigin: "300 300", duration: 2, ease: "power3.inOut" }, 0.2)
      .from(q("[data-clock-icon]"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.45, stagger: 0.3, ease: "back.out(2.4)" }, 0.45)
      .from(q("[data-deadline]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(2.6)" }, 2);
    gsap.from(q("[data-event]"), { y: 20, autoAlpha: 0, duration: 0.55, stagger: 0.08, ease: EASE.soft, scrollTrigger: { trigger: q("[data-events]")[0], start: REVEAL_START, once: true } });
  });
  // Icons sit on the left half of the dial, from 7 o'clock up to 11 o'clock.
  const iconAt = (i: number) => {
    const deg = 210 + i * 30; // clockwise from 12
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: 300 + R * Math.cos(a), y: 300 + R * Math.sin(a) };
  };
  return (
    <section ref={ref} className={styles.events} aria-labelledby="events-title" data-tone="dark">
      <div className="container">
        <div className={styles.eventsHead}>
          <div data-header className={styles.head}>
            <Eyebrow tone="dark">{r.eventsEyebrow}</Eyebrow>
            <h2 id="events-title" className={styles.title} data-title><RichText text={r.eventsTitle} accentClass={styles.accent} /></h2>
          </div>
          <p className={styles.eventsIntro} data-rise>{r.eventsIntro}</p>
        </div>
        <div className={styles.eventsGrid}>
          <div className={styles.clock} data-clock aria-hidden="true">
            <svg viewBox="0 0 600 600">
              <defs>
                <radialGradient id="dial" cx="50%" cy="45%" r="55%">
                  <stop offset="0" stopColor="#3a3a3a" />
                  <stop offset="1" stopColor="#262626" />
                </radialGradient>
                <linearGradient id="arcGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#FFC54A" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#FFC54A" />
                </linearGradient>
              </defs>
              <circle cx="300" cy="300" r="258" fill="none" stroke="rgba(255,255,255,0.08)" />
              <circle cx="300" cy="300" r="222" fill="url(#dial)" stroke="rgba(255,255,255,0.12)" />
              <circle cx="300" cy="300" r="160" fill="none" stroke="rgba(255,255,255,0.05)" />
              <g data-ticks>
                {Array.from({ length: 60 }, (_, i) => {
                  const major = i % 5 === 0;
                  const a = (i * 6 * Math.PI) / 180;
                  const r1 = 212, r2 = major ? 194 : 204;
                  return <line key={i} x1={300 + r1 * Math.sin(a)} y1={300 - r1 * Math.cos(a)} x2={300 + r2 * Math.sin(a)} y2={300 - r2 * Math.cos(a)} stroke="#fff" strokeOpacity={major ? 0.55 : 0.18} strokeWidth={major ? 2 : 1} />;
                })}
              </g>
              {/* progress arc: 7 o'clock → 12 */}
              <path data-arc d={`M ${300 + R * Math.cos(((210 - 90) * Math.PI) / 180)} ${300 + R * Math.sin(((210 - 90) * Math.PI) / 180)} A ${R} ${R} 0 0 1 300 ${300 - R}`} fill="none" stroke="url(#arcGrad)" strokeWidth="3" strokeLinecap="round" />
              <line data-hand-short x1="300" y1="300" x2="268" y2="170" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
              <line data-hand-long x1="300" y1="330" x2="300" y2="100" stroke="#FFC54A" strokeWidth="3" strokeLinecap="round" />
              <circle cx="300" cy="300" r="9" fill="#2E2E2E" stroke="#FFC54A" strokeWidth="3" />
              {CLOCK_ICONS.map((n, i) => {
                const p = iconAt(i);
                return (
                  <g key={n} data-clock-icon>
                    <circle cx={p.x} cy={p.y} r="17" fill="#2E2E2E" stroke="rgba(255,255,255,0.25)" />
                    <image href={img(`exhibitions-clock-icon-0${n}`, "svg")} x={p.x - 9} y={p.y - 9} width="18" height="18" />
                  </g>
                );
              })}
              <g data-deadline>
                <rect x="276" y="44" width="48" height="48" rx="10" fill="#FFC54A" />
                <path d="M225 3H182L141 42L140 3L96 4L0 96V127H49L95 84L97 127H137L225 42Z" transform="translate(281 57) scale(0.17)" fill="#2E2E2E" />
              </g>
            </svg>
          </div>
          <div className={styles.eventsSide}>
            <ul className={styles.eventList} data-events>
              {r.events.map((e, i) => (
                <li key={e} data-event>
                  <span className={styles.eventIcon} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(`exhibitions-clock-icon-0${i + 1}`, "svg")} alt="" width={18} height={18} />
                  </span>
                  {e}
                </li>
              ))}
            </ul>
            <p className={styles.eventsNote} data-rise>{r.eventsNote}</p>
            <div className={styles.site} data-rise>
              <h3>{r.siteTitle}</h3>
              <p>{r.siteBody}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img("exhibition-site-handling", "svg")} alt="" className={styles.siteArt} />
            </div>
            <AppLink to="customsClearance" className={styles.ata} data-rise>
              {r.ataLink} <Icon name="arrow" size={12} />
            </AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ additional services (hanging tags) */
function Extra({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const r = t.solutionPages.relocation;
  useAutoReveal(ref, ({ q }) => {
    const row = q("[data-tags]")[0];
    gsap.from(q("[data-tag]"), { y: -60, rotate: (i) => (i % 2 ? 18 : -18), autoAlpha: 0, transformOrigin: "50% -40px", duration: 1.4, stagger: 0.12, ease: "elastic.out(1, 0.45)", scrollTrigger: { trigger: row, start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.extra} aria-labelledby="extra-title">
      <div className="container">
        <SectionHeader id="extra-title" tone="light" eyebrow={t.routes.relocationExhibitions} title={r.extraTitle} intro={r.extraIntro} />
        <ul className={styles.tags} data-tags>
          <span className={styles.wire} aria-hidden="true" data-line />
          {r.extra.map((x, i) => (
            <li key={x.title} className={styles.tagWrap}>
              <span className={styles.string} aria-hidden="true" />
              <div className={clsx(styles.tag, i === 0 && styles.tagOn)} data-tag style={{ "--tilt": `${[-2, 2.5, -1.5, 3][i]}deg` } as React.CSSProperties}>
                <span className={styles.hole} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(`relocation-icon-0${i + 1}`, "svg")} alt="" width={30} height={30} />
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
