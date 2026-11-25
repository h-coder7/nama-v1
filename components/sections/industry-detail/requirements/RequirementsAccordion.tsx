"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { fill } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useRequirementsAccordionAnimation } from "./useRequirementsAccordionAnimation";
import styles from "./requirements-accordion.module.scss";

/** Requirements — "accordion" variant (Figma: Energy): light panel, one item open at a time. */
export function RequirementsAccordion({ c, copy, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  useRequirementsAccordionAnimation(ref);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="req-title">
      <div className={styles.panel}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.lead}>
            <SectionHeader id="req-title" tone="light" eyebrow={c.requirementsEyebrow} title={c.requirementsTitle} intro={c.requirementsIntro} className={styles.header} />
            <div data-fade className={styles.cta}>
              <Button to="requestQuote" query={{ industry: data.key, service: data.preselect }} tone="dark" chip="yellow" size="sm">
                {fill(c.discussCta, { industry: name })}
              </Button>
            </div>
          </div>

          <ul className={styles.list}>
            {copy.requirements.map((r, i) => {
              const isOpen = i === open;
              return (
                <li key={r.title} className={clsx(styles.item, isOpen && styles.open)} data-item>
                  <h3>
                    <button
                      className={styles.head}
                      aria-expanded={isOpen}
                      aria-controls={`req-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span className={styles.title}>{r.title}</span>
                      <span className={styles.toggle} aria-hidden="true"><i /><i /></span>
                    </button>
                  </h3>
                  <div id={`req-${i}`} className={styles.body} role="region" aria-hidden={!isOpen}>
                    <div className={styles.bodyInner}>
                      {r.tag && <span className={styles.tag}>{r.tag}</span>}
                      <p>{r.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
