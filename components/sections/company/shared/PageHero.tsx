"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import type { Messages } from "@/lib/i18n";
import type { RouteKey } from "@/lib/routes";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, STAGGER, introExpired } from "@/lib/motion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText, balanceLines } from "@/components/ui/RichText";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import styles from "./page-hero.module.scss";

type Props = {
  t: Messages;
  route: RouteKey;
  eyebrow: string;
  title: string;
  /** Short line set at the reading end, behind a yellow rule (Figma: Contact, Quote, Track, Support, Legal). */
  aside?: string;
  image: string;
  /** Where the photo's subject sits, so a narrow screen keeps it in frame. */
  focus?: string;
  size?: "md" | "lg";
  children?: ReactNode;
  className?: string;
};

/**
 * Photo hero used across the company, form and legal pages: breadcrumb, eyebrow,
 * masked title lines and an optional aside. The photo settles from a slight zoom
 * and drifts on scroll; the copy is held hidden until the intro starts.
 */
export function PageHero({ t, route, eyebrow, title, aside, image, focus = "70% 50%", size = "md", children, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(ref, ({ conditions, root, q }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion) return release();
    if (introExpired()) {
      // Hydrated late: copy is already showing, but the photo still settles in.
      release();
      gsap.from(q("[data-photo]"), { scale: 1.08, duration: 2.2, ease: "power2.out" });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: EASE.out }, onStart: release });
    tl.fromTo(q("[data-photo]"), { autoAlpha: 0, scale: 1.14 }, { autoAlpha: 1, scale: 1, duration: 2.4, ease: "power2.out" }, 0)
      .from(q("[data-hero-fade]"), { y: 18, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.base, ease: EASE.soft }, 0.1)
      .from(q("[data-hero-line]"), { yPercent: 110, duration: DUR.slow, stagger: 0.08 }, 0.25);
    if (q("[data-aside]").length) {
      tl.from(q("[data-aside-rule]"), { scaleY: 0, duration: 0.9, ease: "expo.out" }, 0.6)
        .from(q("[data-aside]"), { x: () => (document.documentElement.dir === "rtl" ? -24 : 24), autoAlpha: 0, duration: 0.9 }, 0.7);
    }
    if (conditions.desktop) {
      gsap.to(q("[data-photo]"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    }
  });

  return (
    <section ref={ref} className={clsx(styles.hero, styles[size], className)} aria-labelledby="page-title" data-hero-intro data-tone="dark">
      <div className={styles.media} aria-hidden="true">
        <div className={styles.photo} data-photo data-intro>
          <Image src={image} alt="" fill priority sizes="100vw" style={{ objectPosition: focus }} />
        </div>
        <span className={styles.shade} />
      </div>
      <div className={`container ${styles.inner}`}>
        <div data-intro data-hero-fade>
          <Breadcrumb current={route} t={t} className={styles.crumbs} />
        </div>
        <div className={styles.row}>
          <div className={styles.copy}>
            <div data-intro data-hero-fade>
              <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            </div>
            <h1 id="page-title" className={styles.title}>
              {balanceLines(title).map((line, i) => (
                <span key={i} className={styles.line}>
                  <span data-intro data-hero-line>
                    <RichText text={line} accentClass={styles.accent} />
                  </span>
                </span>
              ))}
            </h1>
          </div>
          {aside && (
            <p className={styles.aside}>
              <span className={styles.rule} data-aside-rule data-intro />
              <span data-aside data-intro>{aside}</span>
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
