"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import type { Messages } from "@/lib/i18n";
import { ROUTES, localePath } from "@/lib/routes";
import { previewHref } from "@/components/ui/AppLink";
import { useLocale } from "@/providers/LocaleProvider";
import styles from "./hero-track.module.scss";

const MPA = process.env.NEXT_PUBLIC_PREVIEW_MPA === "1";

/**
 * Hero "Track Shipment" — a glass button that opens, on hover or focus (tap on touch),
 * into a see-through tracking-number field over the film. Submitting goes to the Track
 * page with ?ref= so the lookup runs there; an empty field just opens the Track page.
 */
export function HeroTrack({ t }: { t: Messages["hero"] }) {
  const locale = useLocale();
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const show = () => setOpen(true);
  const hide = () => {
    // Stay open while the field has text or focus.
    if (value.trim() || document.activeElement === input.current) return;
    setOpen(false);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const ref = value.trim();
    const url = localePath(locale, ROUTES.trackShipment.path) + (ref ? `?ref=${encodeURIComponent(ref)}` : "");
    if (MPA) window.location.href = previewHref(url);
    else router.push(url);
  };

  return (
    <div
      className={clsx(styles.wrap, open && styles.open)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) hide(); }}
      onKeyDown={(e) => { if (e.key === "Escape") { setValue(""); setOpen(false); (e.currentTarget.querySelector("button") as HTMLButtonElement)?.focus(); } }}
    >
      <button
        type="button"
        className={styles.btn}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => { setOpen(true); requestAnimationFrame(() => input.current?.focus()); }}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          {/* parcel with a location target: "where is my shipment" */}
          <path d="M3.5 8.2 11 4.4l7.5 3.8v4.3" />
          <path d="M3.5 8.2v7.6l7.5 3.8 2.2-1.1M3.5 8.2 11 12l7.5-3.8M11 12v7.6" />
          <circle cx="18" cy="17.2" r="3" />
          <path d="M18 12.8v1.4M18 20.2v1.4M13.6 17.2H15M21 17.2h1.4" />
        </svg>
        <span>{t.trackCta}</span>
      </button>
      <form id={id} className={styles.form} onSubmit={submit} role="search" aria-hidden={!open}>
        <label htmlFor={`${id}-ref`} className={styles.sr}>{t.trackLabel}</label>
        <input
          ref={input}
          id={`${id}-ref`}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.trackPlaceholder}
          autoComplete="off"
          spellCheck={false}
          dir="ltr"
          tabIndex={open ? 0 : -1}
        />
        <button type="submit" className={styles.go} aria-label={t.trackSubmit} tabIndex={open ? 0 : -1}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></svg>
        </button>
      </form>
    </div>
  );
}
