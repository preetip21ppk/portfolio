import type { Education } from "@/lib/content";

/**
 * Campus card: photo band above, details below.
 *
 * The previous version laid the school name over the photo, which forced a
 * heavy dark scrim to keep the type legible — and that scrim buried the
 * building it was sitting on. You cannot have both a readable overlay and a
 * visible photo in the same pixels. Separating them gives the image the full
 * band with nothing on top of it, and puts the text on the card surface where
 * it inherits the theme's already-validated contrast.
 *
 * The band is 16:5 because that is the aspect both source photos were cropped
 * to, so neither gets cropped again here.
 */
export default function EducationCard({ ed }: { ed: Education }) {
  const hue = `var(--color-${ed.hue})`;

  return (
    <article className="card box-hover overflow-hidden p-0">
      <span aria-hidden className="block h-1 w-full" style={{ background: hue }} />

      {ed.image ? (
        <div className="aspect-[16/5] w-full overflow-hidden border-b border-line bg-plane">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ed.image}
            alt={`${ed.school} campus`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className="grid aspect-[16/5] w-full place-items-center border-b border-line"
          style={{ background: `linear-gradient(135deg, ${hue}, var(--color-violet))` }}
        >
          <span className="text-3xl font-bold tracking-tight text-white">{ed.short}</span>
        </div>
      )}

      <div className="p-6 sm:p-7">
        <h2 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
          {ed.school}
        </h2>
        {ed.college && (
          <p className="mt-1.5 font-medium" style={{ color: hue }}>
            {ed.college}
          </p>
        )}

        <p className="mt-3 text-lg text-ink-2">{ed.degree}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-accent-fill px-3 py-1 text-xs font-semibold text-on-fill">
            {ed.period}
          </span>
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
