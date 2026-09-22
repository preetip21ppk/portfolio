import type { Metadata } from "next";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Three data internships across health research, pharmaceutical QC, and retail analytics.",
};

export default function ExperiencePage() {
  return (
    <section className="shell py-14 sm:py-20">
      <div className="animate-rise">
        <p className="eyebrow">Career</p>
        <h1 className="heading-accent mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Experience
        </h1>
      </div>

      <div className="mt-12">
        <ExperienceTimeline />
      </div>
    </section>
  );
}
