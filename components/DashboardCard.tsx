import Link from "next/link";
import { artifactLabel, getProject, isLiveArtifact, type Dashboard } from "@/lib/content";
import DashboardEmbed from "@/components/DashboardEmbed";

/**
 * Dashboard card. Shows, in order of preference: a live embed (`embedUrl`), a
 * screenshot (`image`), or nothing above the title. A `liveUrl` adds an
 * "Open live" link regardless.
 */
export default function DashboardCard({ dashboard }: { dashboard: Dashboard }) {
  /* A PDF export or a video walkthrough is not a live report — neither earns
     the "Live" pill, and both get their own label. */
  const isLive = Boolean(dashboard.embedUrl || isLiveArtifact(dashboard.liveUrl));

  /* Resolve the project rather than trusting the id: retiring a project from
     projects.json would otherwise leave this card pointing at a 404. */
  const project = dashboard.projectId ? getProject(dashboard.projectId) : undefined;

  return (
    <article className="card card-interactive group flex h-full flex-col overflow-hidden">
      <div className="table-glass-head relative flex items-center justify-between gap-3 overflow-hidden px-5 py-3">
        <span className="relative flex items-center gap-2">
          <span className="text-xs font-semibold text-primary-text">
            {dashboard.tool}
          </span>
          {isLive && (
            <span className="flex items-center gap-1 rounded-full bg-surface px-1.5 py-0.5 text-[0.625rem] font-medium text-ink-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-highlight" />
              Live
            </span>
          )}
        </span>
        <span className="relative text-[0.6875rem] text-ink-muted">
          {dashboard.domain}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {dashboard.embedUrl ? (
          <div className="mb-4">
            <DashboardEmbed dashboard={dashboard} />
          </div>
        ) : (
          dashboard.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={dashboard.image}
              alt={`Screenshot of the ${dashboard.name} dashboard`}
              loading="lazy"
              className="mb-4 w-full rounded-lg border border-line"
            />
          )
        )}

        <h3 className="text-base font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-primary-text">
          {dashboard.name}
        </h3>
        <p className="mt-1.5 text-xs text-ink-muted">{dashboard.source}</p>

        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          {dashboard.description}
        </p>

        <div className="mt-4">
          <p className="eyebrow">Views</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {dashboard.views.map((v) => (
              <li
                key={v}
                className="chip rounded-md border border-line bg-surface/70 px-1.5 py-0.5 text-[0.6875rem] text-ink-2"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <span className="text-xs font-medium text-ink">{dashboard.highlight}</span>

          <span className="flex shrink-0 items-center gap-3">
            {dashboard.liveUrl && (
              <a
                href={dashboard.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/live text-xs font-medium text-accent-text link-sweep"
              >
                {artifactLabel(dashboard.liveUrl!, dashboard.tool)}
                <span
                  aria-hidden
                  className="ml-1 inline-block transition-transform duration-200 group-hover/live:translate-x-0.5"
                >
                  &#8599;
                </span>
              </a>
            )}
            {project && (
              <Link
                href={`/projects/${project.id}`}
                className="group/link text-xs font-medium text-accent-text link-sweep"
              >
                View project
                <span
                  aria-hidden
                  className="ml-1 inline-block transition-transform duration-200 group-hover/link:translate-x-0.5"
                >
                  &rarr;
                </span>
              </Link>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
