"use client";

import clsx from "clsx";
import Image from "next/image";
import type { Messages } from "@/lib/i18n";
import { networkData } from "./network.data";
import styles from "./network.module.scss";

type Props = {
  t: Messages["network"];
  active: string;
  hold: (code?: string) => void;
  release: () => void;
  pick: (code: string) => void;
  /** Extra class on the map frame (size/position per page). */
  className?: string;
  /** "card" = framed card (home); "bleed" = edges melt into the section (inner page hero). */
  variant?: "card" | "bleed";
  sizes?: string;
  priority?: boolean;
};

/** Interactive map of the three Namma offices: pins, live routes and an office card. */
export function NetworkMap({ t, active, hold, release, pick, className, variant = "card", sizes = "(min-width: 992px) 600px, 100vw", priority }: Props) {
  const pin = networkData.pins.find((p) => p.code === active) ?? networkData.pins[0];
  const current = t.offices.find((o) => o.code === active) ?? t.offices[0];

  return (
    <div className={clsx(styles.map, variant === "bleed" && styles.mapBleed, className)} dir="ltr" onMouseLeave={release} data-map-frame>
      <span className={styles.shape} data-shape>
        <Image src={networkData.map} alt={t.mapAlt} fill sizes={sizes} priority={priority} className={styles.mapImage} />
      </span>
      <span className={styles.glow} style={{ left: `${pin.x}%`, top: `${pin.y}%` }} aria-hidden="true" />
      <svg className={styles.routes} viewBox={`0 0 100 ${100 * networkData.ratio}`} preserveAspectRatio="none" aria-hidden="true">
        {networkData.routes.map((r) => (
          <g key={r.id} className={clsx(styles.route, r.ends.includes(active as never) && styles.routeLive)}>
            <path d={r.d} className={styles.routeBase} />
            <path d={r.d} className={styles.routeFlow} pathLength={100} data-route />
          </g>
        ))}
      </svg>
      {networkData.pins.map((p) => {
        const o = t.offices.find((x) => x.code === p.code)!;
        const on = active === p.code;
        return (
          <button
            key={p.code}
            type="button"
            className={clsx(styles.pin, on && styles.pinActive, p.side === "start" && styles.pinStart)}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => hold(p.code)}
            onFocus={() => hold(p.code)}
            onBlur={release}
            onClick={() => pick(p.code)}
            aria-pressed={on}
            aria-label={`${o.city}, ${o.role}`}
            data-pin
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.tag} aria-hidden="true">
              <b>{o.code}</b>
              {o.city}
            </span>
          </button>
        );
      })}
      <div className={styles.card} key={current.code} aria-live="polite" data-card>
        <span className={styles.cardCode}>{current.code}</span>
        <span className={styles.cardText}>
          <strong>{current.city}</strong>
          <small>{current.role}</small>
        </span>
        <a className={styles.cardCall} href={`tel:${current.phone.replace(/[^+\d]/g, "")}`} dir="ltr">
          {current.phone}
        </a>
      </div>
    </div>
  );
}
