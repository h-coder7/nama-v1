import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages, locales } from "@/lib/i18n";
import { getJob, jobs } from "@/lib/jobs";
import { alternatesFor } from "@/lib/page";
import { CareersPage } from "@/components/sections/company/careers/CareersPage";

type Props = { params: Promise<{ locale: string; slug: string }> };

// /careers/{job-slug} — the Careers page with that role's details open (Figma "Job details").
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => jobs.map((j) => ({ locale, slug: j.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getMessages(locale);
  const job = (t.careersPage.jobs as Record<string, { title: string; about?: string }>)[slug];
  return {
    title: `${job?.title ?? t.routes.careers} | ${t.routes.careers}`,
    description: job?.about ?? t.careersPage.body,
    alternates: alternatesFor(locale, "careers"),
  };
}

export default async function JobPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!getJob(slug)) notFound();
  return (
    <main id="main">
      <CareersPage t={getMessages(locale)} initialJob={slug} />
    </main>
  );
}
