import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { AllProjectsPage } from "@/components/sections/projects/AllProjectsPage";

type Props = { params: Promise<{ locale: string }> };

// /projects/all — completed projects list (no dedicated Figma yet)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "allProjects", (t) => t.projectsPage.allPageBody);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <AllProjectsPage t={getMessages(locale)} />
    </main>
  );
}
