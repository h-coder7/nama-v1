/**
 * Open roles for /careers and /careers/{job-slug} (Figma "Careers" + "Job details").
 * Copy lives in messages.careersPage.jobs[slug]; roles without approved copy show
 * the "Content pending" state from the design.
 * TODO: replace with the client's ATS / CMS feed.
 */
export type Department = "operations" | "warehouse" | "projects" | "customs" | "sales";
export type City = "khobar" | "jeddah" | "riyadh";
export type Job = { slug: string; department: Department; city: City; code: "KHB" | "JED" | "RUH"; type: "fullTime" };

export const jobs: Job[] = [
  { slug: "operations-coordinator", department: "operations", city: "khobar", code: "KHB", type: "fullTime" },
  { slug: "warehouse-supervisor", department: "warehouse", city: "jeddah", code: "JED", type: "fullTime" },
  { slug: "project-engineer", department: "projects", city: "riyadh", code: "RUH", type: "fullTime" },
  { slug: "customs-officer", department: "customs", city: "jeddah", code: "JED", type: "fullTime" },
  { slug: "sales-executive", department: "sales", city: "riyadh", code: "RUH", type: "fullTime" },
];

export const DEPARTMENTS: Department[] = ["operations", "warehouse", "projects", "customs", "sales"];
export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);
