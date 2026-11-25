"use client";

import Image from "next/image";
import { fill } from "@/lib/format";
import { SolutionHero } from "@/components/sections/solutions/shared/SolutionHero";
import { PROJECT_PAGES } from "../projects.data";
import type { DetailProps } from "./ProjectDetail";
import styles from "./project-detail.module.scss";

/** Full-bleed project photo with the record line, title and the two CTAs. */
export function ProjectHero({ t, k }: DetailProps) {
  const p = t.projectsPage;
  const d = p.detail;
  const page = PROJECT_PAGES[k];
  const copy = p.projects[k];
  return (
    <SolutionHero
      t={t}
      route={k}
      eyebrow={fill(page.eyebrow === "milestone" ? d.milestone : d.recorded, { year: page.year })}
      title={copy.title}
      body={copy.body}
      layout="bleed"
      className={styles.hero}
      primary={{ label: d.discussSimilar, to: "requestQuote", query: { service: "projectLogistics" } }}
      secondary={{ label: d.viewProjects, to: "projects" }}
      visual={
        <div className={styles.heroMedia}>
          <Image src={page.heroImage} alt="" fill priority sizes="100vw" data-hero-photo />
          <span className={styles.heroShade} />
        </div>
      }
      intro={(tl, q) => {
        tl.from(q("[data-hero-photo]"), { scale: 1.14, duration: 2.6, ease: "power2.out" }, 0);
      }}
    />
  );
}
