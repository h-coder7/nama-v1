"use client";

import type { Messages } from "@/lib/i18n";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Quote } from "@/components/sections/home/quote/Quote";
import { PageHero } from "../shared/PageHero";

/**
 * /request-a-quote — the hero, then the site's one form (the Home closing card) in quote mode.
 * The service is preselected from ?service= when the visitor comes from another page.
 */
export function QuotePage({ t }: { t: Messages }) {
  const k = t.quotePage;
  return (
    <>
      <PageHero t={t} route="requestQuote" eyebrow={k.eyebrow} title={k.title} aside={k.body} image="/assets/namma/images/company/quote-hero.webp" focus="70% 40%" />
      <SiteClosing t={t}>
        <Quote t={t.quote} readQuery id="quote" />
      </SiteClosing>
    </>
  );
}
