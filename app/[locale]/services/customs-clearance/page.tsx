import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { CustomsPage } from "@/components/sections/solutions/customs/CustomsPage";

type Props = { params: Promise<{ locale: string }> };

// /solutions/customs-clearance — Figma "Customs Clearance"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "customsClearance", (t) => t.solutionPages.customs.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <CustomsPage t={getMessages(locale)} />
    </main>
  );
}
