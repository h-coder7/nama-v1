import { defaultLocale } from "@/lib/i18n";
import { NotFoundView } from "@/components/templates/NotFoundView";
import { LocaleProvider } from "@/providers/LocaleProvider";
import "@/styles/globals.scss";

// URLs outside any locale (e.g. /foo) — full document, no locale layout.
export default function RootNotFound() {
  return (
    <html lang={defaultLocale}>
      <body>
        <LocaleProvider locale={defaultLocale}>
          <NotFoundView locale={defaultLocale} />
        </LocaleProvider>
      </body>
    </html>
  );
}
