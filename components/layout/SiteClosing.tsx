import type { ReactNode } from "react";
import type { Messages } from "@/lib/i18n";
import { Footer } from "./Footer";

/**
 * The rounded dark panel that closes every page (Figma): optional content on
 * top (the quote form on Home, a CTA on inner pages) + the footer.
 */
export function SiteClosing({ t, children }: { t: Messages; children?: ReactNode }) {
  return (
    <div className="closing-panel">
      {children}
      <Footer t={{ ...t.footer, homeLabel: t.common.homeLabel, companyName: t.common.companyName }} routes={t.routes} />
    </div>
  );
}
