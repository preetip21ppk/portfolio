import Reveal from "@/components/Reveal";

/**
 * Consistent section opener: eyebrow, heading, drawn rule, optional lead.
 *
 * Every section used to hand-roll this markup, which is why they had drifted
 * out of alignment with each other. One component means one set of spacings.
 */
const HUES = ["hl-teal", "hl-violet", "hl-amber", "hl-rose", "hl-green"];

export default function SectionHead({
  eyebrow,
  title,
  lead,
  hue = 0,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  hue?: number;
}) {
  // highlight the final word so the marker lands on the payload, not the article
  const words = title.split(" ");
  const head = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];
  return (
    <Reveal from="left">
      <div className="max-w-3xl">
        <p className="eyebrow" data-drift>
          {eyebrow}
        </p>
        <h2 className="mt-2.5 text-[clamp(1.6rem,3.2vw,2.5rem)] font-bold tracking-tight text-balance text-ink">
          {head}{" "}
          <span className={`hl hl-on ${HUES[hue % HUES.length]}`}>{tail}</span>
        </h2>
        <span className="rule-draw mt-3.5" data-visible />
        {lead && (
          <p className="measure mt-4 text-base leading-relaxed text-ink-2 sm:text-lg">
            {lead}
          </p>
        )}
      </div>
    </Reveal>
  );
}
