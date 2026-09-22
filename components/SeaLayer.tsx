"use client";

import { useEffect, useRef } from "react";

type Bubble = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
};

/**
 * Deep-sea atmosphere: bubbles rising through the water column.
 *
 * Each bubble drifts on its own sine so the column sways rather than rising in
 * straight lines, and they respawn at the bottom on a loop — no allocation
 * after init. Drawn as a thin ring with a small specular highlight, which is
 * what makes a circle read as a bubble instead of a dot.
 *
 * Reads the theme and brightens considerably in dark mode, where the effect
 * belongs; in light mode it stays a faint suggestion. Pauses when the tab is
 * hidden, and is skipped entirely under prefers-reduced-motion.
 */
export default function SeaLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let bubbles: Bubble[] = [];
    let frame = 0;
    let running = false;
    let t = 0;
    let dark = document.documentElement.dataset.theme === "dark";

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.round((w * h) / 26000), 60);
      bubbles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.5 + Math.random() * 6,
        speed: 0.18 + Math.random() * 0.55,
        drift: 8 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.55,
      }));
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      const base = dark ? 1 : 0.32;

      for (const b of bubbles) {
        b.y -= b.speed;
        if (b.y < -20) {
          b.y = h + 20;
          b.x = Math.random() * w;
        }
        const x = b.x + Math.sin(t * 0.5 + b.phase) * b.drift;
        const a = b.alpha * base;

        ctx.strokeStyle = dark
          ? `rgba(150, 230, 250, ${(a * 0.65).toFixed(3)})`
          : `rgba(14, 155, 184, ${(a * 0.4).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();

        // specular dot — the thing that reads as "bubble"
        ctx.fillStyle = dark
          ? `rgba(220, 250, 255, ${(a * 0.5).toFixed(3)})`
          : `rgba(255, 255, 255, ${(a * 0.6).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x - b.r * 0.32, b.y - b.r * 0.32, Math.max(b.r * 0.22, 0.6), 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    build();
    start();

    const onResize = () => build();
    const onVisibility = () => (document.hidden ? stop() : start());
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme === "dark";
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      {/* Light shafts from the surface, swaying on offset cycles */}
      <div aria-hidden className="sea-rays">
        <span className="ray ray-1" />
        <span className="ray ray-2" />
        <span className="ray ray-3" />
        <span className="ray ray-4" />
      </div>
      {/* Caustic shimmer + depth gradient */}
      <div aria-hidden className="sea-caustics" />
      <div aria-hidden className="sea-depth" />
      <canvas
        ref={ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 h-full w-full"
      />
    </>
  );
}
