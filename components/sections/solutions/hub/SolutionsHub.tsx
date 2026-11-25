"use client";

import { Quote } from "@/components/sections/home/quote/Quote";
import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";
import { serviceLink, type RouteKey, type ServiceKey } from "@/lib/routes";
import { fill, pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, REVEAL_START, introExpired } from "@/lib/motion";
import { AppLink } from "@/components/ui/AppLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText, balanceLines } from "@/components/ui/RichText";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { useAutoReveal } from "../shared/useAutoReveal";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import styles from "./hub.module.scss";

/** The five service groups (client amendments, Nov 2026) — main page + dedicated sub-pages.
 *  Photos reuse the approved hub set until group-specific ones are supplied. */
const GROUPS: { to: ServiceKey; pages: RouteKey[]; tile: string; media: string; cutout?: boolean }[] = [
  { to: "freightTransport", pages: ["airFreight", "seaFreight", "lclShipments", "roadFreight"], tile: "freight-and-transport", media: solutionImg("hub", "solution-group-02") },
  { to: "customsClearance", pages: [], tile: "", media: solutionImg("customs-clearance", "hero-container"), cutout: true },
  { to: "threePl", pages: ["warehousingDistribution", "transportation", "industrialEquipmentPacking"], tile: "warehousing-distribution-and-customs-services", media: solutionImg("hub", "solution-group-03") },
  { to: "relocationExhibitions", pages: [], tile: "relocation-and-exhibitions", media: solutionImg("hub", "solution-group-04") },
  { to: "projectLogistics", pages: ["heavyLift", "oversizedCargo"], tile: "project-logistics", media: solutionImg("hub", "solution-group-01") },
];
// Bento slots (tile1 wide top-left; tile3 / tile2 / tile4 an even bottom row) → group index.
// Customs Clearance (group 02) is the yellow text tile beside tile1, the same height as it.
const BENTO: [number, number][] = [[0, 1], [2, 3], [3, 2], [4, 4]];
const SIDE = 1;

export function SolutionsHub({ t }: SolutionPageProps) {
  const h = t.solutionPages.hub;
  return (
    <>
      <HubHero t={t} />
      {GROUPS.map((g, i) => (
        <HubGroup key={g.to} t={t} index={i} />
      ))}
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={fill(t.solutionPages.common.discussTitle, { topic: h.discussTopic })} />
      </SiteClosing>
    </>
  );
}

