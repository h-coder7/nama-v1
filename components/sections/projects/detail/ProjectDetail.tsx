import type { Messages } from "@/lib/i18n";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { DiscussProject } from "@/components/sections/industry-detail/discuss/DiscussProject";
import { PROJECT_PAGES, rowById, type ProjectPageKey } from "../projects.data";
import { CATEGORY_INDUSTRY } from "../projects.copy";
import { ProjectHero } from "./ProjectHero";
import { DetailsBanner } from "./DetailsBanner";
import { DetailsSplit } from "./DetailsSplit";
import { ProjectRecord } from "./ProjectRecord";
import { MoreProjects } from "./MoreProjects";
import { ProjectNav } from "./ProjectNav";

export type DetailProps = { t: Messages; k: ProjectPageKey };

/**
 * Project page template (Ras Al Zour, Qatif GOSP, IBN-ZAHR PP-II, SADAF Expansion).
 * Two Figma layouts: "banner" (wide photo + facts bar, then the client's other
 * projects as cards) and "split" (facts card beside the photo and a "More with …" list).
 */
export function ProjectDetail({ t, k }: DetailProps) {
  const page = PROJECT_PAGES[k];
  const row = rowById(page.row);
  return (
    <>
      <ProjectHero t={t} k={k} />
      {page.layout === "banner" ? <DetailsBanner t={t} k={k} /> : <DetailsSplit t={t} k={k} />}
      <ProjectRecord t={t} k={k} />
      {page.layout === "banner" && <MoreProjects t={t} k={k} />}
      <ProjectNav t={t} />
      <SiteClosing t={t}>
        <DiscussProject t={t} c={t.industryDetail.common} data={{ key: CATEGORY_INDUSTRY[row.category], preselect: "projectLogistics" }} />
      </SiteClosing>
    </>
  );
}
