import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  SiPython,
  SiScikitlearn,
  SiPandas,
  SiFastapi,
  SiFlask,
  SiPytorch,
  SiTensorflow,
  SiMysql,
  SiDjango,
  SiSqlalchemy,
  SiDocker,
} from 'react-icons/si';
import { FiCpu, FiDatabase, FiBarChart2, FiLayers, FiServer } from 'react-icons/fi';
import { orbitSkills } from '../data/skills';
import { triggerClickBurst } from '../three/hooks/useSceneStore';

const ICON_MAP = {
  Python: SiPython,
  'Scikit-learn': SiScikitlearn,
  Pandas: SiPandas,
  FastAPI: SiFastapi,
  Flask: SiFlask,
  XGBoost: FiCpu,
  PyTorch: SiPytorch,
  TensorFlow: SiTensorflow,
  'SQL & MySQL': SiMysql,
  Transformers: FiLayers,
  Django: SiDjango,
  SQLAlchemy: SiSqlalchemy,
  LightGBM: FiBarChart2,
  'Power BI': FiBarChart2,
  'REST APIs': FiServer,
  'Docker / Cloud': SiDocker,
};

export default function SkillOrbit({
  onSelectSkill,
  selectedSkillName,
  prefersReducedMotion = false,
}) {
  const containerRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [projectedNodes, setProjectedNodes] = useState([]);
  const rotationRef = useRef({ rx: 0.25, ry: 0.4, vx: 0.0025, vy: 0.0055 });
  const isPausedRef = useRef(false);

  // Distribute skills evenly on a 3D Fibonacci sphere
  const basePoints = useMemo(() => {
    const n = orbitSkills.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return orbitSkills.map((skill, i) => {
      const y = 1 - (i / (n - 1)) * 2; // 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      return { ...skill, x, y, z, id: i };
    });
  }, []);

  useEffect(() => {
    let rafId;

    const project = () => {
      if (!prefersReducedMotion && !isPausedRef.current) {
        rotationRef.current.rx += rotationRef.current.vx;
        rotationRef.current.ry += rotationRef.current.vy;
      }

      const { rx, ry } = rotationRef.current;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      const next = basePoints.map((pt) => {
        // Rotate around Y
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.z * cosY + pt.x * sinY;
        // Rotate around X
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + pt.y * sinX;

        const depthScale = (z2 + 2.1) / 3.1; // ~0.35 to 1.0
        const opacity = Math.min(1, Math.max(0.28, (z2 + 1.4) / 2.2));

        return {
          ...pt,
          px: x1,
          py: y2,
          pz: z2,
          scale: Math.max(0.62, Math.min(1.18, depthScale * 1.15)),
          opacity,
          zIndex: Math.round((z2 + 2) * 10),
        };
      });

      setProjectedNodes(next);
      rafId = requestAnimationFrame(project);
    };

    rafId = requestAnimationFrame(project);
    return () => cancelAnimationFrame(rafId);
  }, [basePoints, prefersReducedMotion]);

  const handlePointerMove = (e) => {
    if (!containerRef.current || prefersReducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rotationRef.current.vy = nx * 0.024;
    rotationRef.current.vx = -ny * 0.024;
  };

  const activeDetail =
    hoveredSkill ||
    orbitSkills.find((s) => s.name === selectedSkillName) ||
    orbitSkills[0];

  return (
    <div className="relative flex flex-col items-center">
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onMouseEnter={() => {
          isPausedRef.current = false;
        }}
        onMouseLeave={() => {
          rotationRef.current.vx = 0.0025;
          rotationRef.current.vy = 0.0055;
          setHoveredSkill(null);
        }}
        className="relative w-full max-w-[440px] aspect-square flex items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.16)_0%,rgba(34,211,238,0.06)_48%,transparent_72%)] border border-white/10 overflow-hidden select-none"
        role="region"
        aria-label="Interactive 3D Skill Orbit Cloud"
      >
        {/* Decorative Orbital Rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-[76%] h-[76%] rounded-full border border-dashed border-purple-400/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-[52%] h-[52%] rounded-full border border-cyan-400/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/25 to-cyan-400/25 blur-xl"
        />

        {/* 3D Orbiting Skill Nodes */}
        {projectedNodes.map((node) => {
          const IconComponent = ICON_MAP[node.name] || FiDatabase;
          const isHovered = hoveredSkill?.name === node.name;
          const isSelected = selectedSkillName === node.name;
          const radiusPx = 138; // Orbit radius in pixels

          return (
            <button
              key={node.name}
              type="button"
              onMouseEnter={() => {
                isPausedRef.current = true;
                setHoveredSkill(node);
              }}
              onMouseLeave={() => {
                isPausedRef.current = false;
                setHoveredSkill(null);
              }}
              onFocus={() => {
                isPausedRef.current = true;
                setHoveredSkill(node);
              }}
              onBlur={() => {
                isPausedRef.current = false;
                setHoveredSkill(null);
              }}
              onClick={(e) => {
                if (e.clientX && e.clientY) {
                  triggerClickBurst(e.clientX, e.clientY, node.color);
                }
                if (onSelectSkill) onSelectSkill(node);
              }}
              aria-label={`${node.name} — ${node.category} (${node.tier} proficiency)`}
              style={{
                transform: `translate3d(${(node.px * radiusPx).toFixed(1)}px, ${(
                  node.py * radiusPx
                ).toFixed(1)}px, 0) scale(${
                  isHovered || isSelected ? 1.28 : node.scale.toFixed(2)
                })`,
                opacity: isHovered || isSelected ? 1 : node.opacity,
                zIndex: isHovered || isSelected ? 40 : node.zIndex,
              }}
              className={`group absolute inline-flex items-center gap-2 px-3 py-2 rounded-2xl border backdrop-blur-md transition-shadow duration-200 ${
                isHovered || isSelected
                  ? 'bg-zinc-900/95 border-cyan-400/70 shadow-[0_0_25px_rgba(34,211,238,0.5)] text-white'
                  : 'bg-[#0b0d1e]/85 border-white/15 text-zinc-200 hover:border-purple-400/50'
              }`}
            >
              <IconComponent
                style={{ color: node.color }}
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                  isHovered ? 'rotate-12 scale-110' : ''
                }`}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold whitespace-nowrap">
                {node.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Telemetry Tooltip Bar Underneath the 3D Sphere */}
      <div className="mt-4 w-full max-w-[440px] px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            style={{ backgroundColor: activeDetail.color }}
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_10px_currentColor]"
            aria-hidden="true"
          />
          <div className="truncate">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">
              {activeDetail.name}
            </p>
            <p className="text-[11px] text-zinc-400 truncate">
              Domain: {activeDetail.category}
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${
            activeDetail.tier === 'Core'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
              : 'bg-sky-500/15 text-sky-300 border-sky-400/30'
          }`}
        >
          {activeDetail.tier} Stack
        </span>
      </div>
    </div>
  );
}

