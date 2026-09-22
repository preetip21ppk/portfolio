"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Masked line reveal — the signature editorial headline animation.
 *
 * Each word sits inside an `overflow-hidden` wrapper and slides up from 110%,
 * so it appears to rise from behind a hard edge rather than fading in. Far more
 * expensive-looking than a per-character fade, and it reads as one deliberate
 * motion instead of twenty small ones.
 *
 * `gradientFrom` marks the index at which words switch to the gradient
 * treatment, so a name can lead in ink and resolve into colour.
 */
export default function MaskedHeading({
  text,
  className = "",
  gradientFrom,
  delay = 0,
}: {
  text: string;
  className?: string;
  gradientFrom?: number;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1 className={className} aria-label={text}>
      <span className="flex flex-wrap justify-center gap-x-[0.3em] lg:justify-start">
        {words.map((word, i) => {
          const gradient = gradientFrom !== undefined && i >= gradientFrom;
          return (
            <span key={`${word}-${i}`} aria-hidden className="block overflow-hidden pb-[0.08em]">
              <motion.span
                initial={reduced ? { opacity: 0 } : { y: "110%" }}
                animate={reduced ? { opacity: 1 } : { y: 0 }}
                transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.09 }}
                className="block"
              >
                {/* The gradient sits on a child, never on the element Framer
                    transforms: background-clip:text with a transparent colour
                    stops painting when the clipped box itself is transformed. */}
                {gradient ? <span className="heading-gradient">{word}</span> : word}
              </motion.span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
