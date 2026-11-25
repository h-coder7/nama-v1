import clsx from "clsx";
import type { Messages } from "@/lib/i18n";
import { trail, type RouteKey } from "@/lib/routes";
import { AppLink } from "./AppLink";
import styles from "./breadcrumb.module.scss";

/** Home › Section › Page — built from the sitemap parents in lib/routes.ts. */
export function Breadcrumb({ current, t, tone = "dark", className }: { current: RouteKey; t: Messages; tone?: "dark" | "light"; className?: string }) {
  const items = trail(current);
  // Some routes read differently in a trail than in menus (e.g. "All Solutions" → "Solutions").
  const label = (k: RouteKey) => (t.crumbs as Partial<Record<RouteKey, string>>)[k] ?? t.routes[k];
  return (
    <nav aria-label={t.common.breadcrumb} className={clsx(styles.crumbs, styles[tone], className)}>
      <ol>
        {items.map((k, i) => (
          <li key={k}>
            {i < items.length - 1 ? <AppLink to={k}>{label(k)}</AppLink> : <span aria-current="page">{label(k)}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
