/**
 * Data modernization → better decisions.
 *
 * A five-column diagram of the path this portfolio is organised around, with
 * every stage alive: sources emit packets along converging feeds, cubes drop
 * into the funnel, the ETL steps light in sequence, the warehouse fills, the
 * network trains, and the dashboard's bars, donut and KPIs move.
 *
 * All motion is CSS keyframes declared once in an inline <style>, rather than
 * rAF or a JS timeline. There are ~40 independent loops here; driving them from
 * JavaScript would mean a frame callback mutating dozens of attributes forever,
 * whereas CSS animations are composited off the main thread and cost nothing
 * once declared. It also means this is a plain server component — no hydration,
 * no client JS at all — and reduced-motion becomes a one-line media query
 * instead of a branch through every animated value.
 *
 * Decorative, so the block is aria-hidden.
 */

const C = [150, 435, 700, 965, 1250];
const HUE = [
  "var(--color-teal)",
  "var(--color-violet)",
  "var(--color-orange)",
  "var(--color-rose)",
  "var(--color-green)",
];
const TITLES = [
  "raw records",
  "clean rows",
  "modelled tables",
  "trained model",
  "insights & decisions",
];
const SUBS = [
  "ingest from any source",
  "transform & validate",
  "trusted data foundation",
  "build, evaluate, deploy",
  "drive business value",
];
const RAIL: [string, string][] = [
  ["Source", "Multiple data sources"],
  ["Pipeline", "ETL / ELT & data quality"],
  ["Warehouse", "Modelled, secure, scalable"],
  ["Models", "Train, evaluate, collaborate"],
  ["Decisions", "Actionable insights"],
];

const SURFACE = "var(--color-surface)";
const LINE = "var(--color-line)";
const INK = "var(--color-ink)";
const INK2 = "var(--color-ink-2)";
const TEAL = "var(--color-teal)";
const VIOLET = "var(--color-violet)";
const ORANGE = "var(--color-orange)";
const ROSE = "var(--color-rose)";
const GREEN = "var(--color-green)";
const AMBER = "var(--color-amber)";

