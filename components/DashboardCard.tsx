import Link from "next/link";
import { artifactLabel, getProject, isLiveArtifact, type Dashboard } from "@/lib/content";
import DashboardEmbed from "@/components/DashboardEmbed";

/**
 * Dashboard showcase card.
 *
 * Deliberately NOT a project card. A project page answers "how was this
 * built"; this answers "what does the report tell me, and who reads it" — so
 * the lead is the artefact itself at full width, followed by the business
 * questions it answers. The project summary is not repeated here at all, and
 * the link back to it is demoted to a footnote.
 *
 * The accent follows the tool rather than an arbitrary palette slot, so Power
 * BI and Tableau work are distinguishable at a glance.
 */

const TOOL_HUE: Record<string, string> = {
  "Power BI": "var(--color-amber)",
  Tableau: "var(--color-teal)",
};

/** Stand-in when a dashboard has no screenshot yet — a contents sheet, not a hole. */
function Poster({ dashboard, hue }: { dashboard: Dashboard; hue: string }) {
  return (
    <div
      className="flex h-full flex-col justify-between p-6"
      style={{
        background: `linear-gradient(135deg, color-mix(in oklab, ${hue} 18%, var(--color-surface)), var(--color-surface))`,
      }}
    >
      <div className="flex flex-wrap gap-1.5">
        {dashboard.views.map((v) => (
          <span
            key={v}
            className="rounded-md border px-1.5 py-0.5 text-[0.6875rem] text-ink-2"
            style={{ borderColor: `color-mix(in oklab, ${hue} 45%, transparent)` }}
          >
            {v}
          </span>
        ))}
      </div>
      <p className="text-right text-2xl font-bold tracking-tight" style={{ color: hue }}>
        {dashboard.tool}
      </p>
    </div>
  );
}

export default function DashboardCard({ dashboard }: { dashboard: Dashboard }) {
  const hue = TOOL_HUE[dashboard.tool] ?? "var(--color-violet)";
  const project = dashboard.projectId ? getProject(dashboard.projectId) : undefined;
  const live = isLiveArtifact(dashboard.liveUrl);

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      {/* the artefact leads */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-plane">
        {dashboard.embedUrl ? (
          <DashboardEmbed dashboard={dashboard} />
        ) : dashboard.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={dashboard.image}
            alt={`${dashboard.name} dashboard`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <Poster dashboard={dashboard} hue={hue} />
        )}

        <span
          className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-tight text-on-fill shadow-md"
          style={{ background: hue }}
        >
          {dashboard.tool}
        </span>
        {live && (
          <span className="glass absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium text-ink">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-highlight" />
            Live
          </span>
        )}
      </div>

      {/* further report pages, if the dashboard runs to more than one */}
      {dashboard.extraImages?.length ? (
        <div className="grid gap-px border-b border-line bg-line sm:grid-cols-2">
          {dashboard.extraImages.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src}
              src={src}
              alt={`${dashboard.name} dashboard, page ${i + 2}`}
              loading="lazy"
              className="aspect-[16/9] w-full bg-plane object-cover object-top"
            />
          ))}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{dashboard.domain}</p>
        <h3 className="mt-2 text-xl leading-snug font-bold tracking-tight">
          {dashboard.name}
        </h3>

        <p className="mt-4 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Answers
        </p>
        <ul className="mt-2.5 flex flex-col gap-2">
          {dashboard.answers.map((q) => (
            <li key={q} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: hue }}
              />
              {q}
            </li>
          ))}
        </ul>

        <dl className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-xs">
          <div className="flex gap-2">
            <dt className="shrink-0 text-ink-muted">Built on</dt>
            <dd className="text-ink-2">{dashboard.builtOn}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-ink-muted">Read by</dt>
            <dd className="text-ink-2">{dashboard.audience}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-ink-muted">Views</dt>
            <dd className="text-ink-2">{dashboard.views.join(" · ")}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
          {dashboard.liveUrl && (
            <a
              href={dashboard.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shine btn-lift inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-on-fill"
              style={{ background: hue }}
            >
              {artifactLabel(dashboard.liveUrl, dashboard.tool)}
              <span aria-hidden>&#8599;</span>
            </a>
          )}
          {project && (
            <Link
              href={`/projects/${project.id}`}
              className="link-sweep text-xs text-ink-muted hover:text-ink-2"
            >
              How it was built &rarr;
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
