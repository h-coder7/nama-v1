"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Messages } from "@/lib/i18n";
import { serviceLink, type ServiceKey } from "@/lib/routes";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START, dirX } from "@/lib/motion";
import { fill, pad2 } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { useSectionMotion } from "@/hooks/useSectionMotion";
import { PageHero } from "../shared/PageHero";
import { JourneyMotion } from "./journey-motion/JourneyMotion";
import styles from "./about.module.scss";

const img = (n: string) => `/assets/namma/images/company/${n}.webp`;
type P = { t: Messages };

const TODAY_LINKS: ServiceKey[] = ["projectLogistics", "freightTransport", "warehousingDistribution", "customsClearance", "relocationExhibitions"];
/** Photo that follows the pointer in "Namma today": one per row, taken from that service's own page. */
const TODAY_PHOTOS = [
  "/assets/namma/images/industries/oil-gas/project-logistics.webp", // Project Logistics hero
  "/assets/namma/images/solutions/freight-transport/hero.webp", // Freight & Transport hero
  "/assets/namma/images/solutions/warehousing-distribution/warehouse-floor.webp", // Warehousing hero
  "/assets/namma/images/solutions/customs-clearance/onward-movement.webp", // Customs page
  "/assets/namma/images/solutions/relocation-exhibitions/household-goods-relocation.webp", // Relocation page
];

/** /about — Figma "About". */
export function AboutPage({ t }: P) {
  const a = t.aboutPage;
  return (
    <>
      <PageHero t={t} route="about" eyebrow={a.eyebrow} title={a.title} image={img("about-hero")} size="lg" focus="62% 50%" />
      <Story t={t} />
      {/* The end-to-end route as a drawn landscape with the Namma box travelling it (the home page shows the photo version). Right under the film (client, Nov 25). */}
      <JourneyMotion t={t.process} />
      <Today t={t} />
      <Journey t={t} />
      <Strengths t={t} />
      <SiteClosing t={t}>
        <NextMove t={t} />
      </SiteClosing>
    </>
  );
}

/* ---------------------------------------------------------------- since 1983 + the company film */
/**
 * The brand film «من باب بيت… إلى قلب مشروع», hosted on YouTube: one upload per locale
 * (`aboutPage.filmFile`: "ar" | "en"). Nothing loads until Play; then the privacy-enhanced
 * youtube-nocookie player is mounted in place of the cover. The static review export cannot frame
 * other sites, so there the Play control opens the film on YouTube in a new tab instead.
 */
const STORY_FILM = {
  cover: img("namma-film-poster"), // the section cover: the film thumbnail
  youtube: { ar: "mHWM3NvyK8M", en: "aFi8rX3KuYU" } as Record<string, string>,
  embed: (id: string) =>
    `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
  watch: (id: string) => `https://www.youtube.com/watch?v=${id}`,
};
const IS_PREVIEW = process.env.NEXT_PUBLIC_PREVIEW_EXPORT === "1";

