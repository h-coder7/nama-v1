"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Connected } from "../shared/Connected";
import { Offices } from "../shared/Offices";
import { QuoteBand } from "../shared/QuoteBand";
import { SolutionHero } from "../shared/SolutionHero";
import { useAutoReveal } from "../shared/useAutoReveal";
import { useAutoCycle } from "../shared/useAutoCycle";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import { FlowArt } from "./FlowArt";
import styles from "./warehousing.module.scss";

const img = (n: string, ext?: string) => solutionImg("warehousing-distribution", n, ext);

export function WarehousingPage({ t }: SolutionPageProps) {
  const w = t.solutionPages.warehousing;
  const c = t.solutionPages.common;
  return (
    <>
      <SolutionHero
        t={t}
        route="warehousingDistribution"
        eyebrow={t.routes.warehousingDistribution}
        title={w.title}
        body={w.body}
        primary={{ label: t.common.talkToExpert, to: "contact" }}
        secondary={{ label: c.allSolutions, to: "solutions" }}
        visual={<Dock />}
        intro={(tl, q) => {
          tl.from(q("[data-dock]"), { y: 40, autoAlpha: 0, duration: 1.2 }, 0.2)
            .fromTo(q("[data-shutter]"), { scaleY: 1 }, { scaleY: 0.04, duration: 1.8, ease: "power2.inOut" }, 0.8)
            .from(q("[data-dock-scene]"), { scale: 1.12, duration: 2.4, ease: "power2.out" }, 0.8);
        }}
      />
      <Inside t={t} />
      <Flow t={t} />
      <Beyond t={t} />
      <Distribution t={t} />
      <Offices t={t} variant="list" />
      <Connected t={t} variant="photos" services={["customsClearance", "transportation", "relocationExhibitions", "freightTransport"]} />
      <QuoteBand t={t} title={w.quoteTitle} service="warehousingDistribution" />
      <SiteClosing t={t} />
    </>
  );
}

