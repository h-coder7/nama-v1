"use client";

import { Quote } from "@/components/sections/home/quote/Quote";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Connected } from "../shared/Connected";
import { SolutionHero } from "../shared/SolutionHero";
import { useAutoReveal } from "../shared/useAutoReveal";
import { useAutoCycle } from "../shared/useAutoCycle";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import { StartArt } from "./StartArt";
import styles from "./packing.module.scss";

const img = (n: string, ext?: string) => solutionImg("industrial-equipment-packing", n, ext);

export function PackingPage({ t }: SolutionPageProps) {
  const p = t.solutionPages.packing;
  return (
    <>
      <SolutionHero
        t={t}
        route="industrialEquipmentPacking"
        eyebrow={t.routes.industrialEquipmentPacking}
        title={p.title}
        body={p.body}
        layout="bleed"
        className={styles.hero}
        primary={{ label: t.common.talkToExpert, to: "contact" }}
        secondary={{ label: t.solutionPages.projectLogistics.exploreCta, to: "projectLogistics" }}
        visual={
          <div className={styles.heroMedia}>
            <Image src={img("hero")} alt="" fill priority sizes="100vw" data-hero-photo />
            <span className={styles.heroShade} />
          </div>
        }
        intro={(tl, q) => {
          tl.from(q("[data-hero-photo]"), { scale: 1.15, duration: 2.4, ease: "power2.out" }, 0)
            .fromTo(q("[data-hero-steps]"), { clipPath: "inset(100% 0% 0% 0% round 16px 16px 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 16px 16px 0 0)", duration: 1.2, ease: "expo.inOut", clearProps: "clipPath" }, 0.6)
            .from(q("[data-hero-steps] li"), { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: EASE.out }, 0.95);
        }}
      >
        <HeroSteps steps={p.steps} />
      </SolutionHero>
      <StartWith t={t} />
      <Protection t={t} />
      <TransportPlan t={t} />
      <Connected t={t} variant="tabs" services={["projectLogistics", "freightTransport", "warehousingDistribution", "customsClearance", "relocationExhibitions"]} />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={p.discussEyebrow} title={p.discussTitle} service="industrialEquipmentPacking" />
      </SiteClosing>
    </>
  );
}

/** Yellow step list on the hero — the active step travels down on a loop. */
function HeroSteps({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setOn((v) => (v + 1) % steps.length), 1600);
    return () => window.clearInterval(id);
  }, [steps.length]);
  return (
    <ol ref={ref} className={styles.heroSteps} data-hero-steps aria-hidden="true" style={{ "--on": on, "--n": steps.length } as React.CSSProperties}>
      <span className={styles.heroStepBar} />
      {steps.map((s, i) => (
        <li key={s} className={i === on ? styles.heroStepOn : undefined}>
          <span>{pad2(i + 1)}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ we start with the equipment */
function StartWith({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.packing;
  const c = t.solutionPages.common;
  const { active, select, bind } = useAutoCycle(ref, p.start.length, 3600);
  useAutoReveal(ref, ({ q }) => {
    const grid = q("[data-start]")[0];
    gsap.from(q("[data-start-card]"), { y: 60, autoAlpha: 0, duration: 1.1, ease: EASE.out, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
    gsap.from(q("[data-start-item]"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: EASE.soft, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
  });
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-start-swap]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: EASE.soft });
  }, [active]);
  const s = p.start[active];
  return (
    <section ref={ref} className={styles.start} aria-labelledby="start-title" {...bind}>
      <div className="container">
        <SectionHeader id="start-title" tone="light" eyebrow={c.stagesEyebrow} title={p.startTitle} intro={c.stagesIntro} />
        <div className={styles.startGrid} data-start>
          <div className={styles.startCard} data-start-card>
            <span className={styles.startNum} data-start-swap>{pad2(active + 1)}</span>
            <div className={styles.startArt}>
              <StartArt index={active} />
            </div>
            <span className={styles.startTag} data-start-swap>{s.tag}</span>
          </div>
          <ol className={styles.startList} role="tablist" aria-orientation="vertical">
            {p.start.map((it, i) => (
              <li key={it.title} data-start-item>
                <button role="tab" aria-selected={i === active} className={clsx(styles.startItem, i === active && styles.startOn)} onClick={() => select(i)}>
                  <span className={styles.startBadge}>{pad2(i + 1)}</span>
                  <span>
                    <strong>{it.title}</strong>
                    <span className={styles.startBody}>{it.body}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ protection in every detail */
function Protection({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.packing;
  const c = t.solutionPages.common;
  useAutoReveal(ref, ({ q }) => {
    gsap.from(q("[data-protect]"), { y: 50, rotateX: -25, transformOrigin: "50% 0%", autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: EASE.out, scrollTrigger: { trigger: q("[data-protect-grid]")[0], start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.protect} aria-labelledby="protect-title" data-tone="dark">
      <div className="container">
        <SectionHeader id="protect-title" tone="dark" eyebrow={c.scopeEyebrow} title={p.protectTitle} intro={c.scopeIntro} />
        <ul className={styles.protectGrid} data-protect-grid>
          {p.protect.map((it, i) => (
            <li key={it.title} className={styles.protectCard} data-protect>
              <span className={styles.protectTop}>
                <span className={styles.protectNum}>{pad2(i + 1)}</span>
                <span className={styles.mark} aria-hidden="true" />
              </span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ packing as part of the transport plan */
function TransportPlan({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.solutionPages.packing;
  useAutoReveal(ref, ({ q }) => {
    const track = q("[data-plan]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: track, start: REVEAL_START, once: true } });
    tl.fromTo(track, { clipPath: "inset(0% 100% 0% 0% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", clearProps: "clipPath", duration: 1.4, ease: "power3.inOut" })
      .from(q("[data-plan-seg] > *"), { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: EASE.soft }, 0.6)
      .from(q("[data-plan-slash]"), { scaleY: 0, duration: 0.45, stagger: 0.08, ease: "back.out(2)" }, 0.5);
  });
  return (
    <section ref={ref} className={styles.plan} aria-labelledby="plan-title">
      <div className="container">
        <SectionHeader id="plan-title" tone="light" eyebrow={p.planEyebrow} title={p.planTitle} intro={p.planIntro} />
        <ol className={styles.track} data-plan>
          {p.plan.map((s, i) => (
            <li key={s} className={clsx(styles.seg, i === 0 && styles.segStart)} data-plan-seg>
              <small>{i === 0 ? p.startPoint : fill(p.stepN, { n: pad2(i) })}</small>
              <strong>{s}</strong>
              {i < p.plan.length - 1 && <span className={styles.slashes} data-plan-slash aria-hidden="true"><i /></span>}
            </li>
          ))}
        </ol>
        <div className={styles.planFoot} data-rise>
          <p>{p.sequence}</p>
          <Button to="requestQuote" query={{ service: "industrialEquipmentPacking" }} tone="dark" chip="yellow" size="sm">{p.cta}</Button>
        </div>
      </div>
    </section>
  );
}
