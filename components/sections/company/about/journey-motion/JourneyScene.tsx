/**
 * The continuous line-art landscape the box travels through (SVG user units).
 * One stage = 640 wide; buildings stand on y=300 (the far kerb of the road).
 * Style: architectural line drawing — a firm ink outline, finer detail lines, one
 * shaded face per volume for depth, soft ground shadows and yellow accents only.
 * Road: an outlined asphalt carriageway (kerb, edge lines, dashed centre line) that
 * gives way to the quay and sea, then to the rail bed at the arrival port.
 */
export const STAGE_W = 640;
export const GROUND = 300;
export const SEA = [2600, 3240] as const;
/** Where the rail bed ends and the road resumes after the arrival quay. */
export const RAIL_END = 4480;
/** Road geometry (far kerb → near edge); vehicles drive in the far lane. */
export const ROAD = { top: GROUND, centre: 323, bottom: 346 } as const;
/** How far the ground and skyline run past each end of the route (the scene svg overflows). */
const OVER = 2400;

const I = "var(--j-ink)";
const Y = "var(--j-yellow)";
const S = "var(--j-shade)";
const W = "var(--j-white)";
const LINE = { fill: "none", stroke: I, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const FINE = { fill: "none", stroke: I, strokeWidth: 1.2, strokeLinecap: "round", opacity: 0.55 } as const;

/** Soft contact shadow under a volume. */
function Shadow({ cx, w }: { cx: number; w: number }) {
  return <ellipse cx={cx} cy={GROUND + 1} rx={w / 2} ry={4} fill={I} opacity={0.07} />;
}

/* ------------------------------------------------------------------ ground */

function Road({ x0, x1 }: { x0: number; x1: number }) {
  const { top, centre, bottom } = ROAD;
  return (
    <g>
      {/* asphalt outline: kerb, kerb face, near edge */}
      <path d={`M${x0} ${top} H${x1} M${x0} ${top + 5} H${x1} M${x0} ${bottom} H${x1}`} {...LINE} />
      {/* lane edge lines */}
      <path d={`M${x0} ${top + 10} H${x1} M${x0} ${bottom - 5} H${x1}`} {...FINE} opacity={0.3} />
      {/* dashed centre line */}
      <path d={`M${x0 + 12} ${centre} H${x1}`} fill="none" stroke={I} strokeWidth={2.4} strokeDasharray="26 22" opacity={0.6} />
      {/* kerb joints */}
      {Array.from({ length: Math.floor((x1 - x0) / 48) }, (_, k) => (
        <path key={k} d={`M${x0 + 24 + k * 48} ${top} v5`} {...FINE} opacity={0.35} />
      ))}
    </g>
  );
}

function Quay({ x, side }: { x: number; side: "left" | "right" }) {
  const s = side === "left" ? 1 : -1;
  return (
    <g>
      {/* quay wall dropping to the water, fender and bollard */}
      <path d={`M${x} ${GROUND} V${ROAD.bottom} M${x - 60 * s} ${ROAD.bottom} H${x}`} {...LINE} />
      <rect x={side === "left" ? x - 10 : x + 2} y={GROUND + 8} width={8} height={26} rx={3} fill={Y} stroke={I} strokeWidth={1.5} />
      <path d={`M${x - 30 * s} ${GROUND} v-10 h${8 * s} v10`} {...LINE} strokeWidth={1.6} />
    </g>
  );
}

function Rails({ x0, x1 }: { x0: number; x1: number }) {
  const sleepers = [];
  for (let x = x0 + 6; x <= x1; x += 20) sleepers.push(<path key={x} d={`M${x} ${GROUND + 3} h10`} stroke={I} strokeWidth={4} opacity={0.75} />);
  return (
    <g>
      {/* ballast bed */}
      <path d={`M${x0} ${GROUND + 10} L${x0 + 10} ${GROUND + 26} H${x1 - 10} L${x1} ${GROUND + 10}`} {...LINE} strokeWidth={1.6} />
      {Array.from({ length: Math.floor((x1 - x0) / 30) }, (_, k) => (
        <circle key={k} cx={x0 + 22 + k * 30} cy={GROUND + 18 + (k % 2) * 3} r={1.6} fill={I} opacity={0.25} />
      ))}
      {sleepers}
      <path d={`M${x0} ${GROUND} H${x1}`} {...LINE} strokeWidth={2.4} />
      <path d={`M${x0} ${GROUND + 9} H${x1}`} {...LINE} strokeWidth={1.4} />
    </g>
  );
}

function Waves({ x0, x1 }: { x0: number; x1: number }) {
  const row = (y: number, start: number, end: number, amp: number) => {
    let d = `M${start} ${y}`;
    for (let x = start; x < end; x += 40) d += ` q10 -${amp} 20 0 t20 0`;
    return d;
  };
  return (
    <g fill="none" stroke={I} strokeLinecap="round">
      <path d={row(GROUND + 2, x0, x1, 7)} strokeWidth={2} />
      <path d={row(GROUND + 22, x0 + 24, x1 - 24, 5)} strokeWidth={1.3} opacity={0.45} />
      <path d={row(GROUND + 40, x0 + 60, x1 - 60, 4)} strokeWidth={1.1} opacity={0.25} />
    </g>
  );
}

/* ------------------------------------------------------------------ street furniture */

function Palm({ x, h = 92, flip }: { x: number; h?: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  const tx = x + 10 * s;
  const ty = GROUND - h;
  return (
    <g>
      <path d={`M${x} ${GROUND} Q${x + 2 * s} ${GROUND - h / 2} ${tx} ${ty}`} {...LINE} strokeWidth={4} opacity={0.9} />
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <path key={t} d={`M${x + t * 10 * s - 3} ${GROUND - t * h} h6`} {...FINE} opacity={0.5} />
      ))}
      {[[-34, 10], [-22, -12], [0, -20], [22, -12], [34, 10], [-10, 18], [12, 20]].map(([dx, dy], k) => (
        <path key={k} d={`M${tx} ${ty} Q${tx + dx * 0.55} ${ty + dy * 0.7 - 12} ${tx + dx} ${ty + dy}`} {...LINE} strokeWidth={1.8} />
      ))}
      <circle cx={tx - 3} cy={ty + 6} r={3} fill={Y} stroke={I} strokeWidth={1.2} />
    </g>
  );
}

