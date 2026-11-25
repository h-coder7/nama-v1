import type { ServiceKey } from "@/lib/routes";
import { img } from "@/lib/site";

export type IndustryKey = "oilGas" | "industrialOperations" | "chemicals" | "energy" | "pharmaHealthcare" | "exhibitionsEvents";

/**
 * Industries page — order follows the Figma (tiles + carousel).
 * `services[i].to` links each service chip to its solution page; the chip's
 * small label is that route's name (messages.routes).
 * `drawing` = line illustration from the Figma (viewBox 0 0 142 112).
 */
export const industriesPageData: {
  key: IndustryKey;
  image: string;
  drawing: string;
  services: ServiceKey[];
}[] = [
  {
    key: "oilGas",
    image: img("industries/oil-gas-v2"),
    drawing: "M5.3252 102.15H136.675M47.9252 102.15L62.1252 52.4496L76.3252 102.15M55.0252 77.2996H69.2252M21.3002 47.1246L117.15 36.4746C126.025 38.2496 129.575 47.1246 126.025 59.5496V102.15M39.0502 46.2371L44.3752 87.9496M120.7 102.15H131.35M88.7502 102.15V77.2996H106.5V102.15",
    services: ["projectLogistics", "freightTransport", "projectLogistics", "customsClearance", "industrialEquipmentPacking", "projectLogistics"],
  },
  {
    key: "industrialOperations",
    image: img("industrial-operations"),
    drawing: "M5.3252 102.15H8.8752M8.8752 102.15H108.275M8.8752 102.15V64.875L30.1752 77.3V64.875L51.4752 77.3V64.875L72.7752 77.3V56H108.275M108.275 102.15H136.675M108.275 102.15V56M108.275 56V20.5H117.15V56M26.6252 89.725H37.2752M51.4752 89.725H62.1252M76.3252 89.725H86.9752",
    services: ["freightTransport", "warehousingDistribution", "industrialEquipmentPacking"],
  },
  {
    key: "chemicals",
    image: img("industries/oil-gas/requirements-v2"),
    drawing: "M5.3252 102.15H136.675M21.3 102.15V56H49.7V102.15M35.5 56V38.25M28.4 38.25H42.6M63.9 102.15V31.15H92.3V102.15M78.1 31.15V13.4M71 13.4H85.2M106.5 102.15V63.1H129.575V102.15M49.7 77.3H63.9M92.3 77.3H106.5M71 56H85.2M71 70.2H85.2",
    services: ["freightTransport", "customsClearance", "warehousingDistribution", "industrialEquipmentPacking"],
  },
  {
    key: "energy",
    image: img("industries/energy"),
    drawing: "M5.3252 102.15H53.2502M53.2502 102.15H60.3502M53.2502 102.15L56.8002 38.2502L60.3502 102.15M60.3502 102.15H97.6252M97.6252 102.15H115.375M97.6252 102.15L101.633 77.3002M115.375 102.15H136.675M115.375 102.15L111.367 77.3002M56.8002 36.4752L53.2502 8.0752M56.8002 36.4752L81.6502 48.9002M56.8002 36.4752L33.7252 50.6752M101.633 77.3002L103.637 64.8752M101.633 77.3002H101.175M101.633 77.3002H111.367M103.637 64.8752L104.21 61.3252M103.637 64.8752H102.95M103.637 64.8752H109.363M104.21 61.3252L105.355 54.2252M104.21 61.3252H95.8502M104.21 61.3252H108.791M105.355 54.2252L106.5 47.1252L107.645 54.2252M105.355 54.2252H92.3002M105.355 54.2252H107.645M107.645 54.2252L108.791 61.3252M107.645 54.2252H120.7M108.791 61.3252L109.363 64.8752M108.791 61.3252H117.15M109.363 64.8752L111.367 77.3002M109.363 64.8752H110.05M111.367 77.3002H111.825",
    services: ["projectLogistics", "seaFreight", "customsClearance"],
  },
  {
    key: "pharmaHealthcare",
    image: img("solutions/warehousing-distribution/warehouse-floor"),
    drawing: "M5.3252 102.15H136.675M28.4 102.15V31.15H113.6V102.15M60.35 102.15V77.3H81.65V102.15M63.9 42.7H78.1V49.8H85.2V63.9H78.1V71H63.9V63.9H56.8V49.8H63.9V42.7ZM14.2 31.15H127.8",
    services: ["airFreight", "customsClearance", "warehousingDistribution", "transportation"],
  },
  {
    key: "exhibitionsEvents",
    image: img("exhibitions-and-events"),
    drawing: "M5.3252 102.15H12.4252M12.4252 102.15H35.5002M12.4252 102.15V40.025M35.5002 102.15H74.5502M74.5502 73.75L81.6502 66.65H42.6002L35.5002 73.75V102.15M74.5502 102.15H81.6502M74.5502 102.15V73.75M81.6502 102.15H106.5M81.6502 102.15V80.85H106.5V102.15M106.5 102.15H129.575M129.575 102.15H136.675M129.575 102.15V40.025M35.5002 29.375H12.4252V40.025M12.4252 40.025H23.0752M12.4252 29.375L23.0752 40.025M35.5002 29.375H56.8002M35.5002 29.375L46.1502 40.025M56.8002 29.375H78.1002M56.8002 29.375L67.4502 40.025M78.1002 29.375H99.4002M78.1002 29.375L88.7502 40.025M129.575 40.025V29.375H99.4002M99.4002 29.375L110.05 40.025M129.575 29.375L118.925 40.025M129.575 40.025H118.925M23.0752 40.025H44.3752M118.925 40.025H110.05M44.3752 40.025H46.1502M44.3752 40.025V47.125M46.1502 40.025H67.4502M67.4502 40.025H71.0002M71.0002 40.025H88.7502M71.0002 40.025V47.125M88.7502 40.025H97.6252M97.6252 40.025H110.05M97.6252 40.025V47.125M35.5002 73.75H74.5502",
    services: ["relocationExhibitions", "customsClearance"],
  },
];

/** Construction / Industrial Operations / Exhibitions reuse homepage photos until dedicated ones are supplied. */
