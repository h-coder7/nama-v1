import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { IndustryDetail } from "@/components/sections/industry-detail/IndustryDetail";

type Props = { params: Promise<{ locale: string }> };

// /industries/oil-gas — Figma "Oil & Gas" (industry template)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "oilGas", (t) => t.industryDetail.oilGas.body);

export default async function OilGasPage({ params }: Props) {
  const { locale } = await params;
  return <IndustryDetail t={getMessages(locale)} industry="oilGas" />;
}
