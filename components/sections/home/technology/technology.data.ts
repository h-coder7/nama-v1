import { img } from "@/lib/site";

/** One photo per tool, in the order the cargo meets them (matches messages.technology.items). */
export const technologyData = {
  autoplayMs: 6000,
  items: [
    { image: img("technology/warehouse-management"), focus: "68% 55%" },
    { image: img("technology/inventory-management"), focus: "50% 50%" },
    { image: img("technology/stock-visibility"), focus: "50% 30%" },
    { image: img("technology/upcoming-shipments"), focus: "50% 45%" },
    { image: img("technology/shipment-tracking"), focus: "50% 60%" },
  ],
};
