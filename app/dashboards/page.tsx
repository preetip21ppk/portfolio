import type { Metadata } from "next";
import { dashboards } from "@/lib/content";
import DashboardCard from "@/components/DashboardCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Dashboards",
  description:
    "Power BI and Tableau reports — what each one answers, who reads it, and the data layer underneath.",
};

export default function DashboardsPage() {
  return (
    <section className="shell py-14 sm:py-20">
      <div className="animate-rise">
        <p className="eyebrow">Business intelligence</p>
        <h1 className="heading-accent mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Dashboards
        </h1>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {dashboards.map((d, i) => (
          <Reveal key={d.id} delay={Math.min((i % 3) * 90, 270)} from="up" className="h-full">
            <DashboardCard dashboard={d} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
