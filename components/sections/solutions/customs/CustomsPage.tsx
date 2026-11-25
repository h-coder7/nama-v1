"use client";

import { Quote } from "@/components/sections/home/quote/Quote";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { RouteKey } from "@/lib/routes";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Connected } from "../shared/Connected";
import { Offices } from "../shared/Offices";
import { SolutionHero } from "../shared/SolutionHero";
import { useAutoReveal } from "../shared/useAutoReveal";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import { DutyEveryCase, DutyProcedures } from "../duty/DutyPage";
import styles from "./customs.module.scss";

const img = (n: string, ext?: string) => solutionImg("customs-clearance", n, ext);

export function CustomsPage({ t }: SolutionPageProps) {
  const k = t.solutionPages.customs;
  const c = t.solutionPages.common;
  return (
    <>
      <SolutionHero
        t={t}
        route="customsClearance"
        eyebrow={t.routes.customsClearance}
        title={k.title}
        body={k.body}
        primary={{ label: t.common.talkToExpert, to: "contact" }}
        secondary={{ label: c.allSolutions, to: "solutions" }}
        visual={
          <div className={styles.docs}>
            <div className={styles.docsSheets} data-docs>
              <Image src={img("hero-1")} alt="" fill priority sizes="(min-width: 992px) 640px, 100vw" />
            </div>
            <div className={styles.seal} data-seal>
              <Image src={img("overlay-border")} alt="" fill sizes="170px" />
            </div>
          </div>
        }
        intro={(tl, q) => {
          tl.from(q("[data-docs]"), { y: 80, rotate: -6, autoAlpha: 0, duration: 1.5 }, 0.3)
            .from(q("[data-seal]"), { scale: 0, rotate: -120, duration: 1.1, ease: "back.out(1.6)" }, 1.1)
            .to(q("[data-seal]"), { y: -8, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 }, 2.3);
        }}
      />
      <Includes t={t} />
      <Documents t={t} />
      <DocsToMovement t={t} />
      <Roles t={t} />
      <DutyProcedures t={t} />
      <DutyEveryCase t={t} />
      <Connected t={t} variant="tiles" title={k.connectedTitle} intro={k.connectedIntro} services={["threePl", "warehousingDistribution", "freightTransport", "projectLogistics"]} />
      <Offices t={t} variant="cards" tone="paper" />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={fill(t.solutionPages.common.discussTitle, { topic: k.discussTopic })} service="customsClearance" />
      </SiteClosing>
    </>
  );
}

