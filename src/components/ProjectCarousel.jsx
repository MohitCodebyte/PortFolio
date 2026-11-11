import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBarChart2,
  FiCode,
  FiExternalLink,
  FiGithub,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiLayers,
  FiLock,
} from 'react-icons/fi';
import GlassCard from './GlassCard';
import Badge from './Badge';
import Tooltip from './Tooltip';
import Button3D from './Button3D';
import { triggerClickBurst } from '../three/hooks/useSceneStore';

export function ProjectCardItem({ project, isFeatured = false }) {
  const [imgStatus, setImgStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [imgParallax, setImgParallax] = useState({ x: 0, y: 0 });
  const isDataScience = project.category === 'data-science';
  const CategoryIcon = isDataScience ? FiBarChart2 : FiCode;

  const visibleTech = project.tech.slice(0, 4);
  const extraTechCount = Math.max(0, project.tech.length - 4);

  const handleCardPointerMove = (e) => {
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setImgParallax({ x: -nx * 10, y: -ny * 10 });
  };

  const handleCardPointerLeave = () => {
    setImgParallax({ x: 0, y: 0 });
  };

  return (
    <GlassCard
      glow={isDataScience ? 'purple' : 'cyan'}
      maxTilt={6}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={handleCardPointerLeave}
      className="h-full w-full flex flex-col"
      innerClassName="p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-5 preserve-3d"
    >
      <div className="preserve-3d">
        {/* 16:9 Self-Hosted WebP Image Frame with Parallax Depth & Neon Overlay */}
        <div
          style={{ transform: 'translateZ(14px)' }}
          className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#070814] border border-white/12 mb-4 sm:mb-5 group shadow-[0_12px_30px_-10px_rgba(0,0,0,0.75)]"
        >
          {/* Skeleton Shimmer while loading */}
          {imgStatus === 'loading' && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-zinc-900 overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
          )}

          {/* Self-hosted 800x450 WebP Image with Parallax Shift */}
          {imgStatus !== 'error' && (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              width="800"
              height="450"
              onLoad={() => setImgStatus('loaded')}
              onError={() => setImgStatus('error')}
              style={{
                transform: `translate3d(${imgParallax.x.toFixed(1)}px, ${imgParallax.y.toFixed(
                  1
                )}px, 0) scale(1.06)`,
              }}
              className={`w-full h-full object-cover object-center transition-transform duration-300 ease-out sm:group-hover:scale-110 ${
                imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Subtle Dark Purple/Blue Neon Theme Gradient Overlay */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${
              isDataScience
                ? 'bg-gradient-to-t from-[#070814]/85 via-purple-950/25 to-indigo-950/20'
                : 'bg-gradient-to-t from-[#070814]/85 via-cyan-950/25 to-indigo-950/20'
            }`}
          />

          {/* Gradient + Icon Fallback if File is Missing */}
          {imgStatus === 'error' && (
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${
                isDataScience
                  ? 'bg-gradient-to-br from-purple-950/90 via-indigo-950/80 to-slate-950'
                  : 'bg-gradient-to-br from-cyan-950/90 via-slate-900 to-indigo-950/80'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-2 ${
                  isDataScience
                    ? 'bg-purple-500/20 border-purple-400/40 text-purple-300'
                    : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                }`}
              >
                <CategoryIcon className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="font-display text-sm font-bold text-white">
                {project.title}
              </p>
            </div>
          )}

          {/* Top-Left Category Badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <Badge
              variant={isDataScience ? 'purple' : 'cyan'}
              icon={CategoryIcon}
              className="backdrop-blur-md bg-zinc-950/75"
            >
              {project.categoryLabel}
            </Badge>
          </div>
        </div>

        {/* Title & 2-Line Description (Depth Layer) */}
        <div style={{ transform: 'translateZ(18px)' }}>
          <h3
            className={`font-display font-bold text-white tracking-tight leading-snug ${
              isFeatured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            }`}
          >
            {project.title}
          </h3>
          <p className="mt-2 fluid-body text-zinc-300 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Tech Chips (wrap, max 4 shown + "+N") */}
        <div
          style={{ transform: 'translateZ(12px)' }}
          className="mt-3.5 flex flex-wrap gap-1.5"
          aria-label="Technologies used"
        >
          {visibleTech.map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
          {extraTechCount > 0 && (
            <Badge
              variant={isDataScience ? 'purple' : 'cyan'}
              title={project.tech.slice(4).join(', ')}
            >
              +{extraTechCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Footer CTAs: Two Buttons Side by Side (Live Demo / GitHub), 48px high */}
      <div
        style={{ transform: 'translateZ(20px)' }}
        className="pt-3.5 border-t border-white/10"
      >
        <div className="grid grid-cols-2 gap-2.5 items-stretch">
          <Button3D
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant={isDataScience ? 'purple' : 'cyan'}
            icon={FiExternalLink}
            className="w-full min-h-[48px] h-12 px-3 text-xs sm:text-sm"
          >
            Live Demo
          </Button3D>

          {project.repoUrl ? (
            <Button3D
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="glass"
              icon={FiGithub}
              className="w-full min-h-[48px] h-12 px-3 text-xs sm:text-sm"
            >
              GitHub
            </Button3D>
          ) : (
            <Tooltip content="Source repository is private or unavailable for public access">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full min-h-[48px] h-12 inline-flex items-center justify-center gap-1.5 px-2.5 rounded-full text-xs font-medium bg-white/[0.03] text-zinc-400 border border-white/10 opacity-65 cursor-not-allowed"
              >
                <FiLock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Private Repo</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default function ProjectCarousel({ items, categoryKey }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // Default = 'grid'

  useEffect(() => {
    setActiveIndex(0);
  }, [categoryKey, items.length]);

  const total = items.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  if (total === 0) return null;

  return (
    <div
      role="region"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Projects Showcase"
      className="focus:outline-none perspective-1000"
    >
      {/* Clean Grid / Carousel Toggle (Desktop only — hidden on mobile) */}
      <div className="hidden md:flex items-center justify-end mb-5">
        <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10">
          <button
            type="button"
            onClick={(e) => {
              triggerClickBurst(e.clientX, e.clientY, '#a855f7');
              setViewMode('grid');
            }}
            aria-pressed={viewMode === 'grid'}
            className={`inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <FiGrid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>3D Grid</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              triggerClickBurst(e.clientX, e.clientY, '#22d3ee');
              setViewMode('carousel');
            }}
            aria-pressed={viewMode === 'carousel'}
            className={`inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'carousel'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <FiLayers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>3D Carousel</span>
          </button>
        </div>
      </div>

      {/* DESKTOP 3D COVERFLOW CAROUSEL STAGE */}
      {viewMode === 'carousel' && (
        <div className="hidden md:block relative py-4">
          <div className="relative min-h-[600px] py-8 flex items-center justify-center perspective-1000 overflow-visible">
            <AnimatePresence initial={false}>
              {items.map((project, idx) => {
                let offset = idx - activeIndex;
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                if (Math.abs(offset) > 2) return null;

                const isCenter = offset === 0;
                const translateX = offset * 350;
                const translateZ = -Math.abs(offset) * 140;
                const rotateY = offset * -18;
                const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.55 : 0.2;

                return (
                  <motion.div
                    key={project.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) handleNext();
                      else if (info.offset.x > 60) handlePrev();
                    }}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(idx);
                    }}
                    animate={{
                      x: translateX,
                      z: translateZ,
                      rotateY,
                      scale: isCenter ? 1 : 0.86,
                      opacity,
                    }}
                    transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                    style={{
                      zIndex: 20 - Math.abs(offset),
                      transformStyle: 'preserve-3d',
                    }}
                    className={`absolute w-[430px] max-w-[90vw] ${
                      isCenter ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                    }`}
                  >
                    <ProjectCardItem project={project} isFeatured={isCenter} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* 3D Carousel Controls */}
          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous project in 3D carousel"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white transition-all active:scale-95"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Carousel slide indicators">
              {items.map((proj, i) => (
                <button
                  key={proj.id}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Focus ${proj.title}`}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-200 ${
                    i === activeIndex
                      ? 'w-8 bg-gradient-to-r from-purple-400 to-cyan-400'
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next project in 3D carousel"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white transition-all active:scale-95"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* RESPONSIVE 3D BENTO GRID WITH STAGGERED 3D FLIP/SLIDE ON TAB CHANGE */}
      <div
        className={`${
          viewMode === 'carousel' ? 'md:hidden' : 'grid'
        } grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6`}
      >
        {items.map((project, idx) => (
          <motion.div
            key={`${categoryKey}-${project.id}`}
            initial={{ opacity: 0, y: 24, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.42,
              delay: Math.min(idx * 0.055, 0.24),
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="h-full"
          >
            <ProjectCardItem project={project} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
