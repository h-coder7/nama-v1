"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useRequirementsListAnimation } from "./useRequirementsListAnimation";
import styles from "./requirements-list.module.scss";

/** Requirements — "list" variant (Figma: Mining): big outlined titles + detail card. */
export function RequirementsList({ c, copy, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useRequirementsListAnimation(ref, active, setActive);
  const total = copy.requirements.length;
  const r = copy.requirements[active];
  const image = data.requirementImages?.[active] ?? data.requirementsImage;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="req-title">
      <div className="container">
        <SectionHeader id="req-title" tone="dark" eyebrow={c.requirementsEyebrow} title={c.requirementsTitle} intro={c.requirementsIntro} />

        <div className={styles.grid}>
          <ol className={styles.list} role="tablist" aria-orientation="vertical">
            {copy.requirements.map((req, i) => (
              <li key={req.title} data-row>
                <button
                  role="tab"
                  aria-selected={i === active}
                  aria-controls="req-panel"
                  className={clsx(styles.row, i === active && styles.active)}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
                >
                  <span className={styles.num}>{pad2(i + 1)}</span>
                  <span className={styles.title}>{req.title}</span>
                  <Icon name="arrow" size={16} className={styles.arrow} />
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.card} id="req-panel" role="tabpanel" data-card>
            <div className={styles.media}>
              <Image src={image} alt="" fill sizes="(min-width: 992px) 380px, 90vw" className={styles.image} data-swap-image />
            </div>
            <div className={styles.cardBody} data-swap>
              <span className={styles.label}>{fill(c.requirementLabel, { n: pad2(active + 1), total: pad2(total) })}</span>
              {r.tag && <span className={styles.label}>{r.tag}</span>}
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.cardText}>{r.body}</p>
            </div>
            <Button to="requestQuote" query={{ industry: data.key, service: data.preselect }} chip="yellow" size="sm">
              {fill(c.discussCta, { industry: name })}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
