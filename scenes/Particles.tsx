"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lerp } from "@/utils/easing";

interface ParticlesProps {
  scrollProgress: number;
}

export default function Particles({ scrollProgress }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points | null>(null);

  const positions = useMemo(() => {
    const count = 900;
    const pos = new Float32Array(count * 3);
    const radius = 12;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Slightly biased distribution around the core.
      const r = radius * (0.3 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.cos(phi) * 0.6;
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    return pos;
  }, []);

  useFrame((_state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const scrollFactor = lerp(0.4, 1.8, scrollProgress);

    points.rotation.y += delta * 0.06 * scrollFactor;
    points.rotation.x = lerp(0.15, 0.5, scrollProgress);
  });

  const opacity = lerp(0.25, 0.6, scrollProgress);
  const size = lerp(0.02, 0.045, scrollProgress);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#38bdf8"
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}
