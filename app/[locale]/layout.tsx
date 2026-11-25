import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getMessages, isRtl, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/page";
import { Header } from "@/components/layout/Header";
import { LoaderGate } from "@/components/layout/LoaderGate";
import { Preloader, preloaderHeadScript } from "@/components/layout/Preloader";
import { LenisProvider } from "@/providers/LenisProvider";
import { LocaleProvider } from "@/providers/LocaleProvider";
import "@/styles/globals.scss";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s | ${t.common.brand}` },
    description: t.meta.description,
    // The "N" from the Namma mark (square, yellow) — svg for modern browsers, png/ico fallbacks.
    icons: {
      icon: [
        { url: "/assets/namma/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/assets/namma/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/assets/namma/brand/favicon.ico", sizes: "any" },
      ],
      apple: "/assets/namma/brand/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = { themeColor: "#2e2e2e", width: "device-width", initialScale: 1 };

/**
 * Hides the hero intro elements before hydration (no flash), only when motion
 * is allowed. Safety net: if no hero intro has started after 1.4s (slow JS), the
 * content is shown and the hero skips its entrance (lib/motion introExpired).
 */
const EN_FONTS = ["space-grotesk-latin-600-normal.woff2", "manrope-latin-400-normal.woff2"];
const AR_FONTS = ["readex-pro-arabic-600-normal.woff2", "ibm-plex-sans-arabic-arabic-400-normal.woff2", ...EN_FONTS];

const introScript = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('is-intro');setTimeout(function(){if(d.classList.contains('is-intro')){d.dataset.introExpired='1';d.classList.remove('is-intro')}},3000)}catch(e){}})();`;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getMessages(locale);
  return (
    <html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderHeadScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        {/* Faces used by the hero headline + copy (LCP): fetched with the HTML, not after the CSS. */}
        {(isRtl(locale) ? AR_FONTS : EN_FONTS).map((f) => (
          <link key={f} rel="preload" as="font" type="font/woff2" href={`/assets/namma/fonts/${f}`} crossOrigin="anonymous" />
        ))}
      </head>
      <body>
        <Preloader locale={locale} />
        <LocaleProvider locale={locale}>
          <LenisProvider>
            <LoaderGate />
            <a className="skip-link" href="#main">{t.common.skip}</a>
            <Header t={t} />
            {children}
          </LenisProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
