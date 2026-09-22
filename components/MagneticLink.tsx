"use client";

import Link from "next/link";
import { useRef } from "react";

/**
 * Button that leans toward the cursor while it is over it, then springs back.
 * Offsets are written straight to the element's style, so tracking the pointer
 * never causes a React render. Fine pointers only, and off under
 * prefers-reduced-motion.
 */
export default function MagneticLink({
  href,
  children,
  className = "",
  external = false,
  strength = 0.28,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || !enabled()) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.setProperty("--tx", `${dx * strength}px`);
    el.style.setProperty("--ty", `${dy * strength}px`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  };

  const props = {
    ref,
    onPointerMove: onMove,
    onPointerLeave: reset,
    className: `magnetic ${className}`,
  };

  if (external) {
    return (
      <a {...props} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
}
