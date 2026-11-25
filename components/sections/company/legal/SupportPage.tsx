"use client";

import { Fragment } from "react";
import type { Messages } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Quote } from "@/components/sections/home/quote/Quote";
import { PageHero } from "../shared/PageHero";
import { telHref } from "../shared/forms";
import { SectionsLayout } from "./LegalPages";
import styles from "./legal.module.scss";

/** /support — Figma "Support". */
export function SupportPage({ t }: { t: Messages }) {
  const s = t.supportPage;
  const sections = s.sections.map((x) => ({
    title: x.title,
    body: (
      <p>
        {x.body.split("{phone}").map((part, i, arr) => (
          <Fragment key={i}>
            {part}
            {i < arr.length - 1 && <a href={telHref(SITE.unifiedNumber)} className={styles.inlineTel} dir="ltr">{SITE.unifiedNumber}</a>}
          </Fragment>
        ))}
      </p>
    ),
  }));
  return (
    <>
      <PageHero t={t} route="support" eyebrow={s.eyebrow} title={s.title} aside={s.body} image="/assets/namma/images/company/support-hero.webp" focus="60% 50%" />
      <SectionsLayout
        t={t}
        sections={sections}
        after={
          <div className={styles.supportCtas} data-rise>
            <Button to="requestQuote" tone="yellow" chip="light" size="sm">{t.common.requestQuote}</Button>
            <AppLink to="trackShipment" className={styles.trackBtn}>
              {t.common.shipmentTracking}
              <Icon name="truck" size={16} />
            </AppLink>
            <Button to="contact" ghost size="sm" className={styles.ghostDark}>{t.routes.contact}</Button>
          </div>
        }
      />
      <SiteClosing t={t}>
        <Quote t={t.quote} />
      </SiteClosing>
    </>
  );
}
