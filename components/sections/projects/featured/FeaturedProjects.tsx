"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { EASE, dirX } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAutoCycle } from "@/components/sections/solutions/shared/useAutoCycle";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { FEATURED, PROJECT_PAGES, rowById } from "../projects.data";
import { num, siteOf, volOf } from "../projects.copy";
import styles from "./featured.module.scss";

/**
 * "Four projects that show the scale" — volume tabs over a dark panel.
 * Steps through the projects while on screen; a click hands control to the visitor.
 */
export function FeaturedProjects({ t }: { t: Messages }) {
  const ref = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const p = t.projectsPage;
  const { active, select, bind } = useAutoCycle(ref, FEATURED.length, 6500);

  useAutoReveal(ref);

  // Panel change: photo wipes in from the reading edge, copy and rows follow, volume counts.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = panel.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const rtl = document.documentElement.dir === "rtl";
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.fromTo(q("[data-photo]"), { clipPath: rtl ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, clearProps: "clipPath" }, 0)
        .from(q("[data-photo] img"), { scale: 1.15, duration: 1.6 }, 0)
        .from(q("[data-panel-title]"), { y: 24, autoAlpha: 0, duration: 0.7 }, 0.1)
        .from(q("[data-fact]"), { x: dirX(-18), autoAlpha: 0, duration: 0.6, stagger: 0.07 }, 0.2)
        .from(q("[data-panel-cta]"), { y: 12, autoAlpha: 0, duration: 0.5 }, 0.45);
      const out = q("[data-volume]")[0] as HTMLElement | undefined;
      if (out) {
        const target = Number(out.dataset.volume);
        const s = { v: 0 };
        tl.to(s, { v: target, duration: 1.2, ease: "power2.out", onUpdate: () => { out.textContent = Math.round(s.v).toLocaleString("en-US"); } }, 0.2);
      }
    }, el);
    return () => ctx.revert();
  }, [active]);

  const key = FEATURED[active];
  const page = PROJECT_PAGES[key];
  const row = rowById(page.row);
  const copy = p.projects[key];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="featured-title" {...bind}>
      <div className="container">
        <SectionHeader eyebrow={p.featuredEyebrow} title={p.featuredTitle} intro={p.featuredIntro} tone="yellow" id="featured-title" />

        <div className={styles.tabs} role="tablist" aria-label={p.featuredEyebrow} data-stagger="20">
          {FEATURED.map((k, i) => {
            const r = rowById(PROJECT_PAGES[k].row);
            return (
              <button
                key={k}
                type="button"
                role="tab"
                id={`featured-tab-${k}`}
                aria-selected={i === active}
                aria-controls="featured-panel"
                tabIndex={i === active ? 0 : -1}
                className={clsx(styles.tab, i === active && styles.tabOn)}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!step) return;
                  const dir = document.documentElement.dir === "rtl" ? -step : step;
                  const next = (i + dir + FEATURED.length) % FEATURED.length;
                  select(next);
                  (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
                }}
              >
                <strong>{volOf(p, r)}</strong>
                <span>{p.projects[k].short.replace(/\n/g, " ")}</span>
              </button>
            );
          })}
        </div>

        <div
          ref={panel}
          id="featured-panel"
          role="tabpanel"
          aria-labelledby={`featured-tab-${key}`}
          className={clsx(styles.panel, active === 0 && styles.panelFirst, active === FEATURED.length - 1 && styles.panelLast)}
          data-rise
        >
          <div className={styles.photo} data-photo>
            <Image src={page.cardImage} alt="" fill sizes="(min-width: 992px) 480px, 100vw" />
          </div>
          <div className={styles.info}>
            <h3 className={styles.panelTitle} data-panel-title>{copy.short.replace(/\n/g, " ")}</h3>
            <dl className={styles.facts}>
              {([[p.site, siteOf(p, row)], [p.client, copy.clientLine], [p.services, p.serviceLong[row.services]]] as const).map(([dt, dd]) => (
                <div key={dt} data-fact>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.volume} data-fact>
              <strong data-volume={row.volume}>{num(row.volume ?? 0)}</strong>
              <span>{p.ftLong}</span>
            </p>
            <div data-panel-cta>
              <Button to={key} chip="yellow" size="sm">{p.viewDetails}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
