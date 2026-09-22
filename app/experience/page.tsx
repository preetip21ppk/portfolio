import type { Metadata } from "next";
import { experience, leadership } from "@/lib/content";
import Reveal from "@/components/Reveal";
import OrgMark from "@/components/OrgMark";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Three data internships across health research, pharmaceutical QC, and retail analytics.",
};

export default function ExperiencePage() {
  return (
    <section className="shell py-14 sm:py-20">
      <div className="animate-rise">
        <p className="eyebrow">Career</p>
        <h1 className="heading-accent mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Experience
        </h1>
      </div>

      {/* Timeline: a continuous rail with a node per role */}
      <ol className="relative mt-12 flex flex-col gap-4 sm:pl-10">
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-3 hidden w-px bg-line sm:block"
        />

        {experience.map((role, i) => (
          <li key={role.id} className="relative">
            <span
              aria-hidden
              className="absolute top-7 -left-10 hidden h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-plane sm:block"
              style={{ left: "-2.05rem" }}
            />
            <Reveal delay={i * 110} from="up">
              <div className="card box-hover p-6 sm:p-7">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      {role.role}
                    </h2>
                    <p className="mt-1 text-ink-2">
                      {role.company} · {role.location}
                    </p>
                  </div>
                  <p className="shrink-0 rounded-full border border-line bg-plane px-2.5 py-1 text-xs text-ink-muted">
                    {role.period}
                  </p>
                </div>

                <ul className="mt-5 flex flex-col gap-3">
                  {role.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-sm leading-relaxed text-ink-2"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {role.stack.map((s) => (
                    <li
                      key={s}
                      className="chip rounded-md border border-line bg-surface/70 px-1.5 py-0.5 text-[0.6875rem] text-ink-2"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      {/* ── Leadership ── */}
      <Reveal from="left">
        <h2 className="mt-20 text-2xl font-bold tracking-tight">
          <span className="hl hl-teal">Leadership</span>
        </h2>
        <p className="measure mt-3 text-ink-2">
          Elected roles running student organisations alongside coursework.
        </p>
      </Reveal>

      <ol className="mt-7 grid gap-4 sm:grid-cols-2">
        {leadership.map((l, i) => (
          <li key={l.id}>
            <Reveal delay={i * 90}>
              <div
                className="tile flex h-full items-center gap-5 p-5 sm:p-6"
                style={{ ["--tile-hue" as string]: `var(--color-${l.hue})` }}
              >
                <OrgMark logo={l.logo} short={l.short} hue={l.hue} alt={l.org} />
                <div className="min-w-0">
                  <p className="eyebrow">{l.period}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight">{l.role}</h3>
                  <p className="mt-1.5 leading-snug text-ink-2">{l.org}</p>
                  {l.institution && (
                    <p className="mt-1 text-sm text-ink-muted">{l.institution}</p>
                  )}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

    </section>
  );
}