/* ------------------------------------------------------------------ hero + bento */
function HubHero({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const h = t.solutionPages.hub;

  useSectionMotion(ref, ({ conditions, q }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion || introExpired()) return release();
    gsap
      .timeline({ defaults: { ease: EASE.out }, onStart: release })
      .from(q("[data-hero-line]"), { yPercent: 110, duration: DUR.slow, stagger: 0.08 }, 0.2)
      .from(q("[data-hero-fade]"), { y: 18, autoAlpha: 0, duration: DUR.base, stagger: 0.08, ease: EASE.soft }, 0.1)
      .fromTo(q("[data-tile]"), { clipPath: "inset(100% 0% 0% 0% round 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", clearProps: "clipPath", duration: 1.1, stagger: 0.1 }, 0.45)
      .from(q("[data-tile] img"), { scale: 1.2, duration: 1.6, stagger: 0.1 }, 0.45)
      .from(q("[data-tile-copy]"), { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: EASE.soft }, 0.9)
      .from(q("[data-integrated] > *"), { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: EASE.soft }, 0.8);
  });

  const tile = ([gi, slot]: [number, number]) => {
    const g = GROUPS[gi];
    return (
      <div key={g.to} className={clsx(styles.tile, styles[`tile${slot}`])} data-tile>
        <div className={styles.tileMedia}>
          <Image src={solutionImg("hub", g.tile)} alt="" fill priority={gi < 2} sizes="(min-width: 992px) 800px, 100vw" className={styles.tileImg} />
          <span className={styles.tileShade} />
        </div>
        <div className={styles.tileCopy} data-tile-copy>
          <div className={styles.tileHead}>
            <span>
              <span className={styles.tileLabel}>{fill(h.groupLabel, { n: pad2(gi + 1) })}</span>
              <AppLink {...serviceLink(g.to)} className={styles.tileLink}>
                <span className={styles.tileTitle}>{h.groupNames[gi]}</span>
              </AppLink>
            </span>
            <span className={styles.tileGo} aria-hidden="true"><Icon name="arrow" size={13} /></span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hub-title" data-hero-intro data-tone="dark">
      <div className="container">
        <div data-intro data-hero-fade>
          <Breadcrumb current="solutions" t={t} className={styles.crumbs} />
        </div>
        <div className={styles.heroHead}>
          <div className={styles.heroLead}>
            <div data-intro data-hero-fade><Eyebrow tone="dark">{h.eyebrow}</Eyebrow></div>
            <h1 id="hub-title" className={styles.heroTitle}>
              {balanceLines(h.title).map((line, i) => (
                <span key={i} className={styles.line}><span data-intro data-hero-line><RichText text={line} accentClass={styles.accent} /></span></span>
              ))}
            </h1>
          </div>
          <p className={styles.heroIntro} data-intro data-hero-fade>{h.intro}</p>
        </div>
      </div>
      <div className={styles.rule} />
      <div className="container">
        <ul className={styles.legend} data-intro data-hero-fade aria-hidden="true">
          <li><span className={styles.legendArrow}><Icon name="arrow" size={11} /></span>{h.legendPage}</li>
          <li><span className={styles.legendDot} />{h.legendCapability}</li>
        </ul>
        <div className={styles.bento}>
          {BENTO.map(tile)}
          <AppLink {...serviceLink(GROUPS[SIDE].to)} className={styles.integrated} data-integrated data-intro>
            <span className={styles.integratedTop}>
              <span>{fill(h.groupLabel, { n: pad2(SIDE + 1) })}</span>
              <span className={styles.mark} aria-hidden="true" />
            </span>
            <span className={styles.integratedTitle}>{h.groupNames[SIDE]}</span>
            <span className={styles.integratedGo} aria-hidden="true"><Icon name="arrow" size={13} /></span>
          </AppLink>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ group sections */
function HubGroup({ t, index }: SolutionPageProps & { index: number }) {
  const ref = useRef<HTMLElement>(null);
  const h = t.solutionPages.hub;
  const c = t.solutionPages.common;
  const g = GROUPS[index];
  const copy = h.groups[index];
  const dark = index % 2 === 1;
  useAutoReveal(ref, ({ q, conditions }) => {
    const media = q("[data-media]")[0];
    gsap.from(media, { y: 60, rotate: dark ? 2 : -2, autoAlpha: 0, duration: 1.2, ease: EASE.out, scrollTrigger: { trigger: media, start: REVEAL_START, once: true } });
    if (conditions.desktop) gsap.fromTo(q("[data-media] img"), { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true } });
  });

  return (
    <section ref={ref} className={clsx(styles.group, dark && styles.groupDark)} aria-labelledby={`group-${index}`} data-tone={dark ? "dark" : "light"}>
      <div className={`container ${styles.groupGrid}`}>
        {/* A transparent cut-out (customs documents) is shown whole, never cropped to the photo frame. */}
        <div className={clsx(styles.groupMedia, g.cutout && styles.groupMediaCutout)} data-media>
          <Image src={g.media} alt="" fill sizes="(min-width: 992px) 480px, 100vw" />
        </div>
        <div className={styles.groupCopy}>
          <div data-header className={styles.groupHead}>
            <Eyebrow tone={dark ? "dark" : "light"}>{fill(h.groupLabel, { n: pad2(index + 1) })}</Eyebrow>
            <h2 id={`group-${index}`} className={styles.groupTitle} data-title>
              <RichText text={copy.title} accentClass={styles.accent} mutedClass={styles.muted} />
            </h2>
            <p className={styles.groupBody} data-intro>{copy.body}</p>
          </div>
          <ul className={styles.caps} data-stagger="14">
            {copy.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
          {g.pages.length > 0 && (
            <ul className={styles.pages} data-stagger="14">
              {g.pages.map((p) => (
                <li key={p}>
                  <AppLink to={p} className={styles.pageLink}>
                    <span className={styles.pageBadge}>{c.page}</span>
                    <span className={styles.pageName}>{t.routes[p]}</span>
                    <Icon name="arrow" size={14} />
                  </AppLink>
                </li>
              ))}
            </ul>
          )}
          <div data-rise>
            <Button {...serviceLink(g.to)} tone={dark ? "light" : "dark"} chip="yellow" size="sm">{fill(h.exploreCta, { name: t.routes[g.to] })}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

