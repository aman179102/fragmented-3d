# Fragmented Scroll 3D Experience

A scroll-driven 3D fragmentation demo built with:

- **Next.js App Router (TypeScript)**
- **React Three Fiber** and **@react-three/drei**
- **@react-three/postprocessing**
- **Tailwind CSS v4**

The core object is built entirely from Three.js primitives and instanced
meshes. As you scroll, the object fractures into many shards that move with
a lightweight physics-inspired integrator.

---

## Getting Started

Install dependencies (after copying this project or dropping these files into
an existing Next.js TypeScript scaffold):

With **pnpm**:

```bash
pnpm install
```

With **npm**:

```bash
npm install
```

Run the dev server:

```bash
# pnpm
pnpm dev

# npm
npm run dev
```

Open <http://localhost:3000> in your browser.

---

## Build and Production

Create an optimized production build:

```bash
# pnpm
pnpm build

# npm
npm run build
```

Start the production server:

```bash
# pnpm
pnpm start

# npm
npm start
```

You can deploy the app to any Next.js-compatible host (Vercel, Netlify, etc.).

---

## Architecture Overview

**app/**

- `app/layout.tsx`  Root layout, imports global styles and sets dark theme
  metadata for the experience.
- `app/page.tsx`  Main page combining the header, hero content, info
  section and the scroll-interactive 3D canvas.

**components/**

- `Header.tsx`  Sticky top navigation with basic accessibility.
- `HeroSection.tsx`  Hero copy describing the interaction.
- `InfoSection.tsx`  Concept and engineering explanation.
- `CanvasWrapper.tsx`  Configures the React Three Fiber `<Canvas>` and
  postprocessing pipeline, rendering `MainScene`.

**scenes/**

- `MainScene.tsx`  Sets up camera animation, lighting, fog, and the
  ground plane, and wires `FragmentedObject` & `Particles`.
- `FragmentedObject.tsx`  Core fragmentation behavior implemented via an
  instanced mesh and a custom integrator: spring forces, damping, gravity, and
  basic bounce against a ground plane and soft bounds.
- `Particles.tsx`  Lightweight particle field orbiting the scene, subtly
  driven by scroll position.

**hooks/**

- `useScrollProgress.ts`  Normalizes scroll progress to `[0, 1]` and
  derives a smoothed `fragmentIntensity` that drives fragmentation and camera
  motion.
- `useIsMobile.ts`  Reports whether the viewport width is below a
  breakpoint so fragment count can be reduced on small screens.

**utils/**

- `easing.ts`  `lerp`, `clamp01`, and `easeInOutCubic` helpers for smooth
  interpolation.
- `constants.ts`  Fragment caps (`FRAGMENTS_LIMIT`,
  `MOBILE_FRAGMENTS_LIMIT`) for performance.

**Styling**

- `app/globals.css`  Imports Tailwind v4, defines a dark theme using
  `@theme inline`, sets smooth scrolling, gradient background ring, and
  custom scrollbars.
- `tailwind.config.ts`  Registers app, components, scenes, hooks
  directories for Tailwind class scanning.

---

## How It Works

- The object is conceptually subdivided into a 3D grid of potential
  fragments.
- Each fragment receives:
  - `basePosition` (intact position),
  - `direction` (explosion path),
  - `velocity` and `angularVelocity`.
- During each frame, a spring force pulls the fragment toward a target along
  its `direction`, scaled by scroll-derived `fragmentIntensity`.
- Gravity and damping shape the motion; ground and side bounds produce
  simple, inexpensive bounces.
- All fragments are drawn through a single `instancedMesh` for performance.

Scroll from top to bottom to drive fragmentation from "intact" to "fully
exploded", then back up to watch the structure reassemble.