/** Loading dock — the roller shutter rolls up on load to reveal the goods arriving. */
function Dock() {
  return (
    <div className={styles.dock} data-dock>
      <div className={styles.dockScene}>
        <Image src={img("warehouse-floor")} alt="" fill priority sizes="(min-width: 992px) 640px, 100vw" data-dock-scene />
        <span className={styles.shutter} data-shutter aria-hidden="true" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ inside the warehouse */
function Inside({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const w = t.solutionPages.warehousing;
  const c = t.solutionPages.common;
  const [active, setActive] = useState(0);
  useAutoReveal(ref, ({ q }) => {
    gsap.from(q("[data-cell]"), { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: EASE.soft, scrollTrigger: { trigger: q("[data-cells]")[0], start: REVEAL_START, once: true } });
    q("[data-cell-num]").forEach((el) => {
      gsap.from(el, { yPercent: 100, duration: 0.9, ease: EASE.out, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
  });
  return (
    <section ref={ref} className={styles.inside} aria-labelledby="inside-title">
      <div className="container">
        <SectionHeader id="inside-title" tone="light" eyebrow={c.scopeEyebrow} title={w.insideTitle} intro={c.scopeIntro} />
        <ul className={styles.cells} data-cells onMouseLeave={() => setActive(0)}>
          {w.inside.map((it, i) => (
            <li key={it.title} className={clsx(styles.cell, styles[`cell${i + 1}`], i === active && styles.cellOn)} data-cell onMouseEnter={() => setActive(i)} tabIndex={0} onFocus={() => setActive(i)}>
              <span className={styles.cellNum}><span data-cell-num>{pad2(i + 1)}</span></span>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ how do your goods move */

function Flow({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const w = t.solutionPages.warehousing;
  const c = t.solutionPages.common;
  const total = w.flow.length;
  const { active, select, bind } = useAutoCycle(ref, total, 4200);
  useAutoReveal(ref, ({ q }) => {
    const grid = q("[data-flow]")[0];
    gsap.from(q("[data-flow-step]"), { x: () => (document.documentElement.dir === "rtl" ? 30 : -30), autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: EASE.soft, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
    gsap.from(q("[data-flow-panel]"), { y: 60, autoAlpha: 0, duration: 1.1, ease: EASE.out, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
  });
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-flow-swap]"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: EASE.soft });
  }, [active]);
  const s = w.flow[active];
  const next = w.flow[(active + 1) % total];

  return (
    <section ref={ref} className={styles.flow} aria-labelledby="flow-title" {...bind}>
      <div className="container">
        <SectionHeader id="flow-title" tone="yellow" eyebrow={c.stagesEyebrow} title={w.flowTitle} intro={c.stagesIntro} />
        <div className={styles.flowGrid} data-flow>
          <ol className={styles.flowSteps} role="tablist" aria-orientation="vertical">
            {w.flow.map((st, i) => (
              <li key={st.title} data-flow-step>
                <button role="tab" aria-selected={i === active} aria-controls="flow-panel" className={clsx(styles.flowStep, i === active && styles.flowStepOn)} onClick={() => select(i)}>
                  <span className={styles.flowNum}>{pad2(i + 1)}</span>
                  <span>{st.title}</span>
                  <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true" className={styles.chev}><path d="M1.5 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </li>
            ))}
          </ol>
          <div className={styles.flowPanel} id="flow-panel" role="tabpanel" data-flow-panel>
            <div className={styles.flowTop}>
              <div className={styles.flowBars} aria-hidden="true">
                {w.flow.map((_, i) => <span key={i} className={i <= active ? styles.barOn : undefined} />)}
              </div>
              <span className={styles.flowOf}>{fill(c.stageOf, { n: pad2(active + 1), total: pad2(total) })}</span>
            </div>
            <div className={styles.flowBody}>
              <div className={styles.flowCopy}>
                <h3 data-flow-swap>{s.title}</h3>
                <p data-flow-swap>{s.body}</p>
                <button type="button" className={styles.flowNext} onClick={() => select((active + 1) % total)} data-flow-swap>
                  {fill(c.nextLabel, { label: next.title })} <Icon name="arrow" size={11} />
                </button>
              </div>
              <div className={styles.flowArt}>
                <FlowArt index={active} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ beyond storage */
const BEYOND_ICONS = ["inventory-management", "kitting-labeling-light-assembly", "conditional-capability"];

function Beyond({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const w = t.solutionPages.warehousing;
  useAutoReveal(ref, ({ q }) => {
    gsap.from(q("[data-beyond-card]"), { y: 80, rotate: (i) => (i - 1) * 3, autoAlpha: 0, duration: 1, stagger: 0.12, ease: EASE.out, scrollTrigger: { trigger: q("[data-beyond-grid]")[0], start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.beyond} aria-labelledby="wbeyond-title" data-tone="dark">
      <div className="container">
        <SectionHeader id="wbeyond-title" tone="dark" eyebrow={w.beyondEyebrow} title={w.beyondTitle} intro={w.beyondIntro} />
        <ul className={styles.beyondGrid} data-beyond-grid>
          {w.beyond.map((b, i) => (
            <li key={b.title} className={clsx(styles.beyondCard, styles[`beyond${i + 1}`])} data-beyond-card>
              <div className={styles.beyondTop}>
                <span>{b.label}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(BEYOND_ICONS[i], "svg")} alt="" className={styles.beyondIcon} />
              </div>
              <div>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ distribution labels */
export function Distribution({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const w = t.solutionPages.warehousing;
  useAutoReveal(ref, ({ q }) => {
    gsap.from(q("[data-label]"), {
      y: -70, rotate: (i) => (i % 2 ? 8 : -8), autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "back.out(1.4)",
      scrollTrigger: { trigger: q("[data-labels]")[0], start: REVEAL_START, once: true },
    });
  });
  return (
    <section ref={ref} className={styles.dist} aria-labelledby="dist-title">
      <div className="container">
        <SectionHeader id="dist-title" tone="light" eyebrow={w.distEyebrow} title={w.distTitle} intro={w.distIntro} />
        <ul className={styles.labels} data-labels>
          {w.destinations.map((d, i) => (
            <li key={d} className={styles.labelWrap} data-label>
              <div className={clsx(styles.label, i === 0 && styles.labelOn)} style={{ "--tilt": `${[-1.5, 1, -0.6, 1.4][i]}deg` } as React.CSSProperties}>
                <div className={styles.labelFrom}>
                  <small>{w.from}</small>
                  <strong>{w.fromPlace}</strong>
                </div>
                <div className={styles.labelTo}>
                  <small>{w.to} · {pad2(i + 1)}</small>
                  <strong>{d}</strong>
                </div>
                <div className={styles.labelCode}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img("qr", "svg")} alt="" width={86} height={43} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
