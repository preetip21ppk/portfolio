"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Round portrait with a graceful fallback.
 *
 * Needs to be a client component because it reacts to the <img> load/error
 * events, and handlers cannot be passed from a server component. The gradient
 * monogram sits underneath and the photo only fades in once it has actually
 * decoded, so a missing file shows the monogram rather than a broken-image
 * icon or a flash of alt text.
 */
export default function Portrait({
  src,
  alt,
  initials,
  className = "h-24 w-24 text-3xl sm:h-28 sm:w-28",
}: {
  src: string;
  alt: string;
  initials: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "ok" | "failed">("idle");
  const img = useRef<HTMLImageElement>(null);

  /**
   * The browser usually finishes the request before React hydrates, so `onLoad`
   * never fires and the photo would stay at opacity 0 forever. Settle from the
   * element's own state once on mount.
   */
  useEffect(() => {
    const el = img.current;
    if (!el || !el.complete) return;
    setState(el.naturalWidth > 0 ? "ok" : "failed");
  }, [src]);

  return (
    <span
      className={`relative inline-grid place-items-center overflow-hidden rounded-full ring-2 ring-primary-line ring-offset-4 ring-offset-transparent ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-teal), var(--color-violet) 55%, var(--color-rose))",
        }}
      />
      <span aria-hidden className="relative font-bold text-white">
        {initials}
      </span>
      {src && state !== "failed" && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={img}
          src={src}
          alt={alt}
          onLoad={() => setState("ok")}
          onError={() => setState("failed")}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: state === "ok" ? 1 : 0 }}
        />
      )}
    </span>
  );
}
