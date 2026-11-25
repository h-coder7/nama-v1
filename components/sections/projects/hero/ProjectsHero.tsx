"use client";

import { useMemo, useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { DUR, EASE, STAGGER, introExpired } from "@/lib/motion";
import { countUp, loopWhileVisible } from "@/lib/reveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText, balanceLines } from "@/components/ui/RichText";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { PROJECT_NAMES, PROJECTS_TOTAL } from "../projects.data";
import styles from "./projects-hero.module.scss";

const ROWS = 28;
const PER_ROW = 8;
/** Wall row drawn as a yellow band (Figma: the highlighted line behind the card). */
const BAND_ROW = 18;
/** Names picked out in yellow on the wall — the four featured projects. */
const HIGHLIGHT = /^(ras al-zour aluminium smelter project|aramco qatif gosp project|ibn-zahr pp-ii project|brown & root sadaf expansion)/i;

/**
 * Projects & Success Stories hero: the client's completed-projects list set as a
 * slow-moving wall of names, with the intro card sitting on top of it.
 * The wall is decorative (aria-hidden) and reads LTR in both languages.
 */
export function ProjectsHero({ t }: { t: Messages }) {
  const ref = useRef<HTMLElement>(null);
  const p = t.projectsPage;

  const rows = useMemo(() => {
    // Each row takes the next names in the list (wrapping), so every row is wider than the screen.
    const len = PROJECT_NAMES.length;
    return Array.from({ length: ROWS }, (_, r) => Array.from({ length: PER_ROW }, (_, j) => PROJECT_NAMES[(r * 5 + j) % len]));
  }, []);

  useSectionMotion(ref, ({ conditions, root, q }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion) return release();

    const rowsEls = q("[data-row]") as HTMLElement[];
    const names = q("[data-name]") as HTMLElement[];
    const glow = q("[data-glow]")[0] as HTMLElement | undefined;
    const wall = q("[data-wall]")[0] as HTMLElement;
    const timers: number[] = [];
    const cleanups: Array<() => void> = [];
    let inView = true;

    // 1 — Kinetic wall: every row drifts on its own loop (three depths, alternating
    // directions). Scrolling pushes the whole wall faster and leans it slightly.
    const loops = q("[data-track]").map((track, i) => {
      const depth = i % 3; // 0 near / 1 mid / 2 far
      const dur = [70, 105, 150][depth] + ((i * 23) % 30);
      const fromX = i % 2 ? -50 : 0;
      return loopWhileVisible(gsap.fromTo(track, { xPercent: fromX }, { xPercent: fromX === 0 ? -50 : 0, duration: dur, ease: "none", repeat: -1 }), root);
    });
    const boost = { v: 1 };
    const skewTo = gsap.quickTo(wall, "skewX", { duration: 0.6, ease: "power3.out" });
    const settle = gsap.delayedCall(0.18, () => skewTo(0)).pause();
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => { inView = self.isActive; },
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-2400, 2400, self.getVelocity());
        gsap.to(boost, { v: 1 + Math.abs(v) / 180, duration: 0.25, overwrite: true, onUpdate: () => loops.forEach((l) => l.timeScale(boost.v)) });
        gsap.to(boost, { v: 1, duration: 1.4, delay: 0.25, ease: "power2.out", onUpdate: () => loops.forEach((l) => l.timeScale(boost.v)) });
        skewTo(v / -320);
        settle.restart(true);
      },
    });

    // 2 — "Delivered" pulses: names across the wall light up one after another,
    // like jobs being signed off, then settle back into the archive.
    const pool = names.filter((n) => !n.dataset.hit);
    const pulse = () => {
      if (inView && document.visibilityState === "visible" && pool.length) {
        // Only light names the reader can actually see (on screen, not under the card).
        const card = (q("[data-card]")[0] as HTMLElement).getBoundingClientRect();
        const vw = window.innerWidth;
        let el: HTMLElement | undefined;
        for (let tries = 0; tries < 24 && !el; tries++) {
          const c = pool[Math.floor(Math.random() * pool.length)];
          const r = c.getBoundingClientRect();
          const onScreen = r.left > 8 && r.right < vw - 8 && r.bottom > 80 && r.top < window.innerHeight;
          const underCard = r.right > card.left && r.left < card.right && r.bottom > card.top && r.top < card.bottom;
          if (onScreen && !underCard && !c.classList.contains(styles.lit)) el = c;
        }
        if (el) {
          el.classList.add(styles.lit);
          const lit = el;
          timers.push(window.setTimeout(() => lit.classList.remove(styles.lit), 2600));
        }
      }
      timers.push(window.setTimeout(pulse, 520 + Math.random() * 520));
    };

    // 3 — Scanner: a thin light line sweeps the archive end to end.
    const scan = gsap.timeline({ repeat: -1, repeatDelay: 2.4, paused: true })
      .fromTo(q("[data-scan]"), { xPercent: -100, left: "0%", autoAlpha: 0 }, { left: "100%", autoAlpha: 1, duration: 4.2, ease: "power1.inOut" })
      .to(q("[data-scan]"), { autoAlpha: 0, duration: 0.5 }, "-=0.5");
    loopWhileVisible(scan, root);

    // 4 — Desktop depth: the pointer tilts the rows by depth and drags a warm light.
    const startPointer = () => {
      if (!conditions.desktop || !glow) return;
      const rowTo = rowsEls.map((r, i) => gsap.quickTo(r, "x", { duration: 1.1 + (i % 3) * 0.35, ease: "power3.out" }));
      const gx = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3.out" });
      const gy = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3.out" });
      gsap.to(glow, { autoAlpha: 1, duration: 1.2, delay: 0.4 });
      const onMove = (e: PointerEvent) => {
        const b = root.getBoundingClientRect();
        const nx = (e.clientX - b.left) / b.width - 0.5;
        gx(e.clientX - b.left);
        gy(e.clientY - b.top);
        rowTo.forEach((to, i) => to(nx * -[46, 28, 14][i % 3]));
      };
      root.addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => root.removeEventListener("pointermove", onMove));
    };

    const begin = () => {
      scan.play();
      pulse();
      startPointer();
    };

    if (introExpired()) {
      release();
      begin();
    } else {
      // Intro: rows sweep in from both edges with a soft blur-free stretch, the yellow
      // band draws across, then the card lands and the copy rises.
      const tl = gsap.timeline({ defaults: { ease: EASE.out }, onStart: release, onComplete: begin });
      tl.from(rowsEls, { autoAlpha: 0, xPercent: (i) => (i % 2 ? 18 : -18), scaleX: 1.06, duration: 1.5, stagger: { each: 0.025, from: "center" }, ease: "expo.out" }, 0)
        .from(q("[data-card]"), { y: 70, autoAlpha: 0, duration: 1.3 }, 0.25)
        .from(q("[data-hero-line]"), { yPercent: 110, duration: DUR.slow, stagger: 0.08 }, 0.5)
        .from(q("[data-hero-fade]"), { y: 16, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.base, ease: EASE.soft }, 0.4)
        .from(q("[data-band]"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0.55);
      countUp(root, root, { scrollTrigger: undefined, delay: 0.9, duration: 2.2 });
    }

    if (conditions.desktop) {
      gsap.to(q("[data-wall-inner]"), { yPercent: 8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(q("[data-card]"), { yPercent: -6, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    }

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="projects-title" data-hero-intro>
      <div className={styles.wall} aria-hidden="true" dir="ltr" data-wall>
        <span className={styles.glow} data-glow />
        <span className={styles.scan} data-scan />
        <div className={styles.wallInner} data-wall-inner>
        {rows.map((names, i) => (
          <div key={i} className={i === BAND_ROW ? `${styles.row} ${styles.bandRow}` : styles.row} data-row>
            {i === BAND_ROW && <span className={styles.band} data-band />}
            <div className={styles.track} data-track>
              {[0, 1].map((copy) => (
                <span key={copy} className={styles.set}>
                  {names.map((n) => (
                    <span key={n} className={HIGHLIGHT.test(n) ? styles.hit : undefined} data-name="" data-hit={HIGHLIGHT.test(n) ? "" : undefined}>{n}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.card} data-card data-intro data-tone="dark">
          <div data-intro data-hero-fade>
            <Breadcrumb current="projects" t={t} className={styles.crumbs} />
          </div>
          <div className={styles.eyebrow} data-intro data-hero-fade>
            <Eyebrow tone="dark">{p.eyebrow}</Eyebrow>
          </div>
          <h1 id="projects-title" className={styles.title}>
            {balanceLines(p.title).map((line, i) => (
              <span key={i} className={styles.line}>
                <span data-intro data-hero-line>
                  <RichText text={line} accentClass={styles.accent} />
                </span>
              </span>
            ))}
          </h1>
          <p className={styles.body} data-intro data-hero-fade>{p.body}</p>
          <div className={styles.foot} data-intro data-hero-fade>
            <p className={styles.count}>
              <strong data-count={String(PROJECTS_TOTAL)}>{PROJECTS_TOTAL}</strong>
              <span>{p.countLabel}</span>
            </p>
            <Button href="#all-projects" chip="yellow" size="sm">{p.browse}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
