import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { AboutPage } from "@/components/sections/company/about/AboutPage";

type Props = { params: Promise<{ locale: string }> };

// /about — Figma "About"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "about", (t) => t.aboutPage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <AboutPage t={getMessages(locale)} />
    </main>
  );
}
