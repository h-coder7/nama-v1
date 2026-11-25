import type { ServiceKey } from "@/lib/routes";

const base = "/assets/namma/images/solutions";

/** Photos used wherever a solution page links to another service (connected-services blocks). */
export const SERVICE_IMAGES: Partial<Record<ServiceKey, string>> = {
  projectLogistics: `${base}/industrial-equipment-packing/project-logistics.webp`,
  freightTransport: `${base}/warehousing-distribution/freight-and-transport.webp`,
  warehousingDistribution: `${base}/hub/warehousing-distribution-and-customs-services.webp`,
  customsClearance: `${base}/warehousing-distribution/customs-clearance.webp`,
  relocationExhibitions: `${base}/warehousing-distribution/relocation-and-exhibitions.webp`,
  industrialEquipmentPacking: `${base}/air-sea-chartering/industrial-equipment-packing.webp`,
  threePl: `${base}/hub/solution-group-03.webp`,
  // New service pages (Nov 2026 amendments) reuse the closest approved photos until dedicated ones are supplied.
  airFreight: `${base}/air-sea-chartering/air-apron.webp`,
  seaFreight: `${base}/freight-transport/sea-open.webp`,
  lclShipments: `${base}/freight-transport/lcl-hero.webp`, // 1458px copy (sharper than home-card)
  roadFreight: `${base}/warehousing-distribution/freight-and-transport.webp`,
  transportation: `${base}/freight-transport/truck-clean.webp`,
  heavyLift: `${base}/industrial-equipment-packing/project-logistics.webp`,
  oversizedCargo: "/assets/namma/images/hero-heavy-lift.webp",
};

/** Yellow line icons (Figma "Air & Sea Chartering" related-service badges). */
export const SERVICE_ICONS: Partial<Record<ServiceKey, string>> = {
  projectLogistics: `${base}/air-sea-chartering/project-logistics-icon.svg`,
  industrialEquipmentPacking: `${base}/air-sea-chartering/industrial-equipment-packing-icon.svg`,
  customsClearance: `${base}/air-sea-chartering/customs-clearance-icon.svg`,
  freightTransport: `${base}/air-sea-chartering/freight-and-transport-icon.svg`,
};

export const solutionImg = (page: string, name: string, ext = "webp") => `${base}/${page}/${name}.${ext}`;
