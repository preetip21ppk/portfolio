import type { Education } from "@/lib/content";

/**
 * Education card — details only, no campus photo.
 *
 * Earlier versions led with a campus band. Even once the caption was moved off
 * the image so the photo was actually visible, it dominated a card whose real
 * content is four short lines. The `image` field is left populated in the data
 * so the band can come back in one edit if wanted.
 */
export default function EducationCard({ ed }: { ed: Education }) {
  const hue = `var(--color-${ed.hue})`;

  return (
    <article className="card box-hover relative overflow-hidden p-0">
      {/* hue rail down the leading edge, so the two schools read apart */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: hue }} />

      <div className="p-6 pl-7 sm:p-7 sm:pl-9">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <h2 className="text-xl leading-tight font-bold tracking-tight sm:text-2xl">
              {ed.school}
            </h2>
            {ed.college && (
              <p className="mt-1.5 font-medium" style={{ color: hue }}>
                {ed.college}
              </p>
            )}
            <p className="mt-2.5 text-ink-2">{ed.degree}</p>
          </div>

          <span className="shrink-0 rounded-full bg-accent-fill px-3 py-1 text-xs font-semibold text-on-fill">
            {ed.period}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-line pt-4">
          <span className="text-sm text-ink-muted">{ed.location}</span>
          {ed.detail && (
            <span className="rounded border border-primary-line bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary-text">
              {ed.detail}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