function Lamp({ x, flip }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g>
      <path d={`M${x} ${GROUND} V196 q0 -12 ${12 * s} -12 h${16 * s}`} {...LINE} strokeWidth={1.8} />
      <path d={`M${x + 22 * s} 184 h${14 * s} l${-3 * s} 6 h${-8 * s} Z`} fill={W} stroke={I} strokeWidth={1.5} strokeLinejoin="round" />
      <path d={`M${x + 25 * s} 191 l${-6 * s} 16 M${x + 33 * s} 191 l${6 * s} 16`} stroke={Y} strokeWidth={1.4} opacity={0.7} />
    </g>
  );
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d={`M${x} ${y} h${70 * s} a${12 * s} ${12 * s} 0 0 0 -8 ${-21 * s} a${18 * s} ${18 * s} 0 0 0 -32 ${-8 * s} a${14 * s} ${14 * s} 0 0 0 -26 ${10 * s} a${10 * s} ${10 * s} 0 0 0 -4 ${19 * s} Z`}
      fill={W} stroke={I} strokeWidth={1.4} strokeLinejoin="round" opacity={0.7}
    />
  );
}

/** A faint skyline behind everything, for depth. */
function Skyline({ x0, x1 }: { x0: number; x1: number }) {
  const blocks: [number, number, number][] = [];
  let x = x0;
  let k = 0;
  while (x < x1) {
    const w = 34 + ((k * 37) % 46);
    const h = 40 + ((k * 53) % 70);
    blocks.push([x, w, h]);
    x += w + 10 + ((k * 17) % 30);
    k++;
  }
  return (
    <g opacity={0.16}>
      {blocks.map(([bx, w, h], i) => (
        <g key={i}>
          <rect x={bx} y={GROUND - h} width={w} height={h} fill="none" stroke={I} strokeWidth={1.2} />
          {i % 3 === 0 && <path d={`M${bx + w / 2} ${GROUND - h} v-14`} stroke={I} strokeWidth={1.2} />}
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ buildings */

function Office({ cx }: { cx: number }) {
  const x = cx - 190;
  const w = 120;
  const top = 120;
  return (
    <g>
      <Shadow cx={x + w / 2 + 14} w={w + 40} />
      {/* side face (depth) */}
      <path d={`M${x + w} ${top} l22 -12 V${GROUND - 8} l-22 8 Z`} fill={S} stroke={I} strokeWidth={2} strokeLinejoin="round" />
      {/* curtain wall */}
      <rect x={x} y={top} width={w} height={GROUND - top} fill={W} stroke={I} strokeWidth={2} />
      {Array.from({ length: 5 }, (_, c) => <path key={`v${c}`} d={`M${x + 12 + c * 24} ${top + 14} V${GROUND - 44}`} {...FINE} />)}
      {Array.from({ length: 9 }, (_, r) => <path key={`h${r}`} d={`M${x + 12} ${top + 14 + r * 15.5} H${x + w - 12}`} {...FINE} opacity={0.35} />)}
      {/* parapet, rooftop plant and mast */}
      <path d={`M${x - 4} ${top} H${x + w + 4} M${x + 18} ${top} v-12 h34 v12 M${x + 88} ${top} V${top - 40}`} {...LINE} />
      <circle cx={x + 88} cy={top - 42} r={3} fill={Y} stroke={I} strokeWidth={1.2} />
      {/* entrance canopy + glazed door */}
      <path d={`M${x + 30} ${GROUND - 36} H${x + 90} L${x + 96} ${GROUND - 44} H${x + 24} Z`} fill={Y} stroke={I} strokeWidth={1.8} strokeLinejoin="round" />
      <rect x={x + 44} y={GROUND - 34} width={32} height={34} fill={W} stroke={I} strokeWidth={1.8} />
      <path d={`M${x + 60} ${GROUND - 34} V${GROUND}`} {...FINE} />
      {/* the approved document */}
      <g transform={`translate(${cx - 30} 132) rotate(-5)`}>
        <path d="M6 8 h92 v120 h-92 Z" fill={I} opacity={0.08} />
        <path d="M0 0 h78 l18 18 v104 h-96 Z" fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <path d="M78 0 v18 h18" fill={S} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M14 20 h40" stroke={I} strokeWidth={3} strokeLinecap="round" />
        {[38, 50, 62, 74].map((y, i) => <path key={y} d={`M14 ${y} H${[80, 70, 82, 58][i]}`} {...FINE} opacity={0.6} />)}
        <path d="M14 104 c6 -8 10 4 16 -4 s8 6 14 -2" {...LINE} strokeWidth={1.4} />
        <circle cx={72} cy={98} r={15} fill={Y} stroke={I} strokeWidth={2} />
        <path d="M65 98 l5 5 l9 -10" {...LINE} strokeWidth={2.4} />
      </g>
      <Palm x={cx + 120} h={84} />
    </g>
  );
}

function Factory({ cx }: { cx: number }) {
  const x = cx - 170;
  return (
    <g>
      <Shadow cx={x + 150} w={330} />
      {/* storage tank */}
      <g>
        <path d={`M${x + 250} ${GROUND} V208 a26 8 0 0 1 52 0 V${GROUND}`} fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <ellipse cx={x + 276} cy={208} rx={26} ry={8} fill={S} stroke={I} strokeWidth={2} />
        {[232, 256, 280].map((y) => <path key={y} d={`M${x + 250} ${y} q26 8 52 0`} {...FINE} opacity={0.4} />)}
        <path d={`M${x + 296} 214 V${GROUND} M${x + 296} 230 h8 M${x + 296} 252 h8 M${x + 296} 274 h8`} {...FINE} />
      </g>
      {/* main hall with saw-tooth roof and glazed north lights */}
      <path d={`M${x} ${GROUND} V214 l44 -30 V214 l44 -30 V214 l44 -30 V214 l44 -30 V214 h26 V${GROUND} Z`} fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M${x + 44 + k * 44} 184 V214 l-10 0 l10 -7`} fill={Y} opacity={0.55} stroke="none" />
      ))}
      {[0, 1, 2, 3].map((k) => <path key={`g${k}`} d={`M${x + 44 + k * 44} 190 l-36 24`} {...FINE} opacity={0.3} />)}
      <path d={`M${x} 226 H${x + 202}`} {...FINE} opacity={0.35} />
      {/* chimney with soft smoke */}
      <path d={`M${x + 214} 214 V112 h20 V214`} fill={S} stroke={I} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x + 212} 112 h24 M${x + 214} 130 h20`} {...LINE} strokeWidth={1.6} />
      <path d={`M${x + 224} 104 c-14 -10 6 -22 -4 -34 c18 -2 22 -20 40 -14 c14 -14 34 -4 30 10`} {...FINE} strokeWidth={1.6} opacity={0.45} />
      {/* roller door (yellow) + personnel door + windows */}
      <rect x={x + 26} y={244} width={58} height={56} fill={Y} stroke={I} strokeWidth={2} />
      {[252, 260, 268, 276, 284, 292].map((y) => <path key={y} d={`M${x + 26} ${y} H${x + 84}`} stroke={I} strokeWidth={1} opacity={0.35} />)}
      <rect x={x + 96} y={262} width={20} height={38} fill={W} stroke={I} strokeWidth={1.8} />
      {[0, 1, 2].map((i) => <rect key={i} x={x + 128 + i * 26} y={238} width={18} height={20} fill={S} stroke={I} strokeWidth={1.5} />)}
      {/* pipe rack */}
      <path d={`M${x + 202} 232 H${x + 250} M${x + 202} 240 H${x + 250}`} {...LINE} strokeWidth={1.6} />
      <Lamp x={cx + 160} />
    </g>
  );
}

function Warehouse({ cx, racks }: { cx: number; racks?: boolean }) {
  const x = cx - 150;
  const w = 290;
  return (
    <g>
      <Shadow cx={x + w / 2 + 12} w={w + 30} />
      {/* depth face */}
      <path d={`M${x + w} 196 l20 -10 V${GROUND - 8} l-20 8 Z`} fill={S} stroke={I} strokeWidth={2} strokeLinejoin="round" />
      {/* portal frame with ribbed cladding */}
      <path d={`M${x} ${GROUND} V196 L${x + w / 2} 150 L${x + w} 196 V${GROUND} Z`} fill={W} stroke={I} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x + w / 2} 150 l20 -10 L${x + w + 20} 186`} {...LINE} />
      <path d={`M${x} 196 H${x + w}`} {...LINE} strokeWidth={1.4} />
      {Array.from({ length: 13 }, (_, k) => <path key={k} d={`M${x + 12 + k * 22} 200 V${GROUND - 4}`} {...FINE} opacity={0.22} />)}
      {/* signage band */}
      <rect x={x + w / 2 - 42} y={164} width={84} height={18} rx={2} fill={Y} stroke={I} strokeWidth={1.6} />
      <path d={`M${x + w / 2 - 30} 173 h60`} stroke={I} strokeWidth={2} opacity={0.6} />
      {racks ? (
        // Cut-away: the inside of the distribution centre, racking with stock.
        <g>
          <rect x={x + 20} y={208} width={w - 40} height={GROUND - 208} fill={W} stroke={I} strokeWidth={1.8} />
          {[0, 1, 2].map((r) => <path key={r} d={`M${x + 20} ${236 + r * 22} H${x + w - 20}`} {...LINE} strokeWidth={1.4} />)}
          {[x + 20, x + 100, x + 180, x + w - 20].map((v) => <path key={v} d={`M${v} 208 V${GROUND}`} {...LINE} strokeWidth={1.4} />)}
          {[[30, 218], [60, 218], [112, 218], [196, 218], [226, 218], [40, 240], [124, 240], [150, 240], [208, 240], [30, 262], [70, 262], [134, 262], [190, 262], [236, 262], [52, 284], [160, 284]].map(([dx, dy]) => (
            <g key={`${dx}${dy}`}>
              <rect x={x + dx} y={dy} width={22} height={18} fill={Y} stroke={I} strokeWidth={1.4} />
              <path d={`M${x + dx} ${dy + 6} h22`} stroke={I} strokeWidth={0.8} opacity={0.4} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          {/* loading dock: two roller doors (one open, lit) with dock levellers */}
          {[0, 1].map((d) => (
            <g key={d}>
              <rect x={x + 40 + d * 110} y={222} width={86} height={GROUND - 222 - 12} fill={d ? Y : W} stroke={I} strokeWidth={1.8} />
              {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${x + 40 + d * 110} ${230 + k * 9} h86`} stroke={I} strokeWidth={1} opacity={0.3} />)}
              <rect x={x + 34 + d * 110} y={GROUND - 12} width={98} height={12} fill={S} stroke={I} strokeWidth={1.6} />
            </g>
          ))}
          {/* crate being packed */}
          <g transform={`translate(${x + w - 46} 256)`}>
            <rect width={40} height={44} fill={W} stroke={I} strokeWidth={1.8} />
            <path d="M0 0 L40 44 M40 0 L0 44 M0 22 h40" {...FINE} />
          </g>
        </g>
      )}
    </g>
  );
}

