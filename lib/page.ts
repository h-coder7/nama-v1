import type { Metadata } from "next";
import { getMessages, locales } from "@/lib/i18n";
import { ROUTES, localePath, type RouteKey } from "@/lib/routes";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nammacargo.com";

/** hreflang alternates for a sitemap route (en is x-default). */
export function alternatesFor(locale: string, key: RouteKey): Metadata["alternates"] {
  const path = ROUTES[key].path;
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath("en", path),
    },
  };
}

/** Standard metadata for a sitemap page (title from messages.routes). */
export async function routeMetadata(params: Promise<{ locale: string }>, key: RouteKey, description?: (t: ReturnType<typeof getMessages>) => string): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(locale);
  return {
    title: t.routes[key],
    description: description?.(t),
    alternates: alternatesFor(locale, key),
    openGraph: { title: t.routes[key], locale: locale === "ar" ? "ar_SA" : "en_US", siteName: t.common.brand },
  };
}
