import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ProjectsPage } from "@/components/sections/projects/ProjectsPage";

type Props = { params: Promise<{ locale: string }> };

// /projects — Figma "Projects & Success Stories"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "projects", (t) => t.projectsPage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ProjectsPage t={getMessages(locale)} />
    </main>
  );
}
