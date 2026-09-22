"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Isometric data-analytics scene.
 *
 * Every solid is generated from grid coordinates through `iso()`, a real
 * isometric projection, so faces always align and the scene re-proportions
 * from one constant. Vector throughout — crisp at any size, themes for free,
 * no raster assets.
 *
 * Note on layout: pieces are positioned by explicit screen-space translate,
 * not by grid coordinate. Isometric projection folds two axes onto one screen
 * axis, so distinct (x, y) pairs can land on the same pixel — laying the whole
 * composition out in grid space stacks it on top of itself.
 */

const U = 22;
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * U * COS, (x + y) * U * SIN - z * U];
}
const pt = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

/** Extruded box with a lit top and two shaded sides. */
function Box({
  x,
  y,
  w = 1,
  d = 1,
  h = 1,
  z = 0,
  color,
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  h?: number;
  z?: number;
  color: string;
}) {
  const top = [iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const left = [iso(x, y + d, z + h), iso(x + w, y + d, z + h), iso(x + w, y + d, z), iso(x, y + d, z)];
  const right = [iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x + w, y + d, z), iso(x + w, y, z)];
  return (
    <g>
      <polygon points={left.map(pt).join(" ")} fill={color} opacity="0.62" />
      <polygon points={right.map(pt).join(" ")} fill={color} opacity="0.42" />
      <polygon points={top.map(pt).join(" ")} fill={color} />
    </g>
  );
}

/** Flat plate lying on the isometric plane. */
function Plate({
  x,
  y,
  w,
  d,
  z = 0,
  fill,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  z?: number;
  fill: string;
  opacity?: number;
}) {
  const p = [iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)];
  return <polygon points={p.map(pt).join(" ")} fill={fill} opacity={opacity} />;
}

/**
 * Upright floating panel. `skewY(-30)` drops a plain rect onto the isometric
 * right-hand plane, which is how every standing screen here is drawn.
 */
