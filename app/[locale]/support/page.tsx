import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { SupportPage } from "@/components/sections/company/legal/SupportPage";

type Props = { params: Promise<{ locale: string }> };

// /support — Figma "Support"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "support", (t) => t.supportPage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <SupportPage t={getMessages(locale)} />
    </main>
  );
}
