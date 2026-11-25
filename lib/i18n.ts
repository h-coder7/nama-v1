import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

/** English is the primary language; Arabic mirrors every key (RTL). */
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = { en, ar };

export function getMessages(locale: string): Messages {
  return dictionaries[(locales as readonly string[]).includes(locale) ? (locale as Locale) : defaultLocale];
}

export const isRtl = (locale: string) => locale === "ar";
export const otherLocale = (locale: string): Locale => (locale === "ar" ? "en" : "ar");

/** /en/industries/ → /ar/industries/ */
export const swapLocale = (pathname: string, to: string) =>
  pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${to}`) || `/${to}/`;
