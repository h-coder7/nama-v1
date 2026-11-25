"use client";

import { onWidthResize } from "@/lib/motion";
import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import type { Messages } from "@/lib/i18n";
import { pad2 } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { pinLength, useProcessAnimation } from "./useProcessAnimation";
import styles from "./process.module.scss";

/** Stages shown on the journey (the first nine of the old site's list); the rest are services along the way. */
export const JOURNEY_STAGES = 9;
/** Which act each stage belongs to: origin · on the way · destination. */
export const ACT_OF = [0, 0, 0, 0, 1, 1, 2, 2, 2];

const IMG = "/assets/namma/images";
/** One of Namma's own project photographs per stage (relit in the site's grade), in route order. */
const FRAMES: { src: string; pos?: string }[] = [
  { src: `${IMG}/company/about-numbers.webp`, pos: "40% 55%" },
  { src: `${IMG}/industries/industrial-operations/delivered.webp`, pos: "45% 50%" },
  { src: `${IMG}/industries/industrial-operations/requirements.webp`, pos: "50% 50%" },
  { src: `${IMG}/projects/ras-al-zour-hero.webp`, pos: "50% 45%" },
  { src: `${IMG}/projects/featured-ras-al-zour.webp`, pos: "45% 45%" },
  { src: `${IMG}/industries/energy/project-logistics.webp`, pos: "55% 55%" },
  { src: `${IMG}/solutions-built-around-your-supply-chain.webp`, pos: "50% 50%" },
  { src: `${IMG}/industries/industrial-operations/hero.webp`, pos: "45% 55%" },
  { src: `${IMG}/industries/oil-gas/hero-heavy-haul-v2.webp`, pos: "40% 60%" },
];

/**
 * End-to-end — "The journey film".
 * The section pins; scrolling plays the route as a film of real Namma photographs,
 * one full-width frame per stage. Each new frame cuts in along the brand diagonal with
 * a fine yellow seam, while the stage caption, act and the rail (with the Namma box
 * travelling along it) follow. Reduced motion: nothing pins; every frame is listed
 * with its caption.
 */
export function Process({ t }: { t: Messages["process"] }) {
  const ref = useRef<HTMLElement>(null);
  // Reserve the pinned scroll length as soon as the page hydrates (the section is far
  // below the fold then), so adding the pin later never pushes visible content (CLS).
  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const set = () => root.style.setProperty("--pin-len", `${pinLength(root)}px`);
    set();
    return onWidthResize(set);
  }, []);
  useProcessAnimation(ref);
  const stages = t.steps.slice(0, JOURNEY_STAGES);
  const extra = t.steps.slice(JOURNEY_STAGES);

  return (
    <section ref={ref} id="journey" className={styles.section} aria-labelledby="process-title" data-acts={t.acts.join("|")}>
      <div className={styles.pinWrap}>
        <div className={styles.pin} data-pin>
          <div className={`container ${styles.head}`}>
            <div className={styles.lead}>
              <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
              <h2 id="process-title" className={styles.title}>
                <RichText text={t.title} accentClass={styles.accent} />
              </h2>
            </div>
            <span className={styles.hint} data-hint aria-hidden="true">{t.scrollHint}</span>
          </div>

          <div className={styles.film} data-film>
            {stages.map((s, i) => (
              <figure key={s.title} className={styles.frame} data-frame style={{ zIndex: i + 1 }}>
                <div className={styles.frameMedia}>
                  <Image
                    src={FRAMES[i].src}
                    alt={s.title}
                    fill
                    sizes="100vw"
                    style={{ objectPosition: FRAMES[i].pos ?? "50% 50%" }}
                    data-frame-img
                  />
                  {/* The whole photo shows (contain); a soft blurred copy fills the rest of the band. */}
                  <Image src={FRAMES[i].src} alt="" fill sizes="480px" className={styles.frameBlur} aria-hidden="true" />
                </div>
                <figcaption className={styles.frameCap}>
                  <b>{pad2(i + 1)}</b> {t.acts[ACT_OF[i]]}
                  <span>{s.title}</span>
                  <span>{t.lines[i]}</span>
                </figcaption>
              </figure>
            ))}
            {/* The cut: a fine yellow line riding the leading edge of the incoming frame */}
            <svg className={styles.seam} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="120" y1="0" x2="106" y2="100" data-seam vectorEffect="non-scaling-stroke" />
            </svg>
            <span className={styles.shade} aria-hidden="true" />

            {/* Live caption, laid over the film like a subtitle */}
            <div className={`container ${styles.caption}`} aria-hidden="true">
              <p className={styles.capMeta}>
                <b data-cap-num>01</b> / {pad2(JOURNEY_STAGES)} · <span data-cap-act>{t.acts[0]}</span>
              </p>
              <p className={styles.capTitle} data-cap-title>{stages[0].title}</p>
              <p className={styles.capLine} data-cap-line>{t.lines[0]}</p>
            </div>
          </div>

          <div className={`container ${styles.strip}`} data-rail>
            {/* Acts over the strip: origin · on the way · destination */}
            <div className={styles.acts} aria-hidden="true">
              {t.acts.map((a, k) => (
                <span key={a} data-act={k} className={k === 0 ? "is-on" : undefined} style={{ gridColumn: `span ${ACT_OF.filter((x) => x === k).length}` }}>{a}</span>
              ))}
            </div>
            {/* The contact sheet: one thumbnail per stage; click to jump to it */}
            <ol className={styles.thumbs}>
              {stages.map((s, i) => (
                <li key={s.title} className={styles.dot} data-dot>
                  <button type="button" className={styles.thumb} data-goto={i} aria-label={`${pad2(i + 1)} · ${s.title}`}>
                    <Image src={FRAMES[i].src} alt="" fill sizes="(max-width: 767px) 48px, 140px" style={{ objectPosition: FRAMES[i].pos ?? "50% 50%" }} />
                    <span className={styles.thumbNum}>{pad2(i + 1)}</span>
                  </button>
                </li>
              ))}
            </ol>
            <span className={styles.railTrack} aria-hidden="true">
              <span className={styles.railFill} data-rail-fill />
              {/* The Namma box travels the strip with the film */}
              <span className={styles.box} data-rail-box>
                <svg viewBox="-6 -6 237 139"><path d="M225 3H182L141 42L140 3L96 4L0 96V127H49L95 84L97 127H137L225 42Z" /></svg>
              </span>
            </span>
          </div>
        </div>
      </div>

      {extra.length > 0 && (
        <div className={`container ${styles.also}`}>
          <p className={styles.alsoLabel}>{t.alsoLabel}</p>
          <ul>
            {extra.map((s) => <li key={s.title}>{s.title}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}
