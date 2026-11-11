import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '../hooks/useSceneStore';

export default function InstancedStarfield({ count = 420, prefersReducedMotion = false }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate deterministic particle data along the entire 3D Z-corridor (+10 to -26)
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const seed = (i * 9301 + 49297) % 233280;
      const r1 = seed / 233280;
      const r2 = ((i * 4211 + 17231) % 233280) / 233280;
      const r3 = ((i * 7919 + 82311) % 233280) / 233280;

      const x = (r1 - 0.5) * 28;
      const y = (r2 - 0.5) * 18;
      const z = 8 - r3 * 42; // spans from +8 to -34 (all the way past Footer)
      const scale = 0.018 + (i % 7) * 0.008;
      const speed = 0.15 + (i % 5) * 0.08;
      const phase = i * 0.37;

      temp.push({ x, y, z, scale, speed, phase });
    }
    return temp;
  }, [count]);

  const colors = useMemo(() => {
    const colorArray = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#a855f7'),
      new THREE.Color('#22d3ee'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#e879f9'),
      new THREE.Color('#f4f4f5'),
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[i % palette.length];
      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }
    return colorArray;
  }, [count]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;

    return () => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    };
  }, [particles, dummy]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || prefersReducedMotion) return;

    const t = state.clock.getElapsedTime();
    const px = sceneState.pointer.x;
    const py = sceneState.pointer.y;
    const vel = Math.min(2.5, Math.max(-2.5, sceneState.scrollVelocity * 0.04));

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const driftX = p.x + Math.sin(t * p.speed + p.phase) * 0.25 + px * 0.45;
      const driftY = p.y + Math.cos(t * p.speed + p.phase) * 0.25 + py * 0.35;
      const driftZ = p.z + vel * 0.4;

      dummy.position.set(driftX, driftY, driftZ);
      const pulse = p.scale * (0.85 + 0.3 * Math.sin(t * 1.5 + p.phase));
      dummy.scale.set(pulse, pulse, pulse * (1 + Math.abs(vel) * 1.6));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </octahedronGeometry>
      <meshBasicMaterial vertexColors transparent opacity={0.78} />
    </instancedMesh>
  );
}

