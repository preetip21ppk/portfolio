/**
 * Infinite marquee of the toolkit. The track is duplicated and translated by
 * exactly -50%, so the seam lands on an identical copy and the loop is
 * invisible. The duplicate is aria-hidden so the list is announced once.
 *
 * That -50% only hides the seam while a single track is wider than the
 * viewport; a short list would run out mid-screen and expose a gap on a wide
 * monitor. Short lists are therefore repeated inside each track, which keeps
 * both tracks identical and the arithmetic intact.
 */
export default function TechMarquee({ items }: { items: string[] }) {
  const row = items.length < 32 ? [...items, ...items] : items;

  const Track = ({ hidden = false }: { hidden?: boolean }) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-3 pr-3"
    >
      {row.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-ink-2"
        >
          <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee relative overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]"
      role="region"
      aria-label="Toolkit"
    >
      <div className="marquee-track flex w-max">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
