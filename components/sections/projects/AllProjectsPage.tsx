import type { Messages } from "@/lib/i18n";
import { fill } from "@/lib/format";
import { Quote } from "@/components/sections/home/quote/Quote";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { RichText } from "@/components/ui/RichText";
import { ProjectsList } from "./list/ProjectsList";
import styles from "./all-projects.module.scss";

/**
 * /projects/all — no dedicated Figma yet: a compact intro over the same
 * completed-projects list used on /projects (see docs/REVIEW.md).
 */
export function AllProjectsPage({ t }: { t: Messages }) {
  const p = t.projectsPage;
  return (
    <>
      <section className={styles.intro} aria-labelledby="all-title" data-tone="dark">
        <div className="container">
          <Breadcrumb current="allProjects" t={t} />
          <h1 id="all-title" className={styles.title}>
            <RichText text={p.allPageTitle} accentClass={styles.accent} />
          </h1>
          <p className={styles.body}>{p.allPageBody}</p>
        </div>
      </section>
      <ProjectsList t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={fill(t.solutionPages.common.discussTitle, { topic: p.discussTopic })} service="projectLogistics" />
      </SiteClosing>
    </>
  );
}
