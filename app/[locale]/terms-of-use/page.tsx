import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { TermsPage } from "@/components/sections/company/legal/LegalPages";

type Props = { params: Promise<{ locale: string }> };

// /terms-of-use — Figma "Terms of Use"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "termsOfUse", (t) => t.legal.terms.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <TermsPage t={getMessages(locale)} />
    </main>
  );
}
