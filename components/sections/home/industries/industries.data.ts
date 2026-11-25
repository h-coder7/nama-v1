import { img } from "@/lib/site";

/** Order matches messages.industries.items (client amendments, Nov 2026).
 *  Chemicals / Pharma reuse the closest approved photos until dedicated ones are supplied. */
export const industriesData = [
  { id: "oil-gas", image: img("oil-and-gas"), to: "oilGas" as const },
  { id: "industrial", image: img("industrial-operations"), to: "industrialOperations" as const },
  { id: "chemicals", image: img("industries/oil-gas/requirements-v2"), to: "chemicals" as const },
  { id: "energy", image: img("energy"), to: "energy" as const },
  { id: "pharma-healthcare", image: img("solutions/warehousing-distribution/warehouse-floor"), to: "pharmaHealthcare" as const },
  { id: "exhibitions-events", image: img("exhibitions-and-events"), to: "exhibitionsEvents" as const },
] as const;
