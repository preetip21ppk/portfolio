import Link from "next/link";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";

type Bar = { label: string; value: number };

/** Fixed hue order — assigned by position, never cycled or recoloured. */
const HUES = [
  "var(--color-teal)",
  "var(--color-violet)",
  "var(--color-orange)",
  "var(--color-rose)",
  "var(--color-green)",
  "var(--color-amber)",
];

/**
 * Bento overview grid.
 *
 * Mixed-size glass tiles, each carrying its own hue via `--tile-hue`, so the
 * section reads as a composition rather than a row of identical boxes. Every
 * figure is passed in from the real content data — nothing here is hardcoded.
 */
export default function BentoHero({
  projectCount,
  dashboardCount,
  toolCount,
  gpa,
  categories,
  topTools,
  latestRole,
  latestCompany,
  latestPeriod,
  domains,
  leadRole,
  leadOrg,
  leadPeriod,
}: {
  projectCount: number;
  dashboardCount: number;
  toolCount: number;
  gpa: string;
  categories: Bar[];
  topTools: string[];
  latestRole: string;
  latestCompany: string;
  latestPeriod: string;
  domains: number;
  leadRole: string;
  leadOrg: string;
  leadPeriod: string;
}) {
  const maxCat = Math.max(...categories.map((c) => c.value), 1);

  return (
    <div className="bento">
      {/* Projects */}
      <Reveal delay={0} className="bento-2">
        <div
          className="tile group h-full p-5"
          style={{ ["--tile-hue" as string]: "var(--color-teal)" }}
        >
          <p className="eyebrow">Shipped</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-teal tabular-nums">
            <CountUp value={String(projectCount)} />
          </p>
          <p className="mt-1.5 text-sm text-ink-2">Projects, end to end</p>
        </div>
      </Reveal>

      {/* Dashboards */}
      <Reveal delay={70} className="bento-2">
        <div
          className="tile group h-full p-5"
          style={{ ["--tile-hue" as string]: "var(--color-violet)" }}
        >
          <p className="eyebrow">Delivered</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-violet tabular-nums">
            <CountUp value={String(dashboardCount)} />
          </p>
          <p className="mt-1.5 text-sm text-ink-2">
            Dashboards across {domains} domains
          </p>
        </div>
      </Reveal>

      {/* Category mini-chart — the wide tile */}
      <Reveal delay={140} className="bento-2 xl:row-span-2">
        <div
          className="tile group flex h-full flex-col p-5"
          style={{ ["--tile-hue" as string]: "var(--color-orange)" }}
        >
          <p className="eyebrow">Where the work sits</p>
          <ul className="mt-4 flex flex-1 flex-col justify-center gap-2.5">
            {categories.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2.5">
                <span className="w-24 truncate text-[0.6875rem] text-ink-2">
                  {c.label}
                </span>
                <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/70">
                  <span
                    className="bar-fill absolute inset-y-0 left-0 rounded-full"
                    data-grown
                    style={{
                      width: `${(c.value / maxCat) * 100}%`,
                      background: HUES[i % 5],
                      transitionDelay: `${300 + i * 90}ms`,
                    }}
                  />
                </span>
                <span className="w-4 text-right text-[0.6875rem] font-semibold tabular-nums">
                  {c.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Latest role */}
      <Reveal delay={210} className="bento-4">
        <div
          className="tile group flex h-full flex-col justify-between p-5"
          style={{ ["--tile-hue" as string]: "var(--color-rose)" }}
        >
          <div>
            <p className="eyebrow">Most recent</p>
            <p className="mt-3 text-lg font-semibold tracking-tight">{latestRole}</p>
            <p className="mt-1 text-sm text-ink-2">
              {latestCompany} · {latestPeriod}
            </p>
          </div>
          <Link
            href="/experience"
            className="link-sweep mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-rose-text"
          >
            Full experience
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </Reveal>

      {/* Distinct tools */}
      <Reveal delay={280} className="bento-2">
        <div
          className="tile group h-full p-5"
          style={{ ["--tile-hue" as string]: "var(--color-green)" }}
        >
          <p className="eyebrow">Toolkit</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-green tabular-nums">
            <CountUp value={String(toolCount)} />
          </p>
          <p className="mt-1.5 text-sm text-ink-2">Distinct technologies</p>
        </div>
      </Reveal>

      {/* GPA */}
      <Reveal delay={350} className="bento-2">
        <div
          className="tile group h-full p-5"
          style={{ ["--tile-hue" as string]: "var(--color-amber)" }}
        >
          <p className="eyebrow">Northeastern</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-amber tabular-nums">
            <CountUp value={gpa} />
          </p>
          <p className="mt-1.5 text-sm text-ink-2">Graduate GPA · MS 2026</p>
        </div>
      </Reveal>

      {/* Leadership */}
      <Reveal delay={390} className="bento-2">
        <div
          className="tile group flex h-full flex-col justify-between p-5"
          style={{ ["--tile-hue" as string]: "var(--color-rose)" }}
        >
          <div>
            <p className="eyebrow">Leadership</p>
            <p className="mt-3 text-lg font-bold tracking-tight">{leadRole}</p>
            <p className="mt-1 text-sm leading-snug text-ink-2">{leadOrg}</p>
          </div>
          <p className="mt-3 text-xs text-ink-muted">{leadPeriod}</p>
        </div>
      </Reveal>

      {/* Top tools chips */}
      <Reveal delay={460} className="bento-4">
        <div
          className="tile group h-full p-5"
          style={{ ["--tile-hue" as string]: "var(--color-teal)" }}
        >
          <p className="eyebrow">Most used</p>
          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {topTools.map((t, i) => (
              <li
                key={t}
                className="chip rounded-lg border px-2 py-1 text-xs"
                style={{
                  borderColor: `color-mix(in srgb, ${HUES[i % 6]} 45%, white)`,
                  background: `color-mix(in srgb, ${HUES[i % 6]} 13%, white)`,
                  color: `color-mix(in srgb, ${HUES[i % 6]} 78%, black)`,
                }}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
