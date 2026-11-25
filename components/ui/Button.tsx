import clsx from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { RouteKey } from "@/lib/routes";
import { AppLink } from "./AppLink";
import { Icon } from "./Icon";
import styles from "./button.module.scss";

type Tone = "light" | "yellow" | "dark";

type CommonProps = {
  children: ReactNode;
  /** Colour of the label block. */
  tone?: Tone;
  /** Colour of the slanted arrow chip (defaults to the label tone). */
  chip?: Tone;
  /** Outlined button without chip. */
  ghost?: boolean;
  /** One piece: the arrow sits inside the label instead of a detached chip (same hover). */
  whole?: boolean;
  size?: "md" | "sm";
  className?: string;
};

type AsLink = CommonProps & ({ href: string; to?: undefined } | { to: RouteKey; href?: undefined }) & { hash?: string; query?: Record<string, string> } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type AsButton = CommonProps & { href?: undefined; to?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

/** Namma CTA: label block + detached slanted arrow chip (as in the Figma). */
export function Button(props: AsLink | AsButton) {
  const { children, tone = "light", chip, ghost = false, whole = false, size = "md", className, ...rest } = props;
  const cls = clsx(styles.btn, styles[size], ghost ? styles.ghost : [styles[`tone-${tone}`], styles[`chip-${chip ?? tone}`]], whole && styles.whole, className);
  const inner = whole ? (
    <span className={styles.label}>
      {children}
      <span className={styles.wholeArrow} aria-hidden="true"><Icon name="arrow" size={13} /></span>
    </span>
  ) : (
    <>
      <span className={styles.label}>{children}</span>
      {!ghost && (
        <span className={styles.chip} aria-hidden="true">
          <Icon name="arrow" size={13} />
        </span>
      )}
    </>
  );
  if (("href" in rest && typeof rest.href === "string") || ("to" in rest && rest.to)) {
    const a = rest as Omit<AsLink, keyof CommonProps>;
    return (
      <AppLink className={cls} {...a}>
        {inner}
      </AppLink>
    );
  }
  const b = rest as Omit<AsButton, keyof CommonProps>;
  return (
    <button type={b.type ?? "button"} className={cls} {...b}>
      {inner}
    </button>
  );
}
