import type { Metadata } from "next";
import { profile } from "@/lib/content";
import Reveal from "@/components/Reveal";
import EducationCard from "@/components/EducationCard";

export const metadata: Metadata = {
  title: "Education",
  description:
    "MS in Data Analytics Engineering at Northeastern University, Boston, and a BE in Computer Science and Engineering from Anna University (Sri Venkateswara College of Engineering), Chennai.",
};

export default function EducationPage() {
  return (
    <section className="shell py-14 sm:py-20">
      <div className="animate-rise">
        <p className="eyebrow">Academics</p>
        <h1 className="heading-accent mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Education
        </h1>
      </div>

      <ol className="mt-12 flex flex-col gap-8">
        {profile.education.map((ed, i) => (
          <li key={ed.school}>
            <Reveal delay={i * 120} from="up">
              <EducationCard ed={ed} />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
