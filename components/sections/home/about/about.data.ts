import { SITE } from "@/lib/site";

export const aboutData = {
  foundedYear: "1983",
  ctas: { primary: "about" as const, profile: SITE.profileUrl },
  /** Index of the milestone selected on load (1983 — the founding year sits in the big number). */
  initialMilestone: 0,
} as const;
