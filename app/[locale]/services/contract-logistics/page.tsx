import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ThreePlPage } from "@/components/sections/solutions/three-pl/ThreePlPage";

type Props = { params: Promise<{ locale: string }> };

// /3pl — Figma "3PL & Integrated Logistics"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "threePl", (t) => t.solutionPages.threePl.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ThreePlPage t={getMessages(locale)} />
    </main>
  );
}
