"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

export type RevealFrom = "up" | "left" | "right" | "scale" | "flip";

/**
 * Scroll entrance, now backed by Framer Motion.
 *
 * Using `whileInView` rather than a hand-rolled IntersectionObserver gives
 * real spring physics, automatic once-only firing, and correct interruption if
 * the element leaves mid-animation. `useReducedMotion` collapses every variant
 * to a plain fade when the visitor has asked for less movement.
 */
const OFFSET: Record<RevealFrom, { x?: number; y?: number; scale?: number; rotateX?: number }> = {
  up: { y: 26 },
  left: { x: -44 },
  right: { x: 44 },
  scale: { scale: 0.94 },
  flip: { rotateX: 12, y: 24 },
};

export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  from?: RevealFrom;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, ...OFFSET[from] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: reduced
        ? { duration: 0.2, delay: delay / 1000 }
        : {
            type: "spring",
            stiffness: 190,
            damping: 24,
            mass: 0.9,
            delay: delay / 1000,
          },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container that staggers its children automatically — cleaner than threading
 * an incrementing delay through every call site.
 */
export function RevealGroup({
  children,
  className = "",
  stagger = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}
