import type { Education } from "@/lib/content";

/**
 * Wide campus banner card.
 *
 * The school name sits *on* the photo, so the scrim underneath it has to carry
 * the contrast rather than the type: the gradient holds at 0.88 alpha across
 * the whole lower band where the text lives, which composites even a near-white
 * facade down to roughly #1f292e — about 15:1 against white. The scrim colour
 * is a fixed dark rather than a theme token for exactly that reason; it has to
 * work identically in light mode, where a page-coloured scrim would not.
 */
export default function EducationCard({ ed }: { ed: Education }) {
  return (
    <article
      className="card box-hover overflow-hidden p-0"
      style={{ ["--tile-hue" as string]: `var(--color-${ed.hue})` }}
    >
      <div className="relative h-56 sm:h-64 lg:h-72">
        {ed.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={ed.image}
            alt={`${ed.school} campus`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, var(--color-${ed.hue}), var(--color-violet))`,
            }}
          />
        )}

        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(2,14,20,0.96) 0%, rgba(2,14,20,0.9) 62%, rgba(2,14,20,0.5) 84%, rgba(2,14,20,0.14) 100%)",
          }}
        />

        {/* hue hairline along the top, so the two schools read apart */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `var(--color-${ed.hue})` }}
        />

        {/* Period badges out of the text flow — wrapped inline it pushed the
            school name up out of the high-alpha part of the scrim on narrow
            screens, onto the bright facade behind it. */}
        <span className="absolute top-4 right-4 rounded-full bg-accent-fill px-3.5 py-1.5 text-xs font-semibold text-on-fill shadow-lg sm:top-6 sm:right-6">
          {ed.period}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <h2 className="text-balance text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl">
            {ed.school}
          </h2>
          {ed.college && (
            <p className="mt-1 text-sm font-medium text-white/80">{ed.college}</p>
          )}
          <p className="mt-1.5 font-medium text-white/90">{ed.degree}</p>
          <p className="mt-1 text-sm text-white/70">{ed.location}</p>
        </div>
      </div>

      {ed.detail && (
        <div className="border-t border-line px-5 py-4 sm:px-7">
          <span className="inline-block rounded border border-primary-line bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary-text">
            {ed.detail}
          </span>
        </div>
      )}
    </article>
  );
}
