import type { RouteKey } from "@/lib/routes";

/** Where each "Start with what you need" option leads. */
export const quoteData: {
  options: ({ action: "focus-form" } | { action: "link"; to: RouteKey })[];
  endpoint: string | null;
} = {
  options: [{ action: "focus-form" }, { action: "link", to: "trackShipment" }, { action: "link", to: "contact" }],
  /** TODO: replace with the real endpoint (Laravel API / form service). */
  endpoint: null,
};