function Story({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const a = t.aboutPage;
  const [playing, setPlaying] = useState(false);
  const [soon, setSoon] = useState(false);
  const year = (a.since.match(/\d{4}/) ?? ["1983"])[0];
  const word = a.since.replace(year, "").trim();

  useAutoReveal(ref, ({ conditions, q }) => {
    // The year rewinds from today to the founding year as it arrives.
    const num = q("[data-since-year]")[0];
    if (num) {
      const o = { v: new Date().getFullYear() };
      gsap.from(q("[data-since-word]"), { y: 24, autoAlpha: 0, duration: 0.9, ease: EASE.out, scrollTrigger: { trigger: num, start: REVEAL_START, once: true } });
      gsap.to(o, {
        v: Number(year), duration: 2.2, ease: "power3.inOut",
        scrollTrigger: { trigger: num, start: REVEAL_START, once: true },
        onUpdate: () => { num.textContent = String(Math.round(o.v)); },
      });
    }
    // The film opens out from the text column to the full width of the screen.
    const film = q("[data-film]")[0] as HTMLElement | undefined;
    if (film && conditions.desktop) {
      const side = () => Math.max(24, (window.innerWidth - 1200) / 2);
      gsap.fromTo(film,
        { clipPath: () => `inset(0px ${side()}px 0px ${side()}px round 20px)` },
        { clipPath: "inset(0px 0px 0px 0px round 0px)", ease: "none", scrollTrigger: { trigger: film, start: "top 88%", end: "top 18%", scrub: 0.6, invalidateOnRefresh: true } });
      gsap.fromTo(q("[data-film-img]"), { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: film, start: "top bottom", end: "bottom top", scrub: true } });
    }
    gsap.from(q("[data-film-play]"), { scale: 0.6, autoAlpha: 0, duration: 1, ease: "back.out(1.8)", scrollTrigger: { trigger: film, start: "top 60%", once: true } });
    gsap.from(q("[data-film-rule] > *"), { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.08, ease: EASE.out, scrollTrigger: { trigger: film, start: "top 55%", once: true } });
  });

  const filmId = a.filmFile ? STORY_FILM.youtube[a.filmFile] : undefined;
  const play = () => {
    if (!filmId) { setSoon(true); window.setTimeout(() => setSoon(false), 2600); return; }
    setPlaying(true);
  };

  return (
    <section ref={ref} className={styles.story} aria-labelledby="story-title">
      <div className={`container ${styles.storyTop}`}>
        <div className={styles.storyHead}>
          <div data-rise>
            <Eyebrow tone="dark">{a.storyEyebrow}</Eyebrow>
          </div>
          <h2 id="story-title" className={styles.since}>
            <span className={styles.sinceWord} data-since-word>{word}</span>
            <span className={styles.sinceYear} dir="ltr" data-since-year>{year}</span>
          </h2>
        </div>
        <div className={styles.storyGrid}>
          <p className={styles.storyLead} data-rise>
            <RichText text={a.lead} mutedClass={styles.mutedDark} />
          </p>
          <div className={styles.storyBody} data-stagger="20">
            <p className={styles.storyExpanded}><RichText text={a.expanded} mutedClass={styles.mutedDark} /></p>
            <p>{a.body}</p>
          </div>
        </div>
      </div>

      {/* The company film: a full-width screening frame */}
      <div className={clsx(styles.film, playing && styles.filmPlaying)} data-film>
        <div className={styles.filmMedia}>
          {playing && filmId ? (
            <iframe
              className={styles.filmVideo}
              src={STORY_FILM.embed(filmId)}
              title={a.filmTitle}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <>
              <Image src={STORY_FILM.cover} alt="" fill sizes="100vw" className={styles.filmImg} data-film-img />
              <span className={styles.filmShade} aria-hidden="true" />
              <span className={styles.filmGrain} aria-hidden="true" />
            </>
          )}
        </div>
        {!playing && (
          <div className={`container ${styles.filmUi}`}>
            <p className={styles.filmLabel}><span className={styles.filmDot} aria-hidden="true" />{a.filmLabel}</p>
            {IS_PREVIEW && filmId ? (
              <a className={styles.filmPlay} href={STORY_FILM.watch(filmId)} target="_blank" rel="noopener noreferrer" aria-label={a.filmCta} data-film-play>
              <svg className={styles.filmRing} viewBox="0 0 200 200" aria-hidden="true">
                <defs><path id="film-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
                {/[\u0600-\u06FF]/.test(a.filmCta) ? (
                  // Arabic letters join, so the ring repeats the phrase rather than stretching its spacing.
                  <text><textPath href="#film-ring">{Array(4).fill(a.filmCta).join("  ✦  ") + "  ✦"}</textPath></text>
                ) : (
                  <text><textPath href="#film-ring" textLength="486" lengthAdjust="spacing">{`${a.filmCta} · ${a.filmCta} · `}</textPath></text>
                )}
              </svg>
              <span className={styles.filmPlayCore} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
              </a>
            ) : (
              <button type="button" className={styles.filmPlay} onClick={play} aria-label={a.filmCta} data-film-play>
              <svg className={styles.filmRing} viewBox="0 0 200 200" aria-hidden="true">
                <defs><path id="film-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
                {/[\u0600-\u06FF]/.test(a.filmCta) ? (
                  // Arabic letters join, so the ring repeats the phrase rather than stretching its spacing.
                  <text><textPath href="#film-ring">{Array(4).fill(a.filmCta).join("  ✦  ") + "  ✦"}</textPath></text>
                ) : (
                  <text><textPath href="#film-ring" textLength="486" lengthAdjust="spacing">{`${a.filmCta} · ${a.filmCta} · `}</textPath></text>
                )}
              </svg>
              <span className={styles.filmPlayCore} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
              </button>
            )}
            <div className={styles.filmFoot}>
              <h3 className={styles.filmTitle}>{a.filmTitle}</h3>
              <div className={styles.filmRule} data-film-rule aria-hidden="true">
                <b>{year}</b>
                <span className={styles.filmTicks}>{Array.from({ length: 44 }, (_, i) => <i key={i} />)}</span>
                <b>{new Date().getFullYear()}</b>
              </div>
            </div>
            <p className={clsx(styles.filmSoon, soon && styles.filmSoonOn)} role="status">{soon ? a.filmSoon : ""}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Namma today */
function Today({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const a = t.aboutPage;
  const [hover, setHover] = useState<number | null>(null);
  // The last row hovered keeps its photo while the card fades out.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (hover !== null) setShown(hover);
  }, [hover]);

  useAutoReveal(ref, ({ conditions, q }) => {
    if (!conditions.desktop || !float.current) return;
    // The photo follows the pointer across the list, tilting with the direction of travel.
    const list = q("[data-today-list]")[0] as HTMLElement;
    const fx = gsap.quickTo(float.current, "x", { duration: 0.6, ease: "power3" });
    const fy = gsap.quickTo(float.current, "y", { duration: 0.6, ease: "power3" });
    const fr = gsap.quickTo(float.current, "rotate", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const r = list.getBoundingClientRect();
      const x = e.clientX - r.left;
      fx(x - 110);
      fy(e.clientY - r.top - 140);
      fr(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6) + 6);
      lastX = e.clientX;
    };
    list.addEventListener("pointermove", move);
    return () => list.removeEventListener("pointermove", move);
  });

  useEffect(() => {
    if (!float.current) return;
    gsap.to(float.current, { autoAlpha: hover === null ? 0 : 1, scale: hover === null ? 0.85 : 1, duration: 0.35, ease: "power2.out" });
  }, [hover]);

  return (
    <section ref={ref} className={styles.today} aria-labelledby="today-title">
      <div className="container">
        <SectionHeader eyebrow={a.todayEyebrow} title={a.todayTitle} intro={a.todayIntro} id="today-title" />
        <div className={styles.todayList} data-today-list onPointerLeave={() => setHover(null)}>
          <div ref={float} className={styles.float} aria-hidden="true">
            {TODAY_PHOTOS.map((src, i) => (
              <Image key={src} src={src} alt="" fill sizes="240px" className={clsx(styles.floatImg, i === shown && styles.floatImgOn)} />
            ))}
          </div>
          <ol data-stagger="18">
            {a.today.map((row, i) => (
              <li key={row.title}>
                <AppLink {...serviceLink(TODAY_LINKS[i])} className={clsx(styles.todayRow, hover === i && styles.todayOn)} onPointerEnter={() => setHover(i)} onFocus={() => setHover(null)}>
                  <span className={styles.todayNum}>( {pad2(i + 1)} )</span>
                  <strong>{row.title}</strong>
                  <span className={styles.todayBody}>{row.body}</span>
                  <span className={clsx(styles.todayArrow, i === 0 && styles.todayArrowFirst)} aria-hidden="true"><Icon name="arrow" size={11} /></span>
                </AppLink>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.special} data-tone="dark" data-rise>
          <div>
            <h3>{a.specialTitle}</h3>
            <div className={styles.specialChips}>
              {(["heavyLift", "oversizedCargo", "industrialEquipmentPacking"] as const).map((k) => (
                <AppLink key={k} to={k} className={styles.chip}>
                  {t.routes[k]}
                  <Icon name="arrow" size={10} />
                </AppLink>
              ))}
            </div>
          </div>
          <p>{a.specialBody}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- journey + values */
function Journey({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const a = t.aboutPage;
  const ms = t.about.milestones;
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const dir = useRef(1);
  const first = useRef(true);
  const prev = useRef(0);
  const revealed = useRef(false);
  const total = ms.length;

  useAutoReveal(ref, ({ q }) => {
    const rail = q("[data-rail]")[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: rail, start: REVEAL_START, once: true }, onComplete: () => { revealed.current = true; } });
    tl.from(q("[data-tick]"), { scaleY: 0, duration: 0.7, ease: "power3.out", stagger: { each: 0.014, from: "start" } }, 0)
      .from(q("[data-stop-year]"), { y: 10, autoAlpha: 0, duration: 0.6, ease: EASE.out, stagger: 0.04 }, 0.1)
      .from(q("[data-rail-fill]"), { scaleX: 0, duration: 1.4, ease: "power3.inOut" }, 0.15)
      .from(q("[data-pill]"), { scale: 0.4, autoAlpha: 0, duration: 0.6, ease: "back.out(2)" }, 0.9)
      .from(q("[data-dial]"), { scale: 0.85, autoAlpha: 0, duration: 1.1, ease: EASE.out }, 0.3)
      .fromTo(q("[data-progress]"), { strokeDashoffset: 100 }, { strokeDashoffset: () => 100 - ((prev.current + 1) / total) * 100, duration: 1.4, ease: "power2.inOut" }, 0.5)
      .fromTo(q("[data-orbit]"), { rotate: 0 }, { rotate: () => orbitDeg(prev.current), duration: 1.4, ease: "power2.inOut" }, 0.5)
      .add(() => countYear(q("[data-dial-year]")[0], Number(ms[0].year), Number(ms[prev.current].year), 1.4), 0.5)
      .from(q("[data-ms-line]"), { yPercent: 110, duration: 0.9, ease: EASE.out }, 0.7)
      .from(q("[data-ms]"), { y: 14, autoAlpha: 0, duration: 0.7, ease: EASE.out, stagger: 0.08 }, 0.75)
      .from(q("[data-ghost]"), { autoAlpha: 0, x: () => dirX(60), duration: 1.6, ease: EASE.out }, 0.4);
    const values = q("[data-value-num]");
    gsap.from(values, { yPercent: 60, autoAlpha: 0, duration: 1, ease: EASE.out, stagger: 0.1, scrollTrigger: { trigger: values[0], start: REVEAL_START, once: true } });
  });

  const orbitDeg = (i: number) => ((i + 1) / total) * 360 * (document.documentElement.dir === "rtl" ? -1 : 1);
  const countYear = (el: Element | undefined, from: number, to: number, duration: number) => {
    if (!el) return;
    const o = { v: from };
    gsap.to(o, { v: to, duration, ease: "power3.inOut", overwrite: true, onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
  };

  const go = useCallback((i: number, user = true) => {
    const next = (i + total) % total;
    dir.current = next >= active ? 1 : -1;
    if (user) setTouched(true);
    setActive(next);
  }, [active, total]);

  // Quiet autoplay: walks the years while the section is on screen, until the visitor takes over.
  useEffect(() => {
    const root = ref.current;
    if (!root || touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let inView = false, paused = false;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting && e.intersectionRatio > 0.35; }, { threshold: [0, 0.35, 0.6] });
    io.observe(root);
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    root.addEventListener("pointerenter", pause); root.addEventListener("pointerleave", resume);
    root.addEventListener("focusin", pause); root.addEventListener("focusout", resume);
    const id = window.setInterval(() => { if (inView && !paused && revealed.current) go(active + 1, false); }, 6500);
    return () => { io.disconnect(); window.clearInterval(id); root.removeEventListener("pointerenter", pause); root.removeEventListener("pointerleave", resume); root.removeEventListener("focusin", pause); root.removeEventListener("focusout", resume); };
  }, [active, touched, go]);

  // Milestone change: the pill glides (and stretches) to its year, the ticks it passes ripple,
  // the rail fills, the dial counts to the new year and the copy rises out of its mask.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const pill = q("[data-pill]")[0] as HTMLElement | undefined;
    const stop = q(`[data-stop="${active}"]`)[0] as HTMLElement | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instant = reduce || first.current;
    const from = prev.current;
    if (pill && stop) {
      const railEl = pill.parentElement!;
      const rail = railEl.getBoundingClientRect();
      const s = stop.getBoundingClientRect();
      const center = s.left - rail.left + s.width / 2;
      const rtl = document.documentElement.dir === "rtl";
      gsap.to(pill, { x: center - pill.offsetWidth / 2, duration: instant ? 0 : 0.8, ease: "power3.inOut" });
      if (!instant) gsap.fromTo(pill, { scaleX: 1 }, { keyframes: [{ scaleX: 1.35, duration: 0.35, ease: "power2.in" }, { scaleX: 1, duration: 0.45, ease: "back.out(2.4)" }] });
      gsap.to(q("[data-rail-fill]"), { width: rtl ? rail.width - center : center, duration: instant ? 0 : 0.9, ease: "power3.inOut" });
      if (!instant && from !== active) {
        const lo = Math.min(from, active), hi = Math.max(from, active);
        const passed: Element[] = [];
        for (let k = lo; k <= hi; k++) passed.push(...q(`[data-stop="${k}"] [data-tick]`));
        if (active < from) passed.reverse();
        gsap.fromTo(passed, { scaleY: 1 }, { scaleY: 1.8, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1, stagger: 0.5 / Math.max(passed.length, 1), clearProps: "transform" });
      }
    }
    if (first.current) gsap.set(q("[data-orbit]"), { rotate: orbitDeg(active) });
    else {
      gsap.to(q("[data-progress]"), { strokeDashoffset: 100 - ((active + 1) / total) * 100, duration: reduce ? 0 : 0.9, ease: "power2.inOut" });
      gsap.to(q("[data-orbit]"), { rotate: orbitDeg(active), duration: reduce ? 0 : 0.9, ease: "power2.inOut" });
    }
    if (!first.current && !reduce && from !== active) {
      countYear(q("[data-dial-year]")[0], Number(ms[from].year), Number(ms[active].year), 0.9);
      gsap.fromTo(q("[data-ms-line]"), { yPercent: 110 * dir.current }, { yPercent: 0, duration: 0.8, ease: EASE.out });
      gsap.fromTo(q("[data-ms]"), { x: dirX(24 * dir.current), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: EASE.out, stagger: 0.07 });
      gsap.fromTo(q("[data-ghost]"), { x: dirX(80 * dir.current), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.1, ease: EASE.out });
    }
    prev.current = active;
    first.current = false;
  }, [active, total, ms]);

  useEffect(() => {
    const onResize = () => { first.current = true; setActive((v) => v); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onKey = (e: KeyboardEvent) => {
    const rtl = document.documentElement.dir === "rtl";
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + (rtl ? -1 : 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active + (rtl ? 1 : -1)); }
  };

  const m = ms[active];

  return (
    <section ref={ref} className={styles.journey} aria-labelledby="journey-title" data-tone="dark">
      <div className="container">
        <SectionHeader eyebrow={a.journeyEyebrow} title={a.journeyTitle} intro={a.journeyIntro} tone="dark" id="journey-title" />

        <div className={styles.timeline} role="group" aria-label={a.journeyEyebrow} data-rise>
          <button type="button" className={styles.tlNav} onClick={() => go(active - 1)} aria-label={t.common.prevMilestone}>
            <Icon name="arrow" size={13} flow="back" />
          </button>
          <div className={styles.rail} data-rail onKeyDown={onKey}>
            <span className={styles.railFill} data-rail-fill aria-hidden="true" />
            <span className={styles.pill} data-pill aria-hidden="true">{m.year}</span>
            {ms.map((x, i) => (
              <button
                key={x.year}
                type="button"
                className={clsx(styles.stop, i === active && styles.stopOn)}
                onClick={() => go(i)}
                aria-pressed={i === active}
                aria-label={`${x.year}: ${x.title.replace(/\n/g, " ")}`}
                data-stop={i}
              >
                <span className={styles.ticks} aria-hidden="true">
                  <i data-tick /><i data-tick className={styles.tickMain} /><i data-tick />
                </span>
                <span className={styles.stopYear} data-stop-year>{x.year}</span>
              </button>
            ))}
          </div>
          <button type="button" className={styles.tlNav} onClick={() => go(active + 1)} aria-label={t.common.nextMilestone}>
            <Icon name="arrow" size={13} />
          </button>
        </div>

        <div className={styles.milestone} aria-live={touched ? "polite" : "off"}>
          <span className={styles.ghost} data-ghost aria-hidden="true">{m.year}</span>
          <div className={styles.dial} data-dial data-ring>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" className={styles.dialTrack} />
              <circle cx="60" cy="60" r="54" className={styles.dialProgress} pathLength={100} strokeDasharray="100" strokeDashoffset={100 - ((active + 1) / total) * 100} data-progress />
            </svg>
            <span className={styles.orbit} data-orbit aria-hidden="true" />
            <span className={styles.dialYear} data-dial-year>{m.year}</span>
          </div>
          <div className={styles.msCopy}>
            <span className={styles.msOf} data-ms>{fill(a.milestoneOf, { n: pad2(active + 1), total: pad2(total) })}</span>
            <h3><span className={styles.msMask}><span data-ms-line>{m.title.replace(/\n/g, " ")}</span></span></h3>
            <p data-ms>{m.body}</p>
          </div>
        </div>

        <span className={styles.journeyRule} data-line />

        <div className={styles.vmv}>
          <div data-rise>
            <Eyebrow tone="dark">{a.valuesEyebrow}</Eyebrow>
          </div>
          <div className={styles.vmGrid}>
            <article className={styles.vision} data-rise>
              <span className={styles.vmLabel}>{a.visionLabel}</span>
              <h3>{a.visionTitle}</h3>
              <p>{a.visionBody}</p>
            </article>
            <article className={styles.mission} data-rise="0.12">
              <span className={styles.vmLabel}>{a.missionLabel}</span>
              <p>{a.missionBody}</p>
            </article>
          </div>
          <ul className={styles.values}>
            {a.values.map((v, i) => (
              <li key={v.title}>
                <span className={styles.valueNum} data-value-num aria-hidden="true">{pad2(i + 1)}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- strengths */
function Strengths({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const a = t.aboutPage;
  const [active, setActive] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });
  useAutoReveal(ref);

  const update = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setEdge({ start: pos < 4, end: pos > max - 4 });
  };
  useEffect(update, []);

  const step = (d: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li") as HTMLElement | null;
    const rtl = document.documentElement.dir === "rtl";
    el.scrollBy({ left: (card ? card.offsetWidth + 20 : 300) * d * (rtl ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section ref={ref} className={styles.strengths} aria-labelledby="strengths-title">
      <div className="container">
        <div className={styles.strengthsHead}>
          <div data-header>
            <Eyebrow tone="light">{a.strengthsEyebrow}</Eyebrow>
            <h2 id="strengths-title" className={styles.strengthsTitle} data-title>
              <RichText text={a.strengthsTitle} accentClass={styles.accent} />
            </h2>
          </div>
          <div className={styles.arrows} data-rise>
            <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label={t.common.previous}><Icon name="arrow" size={12} flow="back" /></button>
            <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label={t.common.next} className={styles.arrowNext}><Icon name="arrow" size={12} /></button>
          </div>
        </div>
      </div>
      <ol ref={track} className={styles.strengthTrack} onScroll={update} data-stagger="30">
        {a.strengths.map((s, i) => (
          <li key={s.title} className={clsx(styles.strength, i === active && styles.strengthOn)} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0}>
            <span className={styles.strengthNum}>{pad2(i + 1)}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------------- next move */
function NextMove({ t }: P) {
  const ref = useRef<HTMLElement>(null);
  const a = t.aboutPage;
  useAutoReveal(ref);
  useSectionMotion(ref, ({ conditions, q }) => {
    if (!conditions.motion) return;
    gsap.from(q("[data-container]"), { xPercent: () => (document.documentElement.dir === "rtl" ? -40 : 40), autoAlpha: 0, duration: 1.4, ease: EASE.out, scrollTrigger: { trigger: q("[data-container]")[0], start: "top 90%", once: true } });
    gsap.from(q("[data-corp]"), { y: 40, autoAlpha: 0, rotate: -3, duration: 1, delay: 0.3, ease: EASE.out, scrollTrigger: { trigger: q("[data-container]")[0], start: "top 90%", once: true } });
  });
  return (
    <section ref={ref} className={styles.next} aria-labelledby="next-title">
      <div className={`container ${styles.nextGrid}`}>
        <div className={styles.nextCopy} data-header>
          <Eyebrow tone="dark">{a.nextEyebrow}</Eyebrow>
          <h2 id="next-title" className={styles.nextTitle} data-title>
            <RichText text={a.nextTitle} accentClass={styles.accent} />
          </h2>
          <div className={styles.nextCtas} data-intro>
            <Button to="requestQuote" size="sm">{t.common.requestQuote}</Button>
            <Button to="projects" ghost size="sm">{a.exploreProjects}</Button>
          </div>
        </div>
        <div className={styles.nextArt}>
          <div className={styles.container3d} data-container>
            <Image src={img("about-container")} alt="" fill sizes="(min-width: 992px) 560px, 90vw" />
          </div>
          <div className={styles.corp} data-corp>
            <span className={styles.corpTag}>
              <span className={styles.corpMark} aria-hidden="true" />
              {a.corporateEyebrow}
            </span>
            <p><RichText text={a.corporate} accentClass={styles.accent} mutedClass={styles.corpStrong} /></p>
          </div>
        </div>
      </div>
    </section>
  );
}
