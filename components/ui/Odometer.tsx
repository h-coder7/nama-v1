import styles from "./odometer.module.scss";

/**
 * Rolling-digit figure. Each digit is a strip of two 0–9 cycles; the reveal rolls it
 * from 0 through a full turn to its digit (animate `[data-odo]` with `rollOdometers`).
 * Without motion the strips rest on their final digits (inline transform).
 */
export function Odometer({ value, className }: { value: string; className?: string }) {
  return (
    <span className={`${styles.odo} ${className ?? ""}`} aria-label={value} role="text">
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className={styles.digit} aria-hidden="true">
            <span className={styles.strip} data-odo={ch} style={{ transform: `translateY(${-((10 + Number(ch)) / 20) * 100}%)` }}>
              {Array.from({ length: 20 }, (_, k) => (
                <span key={k}>{k % 10}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">{ch}</span>
        ),
      )}
    </span>
  );
}