/* ------------------------------------------------------------------ what this service includes */
function Includes({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const k = t.solutionPages.customs;
  const c = t.solutionPages.common;
  useAutoReveal(ref, ({ q }) => {
    const list = q("[data-phases]")[0];
    gsap.from(q("[data-phase-rail]"), { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: true } });
    q("[data-phase]").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } });
      tl.from(row.querySelector("[data-phase-num]"), { scale: 0, duration: 0.6, ease: "back.out(2)" })
        .from(row.querySelector("[data-phase-title]"), { x: -20, autoAlpha: 0, duration: 0.6, ease: EASE.soft }, 0.1)
        .from(row.querySelectorAll("[data-phase-card]"), { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: EASE.soft }, 0.15);
    });
  });
  let n = 0;
  return (
    <section ref={ref} className={styles.includes} aria-labelledby="includes-title">
      <div className="container">
        <SectionHeader id="includes-title" tone="light" eyebrow={c.scopeEyebrow} title={k.includesTitle} intro={c.scopeIntro} />
        <ol className={styles.phases} data-phases>
          <span className={styles.phaseRail} data-phase-rail aria-hidden="true" />
          {k.phases.map((p, pi) => (
            <li key={p.title} className={styles.phase} data-phase>
              <div className={styles.phaseHead}>
                <span className={clsx(styles.phaseNum, pi === 0 && styles.phaseNumOn)} data-phase-num>{pad2(pi + 1)}</span>
                <h3 data-phase-title>{p.title}</h3>
              </div>
              <ul className={styles.phaseCards}>
                {p.items.map((it) => {
                  n += 1;
                  const link = (it as { link?: string }).link as RouteKey | undefined;
                  return (
                    <li key={it.title} className={styles.phaseCard} data-phase-card>
                      <span className={styles.cardNum}>{pad2(n)}</span>
                      <h4>{it.title}</h4>
                      <p>{it.body}</p>
                      {link && (
                        <AppLink to={link} className={styles.cardLink}>
                          <span>{t.routes[link]}</span>
                          <span className={styles.cardGo} aria-hidden="true"><Icon name="arrow" size={11} /></span>
                        </AppLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ documents we typically review */
function Documents({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const k = t.solutionPages.customs;
  const [active, setActive] = useState(0);
  const first = useRef(true);
  useAutoReveal(ref, ({ q }) => {
    const lens = q("[data-lens]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: lens, start: REVEAL_START, once: true } });
    tl.from(lens, { x: () => (document.documentElement.dir === "rtl" ? 160 : -160), rotate: -25, autoAlpha: 0, duration: 1.3, ease: EASE.out })
      .from(q("[data-lens-line]"), { scaleX: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" }, 0.6)
      .from(q("[data-doc-detail] > *"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: EASE.soft }, 0.4)
      .from(q("[data-doc-tile]"), { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: EASE.soft }, 0.6);
  });
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelector("[data-lens]"), { rotate: -10, scale: 0.94 }, { rotate: 0, scale: 1, duration: 0.7, ease: "back.out(1.8)" });
    gsap.fromTo(root.querySelectorAll("[data-lens-line]"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.06, ease: "expo.out" });
    gsap.fromTo(root.querySelectorAll("[data-doc-detail] > *"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: EASE.soft });
  }, [active]);
  const d = k.docs[active];

  return (
    <section ref={ref} className={styles.documents} aria-labelledby="docs-title">
      <div className="container">
        <SectionHeader id="docs-title" tone="yellow" eyebrow={k.docsEyebrow} title={k.docsTitle} intro={k.docsIntro} />
        <div className={styles.docStage}>
          <div className={styles.lens} data-lens aria-hidden="true">
            <div className={styles.lensGlass}>
              <p className={styles.lensTitle}>{d.title}</p>
              <span className={styles.lensRule} data-lens-line />
              <span className={styles.lensLine} data-lens-line />
              <span className={styles.lensLine} data-lens-line style={{ width: "70%" }} />
              <span className={clsx(styles.lensLine, styles.lensHi)} data-lens-line />
              <span className={styles.lensLine} data-lens-line style={{ width: "85%" }} />
              <span className={styles.lensLine} data-lens-line style={{ width: "60%" }} />
            </div>
            <span className={styles.lensHandle} />
          </div>
          <div className={styles.docDetail} data-doc-detail aria-live="polite">
            <span className={styles.docOf}>{fill(k.docsOf, { n: pad2(active + 1), total: pad2(k.docs.length) })}</span>
            <h3>{d.title}</h3>
            <p>{d.body}</p>
          </div>
        </div>
        <ul className={styles.docTiles} role="tablist">
          {k.docs.map((doc, i) => (
            <li key={doc.title} data-doc-tile>
              <button role="tab" aria-selected={i === active} className={clsx(styles.docTile, i === active && styles.docTileOn)} onClick={() => setActive(i)}>
                <small>{pad2(i + 1)}</small>
                <strong>{doc.title}</strong>
                <span className={styles.docTileBody}>{doc.body}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.docNote} data-rise><strong>{k.docsNoteStrong}</strong> {k.docsNote}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ from documents to movement */
const FLOW_IMAGES = ["documentation-1", "coordination", "onward-movement"];

function DocsToMovement({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const k = t.solutionPages.customs;
  useAutoReveal(ref, ({ q }) => {
    const track = q("[data-track]")[0];
    gsap.from(q("[data-track-line]"), { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: track, start: "top 65%", end: "bottom 55%", scrub: true } });
    q("[data-step]").forEach((row, i) => {
      const side = (i % 2 ? 1 : -1) * (document.documentElement.dir === "rtl" ? -1 : 1);
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 72%", once: true } });
      tl.from(row.querySelector("[data-step-dot]"), { scale: 0, duration: 0.5, ease: "back.out(2.5)" })
        .from(row.querySelector("[data-step-copy]"), { x: 40 * side, autoAlpha: 0, duration: 0.8, ease: EASE.soft }, 0.1)
        // Photo drifts up out of a soft focus and settles — no hard wipe edge.
        .from(row.querySelector("[data-step-media]"), { y: 60, autoAlpha: 0, duration: 1.6, ease: "power3.out" }, 0.05)
        .fromTo(row.querySelector("[data-step-media] img"), { scale: 1.22, filter: "blur(10px) brightness(0.7)" }, { scale: 1, filter: "blur(0px) brightness(1)", duration: 1.8, ease: "power3.out", clearProps: "filter" }, 0.05);
    });
  });
  return (
    <section ref={ref} className={styles.movement} aria-labelledby="movement-title" data-tone="dark">
      <div className="container">
        <SectionHeader id="movement-title" tone="dark" eyebrow={k.flowEyebrow} title={k.flowTitle} intro={k.flowIntro} />
        <ol className={styles.track} data-track>
          <span className={styles.trackLine} data-track-line aria-hidden="true" />
          {k.flow.map((s, i) => (
            <li key={s.title} className={clsx(styles.step, i % 2 === 1 && styles.stepFlip)} data-step>
              <div className={styles.stepCopy} data-step-copy>
                <span className={styles.stepNum}>{pad2(i + 1)}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
              <span className={styles.stepDot} data-step-dot aria-hidden="true" />
              <div className={styles.stepMedia} data-step-media>
                <Image src={img(FLOW_IMAGES[i])} alt="" fill sizes="(min-width: 992px) 380px, 100vw" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ roles */
function Roles({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const k = t.solutionPages.customs;
  const [active, setActive] = useState(0);
  const first = useRef(true);
  useAutoReveal(ref);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(root.querySelectorAll("[data-role-swap]"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: EASE.soft });
  }, [active]);
  const r = k.roles[active];
  return (
    <section ref={ref} className={styles.roles} aria-labelledby="roles-title">
      <div className="container">
        <SectionHeader id="roles-title" tone="light" eyebrow={k.rolesEyebrow} title={k.rolesTitle} intro={k.rolesIntro} />
        <div className={styles.roleTabs} role="tablist" data-rise>
          <span className={styles.roleThumb} style={{ "--i": active } as React.CSSProperties} aria-hidden="true" />
          {k.roles.map((role, i) => (
            <button key={role.tab} role="tab" aria-selected={i === active} aria-controls="role-panel" className={clsx(styles.roleTab, i === active && styles.roleTabOn)} onClick={() => setActive(i)}>
              {role.tab}
            </button>
          ))}
        </div>
        <div className={clsx(styles.rolePanel, active === 1 && styles.rolePanelDark)} id="role-panel" role="tabpanel" data-rise>
          <div className={styles.roleLead}>
            <small data-role-swap>{r.tab}</small>
            <h3 data-role-swap><RichText text={r.title} /></h3>
            <p data-role-swap>{r.note}</p>
          </div>
          <ul className={styles.roleItems}>
            {r.items.map((it, i) => (
              <li key={it} data-role-swap>
                <small>{pad2(i + 1)}</small>
                <strong>{it}</strong>
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.boundary} data-rise>{k.boundary}</p>
      </div>
    </section>
  );
}
