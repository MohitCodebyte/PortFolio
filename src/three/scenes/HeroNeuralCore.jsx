import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '../hooks/useSceneStore';

// Hero 3D Centerpiece + ONE Signature 3D Element per Section along the Z-Corridor
export default function HeroNeuralCore({
  isMobile = false,
  isLite3D = false,
  prefersReducedMotion = false,
}) {
  const heroGroupRef = useRef(null);
  const outerRingRef = useRef(null);
  const innerRingRef = useRef(null);
  const coreMeshRef = useRef(null);
  const accentsGroupRef = useRef(null);

  // Post-Skills Signature 3D Refs
  const expGroupRef = useRef(null);
  const expTorusKnotRef = useRef(null);
  const projGroupRef = useRef(null);
  const eduGroupRef = useRef(null);
  const contactGroupRef = useRef(null);
  const contactPlaneRef = useRef(null);
  const contactRingRef = useRef(null);
  const footerGroupRef = useRef(null);
  const footerGlobeRef = useRef(null);

  // Desktop: at most 3 small subtle accents; Mobile-lite: at most 2 small accents
  const heroAccents = useMemo(() => {
    const all = [
      { id: 0, basePos: [1.55, 1.15, -0.4], scale: 0.12, speed: 0.6, phase: 0.2, isCyan: true },
      { id: 1, basePos: [-1.45, -0.95, 0.3], scale: 0.1, speed: 0.5, phase: 1.7, isCyan: false },
      { id: 2, basePos: [0.4, 1.45, -0.8], scale: 0.09, speed: 0.7, phase: 3.1, isCyan: true },
    ];
    return isLite3D ? all.slice(0, 2) : all;
  }, [isLite3D]);

  // Minimal neural lines inside the Hero core only
  const neuralLinesGeometry = useMemo(() => {
    const positions = [];
    heroAccents.forEach((node) => {
      positions.push(0, 0, 0, node.basePos[0], node.basePos[1], node.basePos[2]);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, [heroAccents]);

  // 3D Paper Plane Geometry for Contact Section
  const paperPlaneGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    // Classic origami dart paper plane vertices (nose at +Z, wings on ±X, keel at -Y)
    const vertices = new Float32Array([
      // Left wing
      0, 0, 0.65, -0.55, 0.08, -0.45, -0.06, 0.02, -0.35,
      // Right wing
      0, 0, 0.65, 0.06, 0.02, -0.35, 0.55, 0.08, -0.45,
      // Left inner fold
      0, 0, 0.65, -0.06, 0.02, -0.35, 0, -0.18, -0.4,
      // Right inner fold
      0, 0, 0.65, 0, -0.18, -0.4, 0.06, 0.02, -0.35,
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, []);

  useEffect(() => {
    return () => {
      neuralLinesGeometry.dispose();
      paperPlaneGeometry.dispose();
    };
  }, [neuralLinesGeometry, paperPlaneGeometry]);

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    const t = state.clock.getElapsedTime();
    const px = isLite3D ? 0 : sceneState.pointer.x;
    const py = isLite3D ? 0 : sceneState.pointer.y;
    const vel = Math.min(2.5, Math.max(-2.5, sceneState.scrollVelocity * 0.025));

    // 1. HERO CENTERPIECE
    if (heroGroupRef.current) {
      const targetX = isMobile ? 0 : 2.75 + px * 0.28;
      const targetY = isMobile ? 1.42 : 0.1 + py * 0.22;
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
      heroGroupRef.current.rotation.y += delta * (0.22 + Math.abs(vel) * 0.2);
      heroGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        heroGroupRef.current.rotation.x,
        py * 0.25 + vel * 0.06,
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

    // 2. EXPERIENCE SIGNATURE 3D (Glass Torus-Knot + Stacked Cubes in Right Margin)
    if (expGroupRef.current && expTorusKnotRef.current) {
      expTorusKnotRef.current.rotation.x = t * 0.28 + vel * 0.12;
      expTorusKnotRef.current.rotation.y = t * 0.36;
      expGroupRef.current.position.y = 0.25 + Math.sin(t * 0.9) * 0.12;
    }

    // 3. PROJECTS SIGNATURE 3D (Low-Poly Constellation Reacting to Scroll Velocity)
    if (projGroupRef.current) {
      projGroupRef.current.rotation.y += delta * (0.26 + Math.abs(vel) * 0.85);
      projGroupRef.current.rotation.x = Math.sin(t * 0.6) * 0.25 + vel * 0.18;
      projGroupRef.current.position.y = 0.85 + Math.cos(t * 1.1) * 0.14;
    }

    // 4. EDUCATION SIGNATURE 3D (Low-Poly Graduation Cap + Glass Icosahedron in Margin)
    if (eduGroupRef.current) {
      eduGroupRef.current.rotation.y = Math.sin(t * 0.55) * 0.45 + t * 0.15;
      eduGroupRef.current.position.y = 0.45 + Math.sin(t * 1.2) * 0.12;
    }

    // 5. CONTACT SIGNATURE 3D (Glowing Sphere + Orbiting Ring + Mouse-Reactive Paper Plane)
    if (contactGroupRef.current && contactRingRef.current) {
      contactRingRef.current.rotation.z = t * 0.5;
      contactRingRef.current.rotation.x = Math.PI / 2.6 + py * 0.25;
      contactGroupRef.current.position.x = THREE.MathUtils.lerp(
        contactGroupRef.current.position.x,
        (isMobile ? -1.4 : -2.85) + px * 0.25,
        delta * 4
      );
      contactGroupRef.current.position.y = THREE.MathUtils.lerp(
        contactGroupRef.current.position.y,
        (isMobile ? 1.25 : 0.15) + py * 0.22 + Math.sin(t * 1.3) * 0.08,
        delta * 4
      );
    }

    if (contactPlaneRef.current) {
      const elapsedSinceLaunch =
        sceneState.contactPlaneLaunchAt > 0
          ? (performance.now() - sceneState.contactPlaneLaunchAt) / 1000
          : -1;

      if (elapsedSinceLaunch >= 0 && elapsedSinceLaunch < 2.4) {
        // Paper plane fly-off trajectory on form submit
        const p = elapsedSinceLaunch / 2.4;
        const ease = 1 - Math.pow(1 - p, 3);
        contactPlaneRef.current.position.set(
          0.55 + ease * 6.5,
          0.35 + ease * 3.8,
          0.3 - ease * 8.0
        );
        contactPlaneRef.current.rotation.set(-0.35 - ease * 0.2, 0.65, -0.35);
        contactPlaneRef.current.scale.setScalar(Math.max(0.01, (1 - p * 0.85) * 0.65));
      } else {
        // Idle orbit + mouse bank
        contactPlaneRef.current.position.set(
          Math.cos(t * 0.9) * 0.78,
          0.28 + Math.sin(t * 1.8) * 0.12,
          Math.sin(t * 0.9) * 0.78
        );
        contactPlaneRef.current.rotation.set(
          -0.2 + py * 0.25,
          -t * 0.9 + Math.PI / 2 + px * 0.3,
          -0.22 - px * 0.25
        );
        contactPlaneRef.current.scale.setScalar(0.62);
      }
    }

    // 6. FOOTER SIGNATURE 3D (Slowly Rotating Wireframe Planet/Globe + Orbiting Particles)
    if (footerGroupRef.current && footerGlobeRef.current) {
      footerGlobeRef.current.rotation.y = t * 0.22;
      footerGlobeRef.current.rotation.x = 0.22 + Math.sin(t * 0.4) * 0.06;
    }
  });

  const ringTubularSegments = isLite3D ? 36 : 72;
  const ringRadialSegments = isLite3D ? 10 : 16;

  return (
    <>
      {/* 1. HERO CENTERPIECE + ACCENTS */}
      <group
        ref={heroGroupRef}
        position={[isMobile ? 0 : 2.75, isMobile ? 1.42 : 0.1, 3.0]}
        scale={isMobile ? 0.64 : 0.92}
      >
        <mesh ref={coreMeshRef}>
          <icosahedronGeometry args={[0.88, isLite3D ? 0 : 1]} />
          {isLite3D ? (
            <meshStandardMaterial
              color="#1e1b4b"
              emissive="#6d28d9"
              emissiveIntensity={0.55}
              metalness={0.5}
              roughness={0.22}
            />
          ) : (
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
          )}
        </mesh>

        <mesh scale={1.06}>
          <icosahedronGeometry args={[0.9, isLite3D ? 0 : 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.32} />
        </mesh>

        <mesh ref={outerRingRef}>
          <torusGeometry args={[1.38, 0.022, ringRadialSegments, ringTubularSegments]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={1.0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh ref={innerRingRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.68, 0.016, ringRadialSegments, ringTubularSegments]} />
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

        <group ref={accentsGroupRef}>
          {heroAccents.map((node) => (
            <mesh key={node.id} position={node.basePos} scale={node.scale}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
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

      {/* 2. EXPERIENCE MARGIN 3D: Slowly Rotating Glass Torus-Knot + Stacked Cubes (z = -7.2) */}
      <group
        ref={expGroupRef}
        position={[isMobile ? 1.55 : 3.05, 0.25, -7.2]}
        scale={isMobile ? 0.38 : 0.62}
      >
        <mesh ref={expTorusKnotRef}>
          <torusKnotGeometry args={[0.68, 0.16, isLite3D ? 48 : 84, isLite3D ? 8 : 14]} />
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#a855f7"
            emissiveIntensity={0.45}
            metalness={0.75}
            roughness={0.18}
            transparent
            opacity={isMobile ? 0.35 : 0.68}
          />
        </mesh>
        <mesh position={[-0.95, 0.85, -0.3]} rotation={[0.4, 0.6, 0.2]} scale={0.24}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.42} />
        </mesh>
        <mesh position={[0.85, -0.8, 0.2]} rotation={[0.8, 0.2, 0.5]} scale={0.18}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.38} />
        </mesh>
      </group>

      {/* 3. PROJECTS MARGIN 3D: Floating Low-Poly Constellation Reacting to Scroll Velocity (z = -11.0) */}
      <group
        ref={projGroupRef}
        position={[isMobile ? 1.6 : 3.15, 0.85, -11.0]}
        scale={isMobile ? 0.42 : 0.68}
      >
        <mesh>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#22d3ee"
            emissiveIntensity={0.45}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={isMobile ? 0.35 : 0.65}
          />
        </mesh>
        <mesh scale={1.12}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
          <torusGeometry args={[1.15, 0.018, 8, 48]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.45} />
        </mesh>
        <mesh position={[-1.1, 0.65, 0.2]} scale={0.18}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[1.05, -0.6, -0.2]} scale={0.15}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 4. EDUCATION MARGIN 3D: Low-Poly Graduation Cap + Glass Icosahedron (z = -14.6) */}
      <group
        ref={eduGroupRef}
        position={[isMobile ? -1.55 : -3.05, 0.45, -14.6]}
        scale={isMobile ? 0.42 : 0.68}
        rotation={[0.22, 0.35, -0.08]}
      >
        {/* Mortarboard Top Diamond Board */}
        <mesh position={[0, 0.28, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[1.35, 0.06, 1.35]} />
          <meshStandardMaterial
            color="#1e1b4b"
            emissive="#7e22ce"
            emissiveIntensity={0.5}
            metalness={0.65}
            roughness={0.2}
            transparent
            opacity={isMobile ? 0.38 : 0.72}
          />
        </mesh>
        {/* Mortarboard Wireframe Rim */}
        <mesh position={[0, 0.28, 0]} rotation={[0, Math.PI / 4, 0]} scale={1.02}>
          <boxGeometry args={[1.35, 0.06, 1.35]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.42} />
        </mesh>
        {/* Skull Cap Base */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.48, 0.42, 0.38, 6]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#4f46e5"
            emissiveIntensity={0.4}
            metalness={0.5}
            roughness={0.25}
            transparent
            opacity={isMobile ? 0.38 : 0.72}
          />
        </mesh>
        {/* Glowing Cyan Tassel */}
        <mesh position={[0.56, 0.05, 0.56]}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
        {/* Companion Glass Icosahedron */}
        <mesh position={[-0.85, -0.7, 0.25]} scale={0.35}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.45} />
        </mesh>
      </group>

      {/* 5. CONTACT MARGIN 3D: Glowing Sphere + Orbiting Ring + Mouse-Reactive Paper Plane (z = -18.2) */}
      <group
        ref={contactGroupRef}
        position={[isMobile ? -1.4 : -2.85, isMobile ? 1.25 : 0.15, -18.2]}
        scale={isMobile ? 0.48 : 0.76}
      >
        {/* Glowing Core Sphere */}
        <mesh>
          <icosahedronGeometry args={[0.48, 1]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#0891b2"
            emissiveIntensity={0.65}
            metalness={0.6}
            roughness={0.18}
            transparent
            opacity={isMobile ? 0.45 : 0.78}
          />
        </mesh>
        <mesh scale={1.06}>
          <icosahedronGeometry args={[0.48, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.36} />
        </mesh>
        {/* Orbiting Neon Ring */}
        <mesh ref={contactRingRef} rotation={[Math.PI / 2.6, 0, 0]}>
          <torusGeometry args={[0.88, 0.018, 10, 56]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={1.1}
          />
        </mesh>
        {/* 3D Origami Paper Plane */}
        <mesh ref={contactPlaneRef} geometry={paperPlaneGeometry}>
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#22d3ee"
            emissiveIntensity={0.75}
            metalness={0.35}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 6. FOOTER 3D HORIZON: Rotating Wireframe Planet/Globe + Glowing Grid Floor (z = -21.6) */}
      <group
        ref={footerGroupRef}
        position={[0, -0.95, -21.6]}
        scale={isMobile ? 0.65 : 0.9}
      >
        <group ref={footerGlobeRef} position={[0, 0.45, 0]}>
          <mesh>
            <sphereGeometry args={[1.05, isLite3D ? 12 : 18, isLite3D ? 10 : 14]} />
            <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.22} />
          </mesh>
          <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
            <torusGeometry args={[1.45, 0.014, 8, 56]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.38} />
          </mesh>
        </group>
        {/* Subtle Glowing Perspective Grid Floor */}
        <gridHelper
          args={[18, 18, '#a855f7', '#1e1b4b']}
          position={[0, -0.75, 0]}
        />
      </group>
    </>
  );
}
