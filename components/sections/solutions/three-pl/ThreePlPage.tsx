"use client";

import { loopWhileVisible } from "@/lib/reveal";
import { fill } from "@/lib/format";
import { Quote } from "@/components/sections/home/quote/Quote";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { SITE } from "@/lib/site";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { useLocale } from "@/providers/LocaleProvider";
import { serviceLink, type ServiceKey } from "@/lib/routes";
import { SolutionHero } from "../shared/SolutionHero";
import { useAutoReveal } from "../shared/useAutoReveal";
import { useAutoCycle } from "../shared/useAutoCycle";
import type { SolutionPageProps } from "../shared/types";
import { ONE_PATHS } from "./one-paths";
import styles from "./three-pl.module.scss";

const SERVICES: ServiceKey[] = ["freightTransport", "customsClearance", "warehousingDistribution", "projectLogistics", "transportation", "industrialEquipmentPacking"];

export function ThreePlPage({ t }: SolutionPageProps) {
  const p = t.solutionPages.threePl;
  return (
    <>
      <SolutionHero
        t={t}
        route="threePl"
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        primary={{ label: t.common.talkToExpert, to: "contact" }}
        secondary={{ label: p.secondary, to: "threePl", hash: "capabilities" }}
        visual={<Ticket t={t} />}
        intro={(tl, q) => {
          tl.from(q("[data-ticket]"), { y: -80, rotate: -10, autoAlpha: 0, duration: 1.2, ease: "back.out(1.3)" }, 0.35)
            .from(q("[data-ticket-row]"), { autoAlpha: 0, x: -16, duration: 0.5, stagger: 0.1, ease: EASE.soft }, 0.9)
            .from(q("[data-stamp]"), { scale: 2.4, rotate: -40, autoAlpha: 0, duration: 0.5, ease: "power4.in" }, 1.4)
            .to(q("[data-ticket]"), { x: 3, duration: 0.06, repeat: 3, yoyo: true, ease: "none" }, 1.9);
        }}
      />
      <OneOperation t={t} />
      <Capabilities t={t} />
      <Services t={t} />
      <Coordination t={t} />
      <PartnerBand t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={fill(t.solutionPages.common.discussTitle, { topic: p.discussTopic })} service="threePl" />
      </SiteClosing>
    </>
  );
}

