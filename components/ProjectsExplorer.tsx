"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/content";
import ProjectCard from "@/components/ProjectCard";
import TiltCard from "@/components/TiltCard";

export default function ProjectsExplorer({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const inCategory = active === "All" || p.categories.includes(active);
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = [p.title, p.summary, ...p.stack, ...p.categories]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, active, query]);

  const countFor = (cat: string) =>
    cat === "All"
      ? projects.length
      : projects.filter((p) => p.categories.includes(cat)).length;

  return (
    <div>
      {/* Filters sit in one row above the grid */}
      <div className="flex flex-col gap-4 border-b border-line pb-6">
        <label className="relative block max-w-sm">
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, stack, or topic…"
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm placeholder:text-ink-muted focus:border-primary-line"
          />
        </label>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["All", ...categories].map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary-fill text-on-fill shadow-md shadow-primary-fill/30"
                    : "border-line bg-surface text-ink-2 hover:-translate-y-0.5 hover:border-primary-line hover:text-primary-text motion-reduce:hover:translate-y-0"
                }`}
              >
                {cat}
                <span
                  className={`ml-1.5 text-[0.6875rem] ${
                    isActive ? "text-white/70" : "text-ink-muted"
                  }`}
                >
                  {countFor(cat)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-2" role="status" aria-live="polite">
        Showing <span className="font-medium text-ink">{visible.length}</span> of{" "}
        {projects.length} projects
        {active !== "All" && <> in {active}</>}
      </p>

      {visible.length === 0 ? (
        <div className="card mt-6 px-6 py-16 text-center">
          <p className="text-sm text-ink-2">
            No projects match that filter. Try clearing the search or picking another
            category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActive("All");
            }}
            className="mt-4 rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink-2 hover:border-primary-line hover:text-primary-text"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div
          key={active}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((p, i) => (
            <div
              key={p.id}
              className="animate-rise h-full"
              style={{ animationDelay: `${Math.min((i % 3) * 70, 210)}ms` }}
            >
              <TiltCard><ProjectCard project={p} /></TiltCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
