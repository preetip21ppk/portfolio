import Link from "next/link";
import { getDashboardsForProject, type Project } from "@/lib/content";
import { MetricInline } from "@/components/StatTile";

export default function ProjectCard({ project }: { project: Project }) {
  /* Derive the badge instead of trusting `hasDashboard`: retiring a dashboard
     would otherwise leave a project advertising one it no longer has. */
  const hasDashboard = getDashboardsForProject(project.id).length > 0;

  return (
    <article className="card card-interactive group relative flex h-full flex-col overflow-hidden p-5">
      {/* Accent rail that draws down the left edge on hover */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-y-100 motion-reduce:transition-none"
      />

      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow">{project.date}</span>
        {hasDashboard && (
          <span className="rounded-full border border-primary-line bg-primary-soft px-2 py-0.5 text-[0.6875rem] font-medium text-primary-text">
            Dashboard
          </span>
        )}
      </div>

      <h3 className="mt-2.5 text-base font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-primary-text">
        <Link href={`/projects/${project.id}`} className="before:absolute before:inset-0">
          {project.short}
        </Link>
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-ink-2">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        {project.metrics.slice(0, 3).map((m) => (
          <MetricInline key={m.label} value={m.value} label={m.label} />
        ))}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="chip rounded-md border border-line bg-surface/70 px-1.5 py-0.5 text-[0.6875rem] text-ink-2"
            >
              {s}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-1 py-0.5 text-[0.6875rem] text-ink-muted">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        <span className="mt-4 flex items-center gap-1.5 text-xs font-medium text-accent-text opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:opacity-100">
          Read the build
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </span>
      </div>
    </article>
  );
}
