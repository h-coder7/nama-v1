import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ContactPage } from "@/components/sections/company/contact/ContactPage";

type Props = { params: Promise<{ locale: string }> };

// /contact — Figma "Contact"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "contact", (t) => t.contactPage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ContactPage t={getMessages(locale)} />
    </main>
  );
}
