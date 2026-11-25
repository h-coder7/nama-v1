"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import type { Messages } from "@/lib/i18n";
import { getJob } from "@/lib/jobs";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { fill, pad2 } from "@/lib/format";
import { useLenis } from "@/providers/LenisProvider";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FORM_ENDPOINTS, isEmail, isPhone, wait } from "../shared/forms";
import styles from "./job-modal.module.scss";

type View = "details" | "apply" | "validated";
type Field = "name" | "email" | "phone" | "city" | "cv" | "consent";
type JobCopy = { title: string; about?: string; responsibilities?: string[]; qualifications?: string[] };

const MAX_MB = 5;
const OK_EXT = /\.(pdf|docx?|DOCX?|PDF)$/;

/**
 * Role details as a dialog over the Careers page, with the application form,
 * the "details validated" confirmation (front-end prototype: nothing is sent) and
 * a discard prompt when closing a form that has been started.
 */
export function JobModal({ t, slug, onClose }: { t: Messages; slug: string | null; onClose: () => void }) {
  const c = t.careersPage;
  const m = c.modal;
  const f = t.forms;
  const job = slug ? getJob(slug) : undefined;
  const copy = slug ? (c.jobs as Record<string, JobCopy>)[slug] : undefined;
  const lenis = useLenis();

  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("details");
  const [confirm, setConfirm] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", phone: "", city: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [summary, setSummary] = useState(0);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const dirty = view === "apply" && (Object.values(values).some((v) => v.trim()) || !!file || consent);

  const reset = useCallback(() => {
    setView("details");
    setValues({ name: "", email: "", phone: "", city: "", message: "" });
    setFile(null);
    setConsent(false);
    setErrors({});
    setSummary(0);
    setConfirm(false);
  }, []);

  /* open / close ------------------------------------------------------------- */
  useEffect(() => {
    if (slug) {
      lastFocus.current = document.activeElement as HTMLElement;
      setMounted(true);
      reset();
    }
  }, [slug, reset]);

  useEffect(() => {
    if (!mounted || !slug) return;
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(root.current);
    if (!reduce) {
      gsap.fromTo(q("[data-overlay]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(panel.current, { y: 50, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: EASE.out });
      gsap.fromTo(q("[data-n]"), { xPercent: 30, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.1, ease: EASE.out, delay: 0.15 });
      gsap.fromTo(q("[data-head-fade]"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07, ease: EASE.soft, delay: 0.2 });
    }
    panel.current?.focus();
    return () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [mounted, slug, lenis]);

  const finishClose = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(root.current);
    const done = () => {
      setMounted(false);
      onClose();
      lastFocus.current?.focus?.();
    };
    if (reduce || !panel.current) return done();
    gsap.to(panel.current, { y: 30, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(q("[data-overlay]"), { autoAlpha: 0, duration: 0.3, delay: 0.05, onComplete: done });
  }, [onClose]);

  const requestClose = useCallback(() => {
    if (dirty) setConfirm(true);
    else finishClose();
  }, [dirty, finishClose]);

  // Escape closes (through the discard prompt if needed); Tab stays inside the dialog.
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (confirm) setConfirm(false);
        else requestClose();
      }
      if (e.key === "Tab" && root.current) {
        const scope = (confirm ? root.current.querySelector("[data-confirm]") : panel.current) as HTMLElement | null;
        const items = scope ? Array.from(scope.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, textarea, select, [tabindex='0']")) : [];
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, confirm, requestClose]);

  useEffect(() => {
    if (confirm) (root.current?.querySelector("[data-confirm] button") as HTMLElement | null)?.focus();
  }, [confirm]);

  /* view changes ------------------------------------------------------------- */
  const show = (v: View) => {
    setView(v);
    body.current?.scrollTo({ top: 0 });
  };
  useEffect(() => {
    if (!mounted || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !body.current) return;
    gsap.fromTo(body.current.querySelectorAll("[data-view-in]"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: EASE.soft });
  }, [view, mounted]);

  /* form --------------------------------------------------------------------- */
  const set = (k: keyof typeof values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k in errors) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const takeFile = (fl?: File | null) => {
    if (!fl) return;
    setFile(fl);
    setErrors((er) => ({ ...er, cv: !OK_EXT.test(fl.name) ? f.errFileType : fl.size > MAX_MB * 1024 * 1024 ? f.errFileSize : undefined }));
  };
  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) e.name = f.errName;
    if (!isEmail(values.email)) e.email = f.errEmail;
    if (!isPhone(values.phone)) e.phone = f.errPhone;
    if (!values.city.trim()) e.city = f.errCity;
    if (!file) e.cv = f.errFile;
    else if (!OK_EXT.test(file.name)) e.cv = f.errFileType;
    else if (file.size > MAX_MB * 1024 * 1024) e.cv = f.errFileSize;
    if (!consent) e.consent = f.errConsent;
    return e;
  };
  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const n = Object.keys(e).length;
    setSummary(n);
    if (n) {
      body.current?.scrollTo({ top: 0, behavior: "smooth" });
      const first = Object.keys(e)[0];
      window.setTimeout(() => (root.current?.querySelector(`[data-field="${first}"]`) as HTMLElement | null)?.focus(), 250);
      return;
    }
    setBusy(true);
    try {
      if (FORM_ENDPOINTS.careers) {
        const data = new FormData();
        Object.entries(values).forEach(([k, v]) => data.append(k, v));
        data.append("position", copy?.title ?? "");
        if (file) data.append("cv", file);
        await fetch(FORM_ENDPOINTS.careers, { method: "POST", body: data });
      } else await wait(600);
      show("validated");
    } finally {
      setBusy(false);
    }
  };

  if (!mounted || !job || !copy) return null;

  const a11y = (k: Field) => ({ "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `job-${k}-err` : undefined, "data-field": k });
  const err = (k: Field) => (errors[k] ? <span id={`job-${k}-err`} className={styles.error}>{errors[k]}</span> : null);
  const kb = file ? Math.max(1, Math.round(file.size / 1024)) : 0;

  const section = (n: number, title: string, content?: string | string[]) => (
    <section className={styles.block} data-view-in>
      <h3><span>{pad2(n)} /</span>{title}</h3>
      {!content || (Array.isArray(content) && !content.length) ? (
        <div className={styles.pending}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <span><strong>{m.pendingTitle}</strong>{m.pendingBody}</span>
        </div>
      ) : Array.isArray(content) ? (
        <ul className={styles.bullets}>{content.map((x) => <li key={x}>{x}</li>)}</ul>
      ) : (
        <p className={styles.para}>{content}</p>
      )}
    </section>
  );

  return (
    <div ref={root} className={styles.root}>
      <div className={styles.overlay} data-overlay onClick={requestClose} aria-hidden="true" />
      <div ref={panel} className={clsx(styles.panel, confirm && styles.dimmed)} role="dialog" aria-modal="true" aria-labelledby="job-title" tabIndex={-1}>
        <header className={styles.head}>
          <span className={styles.headArt} data-n aria-hidden="true" />
          <p className={styles.crumb} data-head-fade>
            <span className={styles.mark} aria-hidden="true" />
            {m.opportunity} <i>/</i> {m.company}
          </p>
          <h2 id="job-title" className={styles.title} data-head-fade>{copy.title}</h2>
          <ul className={styles.tags} data-head-fade>
            <li>{c.departments[job.department]}</li>
            <li>{c.cities[job.city]}</li>
            <li>{c.types[job.type]}</li>
          </ul>
          <button type="button" className={styles.close} onClick={requestClose} aria-label={m.close}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </header>

        <div ref={body} className={styles.body} data-lenis-prevent>
          {view === "details" && (
            <>
              {section(1, m.about, copy.about)}
              {section(2, m.responsibilities, copy.responsibilities)}
              {section(3, m.qualifications, copy.qualifications)}
            </>
          )}

          {view === "apply" && (
            <form id="job-apply" className={styles.form} onSubmit={submit} noValidate>
              <div className={styles.formHead} data-view-in>
                <h3>{m.applyTitle}</h3>
                <p>{m.applyIntro}</p>
                <span>{f.requiredMark}</span>
              </div>
              {summary > 0 && (
                <p className={styles.summary} role="alert" data-view-in>
                  {summary === 1 ? f.errSummaryOne : fill(f.errSummary, { n: summary })}
                </p>
              )}
              <div className={styles.grid} data-view-in>
                <label className={styles.field}>
                  <span>{m.fullName}<b>*</b></span>
                  <input value={values.name} onChange={set("name")} autoComplete="name" {...a11y("name")} />
                  {err("name")}
                </label>
                <label className={styles.field}>
                  <span>{m.email}<b>*</b></span>
                  <input type="email" value={values.email} onChange={set("email")} autoComplete="email" dir="ltr" {...a11y("email")} />
                  {err("email")}
                </label>
                <label className={styles.field}>
                  <span>{m.phone}<b>*</b></span>
                  <input type="tel" inputMode="tel" value={values.phone} onChange={set("phone")} placeholder={m.phonePlaceholder} autoComplete="tel" dir="ltr" {...a11y("phone")} />
                  <small className={styles.hint}>{f.phoneHint}</small>
                  {err("phone")}
                </label>
                <label className={styles.field}>
                  <span>{m.city}<b>*</b></span>
                  <input value={values.city} onChange={set("city")} autoComplete="address-level2" {...a11y("city")} />
                  {err("city")}
                </label>
                <label className={clsx(styles.field, styles.full)}>
                  <span>{m.position}</span>
                  <input value={copy.title} readOnly className={styles.readonly} />
                </label>
                <div className={clsx(styles.field, styles.full)}>
                  <span id="cv-label">{m.cv}<b>*</b></span>
                  {file ? (
                    <div className={clsx(styles.file, errors.cv && styles.fileBad)}>
                      <span className={styles.fileIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 3h7l4 4v14H7z M14 3v4h4 M12 17v-6 M9.5 13.5 12 11l2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                      </span>
                      <span className={styles.fileMeta}>
                        <strong dir="ltr">{file.name}</strong>
                        <small>{kb} KB · {errors.cv ? errors.cv : m.cvReady}</small>
                      </span>
                      <label className={styles.fileBtn}>
                        {m.replace}
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => takeFile(e.target.files?.[0])} className={styles.srOnly} />
                      </label>
                      <button type="button" className={styles.fileBtn} onClick={() => setFile(null)}>{m.remove}</button>
                    </div>
                  ) : (
                    <label
                      className={clsx(styles.drop, drag && styles.dropOn, errors.cv && styles.dropBad)}
                      onDragOver={(e: DragEvent) => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e: DragEvent) => { e.preventDefault(); setDrag(false); takeFile(e.dataTransfer.files?.[0]); }}
                    >
                      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => takeFile(e.target.files?.[0])} className={styles.srOnly} aria-labelledby="cv-label" {...a11y("cv")} />
                      <span className={styles.dropIcon} aria-hidden="true"><Icon name="download" size={18} style={{ rotate: "180deg" }} /></span>
                      <span><strong>{m.cvChoose}</strong> {m.cvDrop}</span>
                    </label>
                  )}
                  <small className={styles.hint}>{m.cvHint}</small>
                  {!file && err("cv")}
                </div>
                <label className={clsx(styles.field, styles.full)}>
                  <span>{m.message} <em>{f.optional}</em></span>
                  <textarea rows={4} maxLength={1000} value={values.message} onChange={set("message")} />
                  <small className={styles.counter}>{values.message.length} / 1000</small>
                </label>
                <div className={clsx(styles.full, styles.consentWrap)}>
                  <label className={styles.consent}>
                    <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErrors((er) => ({ ...er, consent: undefined })); }} {...a11y("consent")} />
                    <span>
                      {m.consentBefore} <AppLink to="privacyPolicy" target="_blank">{m.consentLink}</AppLink> {m.consentAfter}
                    </span>
                  </label>
                  {err("consent")}
                </div>
              </div>
            </form>
          )}

          {view === "validated" && (
            <div className={styles.done} role="status">
              <span className={styles.demo} data-view-in>{f.demoBadge}</span>
              <h3 data-view-in>{m.validatedTitle}</h3>
              <p data-view-in>{m.validatedBodyA} <strong>{m.validatedStrong}</strong> {m.validatedBodyB}</p>
              <dl className={styles.recap} data-view-in>
                <div><dt>{m.name}</dt><dd>{values.name}</dd></div>
                <div><dt>{m.positionShort}</dt><dd>{copy.title}</dd></div>
                <div><dt>{m.emailShort}</dt><dd dir="ltr">{values.email}</dd></div>
                <div><dt>{m.cvShort}</dt><dd dir="ltr">{file?.name}</dd></div>
              </dl>
            </div>
          )}
        </div>

        <footer className={styles.foot}>
          {view === "details" && (
            <>
              <div className={styles.ready}>
                <strong>{m.readyTitle}</strong>
                <span>{m.readyBody}</span>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.ghost} onClick={requestClose}>{m.back}</button>
                <Button tone="dark" chip="yellow" size="sm" onClick={() => show("apply")}>{m.apply}</Button>
              </div>
            </>
          )}
          {view === "apply" && (
            <div className={styles.actions}>
              <button type="button" className={styles.ghost} onClick={() => show("details")}>
                <Icon name="arrow" size={11} flow="back" /> {m.backToJob}
              </button>
              <Button type="submit" form="job-apply" tone="dark" chip="yellow" size="sm" disabled={busy} aria-busy={busy}>{busy ? t.common.sending : m.submit}</Button>
            </div>
          )}
          {view === "validated" && (
            <div className={styles.actions}>
              <button type="button" className={styles.ghost} onClick={() => show("apply")}>
                <Icon name="arrow" size={11} flow="back" /> {m.backToJob}
              </button>
              <Button tone="dark" chip="yellow" size="sm" onClick={finishClose}>{m.back}</Button>
            </div>
          )}
        </footer>
      </div>

      {confirm && (
        <div className={styles.confirm} role="alertdialog" aria-modal="true" aria-labelledby="discard-title" aria-describedby="discard-body" data-confirm>
          <h3 id="discard-title">{m.discardTitle}</h3>
          <p id="discard-body">{m.discardBody}</p>
          <div className={styles.confirmActions}>
            <Button tone="dark" chip="yellow" size="sm" onClick={() => setConfirm(false)}>{m.keepEditing}</Button>
            <button type="button" className={styles.discard} onClick={() => { setConfirm(false); finishClose(); }}>{m.discard}</button>
          </div>
        </div>
      )}
    </div>
  );
}
