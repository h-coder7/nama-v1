import clsx from "clsx";
import { Eyebrow } from "./Eyebrow";
import { RichText } from "./RichText";
import styles from "./section-header.module.scss";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "dark" | "light" | "yellow";
  id?: string;
  className?: string;
};

/** Eyebrow + uppercase title on the left, intro copy on the right. */
export function SectionHeader({ eyebrow, title, intro, tone = "light", id, className }: Props) {
  return (
    <div className={clsx(styles.header, styles[tone], className)} data-header>
      <div className={styles.lead}>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2 id={id} className={styles.title} data-title>
          <RichText text={title} accentClass={styles.accent} mutedClass={styles.muted} />
        </h2>
      </div>
      {intro && (
        <p className={styles.intro} data-intro>
          {intro}
        </p>
      )}
    </div>
  );
}
