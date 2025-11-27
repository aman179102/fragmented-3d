"use client";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="space-y-6 pt-2 md:pt-4 lg:pt-0"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
        Scroll-Driven 3D Fragmentation
      </p>
      <h1
        id="hero-title"
        className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl"
      >
        Deconstructing geometry with
        <span className="bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
          {" "}
          pure scroll.
        </span>
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-slate-400">
        This demo turns your scroll position into energy. A dense 3D form gradually
        fractures into hundreds of shards, each driven by a lightweight
        physics-inspired integrator  no heavy physics engine, no external model
        files.
      </p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
        <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Real-time R3F scene
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1">
          Scroll-normalized integrator
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1">
          Tailwind-powered layout
        </span>
      </div>
    </section>
  );
}
