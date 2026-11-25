"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Messages } from "@/lib/i18n";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { quoteData } from "./quote.data";
import { useQuoteAnimation } from "./useQuoteAnimation";
import styles from "./quote.module.scss";

type Field = "service" | "origin" | "destination" | "cargo" | "type" | "office" | "subject" | "message" | "name" | "company" | "email" | "phone";
const REQUIRED: Record<"quote" | "contact", Field[]> = {
  quote: ["service", "origin", "destination", "name", "email", "phone"],
  contact: ["type", "name", "email", "message"],
};
/** ?service= values from other pages that map onto another option. */
const ALIASES: Record<string, string> = {};

type Props = {
  t: Messages["quote"];
  /** "quote" (default): service · origin · destination · cargo. "contact": enquiry type · office · subject · message. */
  mode?: "quote" | "contact";
  /** Page-specific heading on the left (defaults to "Start with what you need"). */
  title?: string;
  eyebrow?: string;
  /** Service preselected in the form (key from quote.serviceOptions). */
  service?: string;
  /** Also preselect from ?service= in the URL (Request a Quote page). */
  readQuery?: boolean;
  id?: string;
  /** "yellow": yellow band with the form on a dark card (Home, Nov 2026 amendments). */
  tone?: "dark" | "yellow";
};

/**
 * The one form used across the site (Home closing card): the same card and fixed fields
 * (name · company · email · phone) everywhere, with the quote or contact fields on top.
 */
