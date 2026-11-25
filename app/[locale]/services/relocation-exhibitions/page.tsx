import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { RelocationPage } from "@/components/sections/solutions/relocation/RelocationPage";

type Props = { params: Promise<{ locale: string }> };

// /solutions/relocation-exhibitions — Figma "Relocation & Exhibitions"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "relocationExhibitions", (t) => t.solutionPages.relocation.body[0]);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <RelocationPage t={getMessages(locale)} />
    </main>
  );
}
