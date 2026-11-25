"use client";

import clsx from "clsx";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { otherLocale, swapLocale, type Messages } from "@/lib/i18n";
import { ROUTES, SOLUTIONS_MENU, localePath, type RouteKey } from "@/lib/routes";

/** Solutions mega menu order (Figma "Menu"). */
// Services mega menu: the five groups, each with its own sub-services (client amendments, Nov 2026).
import { NAV, brand } from "@/lib/site";
import { AppLink, previewHref } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useLenis } from "@/providers/LenisProvider";
import { useLocale } from "@/providers/LocaleProvider";
import styles from "./header.module.scss";

/**
 * Sticky header: transparent over the hero, solid after 80px, and stays with the
 * reader the whole way down (a calm compact state instead of hide/show flicker).
 * Active item = current route or its section (e.g. /solutions/* → Solutions).
 */
export function Header({ t }: { t: Messages }) {
  const [solid, setSolid] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const lenis = useLenis();
  const locale = useLocale();
  const routerPath = usePathname() ?? "";
  // Review-link build: each page is a standalone file, so the real route is injected per page.
  const pathname = (typeof window !== "undefined" && (window as Window & { __NXROUTE?: string }).__NXROUTE) || routerPath;
  const altLocale = otherLocale(locale);

  const isActive = (key: RouteKey) => {
    const base = localePath(locale, ROUTES[key].path);
    if (key === "home") return pathname === base || pathname === base.slice(0, -1);
    if (key === "solutions") return pathname.startsWith(base) || pathname.startsWith(localePath(locale, "/3pl"));
    return pathname.startsWith(base);
  };

  // Pages whose first section is light (e.g. Industries) get a tinted bar at the top,
  // so the white links stay legible before the solid state kicks in.
  useEffect(() => {
    // Sample what actually sits under the bar: photos/video count as dark, otherwise
    // the first painted background decides.
    const check = () => {
      const bar = document.querySelector("header")?.getBoundingClientRect();
      let n = document.elementFromPoint(window.innerWidth / 2, (bar?.bottom ?? 70) + 24) as HTMLElement | null;
      while (n && n !== document.body) {
        if (/^(IMG|VIDEO|CANVAS|PICTURE)$/.test(n.tagName)) return setOnLight(false);
        const cs = getComputedStyle(n);
        if (cs.backgroundImage !== "none" && !cs.backgroundImage.includes("gradient")) return setOnLight(false);
        const m = cs.backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
        if (m && (m[4] === undefined || Number(m[4]) > 0.5)) {
          const lum = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
          return setOnLight(lum > 0.6);
        }
        n = n.parentElement;
      }
      setOnLight(false);
    };
    const id = window.setTimeout(check, 60);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(y > 80);
      setCompact(y > 160);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  // Pages without a scripted hero intro: release the pre-hydration hide right away.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!document.querySelector("[data-hero-intro]")) document.documentElement.classList.remove("is-intro");
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Close menus on route change.
  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [pathname]);

  const close = () => {
    setOpen(false);
    setDropdown(false);
  };

  return (
    <header className={clsx(styles.header, solid && styles.solid, !solid && !open && styles.top, !solid && !open && onLight && styles.topOnLight, compact && !open && styles.compact)} data-intro>
      <div className={clsx("container", styles.bar)}>
        <AppLink to="home" className={styles.logo} aria-label={t.common.homeLabel}>
          <Image src={brand("logo")} alt={t.common.brand} width={130} height={36} priority />
        </AppLink>

        <nav className={styles.nav} aria-label={t.common.primaryNav}>
          <ul>
            {NAV.map((item) => (
              <li
                key={item.key}
                className={clsx(item.dropdown && styles.hasDropdown)}
                onMouseEnter={() => item.dropdown && setDropdown(true)}
                onMouseLeave={() => item.dropdown && setDropdown(false)}
              >
                <AppLink
                  to={item.to}
                  className={clsx(isActive(item.to) && styles.current)}
                  aria-current={isActive(item.to) ? "page" : undefined}
                  aria-haspopup={item.dropdown ? "true" : undefined}
                  aria-expanded={item.dropdown ? dropdown : undefined}
                >
                  {t.nav[item.key]}
                  {item.dropdown && <span className={styles.chev} aria-hidden="true" />}
                </AppLink>
                {item.dropdown && (
                  <div className={clsx(styles.dropdown, dropdown && styles.dropdownOpen)}>
                    <span className={styles.megaGlow} aria-hidden="true" />
                    <ul className={styles.mega}>
                      {SOLUTIONS_MENU.map(({ key: k, children }, i) => (
                        <li key={k} style={{ "--d": `${0.12 + i * 0.05}s` } as CSSProperties}>
                          <AppLink to={k} onClick={close} className={styles.megaItem}>
                            <em className={styles.megaNum} aria-hidden="true">{String(i + 1).padStart(2, "0")}</em>
                            <strong>{t.routes[k]}</strong>
                            <span>{t.megaMenu[k as keyof Messages["megaMenu"]]}</span>
                            <i className={styles.megaArrow} aria-hidden="true"><Icon name="arrow" size={12} /></i>
                          </AppLink>
                          {children && (
                            <ul className={styles.megaSub}>
                              {children.map((c) => (
                                <li key={c}><AppLink to={c} onClick={close}>{t.routes[c]}</AppLink></li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.megaCta} style={{ "--d": "0.38s" } as CSSProperties}>
                      <div>
                        <strong>{t.megaMenu.ctaTitle}</strong>
                        <span>{t.megaMenu.ctaBody}</span>
                      </div>
                      <Button to="requestQuote" tone="dark" chip="light" size="sm" onClick={close}>{t.common.requestQuote}</Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            href={previewHref(swapLocale(pathname || `/${locale}/`, altLocale))}
            className={styles.lang}
            hrefLang={altLocale}
            lang={altLocale}
            aria-label={`${t.common.language}: ${t.common.switchTo}`}
            title={t.common.switchTo}
          >
            {/* Globe: the language switch reads the same in both languages. */}
            <svg className={styles.langGlobe} viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9s1.3-6.4 3.9-9Z" />
              <path d="M4.6 7.5h14.8M4.6 16.5h14.8" />
            </svg>
          </a>
          <AppLink to="trackShipment" className={styles.track}>
            {t.common.shipmentTracking}
          </AppLink>
          <Button to="requestQuote" size="sm" whole className={styles.quote}>
            {t.common.requestQuote}
          </Button>
          <button
            className={clsx(styles.burger, open && styles.burgerOpen)}
            aria-label={open ? t.common.close : t.common.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={clsx(styles.mobile, open && styles.mobileOpen)} hidden={!open}>
        <ul>
          {NAV.map((item, i) => (
            <li key={item.key} style={{ transitionDelay: `${open ? 60 + i * 40 : 0}ms` }}>
              <AppLink to={item.to} onClick={close} aria-current={isActive(item.to) ? "page" : undefined}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t.nav[item.key]}
              </AppLink>
              {item.dropdown && (
                <ul className={styles.mobileSub}>
                  {SOLUTIONS_MENU.flatMap((g) => [g.key, ...(g.children ?? [])]).map((k) => (
                    <li key={k} className={clsx(!SOLUTIONS_MENU.some((g) => g.key === k) && styles.mobileSubChild)}>
                      <AppLink to={k} onClick={close}>{t.routes[k]}</AppLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <a href={previewHref(swapLocale(pathname || `/${locale}/`, altLocale))} className={styles.mobileLang} hrefLang={altLocale} lang={altLocale}>
          {t.common.switchTo}
        </a>
        <div className={styles.mobileCtas}>
          <Button to="requestQuote" tone="yellow" whole onClick={close}>
            {t.common.requestQuote}
          </Button>
          <AppLink to="trackShipment" className={styles.track} onClick={close}>
            {t.common.shipmentTracking}
          </AppLink>
        </div>
      </div>
    </header>
  );
}
