import type { Metadata } from "next";
import { projects, projectCategories } from "@/lib/content";
import ProjectsExplorer from "@/components/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "20 data engineering, machine learning, GenAI, and business intelligence projects, filterable by category and stack.",
};

export default function ProjectsPage() {
  return (
    <section className="shell py-14 sm:py-20">
      <div className="animate-rise">
        <p className="eyebrow">Portfolio</p>
        <h1 className="heading-accent mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="measure mt-4 text-lg leading-relaxed text-ink-2">
          {projects.length} projects spanning serverless GenAI, orchestrated data
          pipelines, cloud analytics platforms, computer vision, and BI. Filter by
          category or search the stack.
        </p>
      </div>

      <div className="animate-rise mt-10" style={{ animationDelay: "120ms" }}>
        <ProjectsExplorer projects={projects} categories={projectCategories} />
      </div>
    </section>
  );
}
