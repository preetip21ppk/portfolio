/**
 * Fixed atmospheric layer behind the whole site.
 *
 * Six saturated colour fields drift on long, offset cycles; a glacier scrim
 * covers the full viewport so text always has a light ground; a faint grid and
 * animated grain add texture. See globals.css for the contrast reasoning.
 *
 * Pure CSS, GPU-composited, no scroll listener.
 */
export default function AuroraBackground() {
  return (
    <div aria-hidden className="aurora">
      <span className="aurora-blob aurora-1" />
      <span className="aurora-blob aurora-2" />
      <span className="aurora-blob aurora-3" />
      <span className="aurora-blob aurora-4" />
      <span className="aurora-blob aurora-5" />
      <span className="aurora-blob aurora-6" />
      <span className="aurora-scrim" />
      <span className="aurora-grain" />
    </div>
  );
}
