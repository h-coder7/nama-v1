import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { WarehousingPage } from "@/components/sections/solutions/warehousing/WarehousingPage";

type Props = { params: Promise<{ locale: string }> };

// /solutions/warehousing-distribution — Figma "Warehousing & Distribution"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "warehousingDistribution", (t) => t.solutionPages.warehousing.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <WarehousingPage t={getMessages(locale)} />
    </main>
  );
}
