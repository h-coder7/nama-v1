import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { IndustriesExperience } from "@/components/sections/industries/IndustriesExperience";
import { NextMove } from "@/components/sections/industries/NextMove";

type Props = { params: Promise<{ locale: string }> };

// /industries — Figma "Industries" (Nov 2026)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "industries", (t) => t.industriesPage.metaDescription);

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;
  const t = getMessages(locale);
  return (
    <main id="main">
      <IndustriesExperience t={t} />
      <NextMove t={t} />
      <SiteClosing t={t} />
    </main>
  );
}
