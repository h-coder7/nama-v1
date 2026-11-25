"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { ROUTES, localePath, type RouteKey } from "@/lib/routes";
import { useLocale } from "@/providers/LocaleProvider";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  /** Sitemap key (preferred) … */
  to?: RouteKey;
  /** … or a raw href: "#anchor", "https://…", "tel:", or a locale-less path "/about". */
  href?: string;
  hash?: string;
  /** Query string, e.g. { industry: "oilGas", service: "projectLogistics" } */
  query?: Record<string, string>;
};

/** The review-link build (static export) uses plain <a> so every page loads as its own file. */
const MPA = process.env.NEXT_PUBLIC_PREVIEW_MPA === "1";

/**
 * Review-link only: "/ar/industries/" → "../../ar/industries/index.html" (relative to the
 * current file; window.__NXP is injected per page). Production returns the path unchanged.
 */
export function previewHref(path: string) {
  if (!MPA || typeof window === "undefined" || !path.startsWith("/")) return path;
  const prefix = (window as Window & { __NXP?: string }).__NXP;
  if (prefix === undefined) return path;
  const m = path.match(/^([^?#]*)(.*)$/)!;
  return `${prefix}${m[1].replace(/^\//, "")}index.html${m[2]}`;
}

/**
 * Locale-aware internal link. Every internal link in the site goes through here,
 * so routes only live in lib/routes.ts.
 */
export function AppLink({ to, href, hash, query, children, ...rest }: Props) {
  const locale = useLocale();
  let target = href ?? "#";
  // Files under /assets (company profile PDF…) are not pages: no locale prefix.
  const internal = !!to || (target.startsWith("/") && !target.startsWith("//") && !target.startsWith("/assets/"));
  if (to) target = localePath(locale, ROUTES[to].path);
  else if (internal) target = localePath(locale, target);
  if (query) target += `?${new URLSearchParams(query).toString()}`;
  if (hash) target += `#${hash}`;

  if (!internal || MPA) {
    return (
      <a href={internal ? previewHref(target) : target} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}