function Panel({
  x,
  y,
  w,
  h,
  fill,
  stroke,
  rx = 5,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke?: string;
  rx?: number;
  children?: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x},${y}) skewY(-30)`}>
      <rect width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.4 : 0} />
      {children}
    </g>
  );
}

/*
 * Deepened palette. Each hue is mixed toward ink so the solids read as
 * submerged material rather than bright stickers pasted over the page, while
 * still carrying enough chroma to stay distinguishable from one another.
 */
const deep = (hue: string, amt: number) =>
  `color-mix(in srgb, ${hue} ${100 - amt}%, var(--color-plane))`;

const TEAL = deep("var(--color-teal)", 26);
const VIOLET = deep("var(--color-violet)", 30);
const ROSE = deep("var(--color-rose)", 32);
const GREEN = deep("var(--color-green)", 28);
const AMBER = deep("var(--color-amber)", 24);

export default function IsoScene() {
  const reduced = useReducedMotion();

  const float = (delay: number, amp = 7) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -amp, 0] },
          transition: {
            duration: 5.5 + delay,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  const draw = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as const, delay },
        };

  return (
    <div aria-hidden className="iso-scene">
      <svg viewBox="-250 -215 500 430" className="h-full w-full">
        <defs>
          <linearGradient id="iso-scr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-surface)" stopOpacity="0.82" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0.55" />
          </linearGradient>
          <filter id="iso-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ══ laptop ══ */}
        <g transform="translate(-14, 26)">
          <motion.g {...float(0, 5)}>
          <Box x={-2.6} y={-1.7} w={5.2} d={3.4} h={0.22} color={deep("var(--color-primary-fill)", 22)} />
          <Plate x={-0.75} y={0.4} w={1.5} d={1.05} z={0.23} fill={TEAL} opacity={0.45} />
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 9 }).map((_, c) => (
              <Plate
                key={`${r}-${c}`}
                x={-2.15 + c * 0.47}
                y={-1.35 + r * 0.38}
                w={0.36}
                d={0.27}
                z={0.23}
                fill="var(--color-primary)"
                opacity={0.34}
              />
            ))
          )}

          <g transform={`translate(${iso(-2.6, -1.7)[0]}, ${iso(-2.6, -1.7)[1]})`}>
            <Panel x={0} y={-126} w={134} h={126} fill="url(#iso-scr)" stroke="var(--color-primary)" rx={6}>
              {Array.from({ length: 6 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="10"
                  y1={22 + i * 17}
                  x2="124"
                  y2={22 + i * 17}
                  stroke="var(--color-line)"
                  strokeWidth="0.8"
                />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={10 + i * 19}
                  y1="22"
                  x2={10 + i * 19}
                  y2="107"
                  stroke="var(--color-line)"
                  strokeWidth="0.8"
                />
              ))}
              <path
                d="M10 96 L29 74 L48 86 L67 52 L86 66 L105 44 L124 58 L124 107 L10 107 Z"
                fill={AMBER}
                opacity="0.45"
              />
              <motion.path
                d="M10 96 L29 74 L48 86 L67 52 L86 66 L105 44 L124 58"
                fill="none"
                stroke={AMBER}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...draw(0.5)}
              />
            </Panel>
          </g>
        </motion.g>
        </g>

        {/* ══ pink panel — zigzag signal ══ */}
        <motion.g {...float(1.1, 11)}>
          <Panel x={-98} y={-188} w={98} h={72} fill={ROSE} rx={5}>
            <motion.path
              d="M10 46 L25 20 L36 42 L48 16 L60 48 L72 22 L88 38"
              fill="none"
              stroke={AMBER}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#iso-soft)"
              {...draw(0.8)}
            />
          </Panel>
        </motion.g>

        {/* ══ teal panel — bar readout ══ */}
        <motion.g {...float(1.7, 9)}>
          <Panel x={76} y={-140} w={94} h={76} fill={GREEN} rx={5}>
            {[34, 54, 26, 46, 62].map((h, i) => (
              <motion.rect
                key={i}
                x={12 + i * 15.5}
                y={66 - h}
                width="8"
                height={h}
                rx="2"
                fill="var(--color-surface)"
                opacity="0.92"
                initial={reduced ? undefined : { scaleY: 0 }}
                animate={reduced ? undefined : { scaleY: 1 }}
                style={{ transformOrigin: `${16 + i * 15.5}px 66px` }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </Panel>
        </motion.g>

        {/* ══ 3D bar cluster ══ */}
        <g transform="translate(-146, -30)">
          <motion.g {...float(0.6, 9)}>
          {[
            { h: 1.1, c: ROSE },
            { h: 2.0, c: TEAL },
            { h: 3.1, c: AMBER },
            { h: 4.0, c: VIOLET },
          ].map((b, i) => (
            <motion.g
              key={i}
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Box x={i * 0.92} y={-i * 0.92} w={0.78} d={0.78} h={b.h} color={b.c} />
            </motion.g>
          ))}
        </motion.g>
        </g>

        {/* ══ radial gauge ══ */}
        <g transform="translate(-170, 104) scale(1, 0.58)">
          <motion.g {...float(2.1, 10)}>
          {[
            { r: 52, c: VIOLET, f: 0.5 },
            { r: 40, c: GREEN, f: 0.38 },
            { r: 28, c: ROSE, f: 0.44 },
          ].map((a, i) => (
            <motion.circle
              key={i}
              cx="0"
              cy="0"
              r={a.r}
              fill="none"
              stroke={a.c}
              strokeWidth="9"
              strokeLinecap="round"
              transform="rotate(180)"
              strokeDasharray={`${2 * Math.PI * a.r}`}
              initial={reduced ? undefined : { strokeDashoffset: 2 * Math.PI * a.r }}
              animate={{ strokeDashoffset: 2 * Math.PI * a.r * (1 - a.f) }}
              transition={{ duration: 1.3, delay: 0.7 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          <circle cx="0" cy="0" r="13" fill={TEAL} />
        </motion.g>
        </g>

        {/* ══ pie with an exploded slice ══ */}
        <g transform="translate(-40, 140) scale(1, 0.58)">
          <motion.g {...float(1.4, 8)}>
          <circle cx="0" cy="0" r="46" fill={VIOLET} />
          <path d="M0 0 L46 0 A46 46 0 0 1 8 45 Z" fill={AMBER} />
          <g transform="translate(-9,-7)">
            <path d="M0 0 L-3 -46 A46 46 0 0 0 -40 -22 Z" fill={ROSE} />
          </g>
          <path d="M0 0 L-40 -22 A46 46 0 0 0 -30 30 Z" fill={TEAL} />
          <text x="16" y="26" textAnchor="middle" fill="#fff" style={{ font: "700 12px var(--font-sans)" }}>
            47%
          </text>
          <text x="-26" y="-22" textAnchor="middle" fill="#fff" style={{ font: "700 10px var(--font-sans)" }}>
            31%
          </text>
        </motion.g>
        </g>

        {/* ══ pyramid with percentage bands ══ */}
        <g transform="translate(150, 74)">
          <motion.g {...float(2.4, 8)}>
          {[
            { w: 2.5, c: VIOLET, z: 0, label: "42%" },
            { w: 1.95, c: TEAL, z: 0.52, label: "36%" },
            { w: 1.4, c: ROSE, z: 1.04, label: "12%" },
            { w: 0.85, c: AMBER, z: 1.56, label: "27%" },
          ].map((L, i) => (
            <g key={i}>
              <Box x={-L.w / 2} y={-L.w / 2} w={L.w} d={L.w} h={0.48} z={L.z} color={L.c} />
              <text
                x={iso(L.w / 2, -L.w / 2, L.z + 0.26)[0] + 10}
                y={iso(L.w / 2, -L.w / 2, L.z + 0.26)[1] + 4}
                className="fill-ink-2"
                style={{ font: "700 10px var(--font-sans)" }}
              >
                {L.label}
              </text>
            </g>
          ))}
        </motion.g>
        </g>

        {/* ══ rising arrows ══ */}
        {[
          { x: 126, y: -198, c: TEAL, d: 0 },
          { x: 160, y: -178, c: AMBER, d: 0.35 },
          { x: 194, y: -202, c: GREEN, d: 0.7 },
        ].map((a, i) => (
          <g key={i} transform={`translate(${a.x},${a.y})`}>
            <motion.g
              animate={reduced ? undefined : { y: [0, -13, 0], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: a.d, ease: "easeInOut" }}
            >
            <path
              d="M0 40 L0 6 M-9 15 L0 6 L9 15"
              fill="none"
              stroke={a.c}
              strokeWidth="4.5"
              strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </g>
        ))}
      </svg>
    </div>
  );
}
