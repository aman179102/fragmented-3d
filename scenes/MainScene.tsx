"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FragmentedObject from "@/scenes/FragmentedObject";
import Particles from "@/scenes/Particles";
import { easeInOutCubic, lerp } from "@/utils/easing";

interface MainSceneProps {
  fragmentIntensity: number;
  scrollProgress: number;
  isMobile: boolean;
}

export default function MainScene({
  fragmentIntensity,
  scrollProgress,
  isMobile,
}: MainSceneProps) {
  const { camera, scene } = useThree();
  const baseCamPos = useMemo(() => new THREE.Vector3(0, 0.6, 8), []);
  const explodedCamPos = useMemo(() => new THREE.Vector3(0, 1.5, 11), []);
  const bgColorNear = useMemo(() => new THREE.Color("#020617"), []);
  const bgColorFar = useMemo(() => new THREE.Color("#020617"), []);
  const tempColor = useRef(new THREE.Color());

  useEffect(() => {
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 0.4, 0);
  }, [baseCamPos, camera]);

  // Camera + background color update driven by scroll.
  useFrame((_, delta) => {
    const t = easeInOutCubic(fragmentIntensity);
    const targetPos = new THREE.Vector3().lerpVectors(
      baseCamPos,
      explodedCamPos,
      t,
    );

    camera.position.lerp(targetPos, 1 - Math.exp(-delta * 3));
    camera.lookAt(0, lerp(0.4, 0.9, t), 0);
    camera.updateProjectionMatrix();

    // Subtle background tint shift with scroll.
    tempColor.current.copy(bgColorNear).lerp(bgColorFar, scrollProgress);
    scene.background = tempColor.current;
  });

  const keyLightIntensity = lerp(1.1, 1.7, fragmentIntensity);
  const fillLightIntensity = lerp(0.2, 0.5, fragmentIntensity);
  const rimLightIntensity = lerp(0.6, 1.2, fragmentIntensity);

  return (
    <>
      {/* Lighting setup: ambient fill + directional key + rim highlight */}
      <ambientLight intensity={fillLightIntensity} color="#0f172a" />
      <directionalLight
        position={[3, 6, 5]}
        intensity={keyLightIntensity}
        color="#e5f3ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[-4, 3, -4]}
        intensity={rimLightIntensity}
        color="#38bdf8"
        distance={18}
      />

      {/* Ground plane only subtly visible; also used as bounce reference. */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, -1.4, 0]}
        receiveShadow
        castShadow={false}
      >
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      <FragmentedObject
        fragmentIntensity={fragmentIntensity}
        isMobile={isMobile}
      />

      <Particles scrollProgress={scrollProgress} />
    </>
  );
}
