import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { NetworkPage } from "@/components/sections/company/network/NetworkPage";

type Props = { params: Promise<{ locale: string }> };

// /network — Figma "Our Network"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "network", (t) => t.networkPage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <NetworkPage t={getMessages(locale)} />
    </main>
  );
}
