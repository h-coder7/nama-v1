import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { SolutionsHub } from "@/components/sections/solutions/hub/SolutionsHub";

type Props = { params: Promise<{ locale: string }> };

// /solutions — Figma "Solutions"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "solutions", (t) => t.solutionPages.hub.intro);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <SolutionsHub t={getMessages(locale)} />
    </main>
  );
}
