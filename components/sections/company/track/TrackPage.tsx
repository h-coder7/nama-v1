"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Messages } from "@/lib/i18n";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { useAutoReveal } from "@/components/sections/solutions/shared/useAutoReveal";
import { PageHero } from "../shared/PageHero";
import { wait } from "../shared/forms";
import styles from "./track.module.scss";

type State = { kind: "idle" } | { kind: "loading"; ref: string } | { kind: "found"; ref: string } | { kind: "missing"; ref: string };

/** Sample reference that returns the demo timeline (no tracking service connected yet). */
const SAMPLE_REF = "NMC-0045821";
/** TODO: connect to Namma's tracking service. */
const TRACKING_ENDPOINT: string | null = null;

/** /track-shipment — Figma "Track Shipment". */
export function TrackPage({ t }: { t: Messages }) {
  const k = t.trackPage;
  const ref = useRef<HTMLElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  useAutoReveal(ref);

  // Prefill from ?ref= so other pages and emails can deep-link a shipment.
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("ref");
    if (r) {
      setValue(r);
      void track(r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const track = async (raw: string) => {
    const reference = raw.trim();
    if (!reference) {
      setError(k.errEmpty);
      input.current?.focus();
      return;
    }
    setError("");
    setState({ kind: "loading", ref: reference });
    if (TRACKING_ENDPOINT) {
      try {
        const res = await fetch(`${TRACKING_ENDPOINT}?ref=${encodeURIComponent(reference)}`);
        setState({ kind: res.ok ? "found" : "missing", ref: reference });
      } catch {
        setState({ kind: "missing", ref: reference });
      }
      return;
    }
    await wait(700);
    setState({ kind: reference.toUpperCase() === SAMPLE_REF ? "found" : "missing", ref: reference });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void track(value);
  };

  // Each result state eases in; the timeline line draws down through the events.
  useEffect(() => {
    const el = result.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(el);
    gsap.fromTo(q("[data-in]"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: EASE.soft });
    if (state.kind === "found") {
      gsap.fromTo(q("[data-rail-fill]"), { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "power2.inOut", delay: 0.2 });
      gsap.fromTo(q("[data-event]"), { x: () => (document.documentElement.dir === "rtl" ? 16 : -16), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.12, delay: 0.2, ease: EASE.soft });
    }
    if (state.kind === "idle") gsap.to(q("[data-box]"), { y: -6, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }, [state.kind]);

  const s = k.sample;
  const reached = 3; // events completed in the sample

  return (
    <>
      <PageHero t={t} route="trackShipment" eyebrow={k.eyebrow} title={k.title} aside={k.body} image="/assets/namma/images/company/track-hero.webp" focus="72% 50%" />
      <section ref={ref} className={styles.section} aria-labelledby="track-label">
        <div className="container">
          <div className={styles.frame} data-rise>
            <form className={styles.search} onSubmit={submit} noValidate role="search">
              <label id="track-label" htmlFor="track-ref">{k.label}</label>
              <div className={styles.row}>
                <input
                  ref={input}
                  id="track-ref"
                  value={value}
                  onChange={(e) => { setValue(e.target.value); if (error) setError(""); }}
                  placeholder={k.placeholder}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  dir="ltr"
                  aria-invalid={!!error || undefined}
                  aria-describedby={error ? "track-err track-hint" : "track-hint"}
                />
                <Button type="submit" tone="yellow" chip="light" size="sm" disabled={state.kind === "loading"} aria-busy={state.kind === "loading"}>
                  {state.kind === "loading" ? k.searching : k.submit}
                </Button>
              </div>
              {error && <p id="track-err" className={styles.error} role="alert">{error}</p>}
              <p id="track-hint" className={styles.hint}>{k.hint}</p>
            </form>

            <div ref={result} className={clsx(styles.result, state.kind === "found" && styles.resultFound)} aria-live="polite">
              {(state.kind === "idle" || state.kind === "loading") && (
                <div className={clsx(styles.empty, state.kind === "loading" && styles.loading)}>
                  <span className={styles.box} data-box data-in aria-hidden="true">
                    <svg viewBox="0 0 90 90" width="76" height="76">
                      <rect x="20.5" y="30.5" width="49" height="29" />
                      <path d="M20 40L33.3 30H70L56.7 40H20Z M56.7 40L70 30V50L56.7 60V40Z M20 40H56.7V60H20V40Z" />
                      {[24.6, 29.2, 33.8, 38.3, 42.9, 47.5, 52.1].map((x) => <path key={x} d={`M${x} 40V60`} className={styles.ribs} />)}
                    </svg>
                  </span>
                  <h2 data-in>{k.awaitingTitle}</h2>
                  <p data-in>{k.awaitingBody}</p>
                  {state.kind === "idle" && (
                    <button type="button" className={styles.sample} onClick={() => { setValue(SAMPLE_REF); void track(SAMPLE_REF); }} data-in>
                      {k.tryDemo}: <span dir="ltr">{SAMPLE_REF}</span>
                    </button>
                  )}
                </div>
              )}

              {state.kind === "missing" && (
                <div className={styles.empty}>
                  <span className={clsx(styles.box, styles.boxMissing)} data-in aria-hidden="true">?</span>
                  <h2 data-in>{k.notFoundTitle}</h2>
                  <p data-in>{k.notFoundBody.replace("{ref}", `“${state.ref}”`)}</p>
                </div>
              )}

              {state.kind === "found" && (
                <div className={styles.found}>
                  <header className={styles.foundHead} data-in>
                    <div>
                      <span className={styles.foundEyebrow}>{k.resultEyebrow}</span>
                      <strong dir="ltr">{state.ref.toUpperCase()}</strong>
                    </div>
                    <span className={styles.status}><i />{s.status}</span>
                  </header>
                  <dl className={styles.facts} data-in>
                    <div><dt>{k.route}</dt><dd>{s.from} <span aria-hidden="true">→</span> {s.to}</dd></div>
                    <div><dt>{k.mode}</dt><dd>{s.mode}</dd></div>
                    <div><dt>{k.lastUpdate}</dt><dd>{s.updated}</dd></div>
                  </dl>
                  <ol className={styles.events}>
                    <span className={styles.rail} aria-hidden="true"><span data-rail-fill style={{ height: `${(reached / (s.events.length - 1)) * 100}%` }} /></span>
                    {s.events.map((ev, i) => (
                      <li key={ev.title} className={clsx(i < reached && styles.done, i === reached && styles.current)} data-event>
                        <i aria-hidden="true" />
                        <div>
                          <strong>{ev.title}</strong>
                          <span>{ev.place}</span>
                        </div>
                        {ev.time && <time>{ev.time}</time>}
                      </li>
                    ))}
                  </ol>
                  <p className={styles.demo} data-in>{k.demoNote}</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.help} data-rise>
            <div>
              <h2>{k.helpTitle}</h2>
              <p>{k.helpBody}</p>
            </div>
            <Button to="contact" tone="dark" chip="yellow" size="sm">{k.helpCta}</Button>
          </div>
        </div>
      </section>
      <SiteClosing t={t}>
        <div className={styles.helpSpacer} aria-hidden="true" />
      </SiteClosing>
    </>
  );
}
