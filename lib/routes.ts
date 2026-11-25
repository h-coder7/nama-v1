/**
 * Single source of truth for the Namma sitemap
 * (Namma_Cargo_Final_Sitemap_Visual_v1 — 33 content pages + job template + 404).
 * Paths are locale-less; build links with `localePath(locale, ROUTES.x.path)`.
 * Labels live in messages/<locale>.json → "routes".
 */
export type RouteKey = keyof typeof ROUTES;

type RouteDef = { path: string; parent?: string; status: "built" | "pending" };

export const ROUTES = {
  home: { path: "/", status: "built" },

  // Services (client amendments, Nov 2026): five groups. Route keys of reused pages are kept
  // (freightTransport = International Freight hub, threePl = Contract Logistics hub,
  // industrialEquipmentPacking = Value-Added Services) so existing references keep working.
  solutions: { path: "/services", parent: "home", status: "built" },
  freightTransport: { path: "/services/international-freight", parent: "solutions", status: "built" },
  airFreight: { path: "/services/international-freight/air-freight", parent: "freightTransport", status: "built" },
  seaFreight: { path: "/services/international-freight/sea-freight", parent: "freightTransport", status: "built" },
  lclShipments: { path: "/services/international-freight/lcl-shipments", parent: "freightTransport", status: "built" },
  roadFreight: { path: "/services/international-freight/road-freight-cross-border", parent: "freightTransport", status: "built" },
  customsClearance: { path: "/services/customs-clearance", parent: "solutions", status: "built" },
  threePl: { path: "/services/contract-logistics", parent: "solutions", status: "built" },
  warehousingDistribution: { path: "/services/contract-logistics/warehousing-distribution", parent: "threePl", status: "built" },
  transportation: { path: "/services/contract-logistics/transportation", parent: "threePl", status: "built" },
  industrialEquipmentPacking: { path: "/services/contract-logistics/value-added-services", parent: "threePl", status: "built" },
  relocationExhibitions: { path: "/services/relocation-exhibitions", parent: "solutions", status: "built" },
  projectLogistics: { path: "/services/project-logistics", parent: "solutions", status: "built" },
  heavyLift: { path: "/services/project-logistics/heavy-lift-cargo", parent: "projectLogistics", status: "built" },
  oversizedCargo: { path: "/services/project-logistics/oversized-cargo-transport", parent: "projectLogistics", status: "built" },

  industries: { path: "/industries", parent: "home", status: "built" },
  oilGas: { path: "/industries/oil-gas", parent: "industries", status: "built" },
  industrialOperations: { path: "/industries/industrial", parent: "industries", status: "built" },
  chemicals: { path: "/industries/chemicals", parent: "industries", status: "built" },
  energy: { path: "/industries/energy", parent: "industries", status: "built" },
  pharmaHealthcare: { path: "/industries/pharma-healthcare", parent: "industries", status: "built" },
  exhibitionsEvents: { path: "/industries/exhibitions-events", parent: "industries", status: "built" },

  projects: { path: "/projects", parent: "home", status: "built" },
  allProjects: { path: "/projects/all", parent: "home", status: "built" },
  rasAlZour: { path: "/projects/ras-al-zour-aluminium-smelter", parent: "allProjects", status: "built" },
  qatifGosp: { path: "/projects/qatif-gas-oil-separation", parent: "allProjects", status: "built" },
  ibnZahr: { path: "/projects/ibn-zahr-pp-ii", parent: "allProjects", status: "built" },
  sadafExpansion: { path: "/projects/sadaf-expansion", parent: "allProjects", status: "built" },

  about: { path: "/about", parent: "home", status: "built" },
  network: { path: "/network", parent: "home", status: "built" },
  requestQuote: { path: "/request-a-quote", parent: "home", status: "built" },
  trackShipment: { path: "/track-shipment", parent: "home", status: "built" },
  contact: { path: "/contact", parent: "home", status: "built" },
  careers: { path: "/careers", parent: "home", status: "built" },
  support: { path: "/support", parent: "home", status: "built" },
  privacyPolicy: { path: "/privacy-policy", parent: "home", status: "built" },
  termsOfUse: { path: "/terms-of-use", parent: "home", status: "built" },
} as const satisfies Record<string, RouteDef>;

/** "/solutions" + "en" → "/en/solutions/" (trailingSlash is on). */
export function localePath(locale: string, path: string) {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return `/${locale}${clean}/`;
}

/** Breadcrumb trail from Home to the given route. */
export function trail(key: RouteKey): RouteKey[] {
  const out: RouteKey[] = [];
  let k: RouteKey | undefined = key;
  while (k) {
    const r: RouteDef = ROUTES[k];
    out.unshift(k);
    k = r.parent as RouteKey | undefined;
  }
  return out;
}

export const childrenOf = (key: RouteKey) =>
  (Object.keys(ROUTES) as RouteKey[]).filter((k) => (ROUTES[k] as RouteDef).parent === key);

/** Services menu (header dropdown, mobile menu, footer), in the client's order. */
export const SOLUTIONS_MENU: { key: RouteKey; children?: RouteKey[] }[] = [
  { key: "freightTransport", children: ["airFreight", "seaFreight", "lclShipments", "roadFreight"] },
  { key: "customsClearance" },
  { key: "threePl", children: ["warehousingDistribution", "transportation", "industrialEquipmentPacking"] },
  { key: "relocationExhibitions" },
  { key: "projectLogistics", children: ["heavyLift", "oversizedCargo"] },
];

/** International Freight services use "Request a Quote"; every other service uses "Talk to an Expert". */
export const QUOTE_SERVICES: RouteKey[] = ["freightTransport", "airFreight", "seaFreight", "lclShipments", "roadFreight"];

/** Industries, in the client's order. */
export const INDUSTRY_KEYS = ["oilGas", "industrialOperations", "chemicals", "energy", "pharmaHealthcare", "exhibitionsEvents"] as const;

/** Old URLs → new ones (production redirects in next.config). */
export const LEGACY_REDIRECTS: [string, string][] = [
  ["/solutions", "/services"],
  ["/solutions/freight-transport", "/services/international-freight"],
  ["/solutions/air-sea-chartering", "/services/international-freight"],
  ["/solutions/customs-clearance", "/services/customs-clearance"],
  ["/solutions/duty-exemption", "/services/customs-clearance"],
  ["/solutions/warehousing-distribution", "/services/contract-logistics/warehousing-distribution"],
  ["/solutions/industrial-equipment-packing", "/services/contract-logistics/value-added-services"],
  ["/solutions/relocation-exhibitions", "/services/relocation-exhibitions"],
  ["/solutions/project-logistics", "/services/project-logistics"],
  ["/3pl", "/services/contract-logistics"],
  ["/industries/industrial-operations", "/industries/industrial"],
  ["/industries/mining", "/industries/industrial"],
  ["/industries/construction", "/industries/industrial"],
];

/** Services named across the site (every service now has its own page). */
export type ServiceKey = RouteKey;
export const serviceLink = (k: ServiceKey): { to: RouteKey; query?: Record<string, string> } => ({ to: k });
