"use client";

import { useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projectsData } from "./projects.data";
import { useProjectsAnimation } from "./useProjectsAnimation";
import styles from "./projects.module.scss";

/** Scroll-snap carousel; arrows + progress line drive native scrolling. */
export function Projects({ t, common }: { t: Messages["projects"]; common: Messages["common"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollBy } = useProjectsAnimation(ref);

  return (
    <section ref={ref} id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader id="projects-title" tone="light" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      </div>

      <div className={styles.viewport}>
        <ul className={styles.track} data-track tabIndex={0} aria-label={t.eyebrow}>
          {t.items.map((p, i) => (
            <li key={p.title} className={styles.card} data-card>
              <AppLink to={projectsData.items[i].to} className={styles.cardLink}>
                <span className={styles.tag}>{p.tag}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.body}>{p.body}</p>
                <span className={styles.stat}>
                  <span className={styles.statValue}>{p.stat}</span>
                  <span className={styles.statLabel}>{p.statLabel}</span>
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={`container ${styles.controls}`}>
        <div className={styles.arrows}>
          <button onClick={() => scrollBy(-1)} aria-label={common.previous}>
            <Icon name="arrow" size={11} flow="back" />
          </button>
          <button onClick={() => scrollBy(1)} aria-label={common.next}>
            <Icon name="arrow" size={11} />
          </button>
        </div>
        <span className={styles.line} aria-hidden="true">
          <span data-progress />
        </span>
        <Button to={projectsData.cta} tone="yellow" chip="dark" size="sm">
          {t.cta}
        </Button>
      </div>
    </section>
  );
}
