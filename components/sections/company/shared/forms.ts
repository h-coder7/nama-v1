/** Shared client-side checks for the preview forms (no data leaves the browser). */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
/** Digits only, 7–15 long, optional leading + (country code). */
export const isPhone = (v: string) => /^\+?\d{7,15}$/.test(v.replace(/[\s()-]/g, ""));
export const telHref = (v: string) => `tel:${v.replace(/\(0\)/g, "").replace(/[^+\d]/g, "")}`;

/** TODO: point at the real form endpoints (CRM / Laravel API). Null = preview, nothing is sent. */
export const FORM_ENDPOINTS: Record<"quote" | "contact" | "careers", string | null> = {
  quote: null,
  contact: null,
  careers: null,
};

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
