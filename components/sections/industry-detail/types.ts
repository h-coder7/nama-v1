import type { Messages } from "@/lib/i18n";
import type { IndustryDetailData } from "./industry-detail.data";

/** Copy for one industry page (messages.industryDetail.<key>). */
export type IndustryCopy = {
  body: string;
  requirements: { title: string; body: string; tag?: string }[];
  featuredSolutionBody: string;
  delivered: { title: string; body: string; role: string };
};
export type DetailCommon = Messages["industryDetail"]["common"];

/** Props every industry-detail section receives. */
export type SectionProps = {
  t: Messages;
  c: DetailCommon;
  copy: IndustryCopy;
  data: IndustryDetailData;
  name: string; // localized industry name
  index: number; // 0-based position in INDUSTRY_ORDER
  total: number;
};
