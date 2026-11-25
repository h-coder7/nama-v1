import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { IndustryDetail } from "@/components/sections/industry-detail/IndustryDetail";

type Props = { params: Promise<{ locale: string }> };

// /industries/chemicals — added in the Nov 2026 amendments (draft copy, closest approved photos)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "chemicals", (t) => t.industryDetail.chemicals.body);

export default async function ChemicalsPage({ params }: Props) {
  const { locale } = await params;
  return <IndustryDetail t={getMessages(locale)} industry="chemicals" />;
}
