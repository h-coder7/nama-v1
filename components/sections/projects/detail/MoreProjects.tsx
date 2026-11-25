"use client";

import { useRef } from "react";
import { fill } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { PROJECT_PAGES, clientRows, rowById } from "../projects.data";
import { clientName, volOf } from "../projects.copy";
import type { DetailProps } from "./ProjectDetail";
import styles from "./project-detail.module.scss";

/** "More projects with <client>" — up to three cards from the same client's record. */
export function MoreProjects({ t, k }: DetailProps) {
  const ref = useRef<HTMLElement>(null);
  const p = t.projectsPage;
  const d = p.detail;
  const row = rowById(PROJECT_PAGES[k].row);
  const others = clientRows(row.client, row.id);
  const client = clientName(p, row.client);
  useAutoReveal(ref);
  if (!others.length) return null;

  return (
    <section ref={ref} className={styles.more} aria-labelledby="more-title">
      <div className="container">
        <div className={styles.moreHead} data-header>
          <h2 id="more-title" className={styles.moreTitle} data-title>
            <RichText text={fill(d.moreProjectsWith, { client })} />
          </h2>
          <div data-intro>
            <Button to="allProjects" ghost size="sm">{fill(d.seeAllWith, { n: others.length + 1, client })}</Button>
          </div>
        </div>
        <ul className={styles.moreCards} data-stagger="28">
          {others.slice(0, 3).map((r) => (
            <li key={r.id}>
              <AppLink to={r.page ?? "allProjects"} className={styles.moreCard}>
                <span className={styles.moreName} dir="ltr">{r.name}</span>
                <span className={styles.moreFoot}>
                  <b>{volOf(p, r)}</b>
                  <span className={styles.moreArrow} aria-hidden="true"><Icon name="arrow" size={11} /></span>
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
