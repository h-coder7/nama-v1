"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useSolutionSwitchesAnimation } from "./useSolutionSwitchesAnimation";
import styles from "./solution-switches.module.scss";

/**
 * Suited solutions — "switches" variant (Figma: Construction).
 * Each service is a switch; the readout counts what is on and describes the
 * last service touched. "Request this scope" carries the selection to the quote form.
 */
export function SolutionSwitches({ t, c, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState<boolean[]>(() => data.solutions.map((_, i) => i === 0));
  const [focus, setFocus] = useState(0);
  const count = on.filter(Boolean).length;
  useSolutionSwitchesAnimation(ref, count, focus);
  const short = c.serviceShort as Record<string, string>;

  const toggle = (i: number) => {
    const next = on.map((v, j) => (j === i ? !v : v));
    setOn(next);
    if (next[i]) setFocus(i);
    else {
      const firstOn = next.findIndex(Boolean);
      setFocus(firstOn === -1 ? i : firstOn);
    }
  };
  const selected = data.solutions.filter((_, i) => on[i]).map((s) => s.to);
  const f = data.solutions[focus];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="suited-title">
      <div className="container">
        <SectionHeader id="suited-title" tone="light" eyebrow={c.solutionsEyebrow} title={fill(c.solutionsTitle, { industry: name })} intro={c.solutionsIntro} />

        <div className={styles.board} data-board>
          <ul className={styles.switches}>
            {data.solutions.map((s, i) => (
              <li key={s.to} data-switch>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on[i]}
                  className={clsx(styles.switch, on[i] && styles.on)}
                  onClick={() => toggle(i)}
                >
                  <span className={styles.led} aria-hidden="true" data-led />
                  <span className={styles.track} aria-hidden="true"><span className={styles.knob} /></span>
                  <span className={styles.state}>
                    {pad2(i + 1)} · {on[i] ? c.switchOn : c.switchOff}
                  </span>
                  <span className={styles.name}>{t.routes[s.to]}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.readout} aria-live="polite" data-readout>
            <p className={styles.readoutLabel}>{c.scopeReadout}</p>
            <p className={styles.count}>
              <span data-scope-count>{count}</span>
              <small> / {data.solutions.length}</small>
            </p>
            <p className={styles.countLabel}>{c.servicesOn}</p>
            <div className={styles.detail} data-detail key={f.to}>
              <h3 className={styles.detailTitle}>{t.routes[f.to]}</h3>
              <p className={styles.detailText}>{count ? short[f.to] ?? "" : c.scopeEmpty}</p>
            </div>
            <div className={styles.cta}>
              <div className={clsx(styles.ctaInner, !count && styles.ctaOff)}>
              <Button
                to="requestQuote"
                query={{ industry: data.key, service: selected.join(",") || data.preselect }}
                chip="yellow"
                size="sm"
                tabIndex={count ? undefined : -1}
                aria-disabled={!count}
              >
                {c.requestScope}
              </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
