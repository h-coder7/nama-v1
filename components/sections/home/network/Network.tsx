"use client";

import clsx from "clsx";
import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { networkData } from "./network.data";
import { NetworkMap } from "./NetworkMap";
import { useOfficeCycle } from "./useOfficeCycle";
import { useNetworkAnimation } from "./useNetworkAnimation";
import styles from "./network.module.scss";

function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={clsx(styles.copy, copied && styles.copied)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked — value stays visible as text */
        }
      }}
      aria-label={`${label} ${value}`}
    >
      {copied ? done : label}
    </button>
  );
}

export function Network({ t, common }: { t: Messages["network"]; common: Messages["common"] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>(networkData.pins[0].code);
  useNetworkAnimation(ref);
  const { hold, release, pick } = useOfficeCycle(ref, setActive);

  return (
    <section ref={ref} id="network" className={styles.section} aria-labelledby="network-title">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left} data-header>
            <Eyebrow tone="dark">{t.eyebrow}</Eyebrow>
            <h2 id="network-title" className={styles.title} data-title>
              <RichText text={t.title} accentClass={styles.accent} />
            </h2>
            <p className={styles.body} data-intro>{t.body}</p>

            <div className={styles.table} role="table" aria-label={t.eyebrow} data-table>
              <div className={styles.thead} role="row">
                <span role="columnheader">{t.table.code}</span>
                <span role="columnheader">{t.table.office}</span>
                <span role="columnheader">{t.table.phone}</span>
              </div>
              {t.offices.map((o) => (
                <div
                  key={o.code}
                  role="row"
                  className={clsx(styles.tr, active === o.code && styles.trActive)}
                  onMouseEnter={() => hold(o.code)}
                  onMouseLeave={release}
                  onClick={() => pick(o.code)}
                  data-row
                >
                  <span role="cell" className={styles.code}>{o.code}</span>
                  <span role="cell" className={styles.city}>
                    {o.city}
                    <small>{o.role}</small>
                  </span>
                  <span role="cell" className={styles.phone}>
                    <span>
                      <a href={`tel:${o.phone.replace(/[^+\d]/g, "").replace("+9660", "+966")}`} dir="ltr">{o.phone}</a>
                      <CopyButton value={o.phone} label={common.copy} done={common.copied} />
                    </span>
                    {"email" in o && o.email && (
                      <span>
                        <a href={`mailto:${o.email}`} dir="ltr">{o.email}</a>
                        <CopyButton value={o.email} label={common.copy} done={common.copied} />
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mapCard} data-map>
            <NetworkMap t={t} active={active} hold={hold} release={release} pick={pick} />
            <dl className={styles.stats}>
              {t.stats.map((s, i) => (
                <div key={s.label} className={styles.stat} data-stat>
                  <dt>{s.label}</dt>
                  <dd>
                    <span className={clsx(styles.statValue, i === 2 && styles.statAccent)}>
                      {i === 2 ? s.value : <span data-count={s.value}>{s.value}</span>}
                      {"unit" in s && s.unit && <small> {s.unit}</small>}
                    </span>
                    <span className={styles.statCaption}>{s.caption}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={styles.agency} data-agency>
          <p className={styles.agencyLead}>
            <span className={styles.agencyMark} aria-hidden="true" />
            {t.agencyLead.replace(/\.$/, "")}
          </p>
          <p className={styles.agencyBody}>{t.agencyBody}</p>
        </div>
      </div>
    </section>
  );
}
