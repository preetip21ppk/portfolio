"use client";

import { useEffect, useRef, useState } from "react";

export type BarDatum = { label: string; value: number };

/**
 * Single-series categorical magnitude chart (horizontal bars).
 *
 * One series, so one hue and no legend — the title names it. Every bar carries
 * a direct value label, so the numbers are readable without hovering; the hover
 * layer adds share-of-total, which is the one thing the bars don't state. Marks
 * are thin with rounded data-ends anchored to a recessive track, separated by a
 * surface gap. Bars grow once, on first scroll into view.
 */
export default function BarList({
  title,
  caption,
  data,
  unit = "",
}: {
  title: string;
  caption?: string;
  data: BarDatum[];
  unit?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} className="card flex h-full flex-col p-5">
      <figcaption>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {caption && <p className="mt-1 text-xs text-ink-muted">{caption}</p>}
      </figcaption>

      <ul className="mt-5 flex flex-col gap-2.5">
        {data.map((d, i) => {
          const share = total > 0 ? Math.round((d.value / total) * 100) : 0;
          const isHovered = hovered === d.label;

          return (
            <li
              key={d.label}
              onMouseEnter={() => setHovered(d.label)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(d.label)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              className="group relative grid grid-cols-[minmax(0,7rem)_1fr_2rem] items-center gap-3 rounded py-0.5"
            >
              <span className="truncate text-xs text-ink-2" title={d.label}>
                {d.label}
              </span>

              <span className="relative h-2.5 overflow-hidden rounded-full bg-plane ring-1 ring-line ring-inset">
                <span
                  data-grown={grown || undefined}
                  style={{
                    width: `${Math.max((d.value / max) * 100, 3)}%`,
                    transitionDelay: `${i * 90}ms`,
                  }}
                  className={`bar-fill absolute inset-y-0 left-0 rounded-full transition-colors ${
                    isHovered ? "bg-primary-hover" : "bg-primary"
                  }`}
                />
              </span>

              <span className="text-right text-xs font-semibold tabular-nums">
                {d.value}
              </span>

              {isHovered && (
                <span
                  role="status"
                  className="pointer-events-none absolute -top-8 right-0 z-10 rounded-md border border-line bg-surface px-2 py-1 text-[0.6875rem] whitespace-nowrap text-ink shadow-sm"
                >
                  {d.label}: {d.value}
                  {unit && ` ${unit}`} · {share}% of {total}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
