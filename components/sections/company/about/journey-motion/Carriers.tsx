/**
 * The travelling unit, drawn in its own small SVG that stays in the same place on
 * screen while the landscape slides under it. The Namma box sits on the same deck
 * (y=262) on every carrier; road carriers drive in the far lane, so their group is
 * lowered by LANE[k] (the motion hook moves the whole unit to that lane on a swap).
 * Kinds: 0 forklift · 1 truck · 2 ship · 3 train.
 */
const I = "var(--j-ink)";
const Y = "var(--j-yellow)";
const S = "var(--j-shade)";
const W = "var(--j-white)";
const LINE = { fill: "none", stroke: I, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const FINE = { fill: "none", stroke: I, strokeWidth: 1.2, strokeLinecap: "round", opacity: 0.55 } as const;

/** Vertical offset per carrier: road vehicles sit in the far lane of the asphalt road. */
export const LANE = [17, 17, 0, 0];

function Wheel({ cx, cy, r = 13 }: { cx: number; cy: number; r?: number }) {
  return (
    <g data-wheel data-c={`${cx} ${cy}`}>
      <circle cx={cx} cy={cy} r={r} fill={I} />
      <circle cx={cx} cy={cy} r={r * 0.62} fill={W} stroke={I} strokeWidth={1.2} />
      {[0, 72, 144, 216, 288].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <path key={a} d={`M${cx} ${cy} l${Math.cos(rad) * r * 0.55} ${Math.sin(rad) * r * 0.55}`} stroke={I} strokeWidth={1.2} />;
      })}
      <circle cx={cx} cy={cy} r={2.2} fill={Y} stroke={I} strokeWidth={1} />
    </g>
  );
}

