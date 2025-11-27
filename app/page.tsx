"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import InfoSection from "@/components/InfoSection";
import dynamic from "next/dynamic";

const CanvasWrapper = dynamic(
  () => import("@/components/CanvasWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-950/60">
        <p className="text-sm text-slate-400">Loading 3D Scene...</p>
      </div>
    ),
  },
);
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function HomePage() {
  const { scrollProgress, fragmentIntensity } = useScrollProgress();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 pt-10 md:px-6 lg:flex-row lg:gap-16 lg:pt-16">
        <section className="flex w-full flex-col gap-10 lg:w-1/2">
          <HeroSection />
          <InfoSection />
        </section>

        <section
          className="sticky top-24 z-10 h-[55vh] w-full rounded-3xl lg:h-[80vh] lg:w-1/2"
          aria-label="Scroll reactive 3D visualization"
        >
          <CanvasWrapper
            fragmentIntensity={fragmentIntensity}
            scrollProgress={scrollProgress}
          />
        </section>
      </div>

      <section className="border-t border-slate-800 bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 md:px-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-400">
              The Experience
            </h2>
            <p className="text-2xl font-semibold text-slate-50">
              Fragmentation intensity is mapped to your scroll position.
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              At the top of the page, the 3D shape is tight and intact. As you scroll,
              we progressively drive a lightweight physics-inspired integrator that
              pushes fragments away from their origin, introduces gravity, and bounces
              against an invisible ground plane.
            </p>
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-400">
              Under the hood
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <span className="font-semibold text-sky-400">React Three Fiber</span>{" "}
                orchestrates the scene.
              </li>
              <li>
                <span className="font-semibold text-sky-400">Instanced fragments</span>{" "}
                keep performance under control.
              </li>
              <li>
                <span className="font-semibold text-sky-400">Custom scroll hook</span>{" "}
                normalizes progress across the full document height.
              </li>
              <li>
                <span className="font-semibold text-sky-400">Mobile fallback</span>{" "}
                automatically reduces fragment count on smaller screens.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row md:px-6">
          <p>Built with Next.js, React Three Fiber, and Tailwind CSS.</p>
          <p className="text-[11px]">
            Scroll to the extremes to explore the full fragmentation range.
          </p>
        </div>
      </footer>
    </main>
  );
}
