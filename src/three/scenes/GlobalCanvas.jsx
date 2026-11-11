import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { sceneState } from '../hooks/useSceneStore';
import { auroraVertexShader, auroraFragmentShader } from '../shaders/AuroraShader';
import InstancedStarfield from './InstancedStarfield';
import HeroNeuralCore from './HeroNeuralCore';

function AuroraBackdrop({ isMobile, prefersReducedMotion }) {
  const matRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uLiteMode: { value: isMobile ? 1.0 : 0.0 },
    }),
    [isMobile]
  );

  useFrame((state) => {
    if (!matRef.current) return;
    if (!prefersReducedMotion) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    matRef.current.uniforms.uScroll.value = sceneState.scrollProgress;
    matRef.current.uniforms.uMouse.value.set(sceneState.pointer.x, sceneState.pointer.y);
    matRef.current.uniforms.uLiteMode.value = isMobile ? 1.0 : 0.0;
  });

  return (
    <mesh position={[0, 0, -28]} scale={[70, 45, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

function ScrollCameraRig({ prefersReducedMotion }) {
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 0.2, 8.5));
  const desiredLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const cam = state.camera;
    const progress = sceneState.scrollProgress; // 0 to 1
    const px = sceneState.pointer.x;
    const py = sceneState.pointer.y;
    const vel = Math.min(2.5, Math.max(-2.5, sceneState.scrollVelocity * 0.015));

    // Continuous 3D Z-corridor travel blended with active section waypoint
    const corridorZ = 8.5 - progress * 21.5; // +8.5 down to -13.0
    const wp = sceneState.targetWaypoint;

    const targetX = wp.position[0] * 0.45 + px * (prefersReducedMotion ? 0.05 : 0.45);
    const targetY = wp.position[1] * 0.45 + py * (prefersReducedMotion ? 0.05 : 0.32);
    const targetZ = THREE.MathUtils.lerp(corridorZ, wp.position[2], 0.35);

    desiredPos.current.set(targetX, targetY, targetZ);
    desiredLook.current.set(
      wp.lookAt[0] * 0.35 + px * 0.2,
      wp.lookAt[1] * 0.35 + py * 0.15 - vel * 0.25,
      targetZ - 6.5
    );

    const damp = prefersReducedMotion ? 12 : 3.2;
    cam.position.lerp(desiredPos.current, Math.min(1, delta * damp));
    lookAtTarget.current.lerp(desiredLook.current, Math.min(1, delta * damp));
    cam.lookAt(lookAtTarget.current);

    // Subtle camera bank/tilt on scroll velocity & mouse
    if (!prefersReducedMotion) {
      cam.rotation.z = THREE.MathUtils.lerp(
        cam.rotation.z,
        -px * 0.035 + vel * 0.018,
        Math.min(1, delta * 4)
      );
    }
  });

  return null;
}

export default function GlobalCanvas({ capabilities }) {
  const { webglSupported, isMobile, prefersReducedMotion, dpr } = capabilities;
  const [degraded, setDegraded] = useState(false);

  // Graceful non-WebGL static gradient fallback
  if (!webglSupported) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.18),transparent_55%),#06060e]"
      />
    );
  }

  const enablePostProcessing = !isMobile && !prefersReducedMotion && !degraded;
  const starCount = isMobile || degraded ? 140 : 420;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0.2, 8.5], fov: 46, near: 0.1, far: 60 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: !enablePostProcessing,
          alpha: false,
          stencil: false,
          depth: true,
        }}
      >
        <color attach="background" args={['#06060e']} />
        <fog attach="fog" args={['#06060e', 10, 34]} />

        <PerformanceMonitor
          onDecline={() => setDegraded(true)}
          flipflops={2}
          onFallback={() => setDegraded(true)}
        />

        {/* Neon Rim Lights + Soft Ambient */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 8, 6]} intensity={1.8} color="#a855f7" />
        <directionalLight position={[-6, -5, 4]} intensity={1.6} color="#22d3ee" />
        <pointLight position={[0, 3, 5]} intensity={1.4} color="#6366f1" distance={20} />

        {/* Flowing GLSL Aurora Background */}
        <AuroraBackdrop isMobile={isMobile || degraded} prefersReducedMotion={prefersReducedMotion} />

        {/* Instanced Drifting Starfield */}
        <InstancedStarfield count={starCount} prefersReducedMotion={prefersReducedMotion} />

        {/* Hero 3D Neural Core + Z-Corridor Waypoints */}
        <HeroNeuralCore isMobile={isMobile} prefersReducedMotion={prefersReducedMotion} />

        {/* Scroll-Synced 3D Camera Rig */}
        <ScrollCameraRig prefersReducedMotion={prefersReducedMotion} />

        {/* Tasteful Desktop Postprocessing */}
        {enablePostProcessing && (
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom
              intensity={0.65}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
            <ChromaticAberration
              offset={[0.0006, 0.0006]}
              radialModulation={false}
              modulationOffset={0.15}
            />
            <Vignette eskil={false} offset={0.15} darkness={0.75} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

