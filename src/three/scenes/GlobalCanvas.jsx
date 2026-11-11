import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { sceneState } from '../hooks/useSceneStore';
import { auroraVertexShader, auroraFragmentShader } from '../shaders/AuroraShader';
import InstancedStarfield from './InstancedStarfield';
import HeroNeuralCore from './HeroNeuralCore';

function AuroraBackdrop({ isLite3D, prefersReducedMotion }) {
  const meshRef = useRef(null);
  const matRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uLiteMode: { value: isLite3D ? 1.0 : 0.0 },
    }),
    [isLite3D]
  );

  useFrame((state) => {
    if (!matRef.current) return;
    if (!prefersReducedMotion) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    matRef.current.uniforms.uScroll.value = sceneState.scrollProgress;
    matRef.current.uniforms.uMouse.value.set(sceneState.pointer.x, sceneState.pointer.y);
    matRef.current.uniforms.uLiteMode.value = isLite3D ? 1.0 : 0.0;

    // Keep the aurora backdrop 26 units ahead of the camera so it never clips or goes dark
    if (meshRef.current) {
      meshRef.current.position.z = state.camera.position.z - 26;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -26]} scale={[76, 48, 1]}>
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

function ScrollCameraRig({ prefersReducedMotion, isLite3D }) {
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 0.2, 8.5));
  const desiredLook = useRef(new THREE.Vector3(0, 0, 0));
  const rigLightPurpleRef = useRef(null);
  const rigLightCyanRef = useRef(null);

  useFrame((state, delta) => {
    const cam = state.camera;
    const progress = sceneState.scrollProgress; // 0 to 1
    const px = isLite3D ? 0 : sceneState.pointer.x;
    const py = isLite3D ? 0 : sceneState.pointer.y;
    const vel = Math.min(2.5, Math.max(-2.5, sceneState.scrollVelocity * 0.015));

    // Continuous 3D Z-corridor travel from +8.5 (Home) all the way to -16.2 (Footer)
    const corridorZ = 8.5 - progress * 24.7;
    const wp = sceneState.targetWaypoint;

    const targetX =
      (isLite3D ? 0 : wp.position[0] * 0.42) +
      px * (prefersReducedMotion ? 0.05 : 0.42);
    const targetY =
      (isLite3D ? wp.position[1] * 0.25 : wp.position[1] * 0.42) +
      py * (prefersReducedMotion ? 0.05 : 0.28);
    const targetZ = THREE.MathUtils.lerp(corridorZ, wp.position[2], 0.45);

    desiredPos.current.set(targetX, targetY, targetZ);
    desiredLook.current.set(
      (isLite3D ? 0 : wp.lookAt[0] * 0.35) + px * 0.2,
      wp.lookAt[1] * 0.35 + py * 0.15 - vel * 0.2,
      targetZ - 6.2
    );

    const damp = prefersReducedMotion ? 12 : isLite3D ? 4.2 : 3.4;
    cam.position.lerp(desiredPos.current, Math.min(1, delta * damp));
    lookAtTarget.current.lerp(desiredLook.current, Math.min(1, delta * damp));
    cam.lookAt(lookAtTarget.current);

    // Subtle camera bank/tilt on scroll velocity & mouse
    if (!prefersReducedMotion && !isLite3D) {
      cam.rotation.z = THREE.MathUtils.lerp(
        cam.rotation.z,
        -px * 0.032 + vel * 0.016,
        Math.min(1, delta * 4)
      );
    } else {
      cam.rotation.z = 0;
    }

    // Move corridor rim lights with the camera so Experience, Projects, Education, Contact & Footer stay vividly lit
    if (rigLightPurpleRef.current) {
      rigLightPurpleRef.current.position.set(4.5, 2.5, cam.position.z - 4.5);
    }
    if (rigLightCyanRef.current) {
      rigLightCyanRef.current.position.set(-4.5, -1.8, cam.position.z - 5.5);
    }
  });

  return (
    <>
      <pointLight
        ref={rigLightPurpleRef}
        position={[4.5, 2.5, 4]}
        intensity={isLite3D ? 1.4 : 2.1}
        color="#a855f7"
        distance={22}
      />
      <pointLight
        ref={rigLightCyanRef}
        position={[-4.5, -1.8, 3]}
        intensity={isLite3D ? 1.3 : 1.9}
        color="#22d3ee"
        distance={22}
      />
    </>
  );
}

export default function GlobalCanvas({ capabilities }) {
  const { webglSupported, isMobile, isTouch, isLite3D, prefersReducedMotion, dpr } = capabilities;
  const [degraded, setDegraded] = useState(false);
  const [tabHidden, setTabHidden] = useState(
    typeof document !== 'undefined' ? document.hidden : false
  );

  // Pause rendering when browser tab is hidden (document.hidden)
  useEffect(() => {
    const onVisibilityChange = () => {
      setTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Graceful non-WebGL static gradient fallback
  if (!webglSupported) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.18),transparent_55%),#06060e]"
      />
    );
  }

  const liteMode = Boolean(isLite3D || isMobile || isTouch || degraded);
  const enablePostProcessing = !liteMode && !prefersReducedMotion;
  const starCount = liteMode ? 125 : 420;
  const maxDpr = liteMode ? Math.min(1.25, dpr || 1) : dpr;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <Canvas
        frameloop={tabHidden ? 'never' : prefersReducedMotion ? 'demand' : 'always'}
        dpr={liteMode ? [1, maxDpr] : [1, dpr]}
        camera={{ position: [0, 0.2, 8.5], fov: isMobile ? 50 : 46, near: 0.1, far: 60 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: liteMode ? false : !enablePostProcessing,
          alpha: false,
          stencil: false,
          depth: true,
        }}
      >
        <color attach="background" args={['#06060e']} />
        <fog attach="fog" args={['#06060e', 11, 36]} />

        <PerformanceMonitor
          onDecline={() => setDegraded(true)}
          flipflops={2}
          onFallback={() => setDegraded(true)}
        />

        {/* Neon Rim Lights + Soft Ambient */}
        <ambientLight intensity={liteMode ? 0.85 : 0.72} />
        <directionalLight position={[6, 8, 6]} intensity={1.7} color="#a855f7" />
        <directionalLight position={[-6, -5, 4]} intensity={1.5} color="#22d3ee" />

        {/* Flowing GLSL Aurora Background */}
        <AuroraBackdrop isLite3D={liteMode} prefersReducedMotion={prefersReducedMotion} />

        {/* Instanced Drifting Starfield */}
        <InstancedStarfield count={starCount} prefersReducedMotion={prefersReducedMotion} />

        {/* Hero 3D Neural Core + Signature 3D Objects for Every Section Through Footer */}
        <HeroNeuralCore
          isMobile={isMobile}
          isLite3D={liteMode}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Scroll-Synced 3D Camera Rig + Traveling Corridor Rim Lights */}
        <ScrollCameraRig prefersReducedMotion={prefersReducedMotion} isLite3D={liteMode} />

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