export function Quote({ t, mode = "quote", title, eyebrow, service = "", readQuery, id, tone = "dark" }: Props) {
  const contact = mode === "contact";
  const [svc, setSvc] = useState(service);
  useEffect(() => {
    if (!readQuery) return;
    const q = new URLSearchParams(window.location.search).get("service") ?? "";
    const key = ALIASES[q] ?? q;
    if (t.serviceOptions.some((o) => o.key === key)) setSvc(key);
  }, [readQuery, t.serviceOptions]);
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  useQuoteAnimation(ref, sent);

  const validate = (data: FormData) => {
    const e: Partial<Record<Field, string>> = {};
    REQUIRED[mode].forEach((f) => {
      if (!String(data.get(f) ?? "").trim()) e[f] = t.errors.required;
    });
    const email = String(data.get("email") ?? "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t.errors.email;
    const phone = String(data.get("phone") ?? "").replace(/[\s()-]/g, "");
    if (phone && !/^\d{7,12}$/.test(phone)) e.phone = t.errors.phone;
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const e = validate(data);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      ev.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setBusy(true);
    try {
      if (quoteData.endpoint) await fetch(quoteData.endpoint, { method: "POST", body: data });
      else await new Promise((r) => setTimeout(r, 700)); // preview only
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  const err = (f: Field) =>
    errors[f] ? (
      <span id={`q-${f}-err`} className={styles.error} role="alert">
        {errors[f]}
      </span>
    ) : null;
  const a11y = (f: Field) => ({ "aria-invalid": !!errors[f] || undefined, "aria-describedby": errors[f] ? `q-${f}-err` : undefined });
  const clear = (f: Field) => errors[f] && setErrors((p) => ({ ...p, [f]: undefined }));

  return (
    <section ref={ref} id={id ?? (contact ? "contact-form" : "quote")} className={clsx(styles.section, tone === "yellow" && styles.yellow)} aria-labelledby={`${id ?? mode}-title`}>
      <div className={clsx("container", styles.grid)}>
        <div className={styles.left} data-header>
          <Eyebrow tone={tone === "yellow" ? "light" : "dark"}>{eyebrow ?? t.eyebrow}</Eyebrow>
          <h2 id={`${id ?? mode}-title`} className={styles.title} data-title>
            <RichText text={title ?? t.title} accentClass={styles.accent} />
          </h2>
          <ul className={styles.options}>
            {t.options.map((o, i) => {
              const base = quoteData.options[i];
              // On the contact form the first option leads to the quote page and "Contact our team" focuses this form.
              const d: (typeof quoteData.options)[number] = contact ? (base.action === "focus-form" ? { action: "link", to: "requestQuote" } : base.to === "contact" ? { action: "focus-form" } : base) : base;
              const content = (
                <>
                  <span>
                    <strong>{o.title}</strong>
                    <small>{o.body}</small>
                  </span>
                  <span className={clsx(styles.optArrow, i === 0 && styles.optArrowActive)} aria-hidden="true">
                    <Icon name="arrow" size={12} />
                  </span>
                </>
              );
              return (
                <li key={o.title} data-option>
                  {d.action === "link" ? (
                    <AppLink className={styles.option} to={d.to}>{content}</AppLink>
                  ) : (
                    <button className={styles.option} onClick={() => formRef.current?.querySelector<HTMLElement>("select")?.focus()}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.panel} data-panel>
          {sent ? (
            <div className={styles.success} data-success role="status">
              <span className={styles.successIcon}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <h3 className={styles.formTitle}>{contact ? t.contact.successTitle : t.successTitle}</h3>
              <p className={styles.formIntro}>{contact ? t.contact.successBody : t.successBody}</p>
              <Button tone="light" chip="yellow" onClick={() => setSent(false)}>{t.again}</Button>
            </div>
          ) : (
            <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
              <h3 className={styles.formTitle}>{contact ? t.contact.formTitle : t.formTitle}</h3>
              <p className={styles.formIntro}>{contact ? t.contact.formIntro : t.formIntro}</p>

              {contact ? (
                <>
                  <label className={styles.field} data-field>
                    <span>{t.contact.type}</span>
                    <span className={styles.selectWrap}>
                      <select name="type" defaultValue="" {...a11y("type")} onChange={() => clear("type")}>
                        <option value="" disabled>{t.contact.typePlaceholder}</option>
                        {t.contact.types.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </span>
                    {err("type")}
                  </label>
                  <label className={styles.field} data-field>
                    <span>{t.contact.office}</span>
                    <span className={styles.selectWrap}>
                      <select name="office" defaultValue="">
                        <option value="">{t.contact.officePlaceholder}</option>
                        {t.contact.offices.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </span>
                  </label>
                  <label className={clsx(styles.field, styles.full)} data-field>
                    <span>{t.contact.subject}</span>
                    <input name="subject" autoComplete="off" />
                  </label>
                  <label className={clsx(styles.field, styles.full)} data-field>
                    <span>{t.contact.message}</span>
                    <textarea name="message" rows={3} placeholder={t.contact.messagePlaceholder} className={styles.dashed} {...a11y("message")} onInput={() => clear("message")} />
                    {err("message")}
                  </label>
                </>
              ) : (
                <>
                  <label className={clsx(styles.field, styles.full)} data-field>
                    <span>{t.fields.service}</span>
                    <span className={styles.selectWrap}>
                      <select name="service" value={svc} {...a11y("service")} onChange={(e) => { setSvc(e.target.value); clear("service"); }}>
                        <option value="" disabled>{t.fields.servicePlaceholder}</option>
                        {t.serviceOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                      </select>
                    </span>
                    {err("service")}
                  </label>
                  <label className={styles.field} data-field>
                    <span>{t.fields.origin}</span>
                    <input name="origin" placeholder={t.fields.originPlaceholder} autoComplete="off" {...a11y("origin")} onInput={() => clear("origin")} />
                    {err("origin")}
                  </label>
                  <label className={styles.field} data-field>
                    <span>{t.fields.destination}</span>
                    <input name="destination" placeholder={t.fields.destinationPlaceholder} autoComplete="off" {...a11y("destination")} onInput={() => clear("destination")} />
                    {err("destination")}
                  </label>
                  <label className={clsx(styles.field, styles.full)} data-field>
                    <span>{t.fields.cargo}</span>
                    <textarea name="cargo" rows={3} placeholder={t.fields.cargoPlaceholder} className={styles.dashed} />
                  </label>
                </>
              )}
              <label className={styles.field} data-field>
                <span>{t.fields.name}</span>
                <input name="name" autoComplete="name" {...a11y("name")} onInput={() => clear("name")} />
                {err("name")}
              </label>
              <label className={styles.field} data-field>
                <span>{t.fields.company}</span>
                <input name="company" autoComplete="organization" />
              </label>
              <label className={styles.field} data-field>
                <span>{t.fields.email}</span>
                <input name="email" type="email" autoComplete="email" {...a11y("email")} onInput={() => clear("email")} />
                {err("email")}
              </label>
              <label className={styles.field} data-field>
                <span>{t.fields.phone}</span>
                <span className={styles.phoneWrap}>
                  <span className={styles.prefix}>+966</span>
                  <input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" {...a11y("phone")} onInput={() => clear("phone")} />
                </span>
                {err("phone")}
              </label>

              <div className={clsx(styles.full, styles.submitRow)} data-field>
                <Button type="submit" tone="light" chip="yellow" size="sm" disabled={busy} aria-busy={busy}>
                  {busy ? t.sending : contact ? t.contact.submit : t.submit}
                </Button>
                <small>{t.privacy}</small>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
