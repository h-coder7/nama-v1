import Image from "next/image";
import clsx from "clsx";
import styles from "./diagonal-duo.module.scss";

type Side = { src: string; position?: string };

/**
 * Two photos meeting on the brand diagonal, divided by a crisp vector seam drawn
 * as a fine yellow line with the Namma "N" badge sitting on it. The seam runs
 * from `top`% (top edge) to `bottom`% (bottom edge). Animate `[data-duo-left]`,
 * `[data-duo-right]`, `[data-duo-bars]` and `[data-duo-badge]`.
 */
export function DiagonalDuo({ left, right, top = 58, bottom = 42, sizes, priority, className }: {
  left: Side; right: Side; top?: number; bottom?: number; sizes: string; priority?: boolean; className?: string;
}) {
  const t = top, b = bottom;
  const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <div className={clsx(styles.duo, className)} aria-hidden="true">
      <div className={styles.half} style={{ clipPath: `polygon(0 0, ${t + 1}% 0, ${b + 1}% 100%, 0 100%)` }} data-duo-left>
        <Image src={left.src} alt="" fill sizes={sizes} priority={priority} style={{ objectPosition: left.position ?? "50% 50%" }} />
      </div>
      <div className={styles.half} style={{ clipPath: `polygon(${t - 1}% 0, 100% 0, 100% 100%, ${b - 1}% 100%)` }} data-duo-right>
        <Image src={right.src} alt="" fill sizes={sizes} priority={priority} style={{ objectPosition: right.position ?? "50% 50%" }} />
      </div>
      <svg className={styles.bars} viewBox="0 0 100 100" preserveAspectRatio="none" data-duo-bars>
        <polygon className={styles.bar} points={poly([[t - 0.18, 0], [t + 0.18, 0], [b + 0.18, 100], [b - 0.18, 100]])} />
      </svg>
      {/* The Namma "N" sits on the seam: the brand mark is the hinge between the two modes. */}
      <span className={styles.badge} style={{ left: `${(t + b) / 2}%` }} data-duo-badge>
        <svg viewBox="-6 -6 237 139" aria-hidden="true">
          <path d="M225 3H182L141 42L140 3L96 4L0 96V127H49L95 84L97 127H137L225 42Z" />
        </svg>
      </span>
    </div>
  );
}
