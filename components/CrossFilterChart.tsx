"use client";

import { useState } from "react";

/**
 * Cross-highlighting bar visual — the behaviour a Power BI report gives you
 * when you click a slicer: every category keeps its full-domain bar as a faint
 * track, and the portion matching the current filter is painted solid on top.
 * The domain never re-sorts and bars never change hue, so the eye can follow a
 * category across interactions.
 *
 * Interaction layer: hover raises a tooltip with the exact count, the share of
 * the filtered set and the share of the whole, plus a guide line across the
 * plot. Values are directly labelled too, so nothing depends on hovering.
 *
 * Single series, so one hue and no legend.
 */
export type CrossFilterDatum = {
  label: string;
  total: number;
  filtered: number;
};

function Tooltip({
  d,
  totalAll,
  align = "right",
}: {
  d: CrossFilterDatum;
  totalAll: number;
  align?: "right" | "center";
}) {
  const pctOfAll = totalAll ? Math.round((d.filtered / totalAll) * 100) : 0;
  const pctOfCat = d.total ? Math.round((d.filtered / d.total) * 100) : 0;
  return (
    <span
      role="status"
      className={`pointer-events-none absolute -top-2 z-20 -translate-y-full rounded-lg border border-white/70 bg-white/90 px-2.5 py-1.5 text-left shadow-xl backdrop-blur-md ${
        align === "right" ? "right-0" : "left-1/2 -translate-x-1/2"
      }`}
    >
      <span className="block text-[0.6875rem] font-semibold whitespace-nowrap text-ink">
        {d.label}
      </span>
      <span className="mt-0.5 block text-[0.625rem] whitespace-nowrap text-ink-2 tabular-nums">
        {d.filtered} of {d.total} · {pctOfCat}% of category
      </span>
      <span className="block text-[0.625rem] whitespace-nowrap text-ink-muted tabular-nums">
        {pctOfAll}% of all {totalAll}
      </span>
    </span>
  );
}

export default function CrossFilterChart({
  title,
  caption,
  data,
  selected,
  onSelect,
  orientation = "horizontal",
  grown,
  totalAll = 0,
}: {
  title: string;
  caption: string;
  data: CrossFilterDatum[];
  selected: string | null;
  onSelect: (label: string) => void;
  orientation?: "horizontal" | "vertical";
  grown: boolean;
  totalAll?: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.total), 1);
  const isFiltered = data.some((d) => d.filtered !== d.total);
  const all = totalAll || data.reduce((s, d) => Math.max(s, d.total), 0);

  if (orientation === "vertical") {
    return (
      <figure className="flex h-full flex-col">
        <figcaption>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-xs text-ink-muted">{caption}</p>
        </figcaption>

        <div className="mt-5 flex flex-1 items-end gap-2">
          {data.map((d, i) => {
            const active = selected === d.label;
            const dimmed = selected !== null && !active;
            const isHover = hovered === d.label;
            return (
              <button
                key={d.label}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(d.label)}
                onMouseEnter={() => setHovered(d.label)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(d.label)}
                onBlur={() => setHovered(null)}
                className={`group relative flex min-w-0 flex-1 flex-col items-center gap-2 rounded transition-all duration-200 ${
                  dimmed ? "opacity-45 hover:opacity-85" : "opacity-100"
                } ${isHover ? "-translate-y-0.5" : ""}`}
              >
                {isHover && <Tooltip d={d} totalAll={all} align="center" />}
                <span className="text-xs font-semibold tabular-nums">
                  {isFiltered ? d.filtered : d.total}
                </span>
                <span className="relative flex h-28 w-full items-end justify-center">
                  <span
                    className="absolute bottom-0 w-full rounded-t bg-primary/20 transition-[height] duration-700 ease-out"
                    style={{ height: grown ? `${(d.total / max) * 100}%` : 0 }}
                  />
                  <span
                    className={`absolute bottom-0 w-full rounded-t transition-all duration-700 ease-out ${
                      isHover || active ? "bg-primary-hover" : "bg-primary-fill"
                    }`}
                    style={{
                      height: grown ? `${(d.filtered / max) * 100}%` : 0,
                      transitionDelay: `${i * 70}ms`,
                      boxShadow: isHover
                        ? "0 0 0 2px rgba(14,155,184,0.25)"
                        : undefined,
                    }}
                  />
                </span>
                <span
                  className={`w-full truncate text-[0.625rem] transition-colors ${
                    active || isHover ? "font-semibold text-ink" : "text-ink-muted"
                  }`}
                >
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
      </figure>
    );
  }

  return (
    <figure className="flex h-full flex-col">
      <figcaption>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-xs text-ink-muted">{caption}</p>
      </figcaption>

      <ul className="relative mt-5 flex flex-col gap-2">
        {data.map((d, i) => {
          const active = selected === d.label;
          const dimmed = selected !== null && !active;
          const isHover = hovered === d.label;
          return (
            <li key={d.label} className="relative">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(d.label)}
                onMouseEnter={() => setHovered(d.label)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(d.label)}
                onBlur={() => setHovered(null)}
                className={`group grid w-full grid-cols-[minmax(0,7.5rem)_1fr_2.75rem] items-center gap-3 rounded-md py-1 text-left transition-all duration-200 ${
                  dimmed ? "opacity-45 hover:opacity-85" : "opacity-100"
                } ${isHover ? "translate-x-0.5" : ""}`}
              >
                {isHover && <Tooltip d={d} totalAll={all} />}

                <span
                  className={`truncate text-xs transition-colors ${
                    active || isHover ? "font-semibold text-ink" : "text-ink-2"
                  }`}
                >
                  {d.label}
                </span>

                <span className="relative h-2.5 overflow-hidden rounded-full bg-white/50 ring-1 ring-white/70 ring-inset">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-[width] duration-700 ease-out"
                    style={{ width: grown ? `${(d.total / max) * 100}%` : 0 }}
                  />
                  <span
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                      isHover || active ? "bg-primary-hover" : "bg-primary-fill"
                    }`}
                    style={{
                      width: grown ? `${(d.filtered / max) * 100}%` : 0,
                      transitionDelay: `${i * 55}ms`,
                    }}
                  />
                </span>

                <span className="text-right text-xs font-semibold tabular-nums">
                  {isFiltered ? (
                    <>
                      {d.filtered}
                      <span className="text-ink-muted">/{d.total}</span>
                    </>
                  ) : (
                    d.total
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
