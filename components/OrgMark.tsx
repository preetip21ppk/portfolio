"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Square logo plate for an organisation.
 *
 * Sits on a near-white plate regardless of theme: org logos are almost always
 * drawn for light backgrounds, and a transparent PNG of dark artwork would
 * disappear entirely against the deep-sea page. `object-contain` rather than
 * cover, so a wide wordmark is never cropped.
 *
 * Until a file exists at `logo`, a hue-tinted monogram stands in — same
 * approach as the campus images, so the layout never has a hole in it.
 */
export default function OrgMark({
  logo,
  short,
  hue,
  alt,
}: {
  logo: string;
  short: string;
  hue: string;
  alt: string;
}) {
  const [state, setState] = useState<"idle" | "ok" | "failed">("idle");
  const img = useRef<HTMLImageElement>(null);

  /* The request usually finishes before hydration, so `onLoad` never fires.
     Settle from the element's own state once on mount. */
  useEffect(() => {
    const el = img.current;
    if (!el || !el.complete) return;
    setState(el.naturalWidth > 0 ? "ok" : "failed");
  }, [logo]);

  return (
    <span
      className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl sm:h-20 sm:w-20"
      style={{
        background: state === "ok" ? "#ffffff" : `color-mix(in oklab, var(--color-${hue}) 22%, #0d2230)`,
        boxShadow: `inset 0 0 0 1.5px color-mix(in oklab, var(--color-${hue}) 55%, transparent)`,
      }}
    >
      <span
        aria-hidden
        className="px-1 text-center text-[0.8125rem] leading-none font-bold tracking-tight"
        style={{ color: `var(--color-${hue})` }}
      >
        {short}
      </span>
      {logo && state !== "failed" && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={img}
          src={logo}
          alt={alt}
          onLoad={() => setState("ok")}
          onError={() => setState("failed")}
          className="absolute inset-0 h-full w-full object-contain p-2 transition-opacity duration-500"
          style={{ opacity: state === "ok" ? 1 : 0 }}
        />
      )}
    </span>
  );
}
