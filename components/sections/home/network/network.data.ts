import { img } from "@/lib/site";

/** Map artwork 658×483 (Saudi regions, no baked pins). Pins are % of the image. */
const RATIO = 483 / 658;

const PINS = [
  { code: "KHB", x: 72.6, y: 35.2, side: "end" },
  { code: "RUH", x: 56.2, y: 46.6, side: "end" },
  { code: "JED", x: 19.9, y: 68.3, side: "start" },
] as const;

type Code = (typeof PINS)[number]["code"];
const pt = (c: Code) => {
  const p = PINS.find((x) => x.code === c)!;
  return { x: p.x, y: p.y * RATIO };
};
/** Gentle arc between two offices (control point lifted above the midpoint). */
const arc = (a: Code, b: Code, lift: number) => {
  const p = pt(a), q = pt(b);
  const cx = (p.x + q.x) / 2, cy = (p.y + q.y) / 2 - lift;
  return `M${p.x} ${p.y} Q${cx} ${cy} ${q.x} ${q.y}`;
};

export const networkData = {
  map: img("our-network"),
  ratio: RATIO,
  /** Only the three offices: Al Khobar (HQ), Riyadh, Jeddah. Autoplay order follows this list. */
  pins: PINS,
  routes: [
    { id: "jed-ruh", ends: ["JED", "RUH"] as Code[], d: arc("JED", "RUH", 9) },
    { id: "ruh-khb", ends: ["RUH", "KHB"] as Code[], d: arc("RUH", "KHB", 5) },
  ],
  cycleMs: 3600,
};
