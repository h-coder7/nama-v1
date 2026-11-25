"use client";

import clsx from "clsx";
import { Fragment, useRef } from "react";
import { pad2 } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { EASE, REVEAL_START } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "../shared/useAutoReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { solutionImg } from "../shared/services.data";
import type { SolutionPageProps } from "../shared/types";
import styles from "./duty.module.scss";

const icon = (n: string) => solutionImg("duty-exemption", n, "svg");
const ICONS = ["duty-exemption-applications", "temporary-imports", "duty-refunds", "chemical-permits", "ata-carnet-facilitation", "bonded-transportation"];

/**
 * Duty exemption sections (Nov 2026): the Duty Exemption page was retired from the sitemap;
 * its approved sections now live on the Customs Clearance page.
 */
/* ------------------------------------------------------------------ six procedures */
export function DutyProcedures({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const d = t.solutionPages.duty;
  useAutoReveal(ref, ({ q }) => {
    q("[data-proc]").forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } });
      tl.from(row, { "--rule": 0, duration: 0.9, ease: "expo.out" })
        .from(row.querySelector("[data-proc-icon]"), { scale: 0, rotate: -90, duration: 0.55, ease: "back.out(2)" }, 0.1)
        .from(row.querySelectorAll("[data-proc-text]"), { y: 16, autoAlpha: 0, duration: 0.55, stagger: 0.08, ease: EASE.soft }, 0.15);
    });
  });
  return (
    <section ref={ref} className={styles.procs} aria-labelledby="procs-title">
      <div className="container">
        <SectionHeader eyebrow={d.procsEyebrow} title={d.procsTitle} intro={d.procsIntro} tone="yellow" id="procs-title" className={styles.procsHead} />
        <ol className={styles.procList}>
          {d.items.map((it, i) => (
            <li key={it.title} className={clsx(styles.proc, i === 0 && styles.procOn)} data-proc>
              <span className={styles.procNum} data-proc-text>{pad2(i + 1)}</span>
              <span className={styles.procIcon} data-proc-icon aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon(ICONS[i])} alt="" width={24} height={24} />
              </span>
              <h3 className={styles.procTitle} data-proc-text>{it.title}</h3>
              <p className={styles.procBody} data-proc-text>{it.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ every case has its own requirements */
export function DutyEveryCase({ t }: SolutionPageProps) {
  const ref = useRef<HTMLElement>(null);
  const d = t.solutionPages.duty;
  useAutoReveal(ref, ({ q }) => {
    const folder = q("[data-folder]")[0];
    // The folder rises, its sheet slides out of it, the lead sentence types itself in
    // word by word, then the marker sweeps across each highlighted phrase in turn.
    const tl = gsap.timeline({ scrollTrigger: { trigger: folder, start: REVEAL_START, once: true } });
    tl.from(folder, { y: 70, autoAlpha: 0, duration: 1.1, ease: "expo.out" })
      .from(q("[data-folder-tab]"), { yPercent: 100, duration: 0.6, ease: EASE.out }, 0.35)
      .from(q("[data-sheet-in]"), { yPercent: 14, autoAlpha: 0, duration: 1, ease: "expo.out" }, 0.45)
      .from(q("[data-word]"), { yPercent: 70, autoAlpha: 0, duration: 0.55, stagger: 0.035, ease: EASE.out }, 0.75)
      .from(q("[data-mark]"), { backgroundSize: "0% 42%", duration: 0.65, stagger: 0.3, ease: "power2.inOut" }, ">-0.1")
      .from(q("[data-folder-fade]"), { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: EASE.soft }, ">-0.2");
  });
  return (
    <section ref={ref} className={styles.case} aria-labelledby="case-title" data-tone="dark">
      <div className={`container ${styles.caseGrid}`}>
        <div className={styles.caseLead} data-header>
          <h2 id="case-title" className={styles.caseTitle} data-title><RichText text={d.caseTitle} accentClass={styles.accent} /></h2>
          <div data-intro>
            <Button to="requestQuote" query={{ service: "customsClearance" }} chip="yellow" size="sm">{d.cta}</Button>
          </div>
        </div>
        <div className={styles.folder} data-folder>
          <span className={styles.folderTab} aria-hidden="true" data-folder-tab><span className={styles.markDark} /></span>
          <div className={styles.folderSheet} data-sheet-in>
            <p className={styles.caseLeadText}>
              {d.caseLead.split(" ").map((w, i) => (
                <Fragment key={i}><span className={styles.word} data-word>{w}</span>{" "}</Fragment>
              ))}
              {d.caseMarks.map((m, i) => (
                <Fragment key={m}>
                  <mark data-mark><span className={styles.word} data-word>{m}</span></mark>
                  {i < d.caseMarks.length - 1 ? " " : ""}
                </Fragment>
              ))}
            </p>
            <p className={styles.caseBody} data-folder-fade>{d.caseBody}</p>
            <p className={styles.caseNote} data-folder-fade>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 21h18M4 10h16M12 3l8 5H4l8-5zM6 10v8M10 10v8M14 10v8M18 10v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {d.caseNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
