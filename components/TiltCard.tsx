"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * Glass card with spring-damped 3D tilt and a cursor-following spotlight.
 *
 * Rotation runs through `useSpring`, so the card settles with real physics
 * instead of snapping back on a fixed transition — it keeps a little momentum
 * when the pointer leaves, which is what makes it feel physical.
 *
 * The spotlight is a radial gradient positioned from pointer percentages,
 * layered above the card and faded in on hover.
 */
export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 20,
  });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || reduced) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px - 0.5);
    y.set(py - 0.5);
    setGlow({ x: px * 100, y: py * 100 });
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={`group/tilt relative h-full [transform-style:preserve-3d] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background: `radial-gradient(340px circle at ${glow.x}% ${glow.y}%, color-mix(in oklch, var(--color-teal) 18%, transparent), transparent 62%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
