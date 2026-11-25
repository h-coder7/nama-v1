import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import { alternatesFor } from "@/lib/page";
import { SiteClosing } from "@/components/layout/SiteClosing";
import { Hero } from "@/components/sections/home/hero/Hero";
import { Solutions } from "@/components/sections/home/solutions/Solutions";
import { About } from "@/components/sections/home/about/About";
import { Numbers } from "@/components/sections/home/numbers/Numbers";
import { FeaturedProject } from "@/components/sections/home/featured-project/FeaturedProject";
import { Industries } from "@/components/sections/home/industries/Industries";
import { WhyNamma } from "@/components/sections/home/why-namma/WhyNamma";
import { Technology } from "@/components/sections/home/technology/Technology";
import { Projects } from "@/components/sections/home/projects/Projects";
import { Network } from "@/components/sections/home/network/Network";
import { Process } from "@/components/sections/home/process/Process";
import { Quote } from "@/components/sections/home/quote/Quote";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor(locale, "home") };
}

/** Home — section order per the client amendments (Nov 2026): Hero → About Namma → journey →
 *  services → … → projects (featured + cards) → network → quote. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getMessages(locale);

  return (
    <>
      <main id="main">
        <Hero t={t.hero} units={t.units} />
        <About t={t.about} common={t.common} />
        <Numbers t={t.numbers} units={t.units} companyName={t.common.companyName} />
        <Process t={t.process} />
        <Solutions t={t.solutions} />
        <Industries t={t.industries} />
        <WhyNamma t={t.why} anniversary={t.anniversary} />
        <Technology t={t.technology} />
        <FeaturedProject t={t.featured} units={t.units} />
        <Projects t={t.projects} common={t.common} />
        <Network t={t.network} common={t.common} />
        <SiteClosing t={t}>
          <Quote t={t.quote} tone="yellow" />
        </SiteClosing>
      </main>
    </>
  );
}
