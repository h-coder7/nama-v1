"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef } from "react";
import type { Messages } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { featuredData } from "./featured-project.data";
import { useFeaturedProjectAnimation } from "./useFeaturedProjectAnimation";
import styles from "./featured-project.module.scss";

export function FeaturedProject({ t, units }: { t: Messages["featured"]; units: Messages["units"] }) {
  const ref = useRef<HTMLElement>(null);
  useFeaturedProjectAnimation(ref);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="featured-title">
      <div className={styles.stage} data-stage>
        <div className={styles.media}>
          <Image src={featuredData.image} alt="" fill sizes="100vw" className={styles.image} data-image />
          <div className={styles.shade} />
        </div>
        <div className={clsx("container", styles.content)} data-header>
          <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
          <h2 id="featured-title" className={styles.title} data-title>
            <RichText text={t.title} />
          </h2>
          <p className={styles.body} data-intro>{t.body}</p>
          <div className={styles.stat} data-intro>
            <p className={styles.statValue}>
              <span data-count={featuredData.stat.value}>{featuredData.stat.value}</span>
              <span className={styles.statUnit}>{units.frt}</span>
            </p>
            <p className={styles.statCaption}>{t.statCaption}</p>
          </div>
          <div data-intro>
            <Button to={featuredData.to} size="sm">{t.cta}</Button>
          </div>
        </div>
      </div>

    </section>
  );
}
