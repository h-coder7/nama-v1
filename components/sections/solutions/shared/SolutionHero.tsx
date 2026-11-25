"use client";

import clsx from "clsx";
import { useRef, type ReactNode } from "react";
import type { Messages } from "@/lib/i18n";
import type { RouteKey } from "@/lib/routes";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, STAGGER, introExpired } from "@/lib/motion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText, balanceLines } from "@/components/ui/RichText";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import styles from "./solution-hero.module.scss";

type Cta = { label: string; to: RouteKey; query?: Record<string, string>; hash?: string };

type Props = {
  t: Messages;
  route: RouteKey;
  eyebrow?: string;
  title: string;
  body: string | string[];
  primary: Cta;
  secondary?: Cta;
  /** Right-hand (or background) visual. */
  visual?: ReactNode;
  /** split: copy + visual side by side · bleed: visual fills the hero behind the copy · stack: visual under the eyebrow, copy below. */
  layout?: "split" | "bleed" | "stack";
  /** Keep the bleed visual hidden until the intro (only when the intro wipes it in, e.g. Air & Sea). Otherwise the photo paints at once (LCP). */
  holdVisual?: boolean;
  /** Extra content under the grid (e.g. a fact strip). */
  children?: ReactNode;
  className?: string;
  /** Append page-specific beats to the hero intro timeline. */
  intro?: (tl: gsap.core.Timeline, q: (sel: string) => Element[]) => void;
};

/**
 * Solution hero — breadcrumb, eyebrow, masked title lines, copy, two CTAs and a
 * page-specific visual. Hidden before hydration via html.is-intro (see layout),
 * released when the intro timeline starts.
 */
export function SolutionHero({ t, route, eyebrow, title, body, primary, secondary, visual, layout = "split", holdVisual, children, className, intro }: Props) {
  const ref = useRef<HTMLElement>(null);
  const paragraphs = Array.isArray(body) ? body : [body];

  useSectionMotion(ref, ({ conditions, root, q }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion || introExpired()) return release();
    const tl = gsap.timeline({ defaults: { ease: EASE.out }, onStart: release });
    tl.from(q("[data-hero-line]"), { yPercent: 110, duration: DUR.slow, stagger: 0.08 }, 0.25)
      .from(q("[data-hero-fade]"), { y: 18, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.base, ease: EASE.soft }, 0.1);
    if (!intro) tl.from(q("[data-hero-visual]"), { y: 50, autoAlpha: 0, duration: 1.4 }, 0.3);
    intro?.(tl, q);
    if (conditions.desktop) {
      gsap.to(q("[data-hero-copy]"), { yPercent: -10, autoAlpha: 0.4, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    }
  });

  return (
    <section ref={ref} className={clsx(styles.hero, styles[layout], className)} aria-labelledby="solution-title" data-hero-intro data-tone="dark">
      {layout === "bleed" && visual && <div className={styles.bleedMedia} data-intro={holdVisual || undefined}>{visual}</div>}
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy} data-hero-copy>
          <div data-intro data-hero-fade>
            <Breadcrumb current={route} t={t} className={styles.crumbs} />
          </div>
          {eyebrow && (
            <div className={styles.eyebrow} data-intro data-hero-fade>
              <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            </div>
          )}
          {layout === "stack" && visual && <div className={styles.stackVisual} data-intro data-hero-visual>{visual}</div>}
          <h1 id="solution-title" className={styles.title}>
            {balanceLines(title).map((line, i) => (
              <span key={i} className={styles.line}>
                <span data-intro data-hero-line>
                  <RichText text={line} accentClass={styles.accent} />
                </span>
              </span>
            ))}
          </h1>
          <div className={styles.foot}>
            <div className={styles.body}>
              {paragraphs.map((p) => (
                <p key={p} data-intro data-hero-fade>{p}</p>
              ))}
            </div>
            <div className={styles.ctas} data-intro data-hero-fade>
              <Button to={primary.to} query={primary.query} hash={primary.hash} size="sm">{primary.label}</Button>
              {secondary && <Button to={secondary.to} query={secondary.query} hash={secondary.hash} ghost size="sm">{secondary.label}</Button>}
            </div>
          </div>
        </div>
        {layout === "split" && visual && <div className={styles.visual} data-intro data-hero-visual>{visual}</div>}
      </div>
      {children}
    </section>
  );
}
