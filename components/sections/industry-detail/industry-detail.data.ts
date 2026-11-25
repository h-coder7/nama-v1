import type { IconName } from "@/components/ui/Icon";
import type { RouteKey, ServiceKey } from "@/lib/routes";
import type { IndustryKey } from "@/components/sections/industries/industries-page.data";
import { SERVICE_IMAGES } from "@/components/sections/solutions/shared/services.data";

const base = "/assets/namma/images/industries";

/** Order + icons shared by every industry page ("Explore other industries", prev/next). */
export const INDUSTRY_ORDER: { key: IndustryKey; icon: IconName }[] = [
  { key: "oilGas", icon: "indOilGas" },
  { key: "industrialOperations", icon: "indIndustrialOperations" },
  { key: "chemicals", icon: "indChemicals" },
  { key: "energy", icon: "indEnergy" },
  { key: "pharmaHealthcare", icon: "indPharma" },
  { key: "exhibitionsEvents", icon: "indExhibitionsEvents" },
];

/** Each industry page in the Figma uses its own variant of some sections. */
export type IndustryVariants = {
  requirements: "columns" | "list" | "accordion";
  solutions: "featured" | "cards" | "tabs" | "switches" | "typeset";
  delivered: "band" | "split" | "stat";
  explore: "cards" | "tiles" | "tabs" | "feature" | "wheel";
};

export type IndustryDetailData = {
  key: IndustryKey;
  variants: IndustryVariants;
  slug: string;
  heroImage: string;
  requirementsImage: string;
  /** "list" variant: one photo per requirement (falls back to requirementsImage). */
  requirementImages?: string[];
  /** First item is the featured (large) card. */
  solutions: { to: ServiceKey; image: string }[];
  /** Service preselected in the "Discuss your project" panel. */
  preselect: ServiceKey;
  delivered: { year: string; yearOnImage?: boolean; project: RouteKey; image: string; freightTons: string; sector: IndustryKey };
};

