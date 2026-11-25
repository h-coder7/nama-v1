"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fill, pad2 } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SectionProps } from "../types";
import { useRequirementsAnimation } from "./useRequirementsAnimation";
import styles from "./requirements.module.scss";

/** From this many requirements on, the columns become a sideways slider (three in view). */
const SLIDER_FROM = 4;

/** "What the sector asks of logistics" — numbered requirements, one active; a slider when there are many. */
export function Requirements({ t, c, copy, data, name }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const total = copy.requirements.length;
  const slider = total >= SLIDER_FROM;
  const [first, setFirst] = useState(0);
  const [inView, setInView] = useState(3);
  useRequirementsAnimation(ref, setActive, slider);

  // Slider: track which card leads the view (for the counter, arrows and the active card).
  useEffect(() => {
    const list = listRef.current;
    if (!slider || !list) return;
    const update = () => {
      const items = Array.from(list.children) as HTMLElement[];
      const box = list.getBoundingClientRect();
      const visible = items.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= box.left - 4 && r.right <= box.right + 4;
      });
      const lead = visible.length ? items.indexOf(visible[0]) : 0;
      setFirst(lead);
      setInView(Math.max(1, visible.length));
      setActive(lead);
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { list.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [slider]);

  const go = (step: number) => {
    const list = listRef.current;
    if (!list) return;
    const target = list.children[Math.min(total - 1, Math.max(0, first + step * inView))] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };
  const last = Math.min(total, first + inView);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="req-title">
      <div className="container">
        <SectionHeader id="req-title" tone="dark" eyebrow={c.requirementsEyebrow} title={c.requirementsTitle} intro={c.requirementsIntro} />

        <div className={styles.banner} data-banner>
          <Image src={data.requirementsImage} alt="" fill sizes="(min-width: 1248px) 1200px, 100vw" className={styles.bannerImage} data-banner-image />
          <span className={styles.bannerShine} aria-hidden="true" />
        </div>

        <ol ref={listRef} className={clsx(styles.list, slider && styles.slider)} data-slider={slider || undefined}>
          {copy.requirements.map((r, i) => (
            <li
              key={r.title}
              className={clsx(styles.item, i === active && styles.active)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
              data-req
            >
              <span className={styles.bar} aria-hidden="true"><span /></span>
              <span className={styles.num} aria-hidden="true">{pad2(i + 1)}</span>
              <span className={styles.label}>{fill(c.requirementLabel, { n: pad2(i + 1), total: pad2(total) })}</span>
              <h3 className={styles.title}>{r.title}</h3>
              <p className={styles.body}>{r.body}</p>
            </li>
          ))}
        </ol>

        <div className={styles.foot} data-foot>
          <Button to="requestQuote" query={{ industry: data.key, service: data.preselect }} chip="yellow" size="sm">
            {fill(c.discussCta, { industry: name })}
          </Button>
          {slider ? (
            <div className={styles.nav}>
              <span className={styles.count} aria-live="polite" dir="ltr">{pad2(first + 1)}–{pad2(last)} / {pad2(total)}</span>
              <button type="button" className={styles.navBtn} onClick={() => go(-1)} disabled={first === 0} aria-label={t.common.previous}>
                <Icon name="arrow" size={14} flow="back" />
              </button>
              <button type="button" className={styles.navBtn} onClick={() => go(1)} disabled={last >= total} aria-label={t.common.next}>
                <Icon name="arrow" size={14} />
              </button>
            </div>
          ) : (
            <span className={styles.count}>{fill(c.requirementsCount, { n: total, industry: name })}</span>
          )}
        </div>
      </div>
    </section>
  );
}
