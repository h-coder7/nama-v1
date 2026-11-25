import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ServiceDetail } from "@/components/sections/solutions/service-detail/ServiceDetail";

type Props = { params: Promise<{ locale: string }> };

// /services/international-freight/lcl-shipments — added in the Nov 2026 amendments (draft copy from the closest approved pages)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "lclShipments", (t) => t.solutionPages.lclShipments.body[0]);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ServiceDetail t={getMessages(locale)} service="lclShipments" />
    </main>
  );
}
