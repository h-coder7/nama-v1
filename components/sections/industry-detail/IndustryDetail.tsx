import type { Messages } from "@/lib/i18n";
import { SiteClosing } from "@/components/layout/SiteClosing";
import type { IndustryKey } from "@/components/sections/industries/industries-page.data";
import { INDUSTRY_DETAILS, INDUSTRY_ORDER } from "./industry-detail.data";
import { IndustryHero } from "./hero/IndustryHero";
import { Requirements } from "./requirements/Requirements";
import { RequirementsList } from "./requirements/RequirementsList";
import { RequirementsAccordion } from "./requirements/RequirementsAccordion";
import { SuitedSolutions } from "./solutions/SuitedSolutions";
import { SolutionCards } from "./solutions/SolutionCards";
import { SolutionTabs } from "./solutions/SolutionTabs";
import { SolutionSwitches } from "./solutions/SolutionSwitches";
import { SolutionTypeset } from "./solutions/SolutionTypeset";
import { Delivered } from "./delivered/Delivered";
import { DeliveredSplit } from "./delivered/DeliveredSplit";
import { DeliveredStat } from "./delivered/DeliveredStat";
import { ExploreIndustries } from "./explore/ExploreIndustries";
import { ExploreTiles } from "./explore/ExploreTiles";
import { ExploreTabs } from "./explore/ExploreTabs";
import { ExploreFeature } from "./explore/ExploreFeature";
import { ExploreWheel } from "./explore/ExploreWheel";
import { DiscussProject } from "./discuss/DiscussProject";
import type { IndustryCopy, SectionProps } from "./types";

/**
 * Industry page template. Every /industries/* page renders
 * this with its own data (industry-detail.data.ts) and copy (messages.industryDetail);
 * `data.variants` picks the section designs used by that page in the Figma.
 */
export function IndustryDetail({ t, industry }: { t: Messages; industry: IndustryKey }) {
  const data = INDUSTRY_DETAILS[industry];
  if (!data) throw new Error(`No industry data for ${industry}`);
  const index = INDUSTRY_ORDER.findIndex((i) => i.key === industry);
  const props: SectionProps = {
    t,
    c: t.industryDetail.common,
    copy: (t.industryDetail as unknown as Record<string, IndustryCopy>)[industry],
    data,
    name: t.routes[industry],
    index,
    total: INDUSTRY_ORDER.length,
  };
  const Req = { columns: Requirements, list: RequirementsList, accordion: RequirementsAccordion }[data.variants.requirements];
  const Sol = { featured: SuitedSolutions, cards: SolutionCards, tabs: SolutionTabs, switches: SolutionSwitches, typeset: SolutionTypeset }[data.variants.solutions];
  const Del = { band: Delivered, split: DeliveredSplit, stat: DeliveredStat }[data.variants.delivered];
  const Exp = { cards: ExploreIndustries, tiles: ExploreTiles, tabs: ExploreTabs, feature: ExploreFeature, wheel: ExploreWheel }[data.variants.explore];

  return (
    <main id="main">
      <IndustryHero {...props} />
      <Req {...props} />
      <Sol {...props} />
      <Del {...props} />
      <Exp {...props} />
      <SiteClosing t={t}>
        <DiscussProject {...props} />
      </SiteClosing>
    </main>
  );
}
