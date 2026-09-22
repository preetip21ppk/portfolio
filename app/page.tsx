import {
  profile,
  skills,
} from "@/lib/content";
import PipelineFlow from "@/components/PipelineFlow";
import TechMarquee from "@/components/TechMarquee";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";
import MaskedHeading from "@/components/MaskedHeading";
import RoleRotator from "@/components/RoleRotator";
import CartoonScene from "@/components/CartoonScene";
import Portrait from "@/components/Portrait";
import SectionHead from "@/components/SectionHead";

export default function HomePage() {
  const marqueeItems = skills.flatMap((g) => g.items).filter((s) => s.length < 22);

  return (
    <>
      {/*
        ── Landing ────────────────────────────────────────────────────────────
        Sized to exactly one viewport minus the 4rem header, in svh so mobile
        browser chrome can't clip it. Type is clamped against vh as well as vw,
        so the whole landing still fits a 1366x768 laptop without scrolling —
        which fixed pixel sizes could never guarantee.
      */}
      <section className="scanline relative flex min-h-[calc(100svh-4.75rem)] flex-col justify-center overflow-hidden">

        {/*
          Centred column. The landing previously sat hard-left inside a 96rem
          shell, which left half a wide screen empty; a centred measure keeps
          the composition balanced at any width.
        */}
        <div className="shell relative grid items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/*
            Portrait. Drop a square image at public/preeti.jpg and it appears
            here; until then the monogram stands in, so the layout never has a
            hole in it.
          */}
          <div className="animate-fade mb-5">
            <Portrait src="/preeti.jpg" alt={profile.name} initials="PK" />
          </div>

          {/* Availability pill with a pinging dot */}
          <div className="animate-fade glass mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium text-ink-2">
            <span className="relative flex h-2 w-2">
              <span
                aria-hidden
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            Open to work · {profile.location} (open to relocation)
          </div>

          <MaskedHeading
            text={profile.name}
            delay={0.12}
            className="max-w-[16ch] text-[clamp(2.5rem,min(6.4vw,10vh),5.25rem)] leading-[1.03] font-bold tracking-tight text-accent-text"
          />

          <div
            className="animate-rise mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start"
            style={{ animationDelay: "160ms" }}
          >
            <span className="text-[clamp(1.25rem,2.9vh,1.9rem)] font-semibold text-primary-text">
              <RoleRotator
                roles={[
                  "Data Analyst",
                  "Data Analytics Engineer",
                  "Data Scientist",
                  "Data Engineer",
                  "Power BI Developer",
                  "Business Analyst",
                ]}
              />
            </span>
          </div>

          <p
            className="animate-rise mt-6 max-w-[52ch] text-[clamp(1.05rem,2.1vh,1.45rem)] leading-relaxed text-balance text-ink-2"
            style={{ animationDelay: "240ms" }}
          >
            {profile.tagline}
          </p>
          </div>

          {/* Animated team-at-a-dashboard scene. Bleeds into the shell's own
              gutter (padding-inline is clamp(1.25rem, 5vw, 5rem), so 4vw is
              always inside it) to buy the figures some size without clipping. */}
          <div className="hidden lg:-mr-[4vw] lg:block">
            <CartoonScene />
          </div>
        </div>
      </section>

      <div className="border-y border-line bg-plane/50 py-3">
        <TechMarquee items={marqueeItems} />
      </div>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section id="about" className="shell scroll-mt-20 border-t border-line py-16 sm:py-24">
        <SectionHead eyebrow="About" title="A bit about me" hue={1} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal from="left">
            <div className="flex max-w-2xl flex-col gap-5">
              {profile.about.map((para) => (
                <p key={para} className="text-lg leading-relaxed text-ink-2">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal from="right" delay={120}>
            <div className="card p-6 sm:p-7 lg:sticky lg:top-24">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span
                    aria-hidden
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                </span>
                <h3 className="text-xl font-bold tracking-tight">Open to work</h3>
              </div>

              <p className="eyebrow mt-6">Get in touch</p>
              <dl className="mt-3 flex flex-col gap-3.5 text-sm">
                <div>
                  <dt className="text-xs text-ink-muted">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${profile.email}`}
                      className="link-sweep break-all text-accent-text"
                    >
                      {profile.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Phone</dt>
                  <dd className="mt-1 text-ink-2">{profile.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Location</dt>
                  <dd className="mt-1 text-ink-2">
                    {profile.location} (open to relocation)
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-line bg-plane px-3.5 py-2.5 text-center text-sm font-medium text-ink-2 hover:border-primary-line hover:text-primary-text"
                >
                  LinkedIn
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-line bg-plane px-3.5 py-2.5 text-center text-sm font-medium text-ink-2 hover:border-primary-line hover:text-primary-text"
                >
                  GitHub
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Method ───────────────────────────────────────────────────────── */}
      <section className="shell border-t border-line py-16 sm:py-24">
        <SectionHead
          eyebrow="Method"
          title="Source to decision, end to end"
          hue={2}
          lead="Every project follows the same path. The dashboard at the end is only as trustworthy as the pipeline behind it."
        />
        <Reveal delay={100} from="up" className="mt-10">
          <PipelineFlow />
        </Reveal>
      </section>

      {/* ── Toolkit ──────────────────────────────────────────────────────── */}
      <section className="shell border-t border-line py-16 sm:py-24">
        <SectionHead eyebrow="Toolkit" title="What I build with"
          hue={4} />
        {/* Four groups with very uneven chip counts (6/2/5/9) — a 2x2 grid
            keeps the rows even where three columns would strand one card. */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={(i % 3) * 80} className="h-full">
              <TiltCard>
                <div className="card box-hover h-full p-5">
                  <h3 className="text-sm font-semibold tracking-tight">
                    {group.group}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="chip rounded-md border border-line bg-surface/70 px-2 py-1 text-[0.6875rem] text-ink-2"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
