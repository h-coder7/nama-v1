"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import type { DetailProps } from "./ProjectDetail";
import styles from "./project-detail.module.scss";

/** Yellow band: "Have a similar project?" (the previous / next cards were removed at the client's request). */
export function ProjectNav({ t }: Pick<DetailProps, "t">) {
  const ref = useRef<HTMLElement>(null);
  const p = t.projectsPage;
  const d = p.detail;
  useAutoReveal(ref);

  return (
    <section ref={ref} className={styles.navBand} aria-labelledby="similar-title">
      <div className={`container ${styles.navInner}`}>
        <div className={styles.similar} data-rise>
          <h2 id="similar-title">{d.similar}</h2>
          <div className={styles.similarCtas}>
            <Button to="requestQuote" query={{ service: "projectLogistics" }} chip="dark" size="sm">{d.requestQuote}</Button>
            <Button to="allProjects" ghost size="sm">{d.allProjects}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
