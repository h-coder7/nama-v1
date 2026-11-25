import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { CareersPage } from "@/components/sections/company/careers/CareersPage";

type Props = { params: Promise<{ locale: string }> };

// /careers — Figma "Careers"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "careers", (t) => t.careersPage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <CareersPage t={getMessages(locale)} />
    </main>
  );
}
