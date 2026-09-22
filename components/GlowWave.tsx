"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Glowing multi-band waveform — the signature visual of a dark analytics
 * console, used as the banner of the interactive report.
 *
 * Three phase-shifted sine bands are sampled into paths and stacked with a
 * blur-based glow filter, so overlaps bloom rather than flattening. Node dots
 * ride the crest of the leading band.
 *
 * Purely decorative (the real numbers live in the charts below), so it is
 * aria-hidden. The drift animation stops under prefers-reduced-motion; the
 * shape itself still renders.
 */
const BANDS = [
  { hue: "var(--color-teal)", amp: 20, freq: 2.1, phase: 0, w: 2.6, op: 1 },
  { hue: "var(--color-violet)", amp: 15, freq: 1.6, phase: 1.5, w: 2.2, op: 0.85 },
  { hue: "var(--color-rose)", amp: 11, freq: 2.7, phase: 3.1, w: 1.8, op: 0.7 },
];

const W = 900;
const H = 130;

function wavePath(amp: number, freq: number, phase: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 90; i++) {
    const x = (i / 90) * W;
    const t = (i / 90) * Math.PI * 2 * freq + phase;
    // envelope tapers the ends so the band doesn't clip at the edges
    const env = Math.sin((i / 90) * Math.PI);
    const y = H / 2 - Math.sin(t) * amp * env - Math.sin(t * 0.5) * amp * 0.35 * env;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${pts.join(" L ")}`;
}

export default function GlowWave() {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="glow-wave relative h-[130px] w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <filter id={`${id}-glow`} x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`${id}-fade`} x1="0" x2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="12%" stopColor="white" stopOpacity="1" />
            <stop offset="88%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect width={W} height={H} fill={`url(#${id}-fade)`} />
          </mask>
        </defs>

        <g mask={`url(#${id}-mask)`} filter={`url(#${id}-glow)`}>
          {BANDS.map((b, i) => (
            <motion.path
              key={i}
              d={wavePath(b.amp, b.freq, b.phase)}
              fill="none"
              stroke={b.hue}
              strokeWidth={b.w}
              strokeLinecap="round"
              opacity={b.op}
              animate={reduced ? undefined : { x: [0, -W / b.freq, 0] }}
              transition={{
                duration: 22 + i * 7,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* node dots along the leading band */}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = (i / 10) * W;
            const t = (i / 10) * Math.PI * 2 * BANDS[0].freq;
            const env = Math.sin((i / 10) * Math.PI);
            const y =
              H / 2 - Math.sin(t) * BANDS[0].amp * env - Math.sin(t * 0.5) * BANDS[0].amp * 0.35 * env;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="2.6"
                fill="var(--color-teal)"
                animate={reduced ? undefined : { opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.18 }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
