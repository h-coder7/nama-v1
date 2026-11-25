import clsx from "clsx";
import styles from "./eyebrow.module.scss";

/** Pill label with the Namma mark — used above every section title. */
export function Eyebrow({ children, tone = "dark", className }: { children: string; tone?: "dark" | "light" | "yellow"; className?: string }) {
  return (
    <span className={clsx(styles.eyebrow, styles[tone], className)} data-eyebrow>
      <span className={styles.mark} aria-hidden="true" />
      {children}
    </span>
  );
}
