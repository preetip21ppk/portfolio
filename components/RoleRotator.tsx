"use client";

import { useEffect, useState } from "react";

/**
 * Cycles the role line under the name.
 *
 * Each role slides up and out while the next slides up and in, so the change
 * reads as a rotating reel rather than a crossfade. The longest role is
 * rendered invisibly underneath to reserve width, which stops the line that
 * follows it from jumping around as the text changes.
 *
 * Honours prefers-reduced-motion by holding on the first role permanently.
 */
export default function RoleRotator({
  roles,
  interval = 2600,
}: {
  roles: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const swap = setInterval(() => {
      setAnimating(true);
      // let the outgoing role clear before swapping the text
      setTimeout(() => {
        setIndex((i) => (i + 1) % roles.length);
        setAnimating(false);
      }, 360);
    }, interval);

    return () => clearInterval(swap);
  }, [roles.length, interval]);

  const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      {/* reserves the widest possible width so nothing after it shifts */}
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <span className="absolute inset-0 flex items-center">
        <span
          key={index}
          className={`role-slide whitespace-nowrap ${animating ? "role-out" : ""}`}
        >
          {roles[index]}
        </span>
      </span>
      {/* full list for assistive tech, since the visible text is animated */}
      <span className="sr-only">{roles.join(", ")}</span>
    </span>
  );
}
