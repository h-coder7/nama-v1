import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { PrivacyPage } from "@/components/sections/company/legal/LegalPages";

type Props = { params: Promise<{ locale: string }> };

// /privacy-policy — Figma "Privacy policy"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "privacyPolicy", (t) => t.legal.privacy.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <PrivacyPage t={getMessages(locale)} />
    </main>
  );
}
