import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ProjectLogisticsPage } from "@/components/sections/solutions/project-logistics/ProjectLogisticsPage";

type Props = { params: Promise<{ locale: string }> };

// /solutions/project-logistics — Website Content doc P03 (no Figma frame; built from the solution-page system)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "projectLogistics", (t) => t.solutionPages.projectLogistics.metaDescription);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ProjectLogisticsPage t={getMessages(locale)} />
    </main>
  );
}
