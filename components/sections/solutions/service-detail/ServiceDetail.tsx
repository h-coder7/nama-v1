"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { Quote } from "@/components/sections/home/quote/Quote";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fill, pad2 } from "@/lib/format";
import { QUOTE_SERVICES, SOLUTIONS_MENU, type RouteKey } from "@/lib/routes";
import { Beyond, ByRoad, Stages } from "../freight/FreightPage";
import { Heavy, Journey, RouteCheck, StartSteps } from "../project-logistics/ProjectLogisticsPage";
import { Distribution } from "../warehousing/WarehousingPage";
import { Connected } from "../shared/Connected";
import { SolutionHero } from "../shared/SolutionHero";
import { SERVICE_IMAGES } from "../shared/services.data";
import { useAutoReveal } from "../shared/useAutoReveal";
import type { SolutionPageProps } from "../shared/types";
import styles from "./service-detail.module.scss";

/** Service pages added with the Nov 2026 amendments (copy in solutionPages.<key>). */
export type DetailKey = "lclShipments" | "roadFreight" | "transportation" | "heavyLift" | "oversizedCargo";

type Copy = {
  title: string;
  body: string[];
  includedTitle: string;
  included: { title: string; body: string }[];
  stepsTitle: string;
  steps: { title: string; body: string }[];
  topic: string;
};

/**
 * Sub-service pages (Nov 2026). Each keeps the approved sections of the closest old page,
 * so no earlier work is lost; only the hero (and LCL / Transportation's "what's included") is new draft copy:
 *   LCL Shipments       → Freight & Transport "From origin to destination" stages
 *   Road & Cross-Border → Freight & Transport "By road" + "Beyond a single mode"
 *   Transportation      → Warehousing "Distribution"
 *   Heavy Lift          → Project Logistics "Heavy" + "How we start"
 *   Oversized Cargo     → Project Logistics "Route check" + "Journey"
 * (Air / Sea Freight use the whole Air & Sea Chartering page — see AirSeaPage.)
 * International Freight services lead with "Request a Quote"; the rest with "Talk to an Expert".
 */
export function ServiceDetail({ t, service }: SolutionPageProps & { service: DetailKey }) {
  const p = t.solutionPages[service] as Copy;
  const d = t.solutionPages.serviceDetail;
  const group = SOLUTIONS_MENU.find((g) => g.children?.includes(service))!;
  const siblings = (group.children ?? []).filter((k) => k !== service);
  const quote = QUOTE_SERVICES.includes(service);

  return (
    <>
      <SolutionHero
        t={t}
        route={service}
        eyebrow={t.routes[group.key]}
        title={p.title}
        body={p.body}
        layout="bleed"
        className={styles.hero}
        primary={quote ? { label: t.common.requestQuote, to: "requestQuote", query: { service } } : { label: t.common.talkToExpert, to: "contact" }}
        secondary={{ label: fill(d.backTo, { group: t.routes[group.key] }), to: group.key }}
        visual={
          <div className={styles.heroMedia}>
            <Image src={SERVICE_IMAGES[service] ?? ""} alt="" fill priority sizes="100vw" />
            <span className={styles.heroShade} />
          </div>
        }
      />
      {SECTIONS[service](t, p, d.includedEyebrow)}
      <Connected t={t} variant="rows" tone="paper" services={[...siblings, group.key] as RouteKey[]} title={d.relatedTitle} viewAll />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={fill(t.solutionPages.common.discussTitle, { topic: p.topic })} service={service} />
      </SiteClosing>
    </>
  );
}

const SECTIONS: Record<DetailKey, (t: SolutionPageProps["t"], p: Copy, eyebrow: string) => React.ReactNode> = {
  lclShipments: (t, p, e) => (<><Included t={t} copy={p} eyebrow={e} /><Stages t={t} /></>),
  roadFreight: (t) => (<><ByRoad t={t} /><Beyond t={t} /></>),
  transportation: (t, p, e) => (<><Included t={t} copy={p} eyebrow={e} /><Distribution t={t} /></>),
  heavyLift: (t) => (<><Heavy t={t} /><StartSteps t={t} /></>),
  oversizedCargo: (t) => (<><RouteCheck t={t} /><Journey t={t} /></>),
};

function Included({ copy, eyebrow }: SolutionPageProps & { copy: Copy; eyebrow: string }) {
  const ref = useRef<HTMLElement>(null);
  // Cards unfold left to right: each rises and settles from below, its number
  // drops in and the title/body rise after it.
  useAutoReveal(ref, ({ q }) => {
    const cards = q("[data-inc-card]");
    if (!cards.length) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: cards[0], start: REVEAL_START, once: true } });
    cards.forEach((card, i) => {
      const at = i * 0.13;
      tl.from(card, { y: 80, autoAlpha: 0, scale: 0.94, transformOrigin: "50% 100%", duration: 1.1, ease: "expo.out" }, at)
        .from(card.querySelector("[data-inc-num]"), { yPercent: -120, autoAlpha: 0, duration: 0.7, ease: "back.out(2)" }, at + 0.35)
        .from(card.querySelectorAll("h3, p"), { y: 18, autoAlpha: 0, duration: 0.7, ease: EASE.out, stagger: 0.08 }, at + 0.4);
    });
  });
  return (
    <section ref={ref} className={styles.included} aria-labelledby="included-title">
      <div className="container">
        <SectionHeader id="included-title" eyebrow={eyebrow} title={copy.includedTitle} />
        <ul className={styles.cards}>
          {copy.included.map((it, i) => (
            <li key={it.title} className={styles.card} data-inc-card>
              <span className={styles.num} data-inc-num>{pad2(i + 1)}</span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
