import CountUp from "@/components/CountUp";

/**
 * Stat tile: label (sentence case) + value.
 * Large standalone values use proportional figures — tabular-nums is reserved
 * for columns that must align vertically. The value counts up on first view.
 */
export function StatTile({
  value,
  label,
  size = "md",
}: {
  value: string;
  label: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="card box-hover group relative overflow-hidden px-5 py-4">
      {/* Accent wash that wipes in on hover */}
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-primary-soft transition-transform duration-300 ease-out group-hover:scale-y-100 motion-reduce:transition-none"
      />
      <div className="relative">
        <div
          className={`stat-value font-semibold leading-none tracking-tight text-primary-text ${
            size === "lg" ? "text-4xl" : "text-2xl"
          }`}
        >
          <CountUp value={value} />
        </div>
        <div className="mt-2 text-sm leading-snug text-ink-2">{label}</div>
      </div>
    </div>
  );
}

/** Compact inline metric used inside project cards and detail headers. */
export function MetricInline({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-lg font-semibold leading-none tracking-tight text-ink">
        <CountUp value={value} duration={1100} />
      </div>
      <div className="mt-1.5 text-xs leading-snug text-ink-muted">{label}</div>
    </div>
  );
}
