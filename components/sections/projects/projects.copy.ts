import type { Messages } from "@/lib/i18n";
import type { IndustryKey } from "@/components/sections/industries/industries-page.data";
import type { ProjectCategory, ProjectRow } from "./projects.data";

export type ProjectsCopy = Messages["projectsPage"];

/** 4,000,000 — Latin digits in both languages (as across the site). */
export const num = (n: number) => n.toLocaleString("en-US");

/** "4,000,000 FT" / "4,000,000 طن شحن" */
export const ft = (p: ProjectsCopy, n: number) => `${num(n)} ${p.ft}`;

/** Row volume: "50,000 FT", or the list's own wording when it records something else. */
export const volOf = (p: ProjectsCopy, r: ProjectRow) =>
  r.volume != null ? ft(p, r.volume) : r.volumeNote ? p.volumeNotes[r.volumeNote.key].replace("{n}", num(r.volumeNote.n)) : p.noSite;

export const siteOf = (p: ProjectsCopy, r: ProjectRow) => p.sites[r.site] ?? p.noSite;
export const clientName = (p: ProjectsCopy, client?: string) =>
  client ? ((p.clients as Record<string, string>)[client] ?? client) : "";

/** Project type → the industry preselected in the "Discuss your project" panel. */
export const CATEGORY_INDUSTRY: Record<ProjectCategory, IndustryKey> = {
  petrochemical: "industrialOperations",
  industrialMining: "industrialOperations",
  oilGas: "oilGas",
  otherCargo: "industrialOperations",
  powerWater: "energy",
  infrastructure: "industrialOperations",
};
