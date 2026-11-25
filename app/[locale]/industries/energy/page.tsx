import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { IndustryDetail } from "@/components/sections/industry-detail/IndustryDetail";

type Props = { params: Promise<{ locale: string }> };

// /industries/energy — Figma "Energy"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "energy", (t) => t.industryDetail.energy.body);

export default async function EnergyPage({ params }: Props) {
  const { locale } = await params;
  return <IndustryDetail t={getMessages(locale)} industry="energy" />;
}
