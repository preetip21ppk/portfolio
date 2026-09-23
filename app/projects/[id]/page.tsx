import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  projects,
  getProject,
  getDashboardsForProject,
  artifactLabel,
} from "@/lib/content";
import { StatTile } from "@/components/StatTile";
import Reveal from "@/components/Reveal";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return { title: "Project not found" };
  return { title: project.short, description: project.summary };
}

export default async function ProjectPage({ params }: Params) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const linkedDashboards = getDashboardsForProject(project.id);

  /* Name the thing on the CTA: a recruiter should know whether they are about
     to get an interactive report, a PDF or a video before they click. */
  const demoLabel = project.demo
    ? artifactLabel(project.demo, linkedDashboards[0]?.tool)
    : "Live demo";

  return (
    <article className="shell py-14 sm:py-20">
      <Link
        href="/projects"
        className="group text-sm text-ink-2 link-sweep hover:text-accent-text"
      >
        <span
          aria-hidden
          className="mr-1 inline-block transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          &larr;
        </span>
        All projects
      </Link>

      <header className="animate-rise mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date dropped here too, to match the tiles */}
          {project.categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-primary-line bg-primary-soft px-2 py-0.5 text-[0.6875rem] font-medium text-primary-text"
            >
              {c}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">{project.summary}</p>

        {(project.github || project.demo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="shine btn-lift inline-flex items-center gap-2 rounded-lg bg-accent-fill px-4 py-2.5 text-sm font-semibold text-on-fill shadow-lg shadow-accent-fill/25 hover:bg-accent-hover"
              >
                View project
                <span aria-hidden className="text-xs">
                  &#8599;
                </span>
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lift inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-2 hover:border-primary-line hover:text-primary-text"
              >
                {demoLabel}
                <span aria-hidden className="text-xs">
                  &#8599;
                </span>
              </a>
            )}
          </div>
        )}
      </header>

      {project.metrics.length > 0 && (
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {project.metrics.map((m, i) => (
            <div
              key={m.label}
              className="animate-rise"
              style={{ animationDelay: `${140 + i * 90}ms` }}
            >
              <StatTile value={m.value} label={m.label} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <Reveal from="left">
          <section>
            <h2 className="text-lg font-semibold tracking-tight">What I built</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {project.bullets.map((b) => (
                <li key={b} className="flex gap-3 leading-relaxed text-ink-2">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <aside className="flex flex-col gap-6">
          <div className="card box-hover p-5">
            <h2 className="text-sm font-semibold tracking-tight">Stack</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="chip rounded-md border border-line bg-surface/70 px-2 py-1 text-xs text-ink-2"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {linkedDashboards.length > 0 && (
            <div className="card box-hover p-5">
              <h2 className="text-sm font-semibold tracking-tight">
                Dashboard delivered
              </h2>
              {linkedDashboards.map((d) => (
                <div key={d.id} className="mt-3">
                  {d.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={d.image}
                      alt={`Screenshot of the ${d.name} dashboard`}
                      loading="lazy"
                      className="mb-3 w-full rounded-lg border border-line"
                    />
                  )}
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {d.tool} · {d.domain}
                  </p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {d.views.map((v) => (
                      <li
                        key={v}
                        className="chip rounded-md border border-line bg-surface/70 px-1.5 py-0.5 text-[0.6875rem] text-ink-2"
                      >
                        {v}
                      </li>
                    ))}
                  </ul>

                  {/* Appears the moment the dashboard has a public URL — this
                      is the slot for "open the real report and click around". */}
                  {d.liveUrl && (
                    <a
                      href={d.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shine btn-lift mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-fill px-3.5 py-2 text-xs font-semibold text-on-fill hover:bg-accent-hover"
                    >
                      {artifactLabel(d.liveUrl, d.tool)}
                      <span aria-hidden>&#8599;</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
