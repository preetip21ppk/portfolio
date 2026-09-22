"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Education, Experience and Projects are sections of the home page, so they
 * point at anchors and the pill tracks scroll position. Dashboards is its own
 * page and matches on pathname like any normal route.
 */
const NAV: { href: string; label: string; section?: string }[] = [
  { href: "/#education", label: "Education", section: "education" },
  { href: "/#experience", label: "Experience", section: "experience" },
  { href: "/#projects", label: "Projects", section: "projects" },
  { href: "/dashboards", label: "Dashboards" },
];

const SECTIONS = NAV.map((n) => n.section).filter(Boolean) as string[];

/**
 * Floating pill header.
 *
 * Detached from the top edge rather than a full-width bar, so it reads as a
 * control surface hovering over the page. The active-item highlight is a single
 * shared element animated via Framer Motion's `layoutId` — it physically slides
 * between items instead of one underline fading out while another fades in.
 *
 * Compresses on scroll: tighter padding, deeper shadow, stronger frost.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [section, setSection] = useState<string | null>(null);
  const onHome = pathname === "/";

  const isActive = (item: (typeof NAV)[number]) =>
    item.section
      ? onHome && section === item.section
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Scroll-spy for the home page. Tracks the set of sections currently on
   * screen and lights the topmost one, rather than whichever entry fired
   * last — with sections taller than the viewport, ordering by position is
   * the only thing that stays stable scrolling up as well as down.
   */
  useEffect(() => {
    if (!onHome) {
      setSection(null);
      return;
    }
    const nodes = SECTIONS.map((id) => document.getElementById(id)).filter(
      (n): n is HTMLElement => n !== null
    );
    if (!nodes.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setSection(SECTIONS.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`shell pointer-events-auto transition-[padding] duration-300 ${
          scrolled ? "pt-2.5" : "pt-4"
        }`}
      >
        <div
          className={`relative flex items-center justify-between gap-6 rounded-2xl border px-3 transition-all duration-300 ${
            scrolled
              ? "glass-strong border-glass-edge py-2 shadow-[0_10px_34px_-14px_rgba(0,0,0,0.35)]"
              : "glass border-glass-edge py-2.5 shadow-[0_6px_24px_-16px_rgba(0,0,0,0.28)]"
          }`}
        >
          {/* Specular top edge — the highlight that sells it as glass */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-glass-shine to-transparent"
          />

          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1 text-[0.9375rem] font-semibold tracking-tight"
          >
            <span
              aria-hidden
              className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-xl text-[0.8125rem] font-bold text-white shadow-md shadow-teal/30"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-teal), var(--color-violet) 55%, var(--color-rose))",
              }}
            >
              <span className="relative z-10">P</span>
              <span className="absolute inset-0 bg-gradient-to-br from-white/45 to-transparent" />
            </span>
            <span className="hidden sm:inline">Preeti Purnimaa Kannan</span>
            <span className="sm:hidden">Preeti</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-xl px-3.5 py-2 text-sm transition-colors duration-200 ${
                    active ? "text-primary-text" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {/*
                    One shared element across all items: Framer Motion matches
                    the layoutId between renders and animates it from the old
                    position to the new, so the pill slides across.
                  */}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-xl border border-primary-line bg-primary-soft"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
            <span className="ml-2"><ThemeToggle /></span>
          </nav>

          <span className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
            className="glass grid h-9 w-9 place-items-center rounded-xl text-ink-2"
          >
            <span aria-hidden className="text-base leading-none">
              {open ? "✕" : "☰"}
            </span>
            </button>
          </span>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="glass-strong mt-2 overflow-hidden rounded-2xl border border-glass-edge p-2 shadow-xl md:hidden"
            >
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item) ? "page" : undefined}
                  className={`block rounded-xl px-3 py-2.5 text-sm ${
                    isActive(item)
                      ? "bg-primary-soft font-medium text-primary-text"
                      : "text-ink-2"
                  }`}
                >
                  {item.label}
                </Link>
              ))}            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <ScrollProgress />
    </header>
  );
}