export function Carriers() {
  return (
    <g>
      {/* 0 forklift carrying the pallet */}
      <g data-carrier="0">
        <path d="M80 262 H164 M80 274 H164" {...LINE} />
        {[84, 120, 158].map((x) => <rect key={x} x={x} y={262} width={6} height={12} fill={S} stroke={I} strokeWidth={1.4} />)}
        <path d="M76 270 H168" stroke={I} strokeWidth={3} strokeLinecap="round" />
        {/* mast + carriage */}
        <path d="M74 196 V292 M68 196 V292" {...LINE} />
        <path d="M66 196 h12" {...LINE} strokeWidth={2.4} />
        {/* body, counterweight, overhead guard */}
        <path d="M24 298 V258 q0 -8 8 -8 H62 V298 Z" fill={Y} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <path d="M18 298 V268 h10 v30" fill={S} stroke={I} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M30 250 V206 H62 V250 M30 206 l-4 -4 M46 206 V250" {...LINE} strokeWidth={1.8} />
        <path d="M40 236 h12 l4 14" {...FINE} opacity={0.7} />
        <circle cx={34} cy={204} r={3} fill={Y} stroke={I} strokeWidth={1.2} />
        <Wheel cx={56} cy={288} r={12} />
        <Wheel cx={30} cy={290} r={10} />
      </g>

      {/* 1 truck: low flatbed trailer + cab-over tractor */}
      <g data-carrier="1">
        <path d="M14 262 H180 V274 H14 Z" fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <path d="M14 268 H180" {...FINE} opacity={0.35} />
        {[26, 46, 160].map((x) => <path key={x} d={`M${x} 262 v-10`} {...LINE} strokeWidth={1.6} />)}
        {/* mudguards */}
        <path d="M30 274 q22 -14 44 0 M196 274 q20 -14 40 0" {...LINE} strokeWidth={1.6} />
        {/* tractor */}
        <path d="M180 274 V220 q0 -6 6 -6 H226 q6 0 8 6 L242 246 V274 Z" fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <path d="M190 222 H226 L234 246 H190 Z" fill={S} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M200 222 l-8 24" stroke={W} strokeWidth={3} opacity={0.8} />
        <path d="M186 214 v-6 h40 v6" fill={Y} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M236 254 h8 M236 260 h8 M236 266 h8" {...FINE} opacity={0.7} />
        <rect x={238} y={268} width={8} height={8} rx={2} fill={Y} stroke={I} strokeWidth={1.2} />
        <rect x={196} y={254} width={26} height={10} rx={3} fill={S} stroke={I} strokeWidth={1.4} />
        <path d="M184 220 V196" {...LINE} strokeWidth={3} />
        <path d="M244 226 h6 v10" {...LINE} strokeWidth={1.4} />
        {/* a second, smaller crate rides behind the Namma box on the road leg */}
        <g>
          <rect x={24} y={224} width={54} height={38} rx={2} fill={W} stroke={I} strokeWidth={2} />
          <path d="M24 224 l5 -5 h54 l-5 5 M78 224 l5 -5 v38 l-5 5" fill={S} stroke={I} strokeWidth={1.5} strokeLinejoin="round" />
          <path d="M24 224 L78 262 M78 224 L24 262" stroke={I} strokeWidth={1} opacity={0.35} />
          <path d="M36 236 h30 M36 244 h22" stroke={Y} strokeWidth={3} strokeLinecap="round" />
        </g>
        <Wheel cx={42} cy={286} />
        <Wheel cx={70} cy={286} />
        <Wheel cx={216} cy={286} />
      </g>

      {/* 2 ship: container feeder (box on the fore deck), hull below the waterline */}
      <g data-carrier="2">
        <path d="M6 262 H230 C238 262 240 272 232 284 L218 306 H30 L10 278 Z" fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <path d="M14 284 H230" stroke={Y} strokeWidth={5} />
        <path d="M16 294 H226" {...FINE} opacity={0.3} />
        <circle cx={214} cy={272} r={3} fill="none" stroke={I} strokeWidth={1.2} />
        {/* deck cargo aft of the box */}
        <rect x={156} y={240} width={34} height={22} fill={S} stroke={I} strokeWidth={1.5} />
        <rect x={156} y={218} width={34} height={22} fill={W} stroke={I} strokeWidth={1.5} />
        {/* bridge, windows, funnel, mast */}
        <path d="M16 262 V214 H58 V262" fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <path d="M12 214 H62" {...LINE} />
        {[22, 34, 46].map((x) => <rect key={x} x={x} y={222} width={8} height={7} fill={S} stroke={I} strokeWidth={1} />)}
        <path d="M24 214 V194 H44 V214" fill={W} stroke={I} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M24 200 H44" stroke={Y} strokeWidth={4} />
        <path d="M70 262 V196 M62 208 h16" {...LINE} strokeWidth={1.6} />
      </g>

      {/* 3 train: flat wagon on two bogies */}
      <g data-carrier="3">
        <path d="M30 262 H214 V276 H30 Z" fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <path d="M30 269 H214" {...FINE} opacity={0.35} />
        <path d="M214 270 h18 M226 266 v8 M30 270 h-16 M18 266 v8" {...LINE} strokeWidth={1.8} />
        <path d="M52 276 h52 M140 276 h52" {...LINE} strokeWidth={3} />
        <Wheel cx={64} cy={290} r={10} />
        <Wheel cx={92} cy={290} r={10} />
        <Wheel cx={152} cy={290} r={10} />
        <Wheel cx={180} cy={290} r={10} />
      </g>

      {/* the box */}
      <g data-box>
        <rect x={90} y={264} width={64} height={4} fill={I} opacity={0.12} />
        <rect x={88} y={208} width={64} height={54} rx={3} fill={Y} stroke={I} strokeWidth={2} />
        <path d="M88 220 H152 M96 208 v54 M144 208 v54" stroke={I} strokeWidth={1} opacity={0.3} />
        <path d="M88 208 l6 -6 h64 l-6 6 M152 208 l6 -6 v54 l-6 6" fill={S} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
        {/* Namma "N" on the box */}
        <path d="M225 3H182L141 42L140 3L96 4L0 96V127H49L95 84L97 127H137L225 42Z" transform="translate(104 228) scale(0.145)" fill={I} />
      </g>
    </g>
  );
}
