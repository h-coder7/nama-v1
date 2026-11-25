import type { RouteKey } from "@/lib/routes";

/** Order matches messages.projects.items — newest first (client, Nov 2026). */
export const projectsData: { cta: RouteKey; items: { id: string; to: RouteKey }[] } = {
  cta: "projects",
  items: [
    { id: "ras-al-zour", to: "rasAlZour" },
    { id: "qatif-gosp", to: "qatifGosp" },
    { id: "ibn-zahr-pp-ii", to: "ibnZahr" },
    { id: "sadaf-expansion", to: "sadafExpansion" },
  ],
};
