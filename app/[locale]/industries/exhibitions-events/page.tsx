import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { IndustryDetail } from "@/components/sections/industry-detail/IndustryDetail";

type Props = { params: Promise<{ locale: string }> };

// /industries/exhibitions-events — Figma "Exhibitions & Events"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "exhibitionsEvents", (t) => t.industryDetail.exhibitionsEvents.body);

export default async function ExhibitionsEventsPage({ params }: Props) {
  const { locale } = await params;
  return <IndustryDetail t={getMessages(locale)} industry="exhibitionsEvents" />;
}
