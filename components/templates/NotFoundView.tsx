import { getMessages } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.scss";

/** 404 system page (sitemap: unmatched URL). */
export function NotFoundView({ locale }: { locale: string }) {
  const t = getMessages(locale);
  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.code} aria-hidden="true">
          4<span className={styles.slash} />04
        </p>
        <h1 className={styles.title}>{t.common.notFoundTitle}</h1>
        <p className={styles.body}>{t.common.notFoundBody}</p>
        <div className={styles.ctas}>
          <Button to="home" tone="yellow" chip="dark">{t.common.backHome}</Button>
          <Button to="contact" ghost>{t.routes.contact}</Button>
        </div>
      </div>
    </main>
  );
}