/** Copy lives in messages.industryDetail[key]; this file holds images, links and numbers. */
const DETAILS: Partial<Record<IndustryKey, IndustryDetailData>> = {
  oilGas: {
    key: "oilGas",
    variants: { requirements: "columns", solutions: "cards", delivered: "band", explore: "feature" },
    slug: "oil-gas",
    heroImage: `${base}/oil-gas/hero-heavy-haul-v2.webp`,
    requirementsImage: `${base}/oil-gas/requirements-v2.webp`,
    solutions: [
      { to: "projectLogistics", image: `${base}/oil-gas/project-logistics.webp` },
      { to: "freightTransport", image: `${base}/oil-gas/freight-transport.webp` },
      { to: "customsClearance", image: `${base}/oil-gas/customs-clearance.webp` },
      { to: "industrialEquipmentPacking", image: `${base}/oil-gas/industrial-equipment-packing.webp` },
    ],
    preselect: "projectLogistics",
    delivered: { year: "2002", project: "qatifGosp", image: `${base}/oil-gas/delivered-v2.webp`, freightTons: "275,000", sector: "oilGas" },
  },
  // Chemicals (Nov 2026 amendments): layout of the retired Mining page, closest approved photos
  // until dedicated ones are supplied.
  chemicals: {
    key: "chemicals",
    variants: { requirements: "columns", solutions: "cards", delivered: "split", explore: "feature" },
    slug: "chemicals",
    heroImage: "/assets/namma/images/solutions/industrial-equipment-packing/hero.webp",
    requirementsImage: `${base}/oil-gas/requirements-v2.webp`,
    solutions: [
      { to: "freightTransport", image: "" },
      { to: "customsClearance", image: "" },
      { to: "warehousingDistribution", image: "" },
      { to: "industrialEquipmentPacking", image: "" },
    ],
    preselect: "freightTransport",
    delivered: { year: "2002", project: "qatifGosp", image: `${base}/mining/delivered.webp`, freightTons: "275,000", sector: "oilGas" },
  },
  energy: {
    key: "energy",
    variants: { requirements: "columns", solutions: "cards", delivered: "stat", explore: "feature" },
    slug: "energy",
    heroImage: `${base}/energy/hero.webp`,
    requirementsImage: `${base}/energy/project-logistics.webp`,
    // Only the Project Logistics photo was supplied for this page; the other tabs reuse Mining photos.
    solutions: [
      { to: "projectLogistics", image: `${base}/energy/project-logistics.webp` },
      { to: "seaFreight", image: `${base}/energy/project-logistics.webp` },
      { to: "customsClearance", image: `${base}/mining/customs-clearance.webp` },
      { to: "industrialEquipmentPacking", image: `${base}/mining/industrial-equipment-packing.webp` },
    ],
    preselect: "projectLogistics",
    // As in the Figma (Qatif GOSP, Oil & Gas).
    delivered: { year: "2002", project: "qatifGosp", image: `${base}/energy/delivered.webp`, freightTons: "275,000", sector: "oilGas" },
  },
  // Pharma & Healthcare (Nov 2026 amendments): layout of the retired Construction page.
  pharmaHealthcare: {
    key: "pharmaHealthcare",
    variants: { requirements: "columns", solutions: "cards", delivered: "band", explore: "feature" },
    slug: "pharma-healthcare",
    heroImage: "/assets/namma/images/solutions/warehousing-distribution/warehouse-floor.webp",
    requirementsImage: "/assets/namma/images/solutions/warehousing-distribution/container-yard.webp",
    solutions: [
      { to: "airFreight", image: "" },
      { to: "customsClearance", image: "" },
      { to: "warehousingDistribution", image: "" },
      { to: "transportation", image: "" },
    ],
    preselect: "airFreight",
    delivered: { year: "2002", project: "qatifGosp", image: `${base}/construction/delivered.webp`, freightTons: "275,000", sector: "oilGas" },
  },
  industrialOperations: {
    key: "industrialOperations",
    variants: { requirements: "columns", solutions: "cards", delivered: "stat", explore: "feature" },
    slug: "industrial",
    heroImage: `${base}/industrial-operations/hero.webp`,
    // One photo supplied for all three requirements.
    requirementsImage: `${base}/industrial-operations/requirements.webp`,
    // Requirements 4–9 come from the retired Mining and Construction pages (Nov 2026), with their photos.
    requirementImages: [
      `${base}/industrial-operations/requirements.webp`, `${base}/industrial-operations/requirements.webp`, `${base}/industrial-operations/requirements.webp`,
      `${base}/mining/requirement.webp`, `${base}/mining/requirement.webp`, `${base}/mining/requirement.webp`,
      `${base}/construction/requirements.webp`, `${base}/construction/requirements.webp`, `${base}/construction/requirements.webp`,
    ],
    // Typeset tiles are type-only in the Figma.
    solutions: [
      { to: "projectLogistics", image: "" },
      { to: "freightTransport", image: "" },
      { to: "customsClearance", image: "" },
      { to: "industrialEquipmentPacking", image: "" },
    ],
    preselect: "industrialEquipmentPacking",
    // As in the Figma (Qatif GOSP, Oil & Gas).
    delivered: { year: "2002", project: "qatifGosp", image: `${base}/industrial-operations/delivered.webp`, freightTons: "275,000", sector: "oilGas" },
  },
  exhibitionsEvents: {
    key: "exhibitionsEvents",
    variants: { requirements: "columns", solutions: "cards", delivered: "split", explore: "feature" },
    slug: "exhibitions-events",
    heroImage: `${base}/exhibitions-events/hero.webp`,
    requirementsImage: `${base}/exhibitions-events/requirements.webp`,
    solutions: [
      { to: "projectLogistics", image: `${base}/exhibitions-events/project-logistics.webp` },
      { to: "freightTransport", image: `${base}/exhibitions-events/freight-transport.webp` },
      { to: "customsClearance", image: `${base}/exhibitions-events/customs-clearance.webp` },
      { to: "industrialEquipmentPacking", image: `${base}/exhibitions-events/industrial-equipment-packing.webp` },
    ],
    preselect: "relocationExhibitions",
    // As in the Figma (Qatif GOSP, Oil & Gas).
    delivered: { year: "2002", project: "qatifGosp", image: `${base}/exhibitions-events/delivered.webp`, freightTons: "275,000", sector: "oilGas", yearOnImage: true },
  },
};

/** Solution photos come from the approved per-solution set (same as the solution pages'
 *  connected-services blocks), matched by service name; the local image is only a fallback. */
export const INDUSTRY_DETAILS: Partial<Record<IndustryKey, IndustryDetailData>> = Object.fromEntries(
  Object.entries(DETAILS).map(([k, d]) => [k, { ...d!, solutions: d!.solutions.map((s) => ({ ...s, image: SERVICE_IMAGES[s.to] ?? s.image })) }]),
);
