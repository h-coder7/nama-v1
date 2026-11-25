import type { Messages } from "@/lib/i18n";
import { fill } from "@/lib/format";
import { Quote } from "@/components/sections/home/quote/Quote";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { ProjectsHero } from "./hero/ProjectsHero";
import { FeaturedProjects } from "./featured/FeaturedProjects";
import { ProjectsList } from "./list/ProjectsList";

/** /projects — Figma "Projects & Success Stories". */
export function ProjectsPage({ t }: { t: Messages }) {
  return (
    <>
      <ProjectsHero t={t} />
      <FeaturedProjects t={t} />
      <ProjectsList t={t} />
      <SiteClosing t={t}>
        <Quote t={t.quote} eyebrow={t.solutionPages.common.discussEyebrow} title={fill(t.solutionPages.common.discussTitle, { topic: t.projectsPage.discussTopic })} service="projectLogistics" />
      </SiteClosing>
    </>
  );
}
