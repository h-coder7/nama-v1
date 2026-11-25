"use client";

import { loopWhileVisible } from "@/lib/reveal";
import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { localePath, ROUTES } from "@/lib/routes";
import { DEPARTMENTS, jobs, type Department } from "@/lib/jobs";
import { gsap } from "@/lib/gsap";
import { DUR, EASE, STAGGER, introExpired } from "@/lib/motion";
import { fill } from "@/lib/format";
import { useLocale } from "@/providers/LocaleProvider";
import { previewHref } from "@/components/ui/AppLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Quote } from "@/components/sections/home/quote/Quote";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { JobModal } from "./JobModal";
import styles from "./careers.module.scss";

type P = { t: Messages };

/** /careers (and /careers/{slug} with that role open) — Figma "Careers" + "Job details". */
export function CareersPage({ t, initialJob }: P & { initialJob?: string }) {
  const locale = useLocale();
  const [open, setOpen] = useState<string | null>(initialJob ?? null);

  // Opening a role gives it its own address; closing returns to /careers.
  const openJob = useCallback(
    (slug: string | null) => {
      setOpen(slug);
      const path = slug ? `${localePath(locale, ROUTES.careers.path)}${slug}/` : localePath(locale, ROUTES.careers.path);
      try {
        window.history.pushState({ job: slug }, "", previewHref(path));
      } catch {
        /* history unavailable (sandboxed preview) — the modal still works */
      }
    },
    [locale],
  );

  useEffect(() => {
    const onPop = () => {
      const m = window.location.pathname.match(/careers\/([^/]+)\/?(index\.html)?$/);
      setOpen(m && m[1] !== "index.html" ? m[1] : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <>
      <CareersHero t={t} />
      <Roles t={t} onOpen={openJob} />
      <SiteClosing t={t}>
        <Quote t={t.quote} />
      </SiteClosing>
      <JobModal t={t} slug={open} onClose={() => openJob(null)} />
    </>
  );
}

/* ---------------------------------------------------------------- hero */
function CareersHero({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const c = t.careersPage;
  const ar = useLocale() === "ar";

  useSectionMotion(ref, ({ conditions, q, root }) => {
    const release = () => document.documentElement.classList.remove("is-intro");
    if (!conditions.motion || introExpired()) return release();
    const tl = gsap.timeline({ defaults: { ease: EASE.out }, onStart: release });
    tl.from(q("[data-hero-fade]"), { y: 18, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.base, ease: EASE.soft }, 0.05)
      .from(q("[data-word]"), { yPercent: 105, duration: 1.2, stagger: 0.12 }, 0.2)
      // Badge drops in on its lanyard and settles with a swing.
      .from(q("[data-badge]"), { yPercent: -70, rotate: 9, duration: 1.6, ease: "elastic.out(0.6, 0.45)" }, 0.35)
      .from(q("[data-ribbon]"), { xPercent: () => (document.documentElement.dir === "rtl" ? -20 : 20), autoAlpha: 0, duration: 1.2 }, 0.6);
    loopWhileVisible(gsap.to(q("[data-badge]"), { rotate: 2.4, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2, transformOrigin: "50% 0%" }), root);
    loopWhileVisible(gsap.fromTo(q("[data-ribbon-track]"), { xPercent: 0 }, { xPercent: -50, duration: 30, ease: "none", repeat: -1 }), root);
  });

  const ribbon = [...c.pillars, ...c.pillars];

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="careers-title" data-hero-intro data-tone="dark">
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <div data-intro data-hero-fade>
            <Breadcrumb current="careers" t={t} />
          </div>
          <div className={styles.heroEyebrow} data-intro data-hero-fade>
            <Eyebrow tone="dark">{c.eyebrow}</Eyebrow>
          </div>
          <h1 id="careers-title" className={styles.heroTitle}>
            <span className={styles.word}><span data-word data-intro>{c.titleTop}</span></span>
            <span className={styles.word}><span data-word data-intro className={ar ? styles.wordSoft : styles.wordOutline} >{c.titleMid}</span></span>
            <span className={styles.word}><span data-word data-intro className={styles.wordYellow}>{c.titleEnd}</span></span>
          </h1>
          <p className={styles.heroBody} data-intro data-hero-fade>{c.body}</p>
          <div data-intro data-hero-fade>
            <Button href="#open-roles" chip="yellow" size="sm">{c.cta}</Button>
          </div>
        </div>

        <div className={styles.badgeWrap} aria-hidden="true">
          <div className={styles.badge} data-badge data-intro>
            <span className={styles.strap} />
            <span className={styles.clip} />
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardMark}>{"//"}</span> NAMMA
                <i />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardPhoto}>
                  <Image src="/assets/namma/images/company/careers-badge-photo.webp" alt="" fill sizes="240px" priority />
                </div>
                <span className={styles.cardEyebrow}>{c.badgeEyebrow}</span>
                <strong className={styles.cardTitle}>{c.badgeTitle}</strong>
                <ul>
                  {c.pillars.map((p) => (
                    <li key={p}><span>{"//"}</span>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ribbon} data-ribbon aria-hidden="true" dir="ltr">
        <div className={styles.ribbonTrack} data-ribbon-track>
          {[0, 1].map((k) => (
            <span key={k} className={styles.ribbonSet}>
              {ribbon.map((p, i) => (
                <span key={`${k}-${i}`}>{p}<b>{"//"}</b></span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- open roles */
function Roles({ t, onOpen }: P & { onOpen: (slug: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const c = t.careersPage;
  const locale = useLocale();
  const [dept, setDept] = useState<Department | "all">("all");
  const changed = useRef(false);
  useAutoReveal(ref);

  const counts = useMemo(() => Object.fromEntries(DEPARTMENTS.map((d) => [d, jobs.filter((j) => j.department === d).length])) as Record<Department, number>, []);
  const shown = dept === "all" ? jobs : jobs.filter((j) => j.department === dept);

  useEffect(() => {
    if (!changed.current || !list.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(list.current.children, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: EASE.soft, clearProps: "transform,opacity,visibility" });
  }, [dept]);

  const count = shown.length === 1 ? c.roleCount : fill(c.rolesCount, { n: shown.length });
  const jobCopy = c.jobs as Record<string, { title: string }>;

  return (
    <section ref={ref} id="open-roles" className={styles.roles} aria-labelledby="roles-title">
      <div className="container">
        <SectionHeader eyebrow={c.rolesEyebrow} title={c.rolesTitle} intro={c.rolesIntro} id="roles-title" />
        <div className={styles.filters} data-rise>
          <div className={styles.chips} role="group" aria-label={c.rolesEyebrow}>
            {(["all", ...DEPARTMENTS] as const).map((d) => (
              <button
                key={d}
                type="button"
                className={clsx(styles.chip, d === dept && styles.chipOn)}
                aria-pressed={d === dept}
                onClick={() => { changed.current = true; setDept(d); }}
              >
                {d === "all" ? c.allDepartments : c.departments[d]} <span>{d === "all" ? jobs.length : counts[d]}</span>
              </button>
            ))}
          </div>
          <p className={styles.count} aria-live="polite">{count}</p>
        </div>
        <ul ref={list} className={styles.roleList} data-stagger="24">
          {shown.map((j) => (
            <li key={j.slug}>
              <a
                href={previewHref(`${localePath(locale, ROUTES.careers.path)}${j.slug}/`)}
                className={styles.role}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  onOpen(j.slug);
                }}
              >
                <span className={styles.roleMain}>
                  <strong>{jobCopy[j.slug].title}</strong>
                  <span className={styles.tags}>
                    <span>{c.departments[j.department]}</span>
                    <span>{c.cities[j.city]}</span>
                    <span>{c.types[j.type]}</span>
                  </span>
                </span>
                <span className={styles.roleCode} aria-hidden="true">{j.code}</span>
                <span className={styles.roleCta}>
                  <span>{c.viewRole}</span>
                  <i aria-hidden="true">
                    <svg viewBox="0 0 13 11" width="12" height="11" data-dir="forward"><path d="M0.5 5.5H12.1667M7.16667 10.5L12.1667 5.5L7.16667 0.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </i>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
