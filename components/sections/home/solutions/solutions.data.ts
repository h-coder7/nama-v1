import type { RouteKey, ServiceKey } from "@/lib/routes";
import { img } from "@/lib/site";

/** Order matches messages.solutions.items — the five service groups (client amendments, Nov 2026).
 *  `chips` link to each group's sub-service pages. */
export const solutionsData: { id: string; to: ServiceKey; image: string; chips: (RouteKey | null)[] }[] = [
  { id: "international-freight", to: "freightTransport", image: img("solutions/hub/solution-group-02"), chips: ["airFreight", "seaFreight", "lclShipments", "roadFreight"] },
  { id: "customs-clearance", to: "customsClearance", image: img("solutions/customs-clearance/home-card"), chips: [] },
  { id: "contract-logistics", to: "threePl", image: img("solutions/hub/solution-group-03"), chips: ["warehousingDistribution", "transportation", "industrialEquipmentPacking"] },
  { id: "relocation-exhibitions", to: "relocationExhibitions", image: img("solutions/hub/solution-group-04"), chips: [] },
  { id: "project-logistics", to: "projectLogistics", image: img("solutions-built-around-your-supply-chain"), chips: ["heavyLift", "oversizedCargo"] },
];
