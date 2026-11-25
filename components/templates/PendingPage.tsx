import { getMessages } from "@/lib/i18n";
import { childrenOf, type RouteKey } from "@/lib/routes";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { AppLink } from "@/components/ui/AppLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import styles from "./pending-page.module.scss";

/**
 * Temporary page for sitemap routes whose design has not been delivered yet.
 * Keeps every link in the site working; replaced page by page as designs arrive
 * (set the route's status to "built" in lib/routes.ts when it is).
 */
export async function PendingPage({ params, route }: { params: Promise<{ locale: string }>; route: RouteKey }) {
  const { locale } = await params;
  const t = getMessages(locale);
  const kids = childrenOf(route);

  return (
    <main id="main">
      <section className={styles.hero}>
        <div className="container">
          <Breadcrumb current={route} t={t} />
          <h1 className={styles.title}>{t.routes[route]}</h1>
          <p className={styles.note}>
            <strong>{t.common.pendingTitle}.</strong> {t.common.pendingBody}
          </p>
        </div>
      </section>
      {kids.length > 0 && (
        <section className={styles.kids}>
          <div className="container">
            <h2 className={styles.kidsTitle}>{t.common.inThisSection}</h2>
            <ul className={styles.grid}>
              {kids.map((k, i) => (
                <li key={k}>
                  <AppLink to={k} className={styles.card}>
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.cardTitle}>{t.routes[k]}</span>
                    <span className={styles.arrow}><Icon name="arrow" size={13} /></span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <SiteClosing t={t} />
    </main>
  );
}
