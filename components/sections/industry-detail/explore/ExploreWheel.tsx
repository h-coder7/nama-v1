"use client";

import clsx from "clsx";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRY_ORDER } from "../industry-detail.data";
import type { SectionProps } from "../types";
import { useExploreWheelAnimation } from "./useExploreWheelAnimation";
import styles from "./explore-wheel.module.scss";

/** Signed shortest distance from `sel` to `i` on a ring of `n`. */
const ringOffset = (i: number, sel: number, n: number) => {
  let d = (i - sel) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
};

/**
 * Explore other industries — "wheel" variant (Figma: Industrial Operations).
 * A drum picker of the other five sectors; arrows / keys / wheel turn it,
 * the left column follows the selection.
 */
export function ExploreWheel({ t, c, index }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const others = useMemo(() => INDUSTRY_ORDER.filter((_, i) => i !== index), [index]);
  const n = others.length;
  // Next industry selected first.
  const [{ sel, prev }, setWheel] = useState(() => {
    const start = others.findIndex((o) => o.key === INDUSTRY_ORDER[(index + 1) % INDUSTRY_ORDER.length].key);
    return { sel: start, prev: start };
  });
  const turn = (step: number) => setWheel((w) => ({ sel: (w.sel + step + n) % n, prev: w.sel }));
  useExploreWheelAnimation(ref, sel);
  const current = others[sel];

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") { e.preventDefault(); turn(-1); }
    if (e.key === "ArrowDown") { e.preventDefault(); turn(1); }
  };

  const offsets = others.map((_, i) => ringOffset(i, sel, n));
  // Items that wrap from one end of the drum to the other jump without a transition.
  const jumped = others.map((_, i) => Math.abs(offsets[i] - ringOffset(i, prev, n)) > 1);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="explore-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.lead}>
          <SectionHeader id="explore-title" tone="light" eyebrow={c.exploreEyebrow} title={c.exploreTitle} intro={c.exploreIntro} className={styles.header} />
          <div className={styles.selected} data-fade>
            <p aria-live="polite">{c.selected}: <strong>{t.routes[current.key]}</strong></p>
            <AppLink to={current.key} className={styles.open}>
              {c.openSector}
              <Icon name="arrow" size={13} />
            </AppLink>
          </div>
        </div>

        <div className={styles.drum} data-drum tabIndex={0} role="listbox" aria-label={c.wheelHint} aria-activedescendant={`wheel-${current.key}`} onKeyDown={onKey}>
          <span className={styles.band} aria-hidden="true" />
          <ul className={styles.items}>
            {others.map((o, i) => {
              const d = offsets[i];
              return (
                <li
                  key={o.key}
                  id={`wheel-${o.key}`}
                  role="option"
                  aria-selected={d === 0}
                  className={clsx(styles.item, d === 0 && styles.itemActive, jumped[i] && styles.noAnim)}
                  style={{ "--d": d, "--ad": Math.abs(d) } as React.CSSProperties}
                  onClick={() => (d === 0 ? undefined : turn(d))}
                >
                  {d === 0 ? <AppLink to={o.key} tabIndex={-1}>{t.routes[o.key]}</AppLink> : t.routes[o.key]}
                </li>
              );
            })}
          </ul>
          <div className={styles.controls}>
            <button type="button" onClick={() => turn(-1)} aria-label={c.previousOption}><span className={styles.up}><Icon name="arrow" size={14} /></span></button>
            <button type="button" onClick={() => turn(1)} aria-label={c.nextOption} className={styles.down}><span className={styles.downIcon}><Icon name="arrow" size={14} /></span></button>
          </div>
        </div>
      </div>
    </section>
  );
}
