import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { AirSeaPage } from "@/components/sections/solutions/air-sea/AirSeaPage";

type Props = { params: Promise<{ locale: string }> };

// /services/international-freight/air-freight — added in the Nov 2026 amendments (approved Air & Sea Chartering page, draft hero)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "airFreight", (t) => t.solutionPages.airFreight.body[0]);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <AirSeaPage t={getMessages(locale)} mode="airFreight" />
    </main>
  );
}