function Ticket({ t }: SolutionPageProps) {
  const p = t.solutionPages.threePl;
  return (
    <div className={styles.ticketWrap}>
      <div className={styles.ticket} data-ticket>
        <p className={styles.ticketHead}>{p.card.brand}</p>
        <dl className={styles.ticketRows}>
          {p.card.rows.map(([k, v]) => (
            <div key={k} data-ticket-row>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <span className={styles.stamp} data-stamp aria-hidden="true"><span /></span>
    </div>
  );
}

/* ------------------------------------------------------------------ one operation */
function OneOperation({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.threePl;
  const locale = useLocale();
  useAutoReveal(ref, ({ q }) => {
    const word = q("[data-one]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: word, start: REVEAL_START, once: true } });
    if (word.querySelector("path")) tl.from(word.querySelectorAll("path"), { drawSVG: "0%", duration: 2.2, ease: "power2.inOut", stagger: 0.15 });
    else tl.from(word, { autoAlpha: 0, scale: 0.9, duration: 1.2, ease: EASE.out });
    tl.from(q("[data-tag]"), { y: 16, autoAlpha: 0, duration: 0.5, ease: EASE.soft }, 0.8)
      .from(q("[data-statement]"), { y: 60, autoAlpha: 0, duration: 1, ease: EASE.out }, 0.2);
  });
  return (
    <section ref={ref} className={styles.one} aria-labelledby="one-title">
      <div className="container">
        <SectionHeader id="one-title" tone="light" eyebrow={p.meansEyebrow} title={p.meansTitle} />
        <div className={styles.oneGrid}>
          <div className={styles.oneArt}>
            {locale === "ar" ? (
              <span className={styles.oneText} data-one aria-hidden="true">{p.oneWord}</span>
            ) : (
              <svg className={styles.oneSvg} viewBox="0 0 783 347" data-one aria-hidden="true">
                {ONE_PATHS.map((d, i) => <path key={i} d={d} fill="none" stroke="#FFC54A" strokeWidth="2" />)}
              </svg>
            )}
            <span className={styles.oneTag} data-tag>{p.contactTag}</span>
          </div>
          <div className={styles.statement} data-statement>
            <p className={styles.statementText}>{p.statement}</p>
            <div className={styles.scope}>
              <strong>{p.scopeLabel}</strong>
              <p>{p.scopeBody}</p>
            </div>
            <div className={styles.statementCtas}>
              <Button to="requestQuote" query={{ service: "threePl" }} chip="yellow" size="sm">{p.cta}</Button>
              <Button href={SITE.profileUrl} ghost size="sm">{p.profile}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ four capabilities */
function Capabilities({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.threePl;
  const { active, select, bind } = useAutoCycle(ref, p.caps.length, 4000);
  useAutoReveal(ref, ({ q }) => {
    const grid = q("[data-caps]")[0];
    gsap.from(q("[data-cap]"), { x: () => (document.documentElement.dir === "rtl" ? 30 : -30), autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: EASE.soft, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
    gsap.from(q("[data-cap-detail]"), { y: 50, autoAlpha: 0, duration: 1, ease: EASE.out, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
  });
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-cap-swap]"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: EASE.soft });
  }, [active]);
  const cap = p.caps[active];
  return (
    <section ref={ref} id="capabilities" className={styles.caps} aria-labelledby="caps-title" {...bind}>
      <div className="container">
        <SectionHeader id="caps-title" tone="yellow" eyebrow={p.capsEyebrow} title={p.capsTitle} intro={p.capsIntro} />
        <div className={styles.capsGrid} data-caps>
          <ul className={styles.capList} role="tablist" aria-orientation="vertical">
            {p.caps.map((c, i) => (
              <li key={c.title} data-cap>
                <button role="tab" aria-selected={i === active} aria-controls="cap-panel" className={clsx(styles.cap, i === active && styles.capOn)} onClick={() => select(i)}>
                  <span className={styles.capNum}>{pad2(i + 1)}</span>
                  <span className={styles.capTitle}>{c.title}</span>
                  <span className={styles.switch} aria-hidden="true"><span /></span>
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.capDetail} id="cap-panel" role="tabpanel" data-cap-detail>
            <small data-cap-swap>( {pad2(active + 1)} )</small>
            <h3 data-cap-swap>{cap.title}</h3>
            <p data-cap-swap>{cap.body}</p>
            <ul>
              {cap.points.map((pt) => <li key={pt} data-cap-swap>{pt}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services we connect */
function Services({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.threePl;
  const desc = t.solutionPages.common.serviceDesc as Record<string, string>;
  useAutoReveal(ref, ({ q }) => {
    const grid = q("[data-svc-grid]")[0];
    gsap.from(q("[data-svc]"), { y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: EASE.soft, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
    gsap.from(q("[data-svc-bar]"), { scaleX: 0, duration: 1.4, ease: "expo.out", delay: 0.5, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.svc} aria-labelledby="svc-title" data-tone="dark">
      <div className="container">
        <SectionHeader id="svc-title" tone="dark" eyebrow={p.servicesEyebrow} title={p.servicesTitle} intro={p.servicesIntro} />
        <ul className={styles.svcGrid} data-svc-grid>
          {SERVICES.map((s, i) => (
            <li key={s} data-svc>
              <AppLink {...serviceLink(s)} className={styles.svcTile}>
                <span className={styles.svcTop}>
                  <span>{pad2(i + 1)}</span>
                  <span className={styles.svcGo} aria-hidden="true"><Icon name="arrow" size={12} /></span>
                </span>
                <span className={styles.svcName}>{t.routes[s]}</span>
                <span className={styles.svcDesc}>{desc[s]}</span>
              </AppLink>
            </li>
          ))}
        </ul>
        <span className={styles.svcBar} data-svc-bar aria-hidden="true" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ coordination rings */
function Coordination({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.threePl;
  useAutoReveal(ref, ({ q, root }) => {
    const rings = q("[data-rings]")[0];
    // Contact sits at the centre: the core lands first, then the rings ripple outward
    // from it, the yellow arcs sweep round, and each numbered node orbits into place.
    const O = "380 363";
    const tl = gsap.timeline({ scrollTrigger: { trigger: rings, start: REVEAL_START, once: true } });
    tl.from(q("[data-ring-bg]"), { scale: 0.82, autoAlpha: 0, svgOrigin: O, duration: 1.2, ease: "expo.out" }, 0)
      .from(q("[data-core]"), { scale: 0, svgOrigin: O, duration: 0.9, ease: "back.out(1.8)" }, 0.15)
      .from(q("[data-ring]"), { scale: 0.35, autoAlpha: 0, svgOrigin: O, duration: 1.2, stagger: { each: 0.16, from: "end" }, ease: "expo.out" }, 0.35)
      .from(q("[data-ring-arc]"), { drawSVG: "0%", duration: 1.5, stagger: { each: 0.14, from: "end" }, ease: "power3.inOut" }, 0.7)
      .from(q("[data-orbit]"), { rotation: -140, autoAlpha: 0, svgOrigin: O, duration: 1.6, stagger: { each: 0.14, from: "end" }, ease: "expo.out" }, 0.8)
      .from(q("[data-coord]"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: EASE.soft }, 0.4)
      // Once drawn, the yellow arcs keep circling their rings (each at its own pace, alternating direction).
      .add(() => {
        const spin = gsap.timeline();
        (q("[data-ring-arc]") as Element[]).forEach((arc, i) => {
          spin.to(arc, { rotation: i % 2 ? -360 : 360, svgOrigin: O, duration: [38, 28, 20][i] ?? 30, ease: "none", repeat: -1 }, 0);
        });
        loopWhileVisible(spin, root);
      });
    loopWhileVisible(
      gsap.fromTo(q("[data-ripple]"), { scale: 1, autoAlpha: 0.7, svgOrigin: O }, { scale: 1.9, autoAlpha: 0, svgOrigin: O, duration: 2.4, ease: "power2.out", repeat: -1, stagger: { each: 1.2, repeat: -1 } }),
      root,
    );
  });
  const radii = [300, 220, 140];
  return (
    <section ref={ref} className={styles.coord} aria-labelledby="coord-title">
      <div className="container">
        <SectionHeader id="coord-title" tone="light" eyebrow={p.coordEyebrow} title={p.coordTitle} intro={p.coordIntro} />
        <div className={styles.coordGrid}>
          <div className={styles.rings} data-rings aria-hidden="true">
            <svg viewBox="0 0 760 726">
              <defs>
                <radialGradient id="ringBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0.6" stopColor="#F2F1EE" />
                  <stop offset="1" stopColor="#E9E7E2" />
                </radialGradient>
                {radii.map((r, i) => (
                  <path key={i} id={`ring-${i}`} d={`M ${380 - r + 18} 363 A ${r - 18} ${r - 18} 0 1 1 ${380 + r - 18} 363`} />
                ))}
              </defs>
              <circle cx="380" cy="363" r="340" fill="url(#ringBg)" data-ring-bg />
              <circle cx="380" cy="363" r="98" fill="none" stroke="#FFC54A" strokeWidth="1.5" data-ripple />
              <circle cx="380" cy="363" r="98" fill="none" stroke="#FFC54A" strokeWidth="1.5" data-ripple />
              {radii.map((r, i) => (
                <g key={r} data-ring>
                  <circle cx="380" cy="363" r={r} fill={i === 2 ? "#FAF9F7" : "none"} stroke="#BDBBB6" strokeDasharray="3 6" />
                  <text className={styles.ringLabel}><textPath href={`#ring-${i}`} startOffset="50%" textAnchor="middle">{p.rings[i]}</textPath></text>
                </g>
              ))}
              <path data-ring-arc d="M 380 663 A 300 300 0 0 1 108 236" fill="none" stroke="#FFC54A" strokeWidth="6" strokeLinecap="round" />
              <path data-ring-arc d="M 600 363 A 220 220 0 0 1 465 566" fill="none" stroke="#FFC54A" strokeWidth="6" strokeLinecap="round" />
              <path data-ring-arc d="M 520 363 A 140 140 0 0 1 380 503" fill="none" stroke="#FFC54A" strokeWidth="5" strokeLinecap="round" />
              {radii.map((r, i) => (
                <g key={`o${r}`} data-orbit>
                  <circle cx={380 + r * Math.cos([-2.3, 2.1, 0.6][i])} cy={363 + r * Math.sin([-2.3, 2.1, 0.6][i])} r="20" fill="#2E2E2E" />
                  <text x={380 + r * Math.cos([-2.3, 2.1, 0.6][i])} y={363 + r * Math.sin([-2.3, 2.1, 0.6][i]) + 5} textAnchor="middle" className={styles.orbitNum}>{pad2(i + 1)}</text>
                </g>
              ))}
              <g data-core>
                <circle cx="380" cy="363" r="98" fill="none" stroke="#FFC54A" strokeWidth="2" />
                <circle cx="380" cy="363" r="86" fill="#2E2E2E" />
                <path d="M225 3H182L141 42L140 3L96 4L0 96V127H49L95 84L97 127H137L225 42Z" transform="translate(357 312) scale(0.205)" fill="#FFC54A" />
                <text x="380" y="372" textAnchor="middle" className={styles.coreLabel}>{p.center}</text>
                <text x="380" y="398" textAnchor="middle" className={styles.coreNum}>04</text>
              </g>
            </svg>
          </div>
          <ol className={styles.coordList}>
            {p.coord.map((c, i) => (
              <li key={c.title} className={clsx(i === 3 && styles.coordLast)} data-coord>
                <span className={styles.coordNum}>{pad2(i + 1)}</span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  {i === 3 && (
                    <ul className={styles.chips}>
                      {p.coordPoints.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ one partner band */
function PartnerBand({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.threePl;
  useAutoReveal(ref, ({ q }) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } });
    tl.from(q("[data-band-one]"), { yPercent: 100, duration: 1.1, ease: EASE.out })
      .from(q("[data-band-slash]"), { scaleY: 0, duration: 0.6, ease: "back.out(2)" }, 0.4)
      .from(q("[data-band-partner]"), { x: -30, autoAlpha: 0, duration: 0.8, ease: EASE.out }, 0.55)
      .from(q("[data-band-fade]"), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: EASE.soft }, 0.7);
  });
  return (
    <section ref={ref} className={styles.band} aria-labelledby="band-title">
      <div className={`container ${styles.bandInner}`}>
        <p className={styles.bandWord} aria-hidden="true">
          <span className={styles.bandOneWrap}><span data-band-one className={styles.bandOne}>{p.bandOne}</span></span>
          <span className={styles.bandSlash} data-band-slash />
          <span data-band-partner className={styles.bandPartner}>{p.bandPartner}</span>
        </p>
        <h2 id="band-title" className={styles.bandTitle} data-band-fade><RichText text={p.bandTitle} mutedClass={styles.bandMuted} /></h2>
        <p className={styles.bandBody} data-band-fade>{p.bandBody}</p>
      </div>
    </section>
  );
}
