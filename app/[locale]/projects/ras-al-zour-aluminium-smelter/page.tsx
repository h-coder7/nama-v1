import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ProjectDetail } from "@/components/sections/projects/detail/ProjectDetail";

type Props = { params: Promise<{ locale: string }> };

// /projects/ras-al-zour-aluminium-smelter — Figma project page
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "rasAlZour", (t) => t.projectsPage.projects.rasAlZour.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ProjectDetail t={getMessages(locale)} k="rasAlZour" />
    </main>
  );
}
