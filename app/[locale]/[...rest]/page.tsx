import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";

// Any unmatched /{locale}/… URL → branded 404 inside the locale layout.
export function generateStaticParams() {
  // Pre-renders /{locale}/404/ (used as the static-export 404 page).
  return locales.map((locale) => ({ locale, rest: ["404"] }));
}

export default function CatchAll() {
  notFound();
}
