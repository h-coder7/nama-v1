import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { ServiceDetail } from "@/components/sections/solutions/service-detail/ServiceDetail";

type Props = { params: Promise<{ locale: string }> };

// /services/project-logistics/heavy-lift-cargo — added in the Nov 2026 amendments (draft copy from the closest approved pages)
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "heavyLift", (t) => t.solutionPages.heavyLift.body[0]);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <ServiceDetail t={getMessages(locale)} service="heavyLift" />
    </main>
  );
}
