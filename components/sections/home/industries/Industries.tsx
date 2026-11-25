"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { industriesData } from "./industries.data";
import { useIndustriesAnimation } from "./useIndustriesAnimation";
import styles from "./industries.module.scss";

/** Expanding panels: one open card, the rest collapse to vertical labels. */
export function Industries({ t }: { t: Messages["industries"] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useIndustriesAnimation(ref, active);

  return (
    <section ref={ref} id="industries" className={styles.section} aria-labelledby="industries-title">
      <div className="container">
        <SectionHeader id="industries-title" tone="light" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        <ul className={styles.panels}>
          {t.items.map((it, i) => {
            const d = industriesData[i];
            const open = i === active;
            return (
              <li
                key={d.id}
                className={clsx(styles.panel, open && styles.open)}
                data-panel
                onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
              >
                <button
                  className={styles.trigger}
                  aria-expanded={open}
                  aria-controls={`ind-${d.id}`}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="visually-hidden">{it.title}</span>
                </button>
                <Image src={d.image} alt="" fill sizes="(min-width: 992px) 440px, 100vw" className={styles.image} />
                <span className={styles.shade} />
                <span className={styles.vertical} aria-hidden="true">{it.title}</span>
                <div className={styles.body} id={`ind-${d.id}`} data-body={open || undefined}>
                  <div className={styles.bodyTop}>
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    <AppLink to={d.to} className={styles.arrow} aria-label={it.title} tabIndex={open ? 0 : -1}>
                      <Icon name="arrow" size={13} />
                    </AppLink>
                  </div>
                  <div className={styles.bodyCopy}>
                    <h3 className={styles.title}><AppLink to={d.to} tabIndex={open ? 0 : -1}>{it.title}</AppLink></h3>
                    <p className={styles.text}>{it.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
