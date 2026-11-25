"use client";

import Image from "next/image";
import { useRef } from "react";
import { pad2 } from "@/lib/format";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, isRtl } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Quote } from "@/components/sections/home/quote/Quote";
import { SolutionHero } from "../shared/SolutionHero";
import { Connected } from "../shared/Connected";
import { useAutoReveal } from "../shared/useAutoReveal";
import type { SolutionPageProps } from "../shared/types";
import styles from "./project-logistics.module.scss";

/** Supplied project-cargo photography (no new imagery generated for this page). */
const PHOTO = {
  hero: "/assets/namma/images/industries/oil-gas/project-logistics.webp",
  heavy: "/assets/namma/images/industries/energy/project-logistics.webp",
  route: "/assets/namma/images/industries/mining/project-logistics.webp",
};

/**
 * /solutions/project-logistics — built from the Website Content doc (P03).
 * No Figma frame exists for this page, so it is composed from the solution-page
 * system: bleed hero → origin-to-site journey → heavy cargo → route checklist →
 * connected services → four starting steps → quote.
 */
export function ProjectLogisticsPage({ t }: SolutionPageProps) {
  const p = t.solutionPages.projectLogistics;
  return (
    <>
      <SolutionHero
        t={t}
        route="projectLogistics"
        eyebrow={p.eyebrow}
        title={p.title}
        body={p.body}
        layout="bleed"
        className={styles.hero}
        primary={{ label: t.common.talkToExpert, to: "contact" }}
        secondary={{ label: p.secondary, to: "projects" }}
        visual={
          <div className={styles.heroMedia}>
            <Image src={PHOTO.hero} alt="" fill priority sizes="100vw" data-hero-photo />
            <span className={styles.heroShade} />
          </div>
        }
        intro={(tl, q) => {
          // The route draws left to right; each stage marker lights the moment the line
          // reaches it and its label rises after it, so rail and stages read as one line.
          const stops = q("[data-hero-stop]");
          const n = stops.length;
          const draw = 1.8;
          tl.from(q("[data-hero-photo]"), { scale: 1.14, duration: 2.4, ease: "power2.out" }, 0)
            .from(q("[data-hero-rail]"), { scaleX: 0, duration: draw, ease: "none" }, 0.6);
          stops.forEach((st, i) => {
            const at = 0.6 + draw * (i / n);
            tl.from(st.querySelector("[data-hero-dot]"), { scale: 0, rotate: -90, duration: 0.45, ease: "back.out(2.4)" }, at)
              .from(st.querySelectorAll("[data-hero-label]"), { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: EASE.soft }, at + 0.08);
          });
          tl.fromTo(q("[data-hero-pulse]"), { left: "0%", autoAlpha: 0 }, { left: "100%", autoAlpha: 1, duration: 3.2, ease: "power1.inOut", repeat: -1, repeatDelay: 1.2 }, 0.6 + draw);
        }}
      >
        <div className={`container ${styles.heroRail}`} aria-hidden="true">
          <span className={styles.heroRailLine} data-hero-rail />
          <span className={styles.heroPulse} data-hero-pulse />
          <ol>
            {p.journey.map((s, i) => (
              <li key={s.title} data-hero-stop>
                <span className={styles.heroDot} data-hero-dot />
                <b data-hero-label>{pad2(i + 1)}</b>
                <span data-hero-label>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </SolutionHero>
      <Journey t={t} />
      <Heavy t={t} />
      <RouteCheck t={t} />
      <Connected
        t={t}
        variant="photos"
        title={p.supportTitle}
        intro={p.supportIntro}
        services={["heavyLift", "oversizedCargo", "industrialEquipmentPacking", "customsClearance"]}
        tone="yellow"
      />
      <StartSteps t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={p.closingTitle} service="projectLogistics" />
      </SiteClosing>
    </>
  );
}

/* ------------------------------------------------------------------ 02 · from origin to project site */
export function Journey({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.projectLogistics;
  useAutoReveal(ref, ({ conditions, q }) => {
    const track = q("[data-track]")[0] as HTMLElement;
    const fill = q("[data-track-fill]")[0];
    const cargo = q("[data-cargo]")[0];
    const stops = q("[data-stop]");
    if (!track) return;
    // The route fills and the cargo block travels as the reader scrolls; each stage
    // lights up as the cargo reaches it. Desktop only: on mobile the list stacks.
    if (conditions.desktop) {
      // The truck starts with its tail at the road's start and drives until its nose
      // reaches the end; the yellow edge fills up to its nose.
      const truckW = () => (cargo as HTMLElement).offsetWidth;
      const travel = () => (track.offsetWidth - truckW()) * (isRtl() ? -1 : 1);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            stops.forEach((s, i) => s.classList.toggle(styles.stopOn, self.progress >= i / (stops.length - 1) - 0.02));
          },
        },
      });
      tl.fromTo(fill, { scaleX: () => truckW() / track.offsetWidth }, { scaleX: 1, ease: "none" }, 0).fromTo(cargo, { x: 0 }, { x: travel, ease: "none" }, 0);
    } else {
      stops.forEach((s) => ScrollTrigger.create({ trigger: s, start: "top 80%", once: true, onEnter: () => s.classList.add(styles.stopOn) }));
    }
    gsap.from(stops, { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.09, ease: EASE.out, scrollTrigger: { trigger: track, start: "top 85%", once: true } });
  });
  return (
    <section ref={ref} className={styles.journey} aria-labelledby="journey-title">
      <div className="container">
        <div className={styles.head} data-header>
          <Eyebrow tone="light">{p.journeyEyebrow}</Eyebrow>
          <h2 id="journey-title" className={styles.title} data-title><RichText text={p.journeyTitle} accentClass={styles.accentInk} /></h2>
        </div>
        <div className={styles.track} data-track aria-hidden="true">
          <span className={styles.trackFill} data-track-fill />
          <span className={styles.cargo} data-cargo>
            {/* Drone view of a low-bed carrying a pressure vessel (3D render, transparent) */}
            <Image
              className={styles.truck}
              src="/assets/namma/images/solutions/project-logistics/truck-drone.webp"
              alt=""
              width={1200}
              height={300}
              sizes="420px"
            />
          </span>
        </div>
        <ol className={styles.stops}>
          {p.journey.map((s, i) => (
            <li key={s.title} className={styles.stop} data-stop>
              <span className={styles.stopDot} aria-hidden="true" />
              <span className={styles.stopNum}>{pad2(i + 1)}</span>
              <h3 className={styles.stopTitle}>{s.title}</h3>
              <p className={styles.stopBody}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 03 + 05 · heavy cargo, transport & handling */
export function Heavy({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.projectLogistics;
  useAutoReveal(ref, ({ q }) => {
    const media = q("[data-media]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: media, start: "top 80%", once: true } });
    tl.from(media, { y: 60, autoAlpha: 0, duration: 1.2, ease: EASE.out })
      .from(q("[data-media] img"), { scale: 1.16, duration: 1.8, ease: "power3.out" }, 0)
      .from(q("[data-dim]"), { scaleX: 0, duration: 0.9, stagger: 0.15, ease: "expo.inOut" }, 0.5)
      .from(q("[data-dim-v]"), { scaleY: 0, duration: 0.9, ease: "expo.inOut" }, 0.65);
    gsap.fromTo(q("[data-media] img"), { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true } });
  });
  return (
    <section ref={ref} className={styles.heavy} aria-labelledby="heavy-title" data-tone="dark">
      <div className={`container ${styles.heavyGrid}`}>
        <figure className={styles.heavyMedia} data-media>
          <Image src={PHOTO.heavy} alt="" fill sizes="(min-width: 992px) 52vw, 100vw" />
          <span className={styles.dimH} data-dim aria-hidden="true" />
          <span className={styles.dimH2} data-dim aria-hidden="true" />
          <span className={styles.dimV} data-dim-v aria-hidden="true" />
        </figure>
        <div className={styles.heavyCopy}>
          <div data-header>
            <Eyebrow tone="dark">{p.heavyEyebrow}</Eyebrow>
            <h2 id="heavy-title" className={styles.title} data-title><RichText text={p.heavyTitle} accentClass={styles.accent} /></h2>
            <div className={styles.copyBody} data-intro>
              {p.heavyBody.map((b) => <p key={b}>{b}</p>)}
            </div>
          </div>
          <div className={styles.handling} data-rise>
            <h3>{p.handlingTitle}</h3>
            {p.handlingBody.map((b) => <p key={b}>{b}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 04 · the route is part of the plan */
export function RouteCheck({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.projectLogistics;
  useAutoReveal(ref, ({ q }) => {
    q("[data-check]").forEach((row, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true }, delay: i * 0.06 });
      tl.from(row, { "--rule": 0, duration: 0.8, ease: "expo.out" })
        .from(row.querySelector("path"), { drawSVG: "0%", duration: 0.5, ease: "power2.out" }, 0.2)
        .from(row.querySelectorAll("[data-check-text]"), { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: EASE.soft }, 0.1);
    });
  });
  return (
    <section ref={ref} className={styles.route} aria-labelledby="route-title">
      <div className={`container ${styles.routeGrid}`}>
        <div className={styles.routeLead}>
          <div data-header>
            <Eyebrow tone="light">{p.routeEyebrow}</Eyebrow>
            <h2 id="route-title" className={styles.title} data-title><RichText text={p.routeTitle} accentClass={styles.accentInk} /></h2>
            <p className={styles.routeIntro} data-intro>{p.routeLead}</p>
          </div>
          <figure className={styles.routePhoto} data-rise>
            <Image src={PHOTO.route} alt="" fill sizes="(min-width: 992px) 36vw, 100vw" />
          </figure>
        </div>
        <div>
          <ol className={styles.checks}>
            {p.routeItems.map((it, i) => (
              <li key={it} className={styles.check} data-check>
                <span className={styles.checkNum} data-check-text>{pad2(i + 1)}</span>
                <span className={styles.checkText} data-check-text>{it}</span>
                <svg className={styles.checkMark} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </li>
            ))}
          </ol>
          <p className={styles.routeNote} data-rise>{p.routeNote}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 07 · how do we start your project? */
export function StartSteps({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.projectLogistics;
  useAutoReveal(ref, ({ q }) => {
    const list = q("[data-steps]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 82%", once: true } });
    tl.from(q("[data-step]"), { y: 50, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: EASE.out })
      .from(q("[data-step-bar]"), { scaleX: 0, duration: 0.8, stagger: 0.12, ease: "expo.inOut" }, 0.3);
  });
  return (
    <section ref={ref} className={styles.start} aria-labelledby="start-title" data-tone="dark">
      <div className="container">
        <div className={styles.head} data-header>
          <Eyebrow tone="dark">{p.startEyebrow}</Eyebrow>
          <h2 id="start-title" className={styles.title} data-title><RichText text={p.startTitle} accentClass={styles.accent} /></h2>
        </div>
        <ol className={styles.steps} data-steps>
          {p.start.map((s, i) => (
            <li key={s.title} className={styles.step} data-step>
              <span className={styles.stepBar} data-step-bar aria-hidden="true" />
              <span className={styles.stepNum}>{pad2(i + 1)}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
