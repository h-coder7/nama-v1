import { img } from "@/lib/site";

export const featuredData = {
  image: img("featured-project"),
  stat: { value: "800,000" },
  to: "rasAlZour" as const,
  cards: [
    { tone: "dark", value: "275,000", to: "qatifGosp" as const },
    { tone: "yellow", value: null, to: "ibnZahr" as const },
    { tone: "light", value: "200,000", to: "sadafExpansion" as const },
  ],
} as const;
