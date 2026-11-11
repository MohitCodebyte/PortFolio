import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '../hooks/useSceneStore';

// Clean, focused Hero 3D Centerpiece on the right + sparse, low-opacity margin accents
export default function HeroNeuralCore({ isMobile = false, prefersReducedMotion = false }) {
  const heroGroupRef = useRef(null);
  const outerRingRef = useRef(null);
  const innerRingRef = useRef(null);
  const coreMeshRef = useRef(null);
  const accentsGroupRef = useRef(null);
  const marginNodesRef = useRef(null);

  // At most 3 small subtle accents orbiting on the far right (away from text)
  const heroAccents = useMemo(
    () => [
      { id: 0, basePos: [1.55, 1.15, -0.4], scale: 0.12, speed: 0.6, phase: 0.2, isCyan: true },
      { id: 1, basePos: [1.75, -1.05, 0.3], scale: 0.1, speed: 0.5, phase: 1.7, isCyan: false },
      { id: 2, basePos: [0.4, 1.45, -0.8], scale: 0.09, speed: 0.7, phase: 3.1, isCyan: true },
    ],
    []
  );

  // Minimal neural lines inside the right-side core only
  const neuralLinesGeometry = useMemo(() => {
    const positions = [];
    heroAccents.forEach((node) => {
      positions.push(0, 0, 0, node.basePos[0], node.basePos[1], node.basePos[2]);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, [heroAccents]);

  useEffect(() => {
    return () => {
      neuralLinesGeometry.dispose();
    };
  }, [neuralLinesGeometry]);

  // Sparse, low-opacity margin accents placed in outer margins (far X) so they never overlap text or cards
  const marginWaypoints = useMemo(
    () => [
      { id: 'about-margin', pos: [5.4, 1.6, -2.8], color: '#a855f7', scale: 0.45 },
      { id: 'skills-margin', pos: [-5.6, -1.4, -6.8], color: '#22d3ee', scale: 0.48 },
      { id: 'exp-margin', pos: [5.5, 1.5, -10.8], color: '#6366f1', scale: 0.42 },
      { id: 'projects-margin', pos: [-5.8, 1.8, -14.8], color: '#a855f7', scale: 0.5 },
      { id: 'edu-margin', pos: [5.4, -1.5, -17.8], color: '#22d3ee', scale: 0.42 },
      { id: 'contact-margin', pos: [5.6, 1.4, -21.2], color: '#a855f7', scale: 0.45 },
    ],
    []
  );

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    const t = state.clock.getElapsedTime();
    const px = sceneState.pointer.x;
    const py = sceneState.pointer.y;
    const vel = Math.min(2.5, Math.max(-2.5, sceneState.scrollVelocity * 0.025));

    if (heroGroupRef.current) {
      // Positioned cleanly on the right side (x = 2.75 on desktop; pushed high/right on mobile so text is never overlapped)
      const targetX = isMobile ? 1.85 : 2.75 + px * 0.28;
      const targetY = isMobile ? 1.75 : 0.1 + py * 0.22;
      heroGroupRef.current.position.x = THREE.MathUtils.lerp(
        heroGroupRef.current.position.x,
        targetX,
        delta * 3.5
      );
      heroGroupRef.current.position.y = THREE.MathUtils.lerp(
        heroGroupRef.current.position.y,
        targetY,
        delta * 3.5
      );

      heroGroupRef.current.rotation.y += delta * (0.22 + Math.abs(vel) * 0.25);
      heroGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        heroGroupRef.current.rotation.x,
        py * 0.25 + vel * 0.08,
        delta * 4
      );
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = t * 0.32;
      outerRingRef.current.rotation.y = t * 0.2;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -t * 0.42;
      innerRingRef.current.rotation.x = Math.sin(t * 0.5) * 0.4;
    }

    if (coreMeshRef.current) {
      const pulse = 1 + Math.sin(t * 1.8) * 0.04;
      coreMeshRef.current.scale.setScalar(pulse);
      coreMeshRef.current.rotation.y = -t * 0.35;
    }

    if (accentsGroupRef.current) {
      accentsGroupRef.current.children.forEach((child, i) => {
        const node = heroAccents[i];
        if (!node) return;
        child.position.y = node.basePos[1] + Math.sin(t * node.speed + node.phase) * 0.14;
        child.rotation.x = t * node.speed;
        child.rotation.y = t * (node.speed * 0.8);
      });
    }

    if (marginNodesRef.current) {
      marginNodesRef.current.children.forEach((group, idx) => {
        group.rotation.y = t * (0.18 + idx * 0.03);
        group.rotation.x = Math.sin(t * 0.3 + idx) * 0.2;
      });
    }
  });

  return (
    <>
      {/* ONE MAIN HERO CENTERPIECE ON THE RIGHT SIDE + 3 SMALL SUBTLE ACCENTS */}
      <group
        ref={heroGroupRef}
        position={[isMobile ? 1.85 : 2.75, isMobile ? 1.75 : 0.1, 3.0]}
        scale={isMobile ? 0.58 : 0.92}
      >
        <mesh ref={coreMeshRef}>
          <icosahedronGeometry args={[0.88, 1]} />
          <meshPhysicalMaterial
            color="#1e1b4b"
            emissive="#6d28d9"
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.14}
            clearcoat={1}
            clearcoatRoughness={0.1}
            iridescence={0.7}
            iridescenceIOR={1.4}
          />
        </mesh>

        <mesh scale={1.06}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.32} />
        </mesh>

        <mesh ref={outerRingRef}>
          <torusGeometry args={[1.38, 0.022, 16, 72]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={1.0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh ref={innerRingRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.68, 0.016, 16, 72]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1.0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <lineSegments geometry={neuralLinesGeometry}>
          <lineBasicMaterial color="#818cf8" transparent opacity={0.18} />
        </lineSegments>

        {/* 3 Small Subtle Accents */}
        <group ref={accentsGroupRef}>
          {heroAccents.map((node) => (
            <mesh key={node.id} position={node.basePos} scale={node.scale}>
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial
                color={node.isCyan ? '#22d3ee' : '#a855f7'}
                emissive={node.isCyan ? '#0891b2' : '#7e22ce'}
                emissiveIntensity={0.7}
                metalness={0.6}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* SPARSE, LOW-OPACITY OUTER MARGIN ACCENTS (1 PER SECTION, NEVER BEHIND TEXT OR CARDS) */}
      {!isMobile && (
        <group ref={marginNodesRef}>
          {marginWaypoints.map((wp) => (
            <group key={wp.id} position={wp.pos} scale={wp.scale}>
              <mesh>
                <octahedronGeometry args={[0.65, 0]} />
                <meshBasicMaterial color={wp.color} wireframe transparent opacity={0.13} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </>
  );
}
