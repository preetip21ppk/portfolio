"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

/**
 * Page transition, now driven by Framer Motion.
 *
 * A template (unlike a layout) remounts on every navigation, so keying on the
 * pathname replays the enter animation per route. Spring physics rather than a
 * fixed curve, so a fast navigation settles quickly instead of always burning
 * the full duration.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 210, damping: 26, mass: 0.85 }
      }
    >
      {children}
    </motion.div>
  );
}
