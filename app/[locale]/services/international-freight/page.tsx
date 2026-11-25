import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { FreightPage } from "@/components/sections/solutions/freight/FreightPage";

type Props = { params: Promise<{ locale: string }> };

// /solutions/freight-transport — Figma "Freight & Transport"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "freightTransport", (t) => t.solutionPages.freight.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <FreightPage t={getMessages(locale)} />
    </main>
  );
}
