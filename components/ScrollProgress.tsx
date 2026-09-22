"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Scroll progress rail.
 *
 * Driven by `useScroll` + `useSpring` on `scaleX` rather than by setting a
 * width from a scroll listener: the transform is GPU-composited and never
 * triggers layout, and the spring smooths out the jitter of raw scroll deltas.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--color-teal), var(--color-violet), var(--color-rose))",
      }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left"
    />
  );
}
