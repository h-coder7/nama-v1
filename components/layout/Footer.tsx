import Image from "next/image";
import type { Messages } from "@/lib/i18n";
import { FOOTER_COLUMNS, FOOTER_LEGAL, SITE, brand } from "@/lib/site";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import styles from "./footer.module.scss";

type Props = { t: Messages["footer"] & { homeLabel: string; companyName: string }; routes: Messages["routes"] };

/** Footer — sits inside the shared dark closing panel (see SiteClosing). */
export function Footer({ t, routes }: Props) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <AppLink to="home" aria-label={t.homeLabel}>
              <Image src={brand("logo")} alt={t.companyName} width={104} height={29} />
            </AppLink>
            <p className={styles.about}>{t.about}</p>
            <a href={`tel:${SITE.unifiedNumber}`} className={styles.unified}>
              <span className={styles.unifiedIcon}><Icon name="phone" size={20} /></span>
              <span>
                <small>{t.unified}</small>
                <strong>{SITE.unifiedNumber}</strong>
              </span>
            </a>
            {/* Primary action right under the unified number. */}
            <div className={styles.unifiedCta}>
              <Button to="requestQuote" tone="light" chip="yellow" whole>{routes.requestQuote}</Button>
            </div>
            <a href={SITE.profileUrl} className={styles.profile}>
              <Icon name="download" size={20} />
              {t.profile}
            </a>
          </div>
          {t.columns.map((c, i) => (
            <nav key={c.title} className={styles.col} aria-label={c.title}>
              <h2>{c.title}</h2>
              <ul>
                {FOOTER_COLUMNS[i].map((key) => (
                  <li key={key}><AppLink to={key}>{routes[key]}</AppLink></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>{t.copyright}</span>
          <ul>
            {FOOTER_LEGAL.map((key) => (
              <li key={key}><AppLink to={key}>{routes[key]}</AppLink></li>
            ))}
            <li><a href={SITE.linkedin} target="_blank" rel="noreferrer">{t.linkedin}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
