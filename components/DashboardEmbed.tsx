"use client";

import { useState } from "react";
import type { Dashboard } from "@/lib/content";

/**
 * Renders an embedded dashboard behind a click-to-load poster.
 *
 * Power BI and Tableau iframes are heavy and set third-party cookies, so the
 * iframe is only mounted once the visitor asks for it — the page stays fast and
 * nothing third-party loads until they opt in.
 */
export default function DashboardEmbed({ dashboard }: { dashboard: Dashboard }) {
  const [loaded, setLoaded] = useState(false);

  if (!dashboard.embedUrl) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-plane">
      {loaded ? (
        <iframe
          src={dashboard.embedUrl}
          title={`${dashboard.name} — interactive ${dashboard.tool} dashboard`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block aspect-[16/10] w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 transition-colors hover:bg-primary-soft"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-fill text-on-fill transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100">
            <span aria-hidden className="ml-0.5 text-sm">
              &#9654;
            </span>
          </span>
          <span className="text-sm font-medium text-ink">
            Load interactive dashboard
          </span>
          <span className="text-xs text-ink-muted">
            Opens the live {dashboard.tool} report in place
          </span>
        </button>
      )}
    </div>
  );
}
