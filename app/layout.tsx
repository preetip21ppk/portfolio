import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuroraBackground from "@/components/AuroraBackground";
import SeaLayer from "@/components/SeaLayer";
import MouseTrail from "@/components/MouseTrail";
import SmoothScroll from "@/components/SmoothScroll";
import { profile, projects, dashboards } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://preeti-kannan.vercel.app"),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Data Analytics Engineer building end-to-end data products: ETL/ELT pipelines, cloud warehouses, ML and GenAI systems, and the Power BI and Tableau dashboards on top of them.",
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description:
      `${projects.length} projects and ${dashboards.length} dashboards across data engineering, machine learning, GenAI, and business intelligence.`,
    type: "website",
  },
};

/**
 * Applied before first paint so the correct theme is on <html> when the page
 * renders — otherwise a dark-theme visitor gets a white flash on every load.
 * Falls back to the OS preference when nothing has been chosen.
 */
const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="relative flex min-h-screen flex-col">
        {/* Fixed layers: colour fields, starfield, then the cursor comet on top */}
        <AuroraBackground />
        <SeaLayer />
        <MouseTrail />
        <SmoothScroll />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-accent-fill focus:px-3 focus:py-2 focus:text-sm focus:text-on-fill"
        >
          Skip to content
        </a>

        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1 pt-[4.75rem]">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
