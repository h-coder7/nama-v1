import { getMessages } from "@/lib/i18n";
import { routeMetadata } from "@/lib/page";
import { QuotePage } from "@/components/sections/company/quote/QuotePage";

type Props = { params: Promise<{ locale: string }> };

// /request-a-quote — Figma "Request a Quote"
export const generateMetadata = ({ params }: Props) =>
  routeMetadata(params, "requestQuote", (t) => t.quotePage.body);

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <main id="main">
      <QuotePage t={getMessages(locale)} />
    </main>
  );
}
