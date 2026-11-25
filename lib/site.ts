import type { RouteKey } from "./routes";

/** Static site data that is not translated (links, contacts, images). */
export const SITE = {
  unifiedNumber: "920009582",
  email: "namma@nammacargo.com",
  linkedin: "https://www.linkedin.com/company/namma-cargo",
  profileUrl: "/assets/namma/docs/namma-cargo-company-profile.pdf", // client-supplied profile (Nov 2026 upload)
} as const;

/** Office "Get directions" links (client-supplied pins; Jeddah has no pin yet, so it searches the national address). */
export const OFFICE_MAPS: Record<string, string> = {
  KHB: "https://maps.google.com/?q=26.346050,50.191364",
  RUH: "https://maps.google.com/?q=24.708252,46.706940",
  JED: "https://www.google.com/maps/search/?api=1&query=7304%20Prince%20Sultan%20Branch%20Road%2C%20Az%20Zahra%2C%20Jeddah%2023522",
};

/** Primary navigation (Figma header). `dropdown` opens the Solutions menu. */
/** Client amendment (Nov 2026): "Home" removed — the logo links home; "About Namma" leads. */
export const NAV: { key: "solutions" | "about" | "industries" | "projects" | "network" | "contact"; to: RouteKey; dropdown?: boolean }[] = [
  { key: "about", to: "about" },
  { key: "solutions", to: "solutions", dropdown: true },
  { key: "industries", to: "industries" },
  { key: "projects", to: "projects" },
  { key: "network", to: "network" },
  { key: "contact", to: "contact" },
];

/** Footer link columns (labels from messages.routes). */
export const FOOTER_COLUMNS: RouteKey[][] = [
  ["freightTransport", "customsClearance", "threePl", "relocationExhibitions", "projectLogistics"],
  ["about", "industries", "projects", "allProjects"],
  ["requestQuote", "trackShipment", "network", "contact", "support", "careers"],
];
export const FOOTER_LEGAL: RouteKey[] = ["privacyPolicy", "termsOfUse"];

export const img = (name: string) => `/assets/namma/images/${name}.webp`;
export const brand = (name: string) => `/assets/namma/brand/${name}.png`;
