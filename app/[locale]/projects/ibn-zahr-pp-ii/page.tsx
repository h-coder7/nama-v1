import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ProjectDetail } from "@/components/sections/projects/detail/ProjectDetail";

type Props = { params: Promise<{ locale: string }> };

// /projects/ibn-zahr-pp-ii — Figma project page
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "ibnZahr", (t) => t.projectsPage.projects.ibnZahr.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ProjectDetail t={getMessages(locale)} k="ibnZahr" />
    </main>
  );
}
