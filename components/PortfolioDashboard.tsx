"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import GlowWave from "@/components/GlowWave";
import CrossFilterChart, {
  type CrossFilterDatum,
} from "@/components/CrossFilterChart";

type Filters = {
  category: string | null;
  period: string | null;
  tool: string | null;
};

const EMPTY: Filters = { category: null, period: null, tool: null };

/**
 * The portfolio as a working BI report.
 *
 * Three slicers cross-highlight each other and drive a KPI row and a detail
 * table — the same interaction model as a Power BI page. Each visual keeps its
 * full domain visible as a faint track and paints the filtered subset on top,
 * so clicking a bar never re-sorts or re-colours the others.
 *
 * Every number here is computed from data/projects.json at render time; nothing
 * is hardcoded.
 */
export default function PortfolioDashboard({
  projects,
  categories,
  periods,
  tools,
  periodOf,
  toolsOf,
}: {
  projects: Project[];
  categories: string[];
  periods: string[];
  tools: string[];
  periodOf: Record<string, string>;
  toolsOf: Record<string, string[]>;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [grown, setGrown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const matches = (p: Project, f: Filters) =>
    (f.category === null || p.categories.includes(f.category)) &&
    (f.period === null || periodOf[p.id] === f.period) &&
    (f.tool === null || toolsOf[p.id].includes(f.tool));

  const visible = useMemo(
    () => projects.filter((p) => matches(p, filters)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, filters]
  );

  /**
   * A visual is not filtered by its own slicer — that is what makes the other
   * bars stay visible and comparable when you click one, exactly as in Power BI.
   */
  const seriesFor = (
    domain: string[],
    key: keyof Filters,
    belongs: (p: Project, label: string) => boolean
  ): CrossFilterDatum[] => {
    const others: Filters = { ...filters, [key]: null };
    const pool = projects.filter((p) => matches(p, others));
    return domain.map((label) => ({
      label,
      total: projects.filter((p) => belongs(p, label)).length,
      filtered: pool.filter((p) => belongs(p, label)).length,
    }));
  };

  const categorySeries = seriesFor(categories, "category", (p, l) =>
    p.categories.includes(l)
  );
  const periodSeries = seriesFor(periods, "period", (p, l) => periodOf[p.id] === l);
  const toolSeries = seriesFor(tools, "tool", (p, l) => toolsOf[p.id].includes(l));

  const toggle = (key: keyof Filters) => (label: string) =>
    setFilters((f) => ({ ...f, [key]: f[key] === label ? null : label }));

  const active = (
    [
      ["category", filters.category],
      ["period", filters.period],
      ["tool", filters.tool],
    ] as const
  ).filter((e): e is [keyof Filters, string] => e[1] !== null);

  const dashboardCount = visible.filter((p) => p.hasDashboard).length;
  const stackCount = new Set(visible.flatMap((p) => toolsOf[p.id])).size;
  const genAiCount = visible.filter((p) =>
    p.categories.includes("GenAI / LLM")
  ).length;

  const kpis = [
    { label: "Projects", value: visible.length, of: projects.length },
    { label: "With a dashboard", value: dashboardCount, of: null },
    { label: "Distinct tools", value: stackCount, of: null },
    { label: "GenAI projects", value: genAiCount, of: null },
  ];

  return (
    <div ref={ref} className="card overflow-hidden">
      {/* Signal banner — sets the analytics-console tone */}
      <div className="relative border-b border-white/40">
        <GlowWave />
        <span className="pointer-events-none absolute bottom-3 left-5 text-[0.625rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
          Live signal
        </span>
      </div>

      {/* Report toolbar */}
      <div className="table-glass-head flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-highlight" />
          <span className="text-xs font-semibold tracking-tight">
            Portfolio Explorer
          </span>
          <span className="hidden text-[0.6875rem] text-ink-muted sm:inline">
            click any bar to cross-filter
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {active.length === 0 ? (
            <span className="text-[0.6875rem] text-ink-muted">No filters</span>
          ) : (
            active.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, [key]: null }))}
                className="flex items-center gap-1.5 rounded-full border border-primary-line bg-primary-soft px-2 py-0.5 text-[0.6875rem] font-medium text-primary-text transition-colors hover:border-accent-line hover:text-accent-text"
              >
                {label}
                <span aria-hidden>&#10005;</span>
              </button>
            ))
          )}
          <button
            type="button"
            onClick={() => setFilters(EMPTY)}
            disabled={active.length === 0}
            className="rounded-md border border-line bg-surface px-2 py-1 text-[0.6875rem] font-medium text-ink-2 transition-colors enabled:hover:border-primary-line enabled:hover:text-primary-text disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="panel-glass box-hover px-4 py-3.5">
            <div className="stat-value text-2xl font-semibold leading-none tracking-tight text-primary-text tabular-nums">
              {k.value}
              {k.of !== null && k.value !== k.of && (
                <span className="text-base text-ink-muted">/{k.of}</span>
              )}
            </div>
            <div className="mt-1.5 text-xs text-ink-2">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Visuals */}
      <div className="grid gap-5 px-4 pb-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="panel-glass p-4">
          <CrossFilterChart
            title="Projects by category"
            caption="Projects carry more than one category"
            data={categorySeries}
            selected={filters.category}
            onSelect={toggle("category")}
            grown={grown}
            totalAll={projects.length}
          />
        </div>
        <div className="panel-glass flex flex-col gap-6 p-4">
          <CrossFilterChart
            title="Delivery over time"
            caption="Projects per half-year"
            data={periodSeries}
            selected={filters.period}
            onSelect={toggle("period")}
            orientation="vertical"
            grown={grown}
            totalAll={projects.length}
          />
        </div>
      </div>

      <div className="grid gap-5 px-4 pb-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="panel-glass p-4">
          <CrossFilterChart
            title="Most-used tools"
            caption="Top 10 across every project stack"
            data={toolSeries}
            selected={filters.tool}
            onSelect={toggle("tool")}
            grown={grown}
            totalAll={projects.length}
          />
        </div>

        {/* Detail table — the drill-through target */}
        <div className="panel-glass flex min-w-0 flex-col p-4">
          <h3 className="text-sm font-semibold tracking-tight">
            Matching projects
          </h3>
          <p className="mt-1 text-xs text-ink-muted" role="status" aria-live="polite">
            {visible.length} of {projects.length}
            {active.length > 0 && ` · ${active.map(([, l]) => l).join(" + ")}`}
          </p>

          {visible.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-line px-4 py-8 text-center text-xs text-ink-muted">
              No project matches that combination. Clear a filter to widen it.
            </p>
          ) : (
            <ul className="table-glass mt-3 max-h-64 overflow-y-auto">
              {visible.map((p) => (
                <li key={p.id} className="row-glass">
                  <Link
                    href={`/projects/${p.id}`}
                    className="group flex items-baseline justify-between gap-3 px-3 py-2"
                  >
                    <span className="min-w-0 truncate text-xs text-ink-2 transition-colors group-hover:text-primary-text">
                      {p.short}
                    </span>
                    <span className="shrink-0 text-[0.625rem] text-ink-muted tabular-nums">
                      {p.date}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="border-t border-white/50 px-5 py-3 text-[0.6875rem] text-ink-muted">
        Built from the same JSON that renders every project page — no hardcoded
        figures. Slicers cross-highlight rather than re-sort, so a bar stays in
        place while you compare.
      </p>
    </div>
  );
}
