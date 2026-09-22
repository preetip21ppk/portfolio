/**
 * The end-to-end path this portfolio is organised around: source systems land
 * in a pipeline, the pipeline feeds a warehouse, the warehouse feeds models and
 * BI. Stage names only — the specific tools live on the project pages.
 *
 * Stacks vertically on mobile and runs left-to-right from md up; the traveling
 * dots switch axis with it and stop entirely under prefers-reduced-motion.
 */
const STAGES = ["Sources", "Pipeline", "Warehouse", "Models", "Decisions"];

function Connector({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      className="relative flex shrink-0 items-center justify-center py-2 md:min-w-6 md:flex-1 md:py-0"
    >
      <span className="absolute h-full w-px bg-primary-line md:h-px md:w-full" />
      <span
        className="flow-dot absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ animationDelay: `${index * 420}ms` }}
      />
    </div>
  );
}

export default function PipelineFlow() {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold tracking-tight">
          How I work, end to end
        </h2>
        <span className="hidden text-[0.6875rem] text-ink-muted sm:inline">
          source &rarr; decision
        </span>
      </div>

      <ol className="mt-5 flex flex-col md:flex-row md:items-stretch">
        {STAGES.map((label, i) => (
          <li key={label} className="contents">
            <div
              className="animate-rise box-hover glass flex flex-1 items-center gap-2 rounded-xl px-4 py-4 md:min-w-0"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span className="text-sm font-semibold tracking-tight">
                {label}
              </span>
            </div>
            {i < STAGES.length - 1 && <Connector index={i} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
