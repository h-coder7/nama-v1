import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { PackingPage } from "@/components/sections/solutions/packing/PackingPage";

type Props = { params: Promise<{ locale: string }> };

// /solutions/industrial-equipment-packing — Figma "Industrial Equipment Packing"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "industrialEquipmentPacking", (t) => t.solutionPages.packing.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <PackingPage t={getMessages(locale)} />
    </main>
  );
}
