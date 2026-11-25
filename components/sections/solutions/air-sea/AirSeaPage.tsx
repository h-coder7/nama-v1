"use client";

import { Quote } from "@/components/sections/home/quote/Quote";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Connected } from "../shared/Connected";
import { SolutionHero } from "../shared/SolutionHero";
import { useAutoReveal } from "../shared/useAutoReveal";
import { useAutoCycle } from "../shared/useAutoCycle";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import { DiagonalDuo } from "./DiagonalDuo";
import styles from "./air-sea.module.scss";

const img = (n: string, ext?: string) => solutionImg("air-sea-chartering", n, ext);

/**
 * Air Freight / Sea Freight (Nov 2026): the approved Air & Sea Chartering page, kept whole.
 * Hero copy comes from the service (solutionPages.airFreight / seaFreight, draft); every other
 * section keeps the chartering page's approved copy and design.
 */
export function AirSeaPage({ t, mode }: SolutionPageProps & { mode: "airFreight" | "seaFreight" }) {
  const a = t.solutionPages.airSea;
  const s = t.solutionPages[mode];
  const sibling = mode === "airFreight" ? "seaFreight" : "airFreight";
  return (
    <>
      <SolutionHero
        t={t}
        route={mode}
        eyebrow={t.routes.freightTransport}
        title={s.title}
        body={s.body}
        layout="bleed"
        holdVisual
        className={styles.hero}
        primary={{ label: t.common.requestQuote, to: "requestQuote", query: { service: mode } }}
        secondary={{ label: t.routes[sibling], to: sibling }}
        visual={
          <div className={styles.heroArt}>
            <div className={styles.heroImg} data-hero-img>
              <DiagonalDuo
                left={{ src: img("air-nose"), position: "50% 62%" }}
                right={{ src: img("sea-port"), position: "62% 50%" }}
                top={60}
                bottom={40}
                sizes="(min-width: 992px) 62vw, 100vw"
                priority
              />
            </div>
            <span className={clsx(styles.heroWord, styles.heroSea)} data-hero-word aria-hidden="true">{a.sea}</span>
            <span className={clsx(styles.heroWord, styles.heroAir)} data-hero-word aria-hidden="true">{a.air}</span>
          </div>
        }
        intro={(tl, q) => {
          tl.from(q("[data-duo-right]"), { xPercent: 18, autoAlpha: 0, duration: 1.5, ease: "expo.out" }, 0)
            .from(q("[data-duo-left]"), { xPercent: -18, autoAlpha: 0, duration: 1.5, ease: "expo.out" }, 0.12)
            .from(q("[data-hero-img] img"), { scale: 1.18, duration: 2.2 }, 0)
            .fromTo(q("[data-duo-bars]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" }, 0.45)
            .from(q("[data-duo-badge]"), { scale: 0, rotate: -120, duration: 0.9, ease: "back.out(1.8)" }, 1.1)
            .from(q("[data-hero-word]"), { yPercent: 60, autoAlpha: 0, duration: 1.1, stagger: 0.15 }, 0.9)
            .from(q("[data-strip] > li"), { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: EASE.soft }, 1);
        }}
      >
        <div className={styles.strip}>
          <ul className="container" data-strip>
            {a.strip.map((s, i) => (
              <li key={s.title} className={i === 2 ? styles.stripPlain : undefined}>
                <strong>{s.title}</strong>
                <span>{s.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </SolutionHero>
      <TwoModes t={t} />
      <CargoStages t={t} />
      <Chain t={t} />
      <Connected t={t} variant="cards" intro={a.connectedIntro} viewAll services={[sibling, "lclShipments", "roadFreight", "customsClearance"]} />
      <Assess t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={fill(t.solutionPages.common.discussTitle, { topic: s.topic })} service={mode} />
      </SiteClosing>
    </>
  );
}

/* ------------------------------------------------------------------ two charter modes */
function TwoModes({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const a = t.solutionPages.airSea;
  const [side, setSide] = useState<"sea" | "air" | null>(null);
  useAutoReveal(ref, ({ q }) => {
    const panel = q("[data-modes]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: REVEAL_START, once: true } });
    tl.from(panel, { y: 50, autoAlpha: 0, duration: 1, ease: "expo.out" })
      .from(q("[data-modes] [data-duo-left]"), { xPercent: -22, duration: 1.4, ease: "expo.out" }, 0.05)
      .from(q("[data-modes] [data-duo-right]"), { xPercent: 22, duration: 1.4, ease: "expo.out" }, 0.05)
      .from(q("[data-modes] img"), { scale: 1.15, duration: 1.8, ease: EASE.out }, 0)
      .fromTo(q("[data-modes] [data-duo-bars]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" }, 0.35)
      .from(q("[data-modes] [data-duo-badge]"), { scale: 0, rotate: -120, duration: 0.8, ease: "back.out(1.8)" }, 0.85)
      .from(q("[data-mode-copy] > *, [data-pill]"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: EASE.soft }, 0.7)
      .from(q("[data-criteria] > *"), { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: EASE.soft }, 0.9);
  });
  return (
    <section ref={ref} className={styles.modes} aria-labelledby="modes-title">
      <div className="container">
        <SectionHeader id="modes-title" tone="light" eyebrow={a.modesEyebrow} title={a.modesTitle} intro={a.modesIntro} />
        <div className={clsx(styles.modePanel, side && styles[`focus-${side}`])} data-modes onMouseLeave={() => setSide(null)}>
          <div className={styles.modeImg}>
            <DiagonalDuo
              left={{ src: img("sea-port"), position: "40% 55%" }}
              right={{ src: img("air-apron"), position: "62% 50%" }}
              top={56}
              bottom={44}
              sizes="(min-width: 1248px) 1200px, 100vw"
            />
          </div>
          <div className={clsx(styles.modeHalf, styles.modeSea)} onMouseEnter={() => setSide("sea")}>
            <span className={styles.pill} data-pill>{a.seaPill}</span>
            <div className={styles.modeCopy} data-mode-copy>
              <h3>{a.seaTitle}</h3>
              <p>{a.seaBody}</p>
            </div>
          </div>
          <div className={clsx(styles.modeHalf, styles.modeAir)} onMouseEnter={() => setSide("air")}>
            <span className={clsx(styles.pill, styles.pillYellow)} data-pill>{a.airPill}</span>
            <div className={styles.modeCopy} data-mode-copy>
              <h3>{a.airTitle}</h3>
              <p>{a.airBody}</p>
            </div>
          </div>
        </div>
        <div className={styles.criteria} data-criteria>
          <p className={styles.decides}><RichText text={a.decides} accentClass={styles.accent} /></p>
          <ul>
            {a.criteria.map((cr) => <li key={cr}>{cr}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ stages + charter brief */
function CargoStages({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const a = t.solutionPages.airSea;
  const c = t.solutionPages.common;
  const total = a.stages.length;
  const { active, select, bind } = useAutoCycle(ref, total, 3400);
  useAutoReveal(ref, ({ q }) => {
    const grid = q("[data-cargo]")[0];
    gsap.from(q("[data-cargo-card]"), { y: 50, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: EASE.soft, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
    gsap.from(q("[data-brief]"), { y: 70, rotate: 3, autoAlpha: 0, duration: 1.1, ease: EASE.out, scrollTrigger: { trigger: grid, start: REVEAL_START, once: true } });
  });
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelector(`[data-check="${active}"]`), { scale: 0.4 }, { scale: 1, duration: 0.5, ease: "back.out(2.6)" });
  }, [active]);
  return (
    <section ref={ref} className={styles.cargo} aria-labelledby="cargo-title" data-tone="dark" {...bind}>
      <div className="container">
        <SectionHeader id="cargo-title" tone="dark" eyebrow={c.stagesEyebrow} title={a.stagesTitle} intro={c.stagesIntro} />
        <div className={styles.cargoGrid} data-cargo>
          <ol className={styles.cargoCards} role="tablist">
            {a.stages.map((s, i) => (
              <li key={s.title} data-cargo-card>
                <button role="tab" aria-selected={i === active} className={clsx(styles.cargoCard, i === active && styles.cargoOn)} onClick={() => select(i)}>
                  <span className={styles.cargoBar} aria-hidden="true" />
                  <span className={styles.cargoNum}>{pad2(i + 1)}</span>
                  <strong>{s.title}</strong>
                  <span className={styles.cargoBody}>{s.body}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className={styles.brief} data-brief aria-live="polite">
            <small>{a.brief}</small>
            <h3><RichText text={a.briefTitle} /></h3>
            <ul>
              {a.stages.map((s, i) => (
                <li key={s.check} className={i <= active ? styles.checked : undefined}>
                  <span className={styles.box} data-check={i} aria-hidden="true">
                    <svg viewBox="0 0 12 10" width="12" height="10"><path d="M1 5l3.2 3.2L11 1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {s.check}
                </li>
              ))}
            </ul>
            <p className={styles.briefStatus}>{fill(a.briefStatus, { n: active + 1, total, title: a.stages[active].title })}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the charter, connected end to end */
function Chain({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const a = t.solutionPages.airSea;
  const c = t.solutionPages.common;
  const [mode, setMode] = useState<"air" | "sea">("air");
  useAutoReveal(ref, ({ q }) => {
    const table = q("[data-chain]")[0];
    gsap.from(q("[data-chain-row]"), { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: EASE.soft, scrollTrigger: { trigger: table, start: REVEAL_START, once: true } });
    gsap.from(q("[data-choice]"), { scale: 0.94, autoAlpha: 0, duration: 0.9, ease: "back.out(1.4)", delay: 0.35, scrollTrigger: { trigger: table, start: REVEAL_START, once: true } });
  });
  const row = (r: { title: string; code: string; tag?: string }, n: number, end?: boolean) => (
    <li key={n} className={styles.chainRow} data-chain-row>
      <span className={styles.chainN}>{pad2(n)}</span>
      <strong>{r.title}</strong>
      <span className={styles.chainTag}>{r.tag ? <em>{r.tag}</em> : end ? <i className={styles.pin} aria-hidden="true" /> : null}</span>
      <span className={styles.chainCode} dir="ltr">{r.code}</span>
    </li>
  );
  return (
    <section ref={ref} className={styles.chain} aria-labelledby="chain-title">
      <div className={`container ${styles.chainGrid}`}>
        <div className={styles.chainLead} data-header>
          <Eyebrow tone="light">{c.scopeEyebrow}</Eyebrow>
          <h2 id="chain-title" className={styles.chainTitle} data-title><RichText text={a.chainTitle} accentClass={styles.accent} /></h2>
          <p data-intro>{c.scopeIntro}</p>
          <div className={styles.legend} data-intro>
            <span><b dir="ltr">S·00</b> {a.legendCode}</span>
            <span><i aria-hidden="true" /> {a.legendLand}</span>
          </div>
          <div data-intro>
            <Button to="requestQuote" query={{ service: "freightTransport" }} tone="dark" chip="yellow" size="sm">{a.buildScope}</Button>
          </div>
        </div>
        <div className={styles.chainTable} data-chain>
          <div className={styles.chainHead}>
            {a.chainHead.map((h) => <span key={h}>{h}</span>)}
          </div>
          <ol>
            {a.chain.slice(0, 3).map((r, i) => row(r, i + 1))}
            <li className={styles.choice} data-choice>
              <span className={styles.chainN}>04</span>
              <div className={styles.choiceBtns} role="radiogroup" aria-label={`${a.chainAir} / ${a.chainSea}`}>
                {(["air", "sea"] as const).map((m, i) => (
                  <button key={m} role="radio" aria-checked={mode === m} className={clsx(styles.choiceBtn, mode === m && styles.choiceOn)} onClick={() => setMode(m)}>
                    <small dir="ltr">04{i ? "B" : "A"} · S·0{i + 1}</small>
                    <strong>{m === "air" ? a.chainAir : a.chainSea}</strong>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(m === "air" ? "air-charter" : "sea-charter", "svg")} alt="" width={22} height={22} />
                  </button>
                ))}
                <span className={styles.or}>{a.or}</span>
              </div>
            </li>
            {a.chain.slice(3).map((r, i) => row(r, i + 5, i === 1))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ what we assess */
function Assess({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const a = t.solutionPages.airSea;
  useAutoReveal(ref, ({ q }) => {
    gsap.from(q("[data-assess-item]"), {
      x: () => (document.documentElement.dir === "rtl" ? -80 : 80), autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: EASE.out,
      scrollTrigger: { trigger: q("[data-assess]")[0], start: REVEAL_START, once: true },
    });
  });
  return (
    <section ref={ref} className={styles.assess} aria-labelledby="assess-title">
      <div className={`container ${styles.assessGrid}`}>
        <div className={styles.assessLead} data-header>
          <Eyebrow tone="light">{a.assessEyebrow}</Eyebrow>
          <h2 id="assess-title" className={styles.chainTitle} data-title><RichText text={a.assessTitle} accentClass={styles.accent} /></h2>
          <p data-intro>{a.assessIntro}</p>
          <div data-intro>
            <Button to="requestQuote" query={{ service: "freightTransport" }} tone="dark" chip="yellow" size="sm">{a.assessCta}</Button>
          </div>
        </div>
        <ol className={styles.stack} data-assess>
          {a.assess.map((it, i) => (
            <li key={it} data-assess-item style={{ "--i": i } as React.CSSProperties} className={i === 0 ? styles.stackOn : undefined}>
              <span>{pad2(i + 1)}</span>
              {it}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
