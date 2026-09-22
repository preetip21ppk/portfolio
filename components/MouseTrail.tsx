"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  hue: number;
};

type Ripple = { x: number; y: number; r: number; life: number };

type Bub = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  life: number;
};

/**
 * Layered cursor effect.
 *
 *   1. ribbon    — spring-chained segments that whip on fast movement
 *   2. sparks    — particles thrown off in proportion to speed, under gravity
 *   3. web       — constellation lines drawn between nearby sparks
 *   4. orbiters  — three dots circling the cursor, speeding up as you move
 *   5. halo      — a lagging ring that swells with velocity
 *   6. ripples   — an expanding shockwave on click
 *
 * Everything additive-blended so overlaps bloom rather than muddying.
 *
 * pointer-events: none throughout, so it can never intercept a click. Skipped
 * on coarse pointers and under prefers-reduced-motion, and the loop halts once
 * everything settles, so an idle cursor costs zero frames.
 */
export default function MouseTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    /*
     * Gate on an actual mouse event rather than a media query.
     *
     * `(pointer: fine)` is read once at mount and is wrong for a large class of
     * devices: touchscreen laptops report a coarse pointer even though a mouse
     * is attached, and any touch emulation disables the effect permanently.
     * Waiting for a pointermove whose pointerType is "mouse" is the ground
     * truth — a real mouse is moving, so draw.
     */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SEGMENTS = 26;
    // Deep-water palette: the comet belongs to the same ocean as the page.
    const TEAL = [8, 110, 140];
    const ORANGE = [150, 60, 25];
    const VIOLET = [72, 48, 160];
    const FOAM = [180, 235, 250];

    const target: Pt = { x: -400, y: -400 };
    const pts: Pt[] = Array.from({ length: SEGMENTS }, () => ({ x: -400, y: -400 }));
    const halo: Pt = { x: -400, y: -400 };
    let sparks: Spark[] = [];
    let ripples: Ripple[] = [];
    let bubbles: Bub[] = [];

    let w = 0;
    let h = 0;
    let frame = 0;
    let running = false;
    let idle = 0;
    let speed = 0;
    let t = 0;
    let prev: Pt = { x: -400, y: -400 };
    let overInteractive = false;   // pointer is on a link/button/input
    let pressed = 0;               // 1 -> 0 decay while the button is held
    let focusPulse = 0;            // 0 -> 1 burst when something is selected
    let focus = 0;                 // eased 0..1 toward overInteractive

    /** teal -> violet -> orange across 0..1 */
    const mix = (u: number) => {
      const [a, b, k] = u < 0.5 ? [TEAL, VIOLET, u * 2] : [VIOLET, ORANGE, (u - 0.5) * 2];
      return a.map((c, i) => Math.round(c + (b[i] - c) * k));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // spring chain
      pts[0].x += (target.x - pts[0].x) * 0.4;
      pts[0].y += (target.y - pts[0].y) * 0.4;
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.4;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.4;
      }
      halo.x += (target.x - halo.x) * 0.11;
      halo.y += (target.y - halo.y) * 0.11;

      // --- ribbon ---
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = pts.length - 1; i > 0; i--) {
        const u = 1 - i / pts.length;
        const [r, g, b] = mix(u);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(u * 0.5).toFixed(3)})`;
        ctx.lineWidth = 0.6 + u * 7.5;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[i - 1].x, pts[i - 1].y);
        ctx.stroke();
      }

      // --- ripples (click shockwaves) ---
      ripples = ripples.filter((rp) => {
        rp.r += 7;
        rp.life -= 0.026;
        if (rp.life <= 0) return false;
        ctx.strokeStyle = `rgba(120, 210, 235, ${(rp.life * 0.55).toFixed(3)})`;
        ctx.lineWidth = 2.5 * rp.life;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // --- sparks ---
      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04;
        s.vx *= 0.986;
        s.life -= s.decay;
        if (s.life <= 0) return false;
        const [r, g, b] = mix(s.hue);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(s.life * 0.8).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // --- bubbles: rise, sway, pop ---
      bubbles = bubbles.filter((b) => {
        b.y -= b.vy;
        b.life -= 0.009;
        if (b.life <= 0) return false;
        const bx = b.x + Math.sin(t * 1.6 + b.phase) * (b.sway * (1 - b.life) * 0.5);
        const a = b.life * 0.7;

        ctx.strokeStyle = `rgba(${FOAM[0]}, ${FOAM[1]}, ${FOAM[2]}, ${(a * 0.55).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();

        // specular dot — what makes a circle read as a bubble
        ctx.fillStyle = `rgba(230, 250, 255, ${(a * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(bx - b.r * 0.34, b.y - b.r * 0.34, Math.max(b.r * 0.24, 0.6), 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // --- constellation web between nearby sparks ---
      for (let i = 0; i < sparks.length; i++) {
        for (let j = i + 1; j < sparks.length; j++) {
          const a = sparks[i];
          const b = sparks[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 68) continue;
          const alpha = (1 - d / 68) * 0.22 * Math.min(a.life, b.life);
          ctx.strokeStyle = `rgba(90, 70, 180, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // --- orbiters ---
      const orbitR = 20 + Math.min(speed * 0.55, 16);
      for (let i = 0; i < 3; i++) {
        const ang = t * (1.6 + speed * 0.05) + (i * Math.PI * 2) / 3;
        const ox = pts[0].x + Math.cos(ang) * orbitR;
        const oy = pts[0].y + Math.sin(ang) * orbitR * 0.6;
        const [r, g, b] = mix(i / 3);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.beginPath();
        ctx.arc(ox, oy, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }

      /*
       * Halo ring. It reacts to context rather than just velocity:
       *   · over a link or button it swells and fills with a soft wash
       *   · while the button is held it contracts, like a press
       *   · selecting text fires a one-shot expanding pulse
       */
      focus += ((overInteractive ? 1 : 0) - focus) * 0.16;
      const pressDip = pressed * 6;
      const ringR =
        17 + Math.min(speed * 0.9, 28) + focus * 16 - pressDip;

      if (focus > 0.02) {
        const wash = ctx.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, ringR);
        wash.addColorStop(0, `rgba(34, 211, 238, ${(focus * 0.16).toFixed(3)})`);
        wash.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx.fillStyle = wash;
        ctx.beginPath();
        ctx.arc(halo.x, halo.y, ringR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = `rgba(34, 211, 238, ${Math.min(0.1 + speed * 0.012 + focus * 0.45, 0.8).toFixed(3)})`;
      ctx.lineWidth = 1.6 + focus * 1.4;
      ctx.beginPath();
      ctx.arc(halo.x, halo.y, Math.max(ringR, 4), 0, Math.PI * 2);
      ctx.stroke();

      // one-shot selection pulse
      if (focusPulse > 0.01) {
        const pr = 20 + (1 - focusPulse) * 70;
        ctx.strokeStyle = `rgba(167, 139, 250, ${(focusPulse * 0.6).toFixed(3)})`;
        ctx.lineWidth = 2.5 * focusPulse;
        ctx.beginPath();
        ctx.arc(halo.x, halo.y, pr, 0, Math.PI * 2);
        ctx.stroke();
        focusPulse *= 0.93;
      }

      // --- head glow + core ---
      const head = pts[0];
      const glowR = 52 + focus * 26;
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, glowR);
      glow.addColorStop(0, `rgba(60, 170, 205, ${(0.26 + focus * 0.36).toFixed(3)})`);
      glow.addColorStop(0.4, `rgba(80, 60, 170, ${(0.16 + focus * 0.22).toFixed(3)})`);
      glow.addColorStop(1, "rgba(8, 60, 90, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.7 + focus * 0.3).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3.2 + focus * 1.8, 0, Math.PI * 2);
      ctx.fill();

      speed *= 0.9;

      const settled =
        Math.abs(pts[pts.length - 1].x - target.x) < 0.5 &&
        Math.abs(pts[pts.length - 1].y - target.y) < 0.5;
      if (settled && sparks.length === 0 && ripples.length === 0 && bubbles.length === 0 && focus < 0.02 && focusPulse < 0.02 && ++idle > 90) {
        running = false;
        ctx.clearRect(0, 0, w, h);
        return;
      }

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      idle = 0;
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      // ignore touch and pen; only a mouse gets the comet
      if (e.pointerType && e.pointerType !== "mouse") return;

      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const d = Math.hypot(dx, dy);
      speed = Math.min(d, 60);
      prev = { x: e.clientX, y: e.clientY };
      target.x = e.clientX;
      target.y = e.clientY;

      /*
       * Hit-test what is under the cursor so the comet can react to it. Using
       * elementFromPoint + closest keeps it accurate for nested markup, where
       * the literal event target is often a inner <span> rather than the link.
       */
      const el = document.elementFromPoint(e.clientX, e.clientY);
      overInteractive = !!el?.closest(
        'a, button, [role="button"], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])'
      );

      // bubbles trail behind the cursor and rise
      if (Math.random() < Math.min(d / 26, 0.7) && bubbles.length < 46) {
        bubbles.push({
          x: e.clientX + (Math.random() - 0.5) * 18,
          y: e.clientY + (Math.random() - 0.5) * 12,
          r: 1.6 + Math.random() * 5.5,
          vy: 0.35 + Math.random() * 0.9,
          sway: 6 + Math.random() * 16,
          phase: Math.random() * Math.PI * 2,
          life: 1,
        });
      }

      const n = Math.min(Math.floor(d / 8), 4);
      for (let i = 0; i < n && sparks.length < 110; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 0.6 + Math.random() * 2;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * spd - dx * 0.05,
          vy: Math.sin(ang) * spd - dy * 0.05,
          life: 1,
          decay: 0.016 + Math.random() * 0.02,
          size: 1.1 + Math.random() * 2.4,
          hue: Math.random(),
        });
      }
      start();
    };

    const onUp = () => {
      pressed = 0;
    };

    const onSelect = () => {
      // text was selected — flash the cursor so the action is acknowledged
      const sel = window.getSelection();
      if (sel && String(sel).length > 0) {
        focusPulse = 1;
        start();
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      pressed = 1;
      for (let i = 0; i < 10 && bubbles.length < 60; i++) {
        bubbles.push({
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 18,
          r: 2 + Math.random() * 6,
          vy: 0.8 + Math.random() * 1.4,
          sway: 10 + Math.random() * 20,
          phase: Math.random() * Math.PI * 2,
          life: 1,
        });
      }
      ripples.push({ x: e.clientX, y: e.clientY, r: 4, life: 1 });
      for (let i = 0; i < 16 && sparks.length < 130; i++) {
        const ang = (i / 16) * Math.PI * 2;
        const spd = 2.4 + Math.random() * 2.6;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1,
          decay: 0.018,
          size: 1.6 + Math.random() * 2,
          hue: Math.random(),
        });
      }
      start();
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("selectionchange", onSelect);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("selectionchange", onSelect);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-50" />
  );
}
