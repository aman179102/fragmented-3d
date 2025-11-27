"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FRAGMENTS_LIMIT, MOBILE_FRAGMENTS_LIMIT } from "@/utils/constants";
import { easeInOutCubic, lerp } from "@/utils/easing";

/**
 * Each fragment stores its own position, velocity and angular velocity.
 * A spring force pulls it toward a target position along an explosion
 * direction; gravity, damping and simple bounds produce a physics-like
 * motion without a full physics engine.
 */
interface FragmentState {
  basePosition: THREE.Vector3;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  direction: THREE.Vector3;
  rotation: THREE.Euler;
  angularVelocity: THREE.Vector3;
}

interface FragmentedObjectProps {
  fragmentIntensity: number;
  isMobile: boolean;
}

const GROUND_Y = -1.4;
const BOUNDS = 4.2;

export default function FragmentedObject({
  fragmentIntensity,
  isMobile,
}: FragmentedObjectProps) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const fragmentsRef = useRef<FragmentState[]>([]);
  const dummyObject = useMemo(() => new THREE.Object3D(), []);
  const count = isMobile ? MOBILE_FRAGMENTS_LIMIT : FRAGMENTS_LIMIT;

  // Pre-generate fragment grid and random directions.
  useEffect(() => {
    const fragments: FragmentState[] = [];

    const gridSize = Math.cbrt(count);
    const grid = Math.round(gridSize);
    const spacing = 0.35;
    const offset = ((grid - 1) * spacing) / 2;

    let i = 0;
    for (let x = 0; x < grid; x++) {
      for (let y = 0; y < grid; y++) {
        for (let z = 0; z < grid; z++) {
          if (i >= count) break;

          // Base positions approximate a solid volume that will resemble an icosahedron when intact.
          const basePosition = new THREE.Vector3(
            x * spacing - offset,
            y * spacing - offset + 0.3,
            z * spacing - offset,
          );

          const length = basePosition.length();
          // Push fragments toward a spherical core to hint at an icosahedral volume.
          if (length > 1.8) continue;

          const direction = basePosition
            .clone()
            .normalize()
            .add(
              new THREE.Vector3(
                (Math.random() - 0.5) * 0.8,
                Math.random() * 0.6,
                (Math.random() - 0.5) * 0.8,
              ),
            )
            .normalize();

          const rotation = new THREE.Euler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
          );

          const angularVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
          );

          fragments.push({
            basePosition,
            position: basePosition.clone(),
            velocity: new THREE.Vector3(),
            direction,
            rotation,
            angularVelocity,
          });

          i++;
          if (i >= count) break;
        }
      }
    }

    fragmentsRef.current = fragments;

    if (meshRef.current) {
      for (let index = 0; index < fragments.length; index++) {
        const frag = fragments[index];
        dummyObject.position.copy(frag.position);
        dummyObject.rotation.copy(frag.rotation);
        dummyObject.scale.setScalar(0.22);
        dummyObject.updateMatrix();
        meshRef.current.setMatrixAt(index, dummyObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, dummyObject]);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const fragments = fragmentsRef.current;
    if (!mesh || fragments.length === 0) return;

    const t = easeInOutCubic(fragmentIntensity);
    const explodeStrength = lerp(0, 8, t);
    const gravityStrength = lerp(0.1, 0.6, t);
    const springStrength = lerp(40, 80, t);
    const damping = 0.86;

    for (let i = 0; i < fragments.length; i++) {
      const frag = fragments[i];

      // Target position along its direction vector, offset from base position.
      const targetOffset = frag.direction.clone().multiplyScalar(explodeStrength);
      const targetPosition = frag.basePosition.clone().add(targetOffset);

      // Spring force toward target.
      const toTarget = targetPosition.sub(frag.position);
      frag.velocity.addScaledVector(toTarget, springStrength * delta);

      // Gravity only becomes significant as we scroll down.
      frag.velocity.y -= gravityStrength * delta * 9.81 * 0.25;

      // Exponential damping keeps the system stable and prevents runaway energy.
      frag.velocity.multiplyScalar(Math.pow(damping, delta * 60));

      // Integrate position.
      frag.position.addScaledVector(frag.velocity, delta);

      // Simple ground collision with inelastic bounce.
      if (frag.position.y < GROUND_Y) {
        frag.position.y = GROUND_Y;
        if (frag.velocity.y < 0) {
          frag.velocity.y *= -0.45;
          frag.velocity.x *= 0.9;
          frag.velocity.z *= 0.9;
        }
      }

      // Soft bounds in X/Z that reflect fragments back toward center.
      if (Math.abs(frag.position.x) > BOUNDS) {
        frag.position.x = THREE.MathUtils.clamp(
          frag.position.x,
          -BOUNDS,
          BOUNDS,
        );
        frag.velocity.x *= -0.55;
      }

      if (Math.abs(frag.position.z) > BOUNDS) {
        frag.position.z = THREE.MathUtils.clamp(
          frag.position.z,
          -BOUNDS,
          BOUNDS,
        );
        frag.velocity.z *= -0.55;
      }

      // Angular motion, scaled with intensity.
      const spinScale = lerp(0.3, 1.4, t);
      frag.rotation.x += frag.angularVelocity.x * delta * spinScale;
      frag.rotation.y += frag.angularVelocity.y * delta * spinScale;
      frag.rotation.z += frag.angularVelocity.z * delta * spinScale;

      // Update instance matrix.
      dummyObject.position.copy(frag.position);
      dummyObject.rotation.copy(frag.rotation);

      const baseScale = 0.22;
      const scalePulse = 1 + 0.25 * Math.sin(performance.now() * 0.001 + i);
      const scale = baseScale * lerp(1, scalePulse, t * 0.25);
      dummyObject.scale.setScalar(scale);

      dummyObject.updateMatrix();
      mesh.setMatrixAt(i, dummyObject.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Intact core mesh that subtly fades as fragmentation grows */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshStandardMaterial
          color="#38bdf8"
          metalness={0.75}
          roughness={0.1}
          transparent
          opacity={lerp(0.9, 0.05, fragmentIntensity)}
          emissive="#0ea5e9"
          emissiveIntensity={lerp(0.7, 0.15, fragmentIntensity)}
        />
      </mesh>

      <instancedMesh
        ref={meshRef}
        args={[undefined as any, undefined as any, count]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial
          color="#e0f2fe"
          metalness={0.8}
          roughness={0.2}
          emissive="#0ea5e9"
          emissiveIntensity={0.65}
        />
      </instancedMesh>
    </group>
  );
}
