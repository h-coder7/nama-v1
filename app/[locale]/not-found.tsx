import { defaultLocale } from "@/lib/i18n";
import { NotFoundView } from "@/components/templates/NotFoundView";

// Rendered inside the locale layout (header included) when notFound() is called.
export default function LocaleNotFound() {
  return <NotFoundView locale={defaultLocale} />;
}
