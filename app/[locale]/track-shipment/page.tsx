import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { TrackPage } from "@/components/sections/company/track/TrackPage";

type Props = { params: Promise<{ locale: string }> };

// /track-shipment — Figma "Track Shipment"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "trackShipment", (t) => t.trackPage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <TrackPage t={getMessages(locale)} />
    </main>
  );
}