/** Ship-to-shore gantry crane, with a container on the spreader. */
function Crane({ x, flip }: { x: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  const a = x;
  const b = x + 46 * s;
  return (
    <g>
      <Shadow cx={x + 23 * s} w={80} />
      {/* legs with portal bracing */}
      <path d={`M${a} ${GROUND} V96 M${b} ${GROUND} V96 M${a} 160 H${b} M${a} 220 H${b}`} {...LINE} />
      <path d={`M${a} 96 L${b} 160 M${b} 96 L${a} 160 M${a} 160 L${b} 220 M${b} 160 L${a} 220`} {...LINE} strokeWidth={1.2} opacity={0.6} />
      {/* boom, back-reach, A-frame and stays */}
      <path d={`M${x - 80 * s} 96 H${x + 196 * s} M${x - 80 * s} 104 H${x + 196 * s}`} {...LINE} />
      <path d={`M${x + 23 * s} 96 V54 M${x + 23 * s} 54 L${x + 196 * s} 96 M${x + 23 * s} 54 L${x - 80 * s} 96`} {...LINE} strokeWidth={1.6} />
      {/* machinery house */}
      <rect x={flip ? x + 6 : x - 62} y={80} width={56} height={16} fill={S} stroke={I} strokeWidth={1.6} />
      {/* trolley, ropes, spreader and the container (corrugated) */}
      <rect x={flip ? x - 168 : x + 140} y={104} width={28} height={8} fill={W} stroke={I} strokeWidth={1.5} />
      {/* the hoist: ropes stretch as the spreader lowers the container (animated in useJourneyMotion) */}
      <path d={`M${x + 148 * s} 112 V150 M${x + 160 * s} 112 V150`} {...FINE} opacity={0.7} data-crane-rope />
      <g data-crane-load>
        <rect x={flip ? x - 184 : x + 126} y={150} width={58} height={6} fill={I} />
        <rect x={flip ? x - 184 : x + 126} y={156} width={58} height={26} fill={Y} stroke={I} strokeWidth={1.6} />
        {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${(flip ? x - 178 : x + 132) + k * 9} 158 v22`} stroke={I} strokeWidth={0.9} opacity={0.4} />)}
      </g>
      {/* bogies */}
      <path d={`M${a - 8} ${GROUND} h16 M${b - 8} ${GROUND} h16`} {...LINE} strokeWidth={5} />
    </g>
  );
}

function Customs({ cx, port }: { cx: number; port?: boolean }) {
  const x = cx - 160;
  return (
    <g>
      <Shadow cx={x + 40} w={110} />
      {/* booth with canopy */}
      <path d={`M${x - 14} 206 H${x + 92} L${x + 80} 190 H${x - 2} Z`} fill={Y} stroke={I} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={`M${x} 206 V${GROUND} M${x + 78} 206 V${GROUND}`} {...LINE} />
      <rect x={x + 12} y={224} width={54} height={76} fill={W} stroke={I} strokeWidth={2} />
      <rect x={x + 20} y={232} width={38} height={24} fill={S} stroke={I} strokeWidth={1.5} />
      <path d={`M${x + 20} 244 h38`} {...FINE} />
      {/* flag */}
      <path d={`M${x + 112} ${GROUND} V150`} {...LINE} />
      <path d={`M${x + 112} 152 c14 -6 22 6 36 0 v24 c-14 6 -22 -6 -36 0`} fill={W} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
      {/* barrier arm */}
      <rect x={x + 96} y={262} width={12} height={38} fill={W} stroke={I} strokeWidth={1.8} />
      <path d={`M${x + 108} 268 H${x + 236}`} stroke={I} strokeWidth={9} strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${x + 114 + i * 25} 268 h12`} stroke={Y} strokeWidth={6} />)}
      <circle cx={x + 102} cy={258} r={4} fill={Y} stroke={I} strokeWidth={1.2} />
      {port ? (
        // Container stack at the export terminal.
        <g>
          <Shadow cx={x + 330} w={150} />
          {[[0, 0, 1], [1, 0, 0], [2, 0, 1], [0, 1, 0], [1, 1, 1], [0, 2, 1]].map(([c, r, y]) => (
            <g key={`${c}${r}`}>
              <rect x={x + 262 + c * 52 + r * 8} y={GROUND - 26 - r * 26} width={52} height={26} fill={y ? Y : W} stroke={I} strokeWidth={1.6} />
              {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${x + 270 + c * 52 + r * 8 + k * 9} ${GROUND - 23 - r * 26} v20`} stroke={I} strokeWidth={0.9} opacity={0.35} />)}
            </g>
          ))}
        </g>
      ) : (
        // Cleared: a stamped check over the arrival terminal.
        <g transform={`translate(${x + 270} 176)`}>
          <circle cx={30} cy={30} r={34} fill="none" stroke={I} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5} />
          <circle cx={30} cy={30} r={26} fill={Y} stroke={I} strokeWidth={2} />
          <path d="M18 31 l8 8 l17 -19" {...LINE} strokeWidth={3} />
        </g>
      )}
    </g>
  );
}

function Sky({ x0, x1 }: { x0: number; x1: number }) {
  const cx = (x0 + x1) / 2;
  return (
    <g>
      {/* low sun with a fine halo */}
      <circle cx={cx + 40} cy={196} r={40} fill="none" stroke={Y} strokeWidth={3} />
      <circle cx={cx + 40} cy={196} r={54} fill="none" stroke={Y} strokeWidth={1.2} opacity={0.5} strokeDasharray="2 7" />
      <Cloud x={cx - 150} y={96} s={0.8} />
      {/* freighter aircraft climbing out, clear of both cranes (flies on a loop: useJourneyMotion) */}
      <g data-plane>
      <g transform={`translate(${cx - 70} 52) rotate(-6)`}>
        <path d="M0 22 C0 12 10 10 22 10 H128 C146 10 158 16 160 22 C158 28 146 32 128 32 H22 C10 32 0 30 0 22 Z" fill={W} stroke={I} strokeWidth={2} />
        <path d="M150 15 c4 2 6 4 7 7" {...FINE} />
        {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={34 + k * 10} cy={19} r={1.8} fill={I} opacity={0.5} />)}
        <path d="M66 22 L42 52 H56 L92 26 Z" fill={S} stroke={I} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M70 12 L54 -6 H64 L88 12" fill={W} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M6 12 L0 -8 H10 L22 12" fill={Y} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
        <rect x={64} y={36} width={18} height={7} rx={3.5} fill={W} stroke={I} strokeWidth={1.4} />
      </g>
      </g>
      {/* gulls */}
      <path d={`M${cx + 110} 150 q6 -6 12 0 q6 -6 12 0 M${cx + 140} 132 q5 -5 10 0 q5 -5 10 0`} {...FINE} strokeWidth={1.4} />
      {/* a distant vessel on the horizon */}
      <g opacity={0.3}>
        <path d={`M${cx + 100} ${GROUND - 2} h80 l-8 -10 h-64 Z M${cx + 116} ${GROUND - 12} v-12 h14 v12 M${cx + 136} ${GROUND - 12} v-8 h30 v8`} {...LINE} strokeWidth={1.4} />
      </g>
    </g>
  );
}

function Signal({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} ${GROUND} V220`} {...LINE} />
      <rect x={x - 9} y={196} width={18} height={30} rx={4} fill={W} stroke={I} strokeWidth={1.8} />
      <circle cx={x} cy={205} r={4} fill={Y} stroke={I} strokeWidth={1.2} />
      <circle cx={x} cy={217} r={4} fill="none" stroke={I} strokeWidth={1.2} />
    </g>
  );
}

function Destination({ cx }: { cx: number }) {
  const x = cx - 120;
  const w = 200;
  return (
    <g>
      <Shadow cx={x + w / 2 + 10} w={w + 30} />
      <path d={`M${x + w} 178 l18 -10 V${GROUND - 8} l-18 8 Z`} fill={S} stroke={I} strokeWidth={2} strokeLinejoin="round" />
      <rect x={x} y={178} width={w} height={GROUND - 178} fill={W} stroke={I} strokeWidth={2} />
      <path d={`M${x - 8} 178 H${x + w + 8} M${x} 238 H${x + w}`} {...LINE} />
      {[0, 1].map((r) => [0, 1, 2, 3].map((c) => (
        <g key={`${r}${c}`}>
          <rect x={x + 18 + c * 46} y={192 + r * 60} width={26} height={30} fill={S} stroke={I} strokeWidth={1.5} />
          <path d={`M${x + 31 + c * 46} ${192 + r * 60} v30`} {...FINE} opacity={0.4} />
        </g>
      ))).flat().filter((_, k) => k !== 5 && k !== 6)}
      {/* the customer's door, where the box arrives */}
      <rect x={x + 84} y={250} width={44} height={50} fill={Y} stroke={I} strokeWidth={2} />
      <circle cx={x + 120} cy={276} r={2.5} fill={I} />
      <path d={`M${x + 76} 250 H${x + 136} L${x + 130} 242 H${x + 82} Z`} fill={W} stroke={I} strokeWidth={1.6} strokeLinejoin="round" />
      {/* map pin with a soft pulse ring */}
      <g transform={`translate(${x + 106} 96)`}>
        <ellipse cx={0} cy={64} rx={14} ry={3.5} fill={I} opacity={0.12} />
        <path d="M0 52 C-26 24 -24 0 0 0 C24 0 26 24 0 52 Z" fill={Y} stroke={I} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={0} cy={19} r={8} fill={W} stroke={I} strokeWidth={1.6} />
      </g>
      <Palm x={x - 30} h={96} flip />
      <Palm x={x + w + 52} h={78} />
    </g>
  );
}

export function JourneyScene() {
  const c = (i: number) => i * STAGE_W + STAGE_W / 2;
  const end = STAGE_W * 9;
  return (
    <g>
      <Skyline x0={-OVER} x1={SEA[0] - 140} />
      <Skyline x0={RAIL_END} x1={end + OVER} />
      {/* ground: road → quay / sea → rail bed → road; the road runs on past both ends so it never stops on screen */}
      <Road x0={-OVER} x1={SEA[0]} />
      <Quay x={SEA[0]} side="left" />
      <Sky x0={SEA[0]} x1={SEA[1]} />
      <Waves x0={SEA[0]} x1={SEA[1]} />
      <Quay x={SEA[1]} side="right" />
      <Rails x0={SEA[1] + 60} x1={RAIL_END} />
      <path d={`M${SEA[1]} ${GROUND} H${SEA[1] + 60}`} {...LINE} />
      <Road x0={RAIL_END} x1={end + OVER} />
      <Cloud x={c(0) + 110} y={70} s={0.8} />
      <Cloud x={c(7) - 60} y={86} s={0.7} />
      <Office cx={c(0)} />
      <Factory cx={c(1)} />
      <Warehouse cx={c(2)} />
      <Customs cx={c(3) - 40} port />
      <Crane x={SEA[0] - 70} />
      {/* arrival quay */}
      <Crane x={SEA[1] + 50} flip />
      <Signal x={c(5) + 130} />
      <Lamp x={c(5) + 260} />
      <Customs cx={c(6)} />
      <Warehouse cx={c(7)} racks />
      <Destination cx={c(8)} />
    </g>
  );
}
