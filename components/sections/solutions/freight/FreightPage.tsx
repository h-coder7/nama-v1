"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, REVEAL_START, STAGGER, introExpired } from "@/lib/motion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { useLocale } from "@/providers/LocaleProvider";
import { Connected } from "../shared/Connected";
import { Offices } from "../shared/Offices";
import { QuoteBand } from "../shared/QuoteBand";
import { useAutoReveal } from "../shared/useAutoReveal";
import { useAutoCycle } from "../shared/useAutoCycle";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import styles from "./freight.module.scss";

const img = (n: string, ext?: string) => solutionImg("freight-transport", n, ext);

export function FreightPage({ t }: SolutionPageProps) {
  const f = t.solutionPages.freight;
  return (
    <>
      <FreightHero t={t} />
      <ThreeWays t={t} />
      <Stages t={t} />
      <Beyond t={t} />
      <ByRoad t={t} />
      <Offices t={t} variant="route" />
      <Connected t={t} variant="rows" services={["customsClearance", "warehousingDistribution", "industrialEquipmentPacking", "projectLogistics"]} />
      <QuoteBand t={t} title={f.quoteTitle} service="freightTransport" />
      <SiteClosing t={t} />
    </>
  );
}

/* ------------------------------------------------------------------ hero: split-flap board */
const FLAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function FreightHero({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const f = t.solutionPages.freight;
  const c = t.solutionPages.common;
  const locale = useLocale();
  // Arabic letters join, so the Arabic board flips whole words instead of letters.
  const byWord = locale === "ar";

  useSectionMotion(ref, ({ conditions, root, q }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion || introExpired()) return release();
    const tl = gsap.timeline({ defaults: { ease: EASE.out }, onStart: release });
    tl.from(q("[data-hero-fade]"), { y: 18, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.base, ease: EASE.soft }, 0.1)
      // The photo is the LCP: it paints at once and only settles (transform), no clip-path wipe.
      .from(q("[data-board] img"), { scale: 1.12, duration: 2, ease: "power2.out" }, 0);
    q("[data-flap]").forEach((el, i) => {
      const final = el.textContent ?? "";
      const at = 0.55 + i * (byWord ? 0.09 : 0.028);
      tl.from(el, { rotateX: -90, autoAlpha: 0, duration: 0.35, ease: "power2.out" }, at);
      if (!byWord && final.trim()) {
        const state = { n: 0 };
        tl.to(state, {
          n: 8, duration: 0.5, ease: "none",
          onUpdate: () => { el.textContent = state.n >= 8 ? final : FLAP[Math.floor(Math.random() * FLAP.length)]; },
          onComplete: () => { el.textContent = final; },
        }, at);
      }
    });
    tl.from(q("[data-mode]"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: EASE.soft }, 1.2);
    if (conditions.desktop) gsap.to(q("[data-board] img"), { yPercent: 8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="solution-title" data-hero-intro data-tone="dark">
      <div className="container">
        <div data-intro data-hero-fade><Breadcrumb current="freightTransport" t={t} className={styles.crumbs} /></div>
        <div className={styles.heroTop} data-intro data-hero-fade>
          <Eyebrow tone="dark">{t.routes.freightTransport}</Eyebrow>
          <span className={styles.mark} aria-hidden="true" />
        </div>
        <div className={styles.board} data-board>
          <Image src={img("hero")} alt="" fill priority sizes="(min-width: 1248px) 1200px, 100vw" className={styles.boardImg} />
          <h1 id="solution-title" className={styles.flaps} data-intro aria-label={f.board.join(" ")}>
            {f.board.map((line, li) => (
              <span key={li} className={clsx(styles.flapLine, li >= 2 && styles.flapAccent)} aria-hidden="true">
                {line.split(" ").map((word, wi, words) => (
                  <span key={wi} className={styles.flapWord}>
                    {(byWord ? [word] : word.toUpperCase().split("")).map((ch, i) => (
                      <span key={i} className={clsx(styles.flap, byWord && styles.flapWhole)} data-flap>{ch}</span>
                    ))}
                    {wi < words.length - 1 && <span className={clsx(styles.flap, styles.flapBlank)} data-flap> </span>}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <ul className={styles.modes}>
            {f.modes.map((m) => (
              <li key={m.title} data-mode>
                <strong>{m.title}</strong>
                <span>{m.body}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.heroFoot}>
          <p data-intro data-hero-fade>{f.body}</p>
          <div className={styles.ctas} data-intro data-hero-fade>
            <Button to="requestQuote" query={{ service: "freightTransport" }} chip="yellow" size="sm">{f.cta}</Button>
            <Button to="solutions" ghost size="sm">{c.allSolutions}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ three ways */
const WAY_IMAGES = ["background", "sea-open", "background-2"];

function ThreeWays({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const f = t.solutionPages.freight;
  const c = t.solutionPages.common;
  useAutoReveal(ref, ({ q }) => {
    // One shared trigger so the three cards rise as a set (centre card leads): the photo
    // wipes up inside its frame and settles, the mode word slides up, rules draw, copy follows.
    const cards = q("[data-way]");
    const order = [1, 0, 2];
    const tl = gsap.timeline({ scrollTrigger: { trigger: cards[0]?.parentElement ?? cards[0], start: REVEAL_START, once: true } });
    order.forEach((ci, k) => {
      const card = cards[ci];
      if (!card) return;
      const at = k * 0.14;
      tl.from(card, { y: 70, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, at)
        .fromTo(card.querySelector("[data-way-media]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" }, at + 0.05)
        .from(card.querySelector("[data-way-media] img"), { scale: 1.3, duration: 1.8, ease: "expo.out" }, at + 0.1)
        .from(card.querySelector("[data-way-word]"), { yPercent: 110, duration: 0.9, ease: EASE.out }, at + 0.45)
        .from(card.querySelectorAll("[data-way-rule]"), { scaleX: 0, transformOrigin: document.documentElement.dir === "rtl" ? "100% 50%" : "0% 50%", duration: 0.9, ease: "expo.out" }, at + 0.55)
        .from(card.querySelectorAll("[data-way-copy]"), { y: 14, autoAlpha: 0, duration: 0.7, ease: EASE.out, stagger: 0.08 }, at + 0.6);
    });
  });
  let n = 0;
  return (
    <section ref={ref} className={styles.ways} aria-labelledby="ways-title">
      <div className="container">
        <SectionHeader id="ways-title" tone="light" eyebrow={c.scopeEyebrow} title={f.waysTitle} intro={c.scopeIntro} />
        <ul className={styles.wayGrid}>
          {f.ways.map((w, wi) => (
            <li key={w.word} className={clsx(styles.way, wi === 1 && styles.waySea)} data-way>
              <div className={styles.wayMedia} data-way-media>
                <Image src={img(WAY_IMAGES[wi])} alt="" fill sizes="(min-width: 992px) 600px, 100vw" />
              </div>
              <div className={styles.wayBody}>
                <p className={styles.wayWord}><span data-way-word>{w.word}</span></p>
                <div className={styles.wayItems}>
                  {w.items.map((it) => {
                    n += 1;
                    return (
                      <div key={it.title} className={styles.wayItem}>
                        <span className={styles.wayRule} data-way-rule />
                        <span className={styles.wayNum} dir="ltr" data-way-copy>{pad2(n)} / 04</span>
                        <h3 data-way-copy>{it.title}</h3>
                        <p data-way-copy>{it.body}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ stages */
const STAGE_ICONS: (IconName | "ship")[] = ["ship", "pin", "customs", "warehousing", "delivery"];

export function Stages({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const f = t.solutionPages.freight;
  const c = t.solutionPages.common;
  const total = f.stages.length;
  const { active, select, bind } = useAutoCycle(ref, total, 3600);
  useAutoReveal(ref, ({ q }) => {
    const list = q("[data-stage-list]")[0];
    gsap.from(q("[data-stage-rail]"), { scaleY: 0, transformOrigin: "top", duration: 1.4, ease: "power2.inOut", scrollTrigger: { trigger: list, start: REVEAL_START, once: true } });
    gsap.from(q("[data-stage-item]"), { x: -20, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: EASE.soft, scrollTrigger: { trigger: list, start: REVEAL_START, once: true } });
    gsap.from(q("[data-stage-card]"), { y: 60, rotate: 2, autoAlpha: 0, duration: 1.1, ease: EASE.out, scrollTrigger: { trigger: list, start: REVEAL_START, once: true } });
  });
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-stage-swap]"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: EASE.soft });
    gsap.fromTo(root.querySelector("[data-stage-icon]"), { scale: 0.7, rotate: -8, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.7, ease: "back.out(1.8)" });
  }, [active]);
  const s = f.stages[active];
  const icon = STAGE_ICONS[active];

  return (
    <section ref={ref} className={styles.stages} aria-labelledby="stages-title" {...bind}>
      <div className="container">
        <SectionHeader id="stages-title" tone="yellow" eyebrow={c.stagesEyebrow} title={f.stagesTitle} intro={c.stagesIntro} />
        <div className={styles.stageGrid}>
          <ol className={styles.stageList} data-stage-list role="tablist" aria-orientation="vertical">
            <span className={styles.stageRail} data-stage-rail aria-hidden="true" />
            {f.stages.map((st, i) => (
              <li key={st.title} data-stage-item>
                <button role="tab" aria-selected={i === active} aria-controls="stage-panel" className={clsx(styles.stageBtn, i === active && styles.stageOn, i < active && styles.stageDone)} onClick={() => select(i)}>
                  <span className={styles.stageDot} aria-hidden="true" />
                  <small>{c.stage} {pad2(i + 1)}</small>
                  <span>{st.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className={styles.stageCard} id="stage-panel" role="tabpanel" data-stage-card>
            <div className={styles.stageCardTop}>
              <span data-stage-swap>{c.stage} {pad2(active + 1)}</span>
              <span className={styles.markSm} aria-hidden="true" />
            </div>
            <div className={styles.stageIcon}>
              <span data-stage-icon key={active}>
                {icon === "ship" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img("shipping-from-origin", "svg")} alt="" width={88} height={80} />
                ) : (
                  <Icon name={icon} size={72} strokeWidth={1.3} />
                )}
              </span>
            </div>
            <div className={styles.progress} aria-hidden="true">
              {f.stages.map((_, i) => <span key={i} className={i <= active ? styles.progressOn : undefined} />)}
            </div>
            <h3 data-stage-swap>{s.title}</h3>
            <p data-stage-swap>{s.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ beyond a single mode */
const BEYOND_ICONS = [["import", "export"], ["air", "sea", "road"]];

export function Beyond({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const f = t.solutionPages.freight;
  const c = t.solutionPages.common;
  useAutoReveal(ref, ({ q }) => {
    gsap.from(q("[data-part] img"), { x: () => (document.documentElement.dir === "rtl" ? 40 : -40), autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: EASE.out, scrollTrigger: { trigger: q("[data-beyond]")[0], start: REVEAL_START, once: true } });
  });
  return (
    <section ref={ref} className={styles.beyond} aria-labelledby="beyond-title" data-tone="dark">
      <div className="container">
        <SectionHeader id="beyond-title" tone="dark" eyebrow={c.scopeEyebrow} title={f.beyondTitle} />
        <ul className={styles.beyondGrid} data-beyond data-stagger="40">
          {f.beyond.map((b, bi) => (
            <li key={b.title} className={styles.beyondCard}>
              <div className={styles.beyondHead}>
                <span>{b.label}</span>
                <span className={styles.markSm} aria-hidden="true" />
              </div>
              <div className={styles.parts}>
                {b.parts.map((p, pi) => (
                  <div key={p} className={styles.part} data-part>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(BEYOND_ICONS[bi][pi], "svg")} alt="" width={110} height={55} />
                    <strong>{p}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.beyondBody}>
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

/* ------------------------------------------------------------------ by road: shipment profile on the trailer */
export function ByRoad({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const f = t.solutionPages.freight;
  useAutoReveal(ref, ({ q, conditions }) => {
    const truck = q("[data-truck]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: truck, start: "top 80%", once: true } });
    tl.from(q("[data-truck-img]"), { xPercent: () => (document.documentElement.dir === "rtl" ? 30 : -30), duration: 1.6, ease: "power3.out" })
      .from(q("[data-profile-title]"), { autoAlpha: 0, y: 10, duration: 0.5 }, 0.9)
      .from(q("[data-profile-row]"), { autoAlpha: 0, x: -12, duration: 0.45, stagger: 0.09, ease: EASE.soft }, 1.05)
      .from(q("[data-profile-row] i"), { scaleX: 0, duration: 0.6, stagger: 0.09, ease: "expo.out" }, 1.05);
    if (conditions.desktop) gsap.fromTo(q("[data-truck-img]"), { x: 0 }, { x: () => (document.documentElement.dir === "rtl" ? -40 : 40), ease: "none", immediateRender: false, scrollTrigger: { trigger: truck, start: "top 40%", end: "bottom top", scrub: true } });
  });
  return (
    <section ref={ref} className={styles.road} aria-labelledby="road-title">
      <div className="container">
        <SectionHeader id="road-title" tone="light" eyebrow={f.roadEyebrow} title={f.roadTitle} intro={f.roadIntro} />
        <div className={styles.truck} data-truck>
          <div className={styles.truckClip}>
            <div className={styles.truckImg} data-truck-img>
              <Image src={img("golden-hour-shipment-profile-truck-2")} alt="" fill sizes="(min-width: 1248px) 1200px, 100vw" />
              <div className={styles.profile}>
                <p className={styles.profileTitle} data-profile-title>
                  <strong>{f.profileTitle}</strong>
                  <span>{f.profileCount}</span>
                </p>
                <ol className={styles.profileRows}>
                  {f.profile.map((p, i) => (
                    <li key={p} data-profile-row>
                      <span dir="ltr">{pad2(i + 1)}</span>
                      <strong>{p}</strong>
                      <i aria-hidden="true" />
                    </li>
                  ))}
                </ol>
                <span className={styles.profileMark} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

