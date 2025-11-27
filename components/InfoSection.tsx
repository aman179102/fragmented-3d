"use client";

export default function InfoSection() {
  return (
    <section
      id="concept"
      aria-label="Concept and capabilities"
      className="space-y-5 text-sm text-slate-300"
    >
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Concept
        </h2>
        <p className="max-w-xl">
          The core object is synthesized entirely from primitive geometry. It is
          conceptually subdivided into a uniform grid; each cell becomes a fragment
          with its own position, velocity and angular velocity.
        </p>
      </div>

      <div className="space-y-2" id="engineering">
        <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Engineering Notes
        </h3>
        <ul className="space-y-2">
          <li>
            <span className="font-semibold text-sky-400">Scroll mapping:</span>{" "}
            a custom hook tracks normalized scroll progress, driving fragmentation
            intensity and camera motion.
          </li>
          <li>
            <span className="font-semibold text-sky-400">Motion model:</span>{" "}
            per-fragment integration relies on a spring force toward an explosion
            target, with damping, gravity and simple bounds-based bounce.
          </li>
          <li>
            <span className="font-semibold text-sky-400">Performance strategy:</span>{" "}
            fragments are rendered via instancing with a global fragment cap and a
            tighter cap on smaller screens.
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Try it
        </h3>
        <p className="max-w-xl">
          Scroll slowly from top to bottom to feel how fragments accelerate, then
          stabilize into a drifting cloud. Snap back to the top to see the system
          reassemble into a coherent core.
        </p>
      </div>
    </section>
  );
}
