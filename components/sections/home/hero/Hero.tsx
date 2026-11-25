"use client";

import { whenLoaderDone } from "@/lib/loader";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { heroData } from "./hero.data";
import { HeroTrack } from "./HeroTrack";
import { filmEnabled, useHeroAnimation } from "./useHeroAnimation";
import styles from "./hero.module.scss";

/**
 * Home hero — "The Rhythm of Giants" film.
 * The film carries the hero; one Namma figure rides each shot and enters on the same
 * move as the cut into it. The buttons arrive with the finale and then stay.
 * Without JS, with reduced motion or data saver: poster + the finale state, all visible.
 */
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Hero({ t, units }: { t: Messages["hero"]; units: Messages["units"] }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);
  useHeroAnimation(ref, videoRef);
  const f = t.film;

  // Pick the file for the screen and play only while the hero is on screen.
  useEffect(() => {
    const v = videoRef.current;
    const root = ref.current;
    if (!v || !root) return;
    if (!filmEnabled()) {
      root.dataset.film = "off";
      return;
    }
    const w = window.innerWidth;
    const portrait = window.innerHeight > w;
    v.src = w < 600 && portrait ? heroData.video.portrait : w < 900 ? heroData.video.mobile : heroData.video.mp4;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.1 },
    );
    // The film starts when the first-visit loading screen lifts, not behind it.
    const cancel = whenLoaderDone(() => io.observe(v));
    return () => {
      cancel();
      io.disconnect();
    };
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
      setPaused(false);
    } else {
      userPaused.current = true;
      v.pause();
      setPaused(true);
    }
  };

  return (
    <section ref={ref} id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} data-media>
        <Image src={heroData.image} alt="" fill priority sizes="100vw" className={styles.image} data-image />
        {/* Video sits over the poster (its first frame) and fades in once it is actually playing. */}
        <video ref={videoRef} className={`${styles.image} ${styles.video}`} poster={heroData.image} muted loop playsInline preload="auto" aria-hidden="true" data-image
          onPlaying={(e) => e.currentTarget.classList.add(styles.videoOn)} />
        <div className={styles.shade} />
      </div>

      <div className={`container ${styles.content}`} data-content>
        <h1 id="hero-title" className="visually-hidden">{t.titleLines.join(" ")}</h1>
        <p className={styles.kicker} data-hero-kicker>{t.eyebrow}</p>

        <div className={styles.slot}>
          {heroData.beats.map((b, i) => (
            <div key={b.label} className={styles.beat} data-beat data-final={i === heroData.beats.length - 1 ? "" : undefined}>
              {b.year && <span className={styles.pre}>{f.since}</span>}
              <p className={styles.num}>
                <span className="visually-hidden">{b.value}</span>
                {/* Odometer: each digit rolls into place on a masked strip (aria-hidden; the real value is above). */}
                <span className={styles.value} aria-hidden="true">
                  {b.value.split("").map((ch, ci) =>
                    /\d/.test(ch) ? (
                      <span key={ci} className={styles.odo}>
                        <span className={styles.strip} data-digit={ch} style={{ ["--d" as string]: Number(ch) }}>
                          {DIGITS.map((d) => <span key={d}>{d}</span>)}
                        </span>
                      </span>
                    ) : (
                      <span key={ci}>{ch}</span>
                    ),
                  )}
                  <span className={styles.glint} data-glint />
                </span>
                {b.suffix && <span className={styles.suffix} data-pop>{units[b.suffix]}</span>}
                {b.plus && <span className={styles.plus} data-pop>+</span>}
                {b.unit && <span className={styles.unit} data-pop>{units[b.unit]}</span>}
              </p>
              <p className={styles.label} data-beat-label>{f[b.label]}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctas} data-hero-ctas>
          <Button to={heroData.ctas.primary} tone="yellow" whole>{t.primary}</Button>
          {/* Track Shipment (replaces "Explore Our Services"): opens a glass tracking field on hover/focus. */}
          <HeroTrack t={t} />
        </div>
      </div>

      <div className={`container ${styles.foot}`}>
        <div className={styles.rail} data-rail aria-hidden="true">
          {heroData.beats.map((b) => <i key={b.label} />)}
        </div>
        <button type="button" className={styles.pp} onClick={toggle} aria-label={paused ? f.play : f.pause} aria-pressed={paused}>
          {paused ? (
            <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1l10 6-10 6z" /></svg>
          ) : (
            <svg viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" /><rect x="8.5" y="1" width="3.5" height="12" /></svg>
          )}
        </button>
      </div>
    </section>
  );
}
