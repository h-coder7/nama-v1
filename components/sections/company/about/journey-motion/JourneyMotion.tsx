"use client";

import { onWidthResize } from "@/lib/motion";
import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import type { Messages } from "@/lib/i18n";
import { pad2 } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { JourneyScene, STAGE_W } from "./JourneyScene";
import { Carriers, LANE } from "./Carriers";
import { pinLength, useJourneyMotion } from "./useJourneyMotion";
import styles from "./journeyMotion.module.scss";

/** Stages shown on the journey (the first nine of the old site's list); the rest are services along the way. */
export const JOURNEY_STAGES = 9;
/** Which act each stage belongs to: origin · on the way · destination. */
export const ACT_OF = [0, 0, 0, 0, 1, 1, 2, 2, 2];

/**
 * End-to-end — "One box, one journey".
 * The section pins; as the reader scrolls, one Namma box stays put while a continuous
 * line-drawn landscape slides under it: office → factory → warehouse → export port →
 * sea / air → arrival quay and rail → customs → warehouse → the customer's door.
 * Its carrier changes on the way (pallet, truck, ship, train). Each stage's name and
 * a one-line explanation follow in the caption; the stage rail below tracks progress.
 * Reduced motion: the landscape scrolls sideways by hand and every caption is listed.
 */
export function JourneyMotion({ t }: { t: Messages["process"] }) {
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
  useJourneyMotion(ref);
  const stages = t.steps.slice(0, JOURNEY_STAGES);
  const extra = t.steps.slice(JOURNEY_STAGES);

  return (
    <section ref={ref} id="journey-motion" className={styles.section} aria-labelledby="journey-motion-title" data-acts={t.acts.join("|")}>
      <div className={styles.pinWrap}>
      <div className={styles.pin} data-pin>
        <div className={`container ${styles.head}`}>
          <div className={styles.lead}>
            <Eyebrow tone="light">{t.eyebrow}</Eyebrow>
            <h2 id="journey-motion-title" className={styles.title}>
              <RichText text={t.title} accentClass={styles.accent} />
            </h2>
          </div>
          {/* Live caption: the stage the box is at */}
          <div className={styles.caption} aria-hidden="true">
            <p className={styles.capMeta}>
              <b data-cap-num>01</b> / {pad2(JOURNEY_STAGES)} · <span data-cap-act>{t.acts[0]}</span>
            </p>
            <p className={styles.capTitle} data-cap-title>{stages[0].title}</p>
            <p className={styles.capLine} data-cap-line>{t.lines[0]}</p>
          </div>
        </div>

        <div className={styles.stage} data-stage>
          <div className={styles.world} data-world>
            <svg className={styles.scene} viewBox={`0 0 ${STAGE_W * JOURNEY_STAGES} 400`} preserveAspectRatio="xMinYMid meet" data-scene aria-hidden="true">
              <JourneyScene />
            </svg>
          </div>
          <svg className={styles.unit} viewBox="0 0 240 400" preserveAspectRatio="xMidYMid meet" data-unit aria-hidden="true">
            <g data-lane transform={`translate(0 ${LANE[0]})`}>
              <Carriers />
            </g>
          </svg>
          <span className={styles.hint} data-hint>{t.scrollHint}</span>
        </div>

        <div className="container">
          <ol className={styles.rail} data-rail>
            <span className={styles.railTrack} aria-hidden="true"><span className={styles.railFill} data-rail-fill /></span>
            {stages.map((s, i) => (
              <li key={s.title} className={styles.dot} data-dot>
                <span className={styles.dotMark} aria-hidden="true" />
                <span className={styles.dotNum}>{pad2(i + 1)}</span>
                <span className={styles.dotTitle}>{s.title}</span>
                <span className={styles.srLine}>{t.lines[i]}</span>
              </li>
            ))}
          </ol>
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