const CSS = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes dm-flow { to { stroke-dashoffset: -32; } }
  @keyframes dm-pulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }
  @keyframes dm-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
  @keyframes dm-fall {
    0%   { transform: translateY(-46px) rotate(0deg); opacity:0 }
    15%  { opacity:1 }
    85%  { opacity:1 }
    100% { transform: translateY(56px) rotate(120deg); opacity:0 }
  }
  @keyframes dm-step { 0%,10% { opacity:1 } 26%,100% { opacity:.42 } }
  @keyframes dm-bar { 0%,100% { transform: scaleY(.5) } 50% { transform: scaleY(1) } }
  @keyframes dm-ring { 0% { stroke-dashoffset: 163 } 55%,100% { stroke-dashoffset: 52 } }
  @keyframes dm-blink { 0%,55% { opacity:.2 } 65%,100% { opacity:1 } }
  @keyframes dm-type { 0%,100% { transform: scaleX(.35) } 50% { transform: scaleX(1) } }
  @keyframes dm-node { 0%,100% { transform: scale(1); opacity:.6 } 50% { transform: scale(1.35); opacity:1 } }
  @keyframes dm-rise { 0%,100% { transform: translateY(0); opacity:.78 } 50% { transform: translateY(-9px); opacity:1 } }
  @keyframes dm-sheen { 0% { opacity:0 } 40% { opacity:.4 } 100% { opacity:0 } }

  .dm-feed   { stroke-dasharray: 7 9; animation: dm-flow 1.1s linear infinite; }
  .dm-dash   { stroke-dasharray: 5 8; animation: dm-flow 1.6s linear infinite; }
  .dm-pulse  { animation: dm-pulse 2.6s ease-in-out infinite; }
  .dm-float  { transform-box: fill-box; transform-origin: center; animation: dm-float 4.2s ease-in-out infinite; }
  .dm-fall   { transform-box: fill-box; transform-origin: center; animation: dm-fall 2.6s ease-in infinite; }
  .dm-step   { animation: dm-step 4.4s linear infinite; }
  .dm-bar    { transform-box: fill-box; transform-origin: bottom; animation: dm-bar 3.2s ease-in-out infinite; }
  .dm-ring   { animation: dm-ring 3.6s ease-in-out infinite; }
  .dm-blink  { animation: dm-blink 3.4s ease-in-out infinite; }
  .dm-type   { transform-box: fill-box; transform-origin: left; animation: dm-type 1.5s ease-in-out infinite; }
  .dm-node   { transform-box: fill-box; transform-origin: center; animation: dm-node 2.4s ease-in-out infinite; }
  .dm-rise   { transform-box: fill-box; transform-origin: center; animation: dm-rise 3.8s ease-in-out infinite; }
  .dm-sheen  { animation: dm-sheen 5s ease-in-out infinite; }

  /* A reaching arm pivots about the shoulder. transform-box defaults to
     view-box, so an inline transform-origin in px is read in viewBox units —
     which is how the pivot can be an exact absolute point. */
  @keyframes dm-reach { 0%,100% { transform: rotate(0deg) } 50% { transform: rotate(-11deg) } }
  @keyframes dm-touch { 0%,100% { transform: scale(.7); opacity:.5 } 70%,100% { transform: scale(2.1); opacity:0 } }
  @keyframes dm-lit   { 0%,100% { opacity:.45 } 50% { opacity:1 } }
  .dm-reach { animation: dm-reach 4.4s ease-in-out infinite; }
  .dm-touch { transform-box: fill-box; transform-origin: center; animation: dm-touch 2.2s ease-out infinite; }
  .dm-lit   { animation: dm-lit 4.4s ease-in-out infinite; }
}
`;

/*
 * Positioning note: `.dm-float` / `.dm-rise` animate `transform`, which
 * overrides an SVG `transform` attribute on the same element and collapses it
 * to the origin. Anything using them is therefore wrapped in a plain <g> that
 * owns the translate.
 */

/** Glyphs for the five header cards. */
function CardIcon({ i, hue }: { i: number; hue: string }) {
  if (i === 0)
    return (
      <g>
        <rect x="-15" y="-15" width="30" height="30" rx="8" fill="none" stroke={hue} strokeWidth="2.6" />
        {[
          [-6, -6],
          [6, -6],
          [0, 0],
          [-6, 6],
          [6, 6],
        ].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="2.6" fill={hue} />
        ))}
      </g>
    );
  if (i === 1)
    return (
      <g>
        <rect x="-14" y="-16" width="28" height="32" rx="6" fill="none" stroke={hue} strokeWidth="2.6" />
        {[-7, -1, 5].map((y, k) => (
          <rect key={k} x="-7" y={y} width={14 - k * 4} height="2.8" rx="1.4" fill={hue} />
        ))}
      </g>
    );
  if (i === 2)
    return (
      <g fill="none" stroke={hue} strokeWidth="2.6" strokeLinejoin="round">
        <path d="M0 -16 L14 -8 L0 0 L-14 -8 Z" fill={hue} fillOpacity="0.25" />
        <path d="M-14 -8 L-14 8 L0 16 L14 8 L14 -8" />
        <path d="M0 0 L0 16" />
      </g>
    );
  if (i === 3)
    return (
      <g stroke={hue} strokeWidth="2.4" fill="none">
        <path d="M-12 8 L0 -12 L12 8 M-12 8 L12 8" />
        <circle cx="-12" cy="8" r="4.5" fill={hue} />
        <circle cx="12" cy="8" r="4.5" fill={hue} />
        <circle cx="0" cy="-12" r="5" fill={hue} />
      </g>
    );
  return (
    <g>
      {[
        [-11, 4, 12],
        [-2, -2, 18],
        [7, -9, 25],
      ].map(([x, y, h], k) => (
        <rect key={k} x={x} y={y} width="7" height={h} rx="2" fill={hue} />
      ))}
      <path d="M-13 -8 L-2 -13 L12 -19" fill="none" stroke={hue} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 -19 L6 -19 M12 -19 L12 -13" stroke={hue} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </g>
  );
}

/**
 * A full-height person, drawn in absolute canvas coordinates so the reaching
 * arm can pivot about its own shoulder (see .dm-reach). `hand` is the point the
 * figure is touching — the arm is a single curve to that point rather than a
 * jointed limb, which always lands exactly on target at this scale.
 */
function Figure({
  x,
  ground,
  h = 236,
  shirt,
  sleeve,
  trouser,
  skin,
  hair,
  hand,
  hairStyle = "short",
}: {
  x: number;
  ground: number;
  h?: number;
  shirt: string;
  sleeve: string;
  trouser: string;
  skin: string;
  hair: string;
  hand: [number, number];
  hairStyle?: "short" | "long";
}) {
  const s = h / 236;
  const y = (ly: number) => ground + ly * s;
  const px = (lx: number) => x + lx * s;

  const shoulderX = px(hand[0] > x ? 26 : -26);
  const shoulderY = y(-186);
  const [hx, hy] = hand;
  // Bow the arm away from the torso so it reads as an elbow.
  const cx = (shoulderX + hx) / 2 + (hx > shoulderX ? -10 : 10) * s;
  const cy = (shoulderY + hy) / 2 + 26 * s;

  return (
    <g>
      {/* legs */}
      <path
        d={`M${px(-13)} ${y(-104)} L${px(-15)} ${y(-52)} L${px(-16)} ${y(-2)}`}
        fill="none"
        stroke={trouser}
        strokeWidth={21 * s}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${px(13)} ${y(-104)} L${px(16)} ${y(-52)} L${px(18)} ${y(-2)}`}
        fill="none"
        stroke={trouser}
        strokeWidth={21 * s}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${px(-23)} ${y(-1)} L${px(-11)} ${y(-1)}`}
        stroke="#1E2A36"
        strokeWidth={11 * s}
        strokeLinecap="round"
      />
      <path
        d={`M${px(13)} ${y(-1)} L${px(25)} ${y(-1)}`}
        stroke="#1E2A36"
        strokeWidth={11 * s}
        strokeLinecap="round"
      />

      {/* trailing arm */}
      <path
        d={`M${px(hand[0] > x ? -26 : 26)} ${y(-182)} Q${px(hand[0] > x ? -38 : 38)} ${y(-140)} ${px(hand[0] > x ? -30 : 30)} ${y(-96)}`}
        fill="none"
        stroke={sleeve}
        strokeWidth={17 * s}
        strokeLinecap="round"
      />
      <circle cx={px(hand[0] > x ? -30 : 30)} cy={y(-94)} r={8 * s} fill={skin} />

      {/* torso */}
      <path
        d={`M${px(-28)} ${y(-186)} Q${px(0)} ${y(-200)} ${px(28)} ${y(-186)} L${px(20)} ${y(-102)} Q${px(0)} ${y(-92)} ${px(-20)} ${y(-102)} Z`}
        fill={shirt}
      />

      {/* head */}
      <rect x={px(-7)} y={y(-200)} width={14 * s} height={14 * s} fill={skin} />
      <circle cx={px(0)} cy={y(-216)} r={24 * s} fill={skin} />
      {hairStyle === "long" ? (
        <path
          d={`M${px(-24)} ${y(-214)} Q${px(-26)} ${y(-246)} ${px(0)} ${y(-246)} Q${px(26)} ${y(-246)} ${px(24)} ${y(-214)} L${px(24)} ${y(-176)} Q${px(17)} ${y(-196)} ${px(15)} ${y(-224)} Q${px(0)} ${y(-234)} ${px(-15)} ${y(-224)} Q${px(-17)} ${y(-196)} ${px(-24)} ${y(-176)} Z`}
          fill={hair}
        />
      ) : (
        <path
          d={`M${px(-24)} ${y(-212)} Q${px(-27)} ${y(-246)} ${px(0)} ${y(-246)} Q${px(27)} ${y(-246)} ${px(24)} ${y(-212)} Q${px(19)} ${y(-227)} ${px(4)} ${y(-231)} Q${px(-12)} ${y(-234)} ${px(-20)} ${y(-220)} Z`}
          fill={hair}
        />
      )}

      {/* reaching arm — the whole limb swings about the shoulder */}
      <g className="dm-reach" style={{ transformOrigin: `${shoulderX}px ${shoulderY}px` }}>
        <path
          d={`M${shoulderX} ${shoulderY} Q${cx} ${cy} ${hx} ${hy}`}
          fill="none"
          stroke={sleeve}
          strokeWidth={18 * s}
          strokeLinecap="round"
        />
        <circle cx={hx} cy={hy} r={9 * s} fill={skin} />
        <circle className="dm-touch" cx={hx} cy={hy} r={14 * s} fill={shirt} />
      </g>
    </g>
  );
}

export default function CartoonScene() {
  const feeds = [0, 1, 2, 3].map(
    (k) => `M118 ${230 + k * 90} C 190 ${230 + k * 90}, 200 370, 262 370`
  );

  return (
    <div aria-hidden className="w-full">
      <svg viewBox="0 0 1400 720" className="h-auto w-full">
        <style>{CSS}</style>

        <defs>
          <linearGradient id="dm-wash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.14" />
            <stop offset="50%" stopColor={VIOLET} stopOpacity="0.1" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0.13" />
          </linearGradient>
          <linearGradient id="dm-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SURFACE} stopOpacity="1" />
            <stop offset="100%" stopColor={SURFACE} stopOpacity="0.85" />
          </linearGradient>
          {feeds.map((d, k) => (
            <path key={k} id={`dm-feed-${k}`} d={d} />
          ))}
        </defs>

        <rect x="0" y="0" width="1400" height="720" rx="28" fill="url(#dm-wash)" />

        {/* ───────── header cards ───────── */}
        {C.map((cx, i) => (
          <g key={TITLES[i]}>
            <rect
              x={cx - 116}
              y="28"
              width="232"
              height="104"
              rx="16"
              fill={SURFACE}
              fillOpacity="0.55"
              stroke={HUE[i]}
              strokeWidth="2.4"
            />
            <g transform={`translate(${cx},62)`}>
              <CardIcon i={i} hue={HUE[i]} />
            </g>
            <text x={cx} y="96" textAnchor="middle" fill={INK} fontSize="23" fontWeight="700">
              {TITLES[i]}
            </text>
            <text x={cx} y="120" textAnchor="middle" fill={INK2} fontSize="20">
              {SUBS[i]}
            </text>
            <path
              className="dm-dash"
              d={`M${cx} 132 L${cx} 178`}
              stroke={HUE[i]}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>
        ))}

        {/* ───────── 1. sources ───────── */}
        <g>
          {feeds.map((d, k) => (
            <path key={k} className="dm-feed" d={d} fill="none" stroke={TEAL} strokeWidth="2.4" opacity="0.75" />
          ))}
          {feeds.map((_, k) => (
            <circle key={`p${k}`} r="4.5" fill={TEAL}>
              <animateMotion dur="2.2s" begin={`${k * 0.45}s`} repeatCount="indefinite">
                <mpath href={`#dm-feed-${k}`} />
              </animateMotion>
            </circle>
          ))}

          <g transform="translate(78,230)">
            <g className="dm-float">
            <ellipse cx="0" cy="-14" rx="24" ry="8" fill={TEAL} />
            <path d="M-24 -14 L-24 10 Q0 20 24 10 L24 -14" fill={TEAL} opacity="0.4" />
            <ellipse cx="0" cy="10" rx="24" ry="8" fill={TEAL} />
            <ellipse cx="0" cy="-2" rx="24" ry="8" fill="none" stroke={TEAL} strokeWidth="2" opacity="0.65" />
            </g>
          </g>
          <text x="78" y="272" textAnchor="middle" fill={INK2} fontSize="20" fontWeight="600">
            Databases
          </text>

          <g transform="translate(78,318)">
            <g className="dm-float" style={{ animationDelay: "0.6s" }}>
            <path d="M-26 8 Q-34 -6 -18 -10 Q-14 -26 4 -22 Q20 -28 24 -10 Q36 -8 30 6 Z" fill={TEAL} opacity="0.55" />
            <path
              d="M-26 8 Q-34 -6 -18 -10 Q-14 -26 4 -22 Q20 -28 24 -10 Q36 -8 30 6 Z"
              fill="none"
              stroke={TEAL}
              strokeWidth="2"
            />
            </g>
          </g>
          <text x="78" y="362" textAnchor="middle" fill={INK2} fontSize="20" fontWeight="600">
            SaaS / APIs
          </text>

          <g transform="translate(78,408)">
            <g className="dm-float" style={{ animationDelay: "1.2s" }}>
            <rect x="-22" y="-20" width="44" height="40" rx="5" fill={GREEN} opacity="0.75" />
            <path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke={SURFACE} strokeWidth="3.4" strokeLinecap="round" />
            </g>
          </g>
          <text x="78" y="452" textAnchor="middle" fill={INK2} fontSize="20" fontWeight="600">
            Spreadsheets
          </text>

          <g transform="translate(78,498)">
            <g className="dm-float" style={{ animationDelay: "1.8s" }}>
            {[9, 16, 23].map((r, k) => (
              <path
                key={k}
                className="dm-pulse"
                d={`M${-r} 8 A ${r} ${r} 0 0 1 ${r} 8`}
                fill="none"
                stroke={TEAL}
                strokeWidth="3"
                strokeLinecap="round"
                style={{ animationDelay: `${k * 0.3}s` }}
              />
            ))}
            <circle cx="0" cy="10" r="4" fill={TEAL} />
            </g>
          </g>
          <text x="78" y="542" textAnchor="middle" fill={INK2} fontSize="20" fontWeight="600">
            Streaming
          </text>
        </g>

        {/* ───────── 2. pipeline ───────── */}
        <g>
          {([
            [330, ORANGE, 0],
            [352, VIOLET, 0.55],
            [374, TEAL, 1.1],
            [341, ROSE, 1.7],
          ] as [number, string, number][]).map(([x, fill, d], k) => (
            <rect
              key={k}
              className="dm-fall"
              x={x - 8}
              y="248"
              width="16"
              height="16"
              rx="4"
              fill={fill}
              style={{ animationDelay: `${d}s` }}
            />
          ))}

          <path d="M306 300 L404 300 L366 360 L366 404 L344 414 L344 360 Z" fill={VIOLET} opacity="0.5" />
          <path
            d="M306 300 L404 300 L366 360 L366 404 L344 414 L344 360 Z"
            fill="none"
            stroke={VIOLET}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />

          <path className="dm-dash" d="M404 336 L436 336" stroke={VIOLET} strokeWidth="2.4" strokeLinecap="round" fill="none" />

          {["Transform", "Clean", "Validate", "Enrich"].map((label, k) => (
            <g key={label} className="dm-step" style={{ animationDelay: `${k * 1.1}s` }} transform={`translate(444,${236 + k * 62})`}>
              <rect width="164" height="46" rx="10" fill={SURFACE} fillOpacity="0.7" stroke={VIOLET} strokeWidth="1.8" />
              <circle cx="26" cy="23" r="11" fill={VIOLET} opacity="0.85" />
              <path
                d={k === 2 ? "M21 23 l3.6 3.8 L32 18" : "M20 23 h12 M26 17 v12"}
                stroke={SURFACE}
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="48" y="29" fill={INK} fontSize="21" fontWeight="600">
                {label}
              </text>
            </g>
          ))}
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M526 ${284 + k * 62} L526 ${296 + k * 62}`}
              stroke={VIOLET}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          ))}
        </g>

        <path className="dm-dash" d="M616 370 L654 370" stroke={ORANGE} strokeWidth="2.6" strokeLinecap="round" fill="none" />

        {/* ───────── 3. warehouse ───────── */}
        <g>
          <g className="dm-float">
            <path
              d="M654 246 Q642 226 664 220 Q670 198 694 204 Q714 194 722 216 Q744 218 738 240 Q736 250 726 250 L664 250 Q656 250 654 246 Z"
              fill={ORANGE}
              opacity="0.4"
            />
            <path
              d="M654 246 Q642 226 664 220 Q670 198 694 204 Q714 194 722 216 Q744 218 738 240 Q736 250 726 250 L664 250 Q656 250 654 246 Z"
              fill="none"
              stroke={ORANGE}
              strokeWidth="2.2"
            />
          </g>
          {[0, 1].map((k) => (
            <path
              key={k}
              className="dm-dash"
              d={`M${676 + k * 36} 254 L${676 + k * 36} 296`}
              stroke={ORANGE}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
              style={{ animationDelay: `${k * 0.4}s` }}
            />
          ))}

          <g transform="translate(700,360)">
            <path d="M-46 -24 L-46 28 Q0 46 46 28 L46 -24" fill={ORANGE} opacity="0.28" />
            {[0, 1, 2].map((k) => (
              <ellipse
                key={k}
                className="dm-pulse"
                cx="0"
                cy={-24 + k * 26}
                rx="46"
                ry="14"
                fill={ORANGE}
                opacity={0.85 - k * 0.12}
                style={{ animationDelay: `${k * 0.5}s` }}
              />
            ))}
            <ellipse cx="0" cy="28" rx="46" ry="14" fill={ORANGE} opacity="0.55" />
          </g>

          {[0, 1].map((k) => (
            <g key={k} transform={`translate(768,${298 + k * 92})`}>
              <g className="dm-rise" style={{ animationDelay: `${k * 0.9}s` }}>
              <rect width="84" height="66" rx="8" fill={SURFACE} stroke={ORANGE} strokeWidth="2" />
              <rect x="8" y="10" width="68" height="10" rx="3" fill={ORANGE} opacity="0.75" />
              {[0, 1, 2].map((r) => (
                <g key={r}>
                  <rect x="8" y={26 + r * 11} width="30" height="6" rx="3" fill={LINE} />
                  <rect x="44" y={26 + r * 11} width="32" height="6" rx="3" fill={LINE} />
                </g>
              ))}
              </g>
            </g>
          ))}

          <g transform="translate(616,430)">
            <rect width="54" height="62" rx="8" fill={SURFACE} stroke={ORANGE} strokeWidth="2" />
            {[0, 1, 2].map((k) => (
              <g key={k}>
                <circle
                  className="dm-pulse"
                  cx="14"
                  cy={16 + k * 18}
                  r="4"
                  fill={ORANGE}
                  style={{ animationDelay: `${k * 0.4}s` }}
                />
                <rect x="24" y={13 + k * 18} width="20" height="6" rx="3" fill={LINE} />
              </g>
            ))}
          </g>

          <g transform="translate(800,464)">
            <path d="M0 -20 L18 -12 V4 Q18 18 0 24 Q-18 18 -18 4 V-12 Z" fill={GREEN} opacity="0.35" />
            <path d="M0 -20 L18 -12 V4 Q18 18 0 24 Q-18 18 -18 4 V-12 Z" fill="none" stroke={GREEN} strokeWidth="2.2" />
            <path
              className="dm-blink"
              d="M-7 2 l5 5 L9 -5"
              fill="none"
              stroke={GREEN}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* ───────── 4. models ───────── */}
        <g>
          {/* no frame — the network sits in the open so the figure can reach it */}
          {[
            [958, 286, 1022, 258],
            [958, 286, 1022, 314],
            [958, 286, 1022, 370],
            [958, 342, 1022, 258],
            [958, 342, 1022, 314],
            [958, 342, 1022, 370],
            [1022, 258, 1086, 286],
            [1022, 258, 1086, 342],
            [1022, 314, 1086, 286],
            [1022, 314, 1086, 342],
            [1022, 370, 1086, 286],
            [1022, 370, 1086, 342],
          ].map(([x1, y1, x2, y2], k) => (
            <line
              key={k}
              className="dm-pulse"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={ROSE}
              strokeWidth="2.2"
              style={{ animationDelay: `${(k % 6) * 0.35}s` }}
            />
          ))}
          {[
            [958, 286],
            [958, 342],
            [1022, 258],
            [1022, 314],
            [1022, 370],
            [1086, 286],
            [1086, 342],
          ].map(([x, y], k) => (
            <circle key={k} className="dm-node" cx={x} cy={y} r="11" fill={ROSE} style={{ animationDelay: `${k * 0.28}s` }} />
          ))}
          {/* the node under her hand lights on the same 4.4s beat as the reach */}
          <circle className="dm-lit" cx="958" cy="342" r="19" fill="none" stroke={ROSE} strokeWidth="3" />

          <g transform="translate(1122,246)">
            <g className="dm-float">
              <circle r="30" fill={AMBER} opacity="0.2" />
              <path
                className="dm-blink"
                d="M0 -17 Q14 -17 14 -4 Q14 4 6 10 L6 16 L-6 16 L-6 10 Q-14 4 -14 -4 Q-14 -17 0 -17 Z"
                fill={AMBER}
              />
              <rect x="-6" y="19" width="12" height="4.5" rx="2.25" fill={AMBER} />
            </g>
          </g>

          <g transform="translate(944,424)">
            <rect width="148" height="70" rx="10" fill={SURFACE} fillOpacity="0.8" stroke={LINE} strokeWidth="1.8" />
            <text x="14" y="32" fill={ROSE} fontSize="21" fontWeight="700" fontFamily="ui-monospace, monospace">
              {"</>"}
            </text>
            {[0, 1, 2].map((k) => (
              <rect
                key={k}
                className="dm-type"
                x="58"
                y={17 + k * 16}
                width={76 - k * 16}
                height="8"
                rx="4"
                fill={LINE}
                style={{ animationDelay: `${k * 0.35}s` }}
              />
            ))}
          </g>

          <ellipse cx="870" cy="562" rx="54" ry="9" fill="#000" opacity="0.28" />
          <Figure
            x={870}
            ground={560}
            h={244}
            shirt={ROSE}
            sleeve="color-mix(in oklab, var(--color-rose) 66%, #0a1e28)"
            trouser="#42567A"
            skin="#E8B48F"
            hair="#2A2530"
            hairStyle="long"
            hand={[946, 346]}
          />
        </g>

        {/* ───────── 5. decisions ───────── */}
        <g>
          <rect x="1168" y="232" width="222" height="172" rx="12" fill="url(#dm-screen)" stroke={GREEN} strokeWidth="2.6" />
          <rect className="dm-sheen" x="1168" y="232" width="222" height="172" rx="12" fill={GREEN} opacity="0" />
          <rect x="1184" y="248" width="96" height="9" rx="4.5" fill={LINE} />

          {[40, 62, 48, 78, 56].map((h, k) => (
            <rect
              key={k}
              className="dm-bar"
              x={1188 + k * 22}
              y={380 - h}
              width="15"
              height={h}
              rx="4"
              fill={GREEN}
              style={{ animationDelay: `${k * 0.24}s` }}
            />
          ))}
          <path d="M1182 382 L1300 382" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
          {/* the bar she is touching */}
          <rect className="dm-lit" x="1183" y="334" width="25" height="52" rx="6" fill="none" stroke={GREEN} strokeWidth="3" />

          <g transform="translate(1338,306)">
            <circle r="34" fill="none" stroke={LINE} strokeWidth="12" />
            <g transform="rotate(-90)">
              <circle
                className="dm-ring"
                r="34"
                fill="none"
                stroke={GREEN}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="214"
                strokeDashoffset="214"
              />
            </g>
          </g>

          {([
            ["32%", "Revenue", GREEN, "up"],
            ["18%", "Cost", ROSE, "down"],
            ["2.4x", "Efficiency", TEAL, "up"],
          ] as [string, string, string, string][]).map(([v, label, hue, dir], k) => (
            <g key={label} transform={`translate(${1168 + k * 76},418)`}>
              <g className="dm-rise" style={{ animationDelay: `${k * 0.8}s` }}>
                <rect width="70" height="56" rx="10" fill={SURFACE} stroke={hue} strokeWidth="1.8" />
                <path d={dir === "up" ? "M10 24 L14 16 L18 24 Z" : "M10 16 L18 16 L14 24 Z"} fill={hue} />
                <text x="22" y="25" fill={hue} fontSize="19" fontWeight="700">
                  {v}
                </text>
                <text x="9" y="45" fill={INK2} fontSize="16">
                  {label}
                </text>
              </g>
            </g>
          ))}

          <ellipse cx="1116" cy="562" rx="54" ry="9" fill="#000" opacity="0.28" />
          <Figure
            x={1116}
            ground={560}
            h={244}
            shirt={TEAL}
            sleeve="color-mix(in oklab, var(--color-teal) 62%, #0a1e28)"
            trouser="#3B4A63"
            skin="#D9A077"
            hair="#1F1B24"
            hand={[1194, 352]}
          />
        </g>

        {/* ───────── rail ───────── */}
        <path d="M60 602 L1340 602" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
        {C.map((cx, i) => (
          <g key={RAIL[i][0]}>
            {i < 4 && (
              <path
                className="dm-dash"
                d={`M${cx + 20} 602 L${C[i + 1] - 20} 602`}
                stroke={HUE[i]}
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
            )}
            <circle className="dm-pulse" cx={cx} cy="602" r="12" fill={HUE[i]} opacity="0.3" style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx={cx} cy="602" r="7" fill={HUE[i]} />
            <text x={cx} y="646" textAnchor="middle" fill={INK} fontSize="30" fontWeight="700">
              {RAIL[i][0]}
            </text>
            <text x={cx} y="672" textAnchor="middle" fill={INK2} fontSize="19">
              {RAIL[i][1]}
            </text>
          </g>
        ))}

      </svg>
    </div>
  );
}
