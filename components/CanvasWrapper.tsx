"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import MainScene from "@/scenes/MainScene";
import { useIsMobile } from "@/hooks/useIsMobile";

interface CanvasWrapperProps {
  fragmentIntensity: number;
  scrollProgress: number;
}

export default function CanvasWrapper({
  fragmentIntensity,
  scrollProgress,
}: CanvasWrapperProps) {
  const isMobile = useIsMobile();
  const showOrbitControls = process.env.NODE_ENV === "development";

  return (
    <div className="h-full w-full overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/60 shadow-[0_20px_80px_rgba(15,23,42,0.85)]">
      <Canvas camera={{ position: [0, 0.4, 8], fov: 50 }} dpr={[1, 2]} shadows>
        <color attach="background" args={["#020617"]} />
        <fog attach="fog" args={["#020617", 8, 26]} />

        <Suspense fallback={null}>
          <MainScene
            fragmentIntensity={fragmentIntensity}
            scrollProgress={scrollProgress}
            isMobile={isMobile}
          />

          {showOrbitControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              makeDefault
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3.5}
            />
          )}

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.2}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.7} />
          </EffectComposer>

          <AdaptiveDpr pixelated />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
