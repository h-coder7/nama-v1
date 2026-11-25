"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { fill } from "@/lib/format";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { CATEGORY_ORDER, PROJECT_ROWS, byVolume, type ProjectCategory } from "../projects.data";
import { siteOf, volOf } from "../projects.copy";
import styles from "./projects-list.module.scss";

const PAGE = 10;
type Filter = ProjectCategory | "all";
type Sort = "volume" | "az";

/**
 * The completed projects list: filter chips by project type, sort by volume or
 * name, and "Show 10 more". Chip counts come from the data, so they stay right
 * as the client's full list is added to projects.data.ts.
 */
export function ProjectsList({ t, tone = "paper" }: { t: Messages; tone?: "paper" | "white" }) {
  const ref = useRef<HTMLElement>(null);
  const body = useRef<HTMLTableSectionElement>(null);
  const p = t.projectsPage;
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("volume");
  const [shown, setShown] = useState(PAGE);
  const changed = useRef<"filter" | "more" | null>(null);
  const prevShown = useRef(PAGE);

  useAutoReveal(ref);

  const counts = useMemo(() => {
    const c = new Map<ProjectCategory, number>();
    PROJECT_ROWS.forEach((r) => c.set(r.category, (c.get(r.category) ?? 0) + 1));
    return c;
  }, []);
  const chips: [Filter, number][] = [["all", PROJECT_ROWS.length], ...CATEGORY_ORDER.filter((c) => counts.get(c)).map((c) => [c, counts.get(c)!] as [Filter, number])];

  const rows = useMemo(() => {
    const list = filter === "all" ? [...PROJECT_ROWS] : PROJECT_ROWS.filter((r) => r.category === filter);
    return list.sort(sort === "volume" ? byVolume : (a, b) => a.name.localeCompare(b.name));
  }, [filter, sort]);
  const visible = rows.slice(0, shown);

  // New rows fade up — all of them after a filter / sort change, only the added ones after "Show more".
  useEffect(() => {
    const kind = changed.current;
    changed.current = null;
    const tb = body.current;
    if (!kind || !tb || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const trs = Array.from(tb.children).slice(kind === "more" ? prevShown.current : 0);
    gsap.fromTo(trs, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE.soft, stagger: 0.035, clearProps: "transform,opacity,visibility" });
  }, [filter, sort, shown]);

  const pick = (f: Filter) => {
    if (f === filter) return;
    changed.current = "filter";
    setFilter(f);
    setShown(PAGE);
  };
  const order = (s: Sort) => {
    if (s === sort) return;
    changed.current = "filter";
    setSort(s);
  };
  const more = () => {
    changed.current = "more";
    prevShown.current = shown;
    setShown((n) => n + PAGE);
  };
  const label = (f: Filter) => (f === "all" ? p.all : p.categories[f]);

  return (
    <section ref={ref} id="all-projects" className={clsx(styles.section, styles[tone])} aria-labelledby="list-title">
      <div className="container">
        <SectionHeader eyebrow={p.listEyebrow} title={p.listTitle} intro={p.listIntro} id="list-title" />

        <div className={styles.controls} data-rise>
          <div className={styles.chips} role="group" aria-label={p.listEyebrow}>
            {chips.map(([f, n]) => (
              <button key={f} type="button" className={clsx(styles.chip, f === filter && styles.chipOn)} aria-pressed={f === filter} onClick={() => pick(f)}>
                {label(f)} <span>{n}</span>
              </button>
            ))}
          </div>
          <div className={styles.sort} role="group" aria-label={p.sort}>
            <span>{p.sort}</span>
            {(["volume", "az"] as const).map((s) => (
              <button key={s} type="button" className={clsx(styles.sortBtn, s === sort && styles.sortOn)} aria-pressed={s === sort} onClick={() => order(s)}>
                {s === "volume" ? p.sortVolume : p.sortAz}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrap} data-rise="0.1">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{p.colProject}</th>
                <th scope="col">{p.colSite}</th>
                <th scope="col">{p.colServices}</th>
                <th scope="col" className={styles.num}>{p.colVolume}</th>
              </tr>
            </thead>
            <tbody ref={body} aria-live="polite">
              {visible.map((r) => (
                <tr key={r.id} className={r.page ? styles.linked : undefined}>
                  <td className={styles.name}>
                    {r.page ? (
                      <AppLink to={r.page} className={styles.nameLink}>
                        <strong dir="ltr">{r.name}</strong>
                        <Icon name="arrow" size={11} />
                      </AppLink>
                    ) : (
                      <strong dir="ltr">{r.name}</strong>
                    )}
                    <small>{p.categories[r.category]} · <span dir="ltr">{r.year}</span></small>
                  </td>
                  <td data-label={p.colSite}>{siteOf(p, r)}</td>
                  <td data-label={p.colServices} className={styles.services}>{p.serviceLabels[r.services]}</td>
                  <td data-label={p.colVolume} className={styles.num}><b>{volOf(p, r)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.foot}>
            <p>{fill(p.showing, { n: visible.length, total: rows.length })}</p>
            {shown < rows.length && (
              <button type="button" className={styles.more} onClick={more}>
                {fill(p.showMore, { n: Math.min(PAGE, rows.length - shown) })}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
