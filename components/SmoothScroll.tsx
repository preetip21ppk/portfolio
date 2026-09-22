"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Smooth scrolling (Lenis) driven from GSAP's ticker, plus the scroll-driven
 * effects that depend on it.
 *
 * Lenis and ScrollTrigger must share a clock — otherwise ScrollTrigger reads
 * positions from the native scroll while Lenis animates its own, and pinned or
 * scrubbed elements drift a frame behind. Wiring Lenis into `gsap.ticker` and
 * calling `ScrollTrigger.update` on every Lenis frame keeps them in lockstep.
 *
 * Effects registered here:
 *   · parallax on anything marked [data-parallax]
 *   · a scrubbed progress bar for the page
 *   · section headings that lift slightly as they scroll through
 *
 * The whole module no-ops under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Parallax layers
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0.2;
        gsap.to(el, {
          yPercent: -depth * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Headings drift up a touch as their section passes
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 22 },
          {
            y: -22,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
