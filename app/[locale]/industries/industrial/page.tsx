import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { IndustryDetail } from "@/components/sections/industry-detail/IndustryDetail";

type Props = { params: Promise<{ locale: string }> };

// /industries/industrial — Figma "Industrial Operations", retitled "Industrial" (Nov 2026)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "industrialOperations", (t) => t.industryDetail.industrialOperations.body);

export default async function IndustrialOperationsPage({ params }: Props) {
  const { locale } = await params;
  return <IndustryDetail t={getMessages(locale)} industry="industrialOperations" />;
}
