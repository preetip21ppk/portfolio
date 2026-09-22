"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Animates the numeric part of a metric string on first scroll into view.
 *
 * Metric values in this portfolio are mixed — "20", "$11M", "98.3%", "7.64x",
 * but also "Text-to-SQL", "5+1", "28.6% to 60%". Only a string that is exactly
 * one number with optional non-digit affixes is animated; anything else renders
 * as static text, so nothing is ever mangled into a misleading number.
 *
 * The server renders the real value (correct for SEO and no-JS), and the client
 * resets it to zero in a layout effect — before paint — so there is no flash of
 * the final number before the count begins.
 */
const PARSE = /^(\D*)(\d[\d,]*(?:\.\d+)?)(\D*)$/;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function CountUp({
  value,
  duration = 1400,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useIsomorphicLayoutEffect(() => {
    const match = value.match(PARSE);
    if (!match) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const [, prefix, rawNumber, suffix] = match;
    const target = Number(rawNumber.replace(/,/g, ""));
    const decimals = rawNumber.includes(".")
      ? rawNumber.split(".")[1].length
      : 0;
    const grouped = rawNumber.includes(",");

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      const body = grouped
        ? Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed;
      return `${prefix}${body}${suffix}`;
    };

    // Reset to zero before the browser paints, then count up when in view.
    setDisplay(format(0));

    let frame = 0;
    let startTime = 0;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      setDisplay(format(target * easeOutCubic(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // Re-runs only when the metric itself changes, never on each animation frame.
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
