"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Theme switch, styled as a sliding track.
 *
 * The initial value is already on <html> from the inline script in layout, so
 * this only mirrors it and writes changes back. Renders a neutral placeholder
 * until mounted, because the server cannot know which theme the browser
 * resolved and guessing would cause a hydration mismatch.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) || "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — the toggle still works for this session */
    }
    setTheme(next);
  };

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="glass relative grid h-9 w-[3.75rem] shrink-0 place-items-center rounded-full px-1 transition-colors"
    >
      <span className="flex w-full items-center justify-between px-1.5 text-ink-muted">
        <Sun className="h-3.5 w-3.5" />
        <Moon className="h-3.5 w-3.5" />
      </span>
      <motion.span
        aria-hidden
        layout
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className="absolute top-1 h-7 w-7 rounded-full shadow-md"
        style={{
          left: dark ? "calc(100% - 1.875rem)" : "0.25rem",
          background:
            "linear-gradient(135deg, var(--color-teal), var(--color-violet))",
        }}
      />
    </button>
  );
}
