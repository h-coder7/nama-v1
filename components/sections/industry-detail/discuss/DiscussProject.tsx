"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import { fill } from "@/lib/format";
import { SOLUTIONS_MENU, type RouteKey, type ServiceKey } from "@/lib/routes";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { INDUSTRY_ORDER } from "../industry-detail.data";
import type { SectionProps } from "../types";
import type { IndustryDetailData } from "../industry-detail.data";

type Props = Pick<SectionProps, "t" | "c"> & { data: Pick<IndustryDetailData, "key" | "preselect"> };
import { useDiscussAnimation } from "./useDiscussAnimation";
import styles from "./discuss.module.scss";

const SERVICES: ServiceKey[] = [...SOLUTIONS_MENU.flatMap((g) => [g.key, ...(g.children ?? [])])];
const OPTION_LINKS: (RouteKey | null)[] = [null, "trackShipment", "contact"];

/**
 * Closing "Next step" panel for industry pages: the three routes from the
 * homepage + a short "Discuss your project" card with industry and service
 * preselected, handing off to the Request a Quote form.
 */
export function DiscussProject({ t, c, data }: Props) {
  const ref = useRef<HTMLElement>(null);
  useDiscussAnimation(ref);
  const [industry, setIndustry] = useState<string>(data.key);
  const [service, setService] = useState<ServiceKey>(data.preselect);
  const q = t.quote;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="discuss-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.left} data-header>
          <Eyebrow tone="dark">{q.eyebrow}</Eyebrow>
          <h2 className={styles.title} data-title>
            <RichText text={q.title} accentClass={styles.accent} />
          </h2>
          <ul className={styles.options}>
            {q.options.map((o, i) => {
              const to = OPTION_LINKS[i];
              const inner = (
                <>
                  <span>
                    <strong>{o.title}</strong>
                    <small>{o.body}</small>
                  </span>
                  <span className={clsx(styles.optArrow, i === 0 && styles.optArrowActive)} aria-hidden="true">
                    <Icon name="arrow" size={12} />
                  </span>
                </>
              );
              return (
                <li key={o.title} data-option>
                  {to ? (
                    <AppLink to={to} className={styles.option}>{inner}</AppLink>
                  ) : (
                    <AppLink to="requestQuote" className={styles.option}>{inner}</AppLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.card} data-card>
          <h3 id="discuss-title" className={styles.cardTitle}>{c.formTitle}</h3>
          <p className={styles.cardBody}>{c.formBody}</p>
          <div className={styles.fields}>
            <label className={styles.field}>
              <span>{c.formIndustry}</span>
              <span className={styles.selectWrap}>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  {INDUSTRY_ORDER.map((i) => (
                    <option key={i.key} value={i.key}>{t.routes[i.key]}</option>
                  ))}
                </select>
              </span>
            </label>
            <label className={styles.field}>
              <span>{c.formService}</span>
              <span className={styles.selectWrap}>
                <select value={service} onChange={(e) => setService(e.target.value as ServiceKey)}>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{t.routes[s]}</option>
                  ))}
                </select>
              </span>
            </label>
          </div>
          <Button to="requestQuote" query={{ industry, service }} chip="yellow" size="sm">{c.formCta}</Button>
          <p className={styles.note}>{fill(c.formNote, { service: t.routes[service] })}</p>
        </div>
      </div>
    </section>
  );
}
