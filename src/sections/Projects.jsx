import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiCode, FiLayers } from 'react-icons/fi';
import { projects, projectCategories } from '../data/projects';
import SectionHeading from '../components/SectionHeading';
import ProjectCarousel from '../components/ProjectCarousel';
import ResumeButtons from '../components/ResumeButtons';
import { triggerClickBurst } from '../three/hooks/useSceneStore';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'data-science' | 'python-developer'

  const dsProjects = useMemo(
    () => projects.filter((p) => p.category === 'data-science'),
    []
  );
  const pyProjects = useMemo(
    () => projects.filter((p) => p.category === 'python-developer'),
    []
  );

  const handleTabChange = (e, tabId) => {
    if (e.clientX && e.clientY) {
      triggerClickBurst(
        e.clientX,
        e.clientY,
        tabId === 'python-developer' ? '#22d3ee' : '#a855f7'
      );
    }
    setActiveTab(tabId);
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-6 sm:mb-8">
        <SectionHeading
          id="projects-heading"
          title="Featured"
          highlight="Projects"
          subtitle="Machine learning platforms and full-stack Python systems."
          accent="cyan"
          className="mb-0"
        />

        {/* ONE Row with Both Resume Buttons Above the Tabs */}
        <ResumeButtons compact />
      </div>

      {/* Category Filter Tabs: Horizontally scrollable pill bar with snap, sticky below navbar */}
      <div className="sticky top-[64px] sm:top-[76px] z-20 mb-8 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-[#06060e]/85 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none">
        <div
          role="tablist"
          aria-label="Filter projects by specialization"
          className="flex sm:inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[#090a18]/90 border border-white/12 backdrop-blur-xl overflow-x-auto no-scrollbar snap-x snap-mandatory w-full sm:w-auto"
        >
          {projectCategories.map((cat) => {
            const isSelected = activeTab === cat.id;
            const Icon =
              cat.id === 'data-science'
                ? FiBarChart2
                : cat.id === 'python-developer'
                ? FiCode
                : FiLayers;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={(e) => handleTabChange(e, cat.id)}
                className={`snap-start shrink-0 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap touch-manipulation transition-all duration-200 active:scale-[0.97] ${
                  isSelected
                    ? cat.id === 'python-developer'
                      ? 'bg-cyan-500/25 text-cyan-100 border border-cyan-400/50 shadow-[0_0_24px_-4px_rgba(34,211,238,0.5)]'
                      : 'bg-purple-600/25 text-purple-100 border border-purple-400/50 shadow-[0_0_24px_-4px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{cat.shortLabel}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono-tabular bg-white/10 text-zinc-200">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Category Content with 3D Flip/Slide Transition */}
      <AnimatePresence mode="wait">
        {activeTab === 'all' && (
          <motion.div
            key="tab-all"
            initial={{ opacity: 0, y: 18, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12, rotateX: -4 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12 sm:space-y-14 perspective-1000"
          >
            {/* GROUP 1: DATA SCIENCE (3 PROJECTS) */}
            <div>
              <div className="pb-3 mb-5 border-b border-purple-500/25 flex items-center gap-2.5">
                <FiBarChart2 className="w-5 h-5 text-purple-300 shrink-0" aria-hidden="true" />
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Data Science
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-purple-500/15 text-purple-200 border border-purple-400/30">
                  {dsProjects.length}
                </span>
              </div>

              <ProjectCarousel items={dsProjects} categoryKey="ds-all" />
            </div>

            {/* GROUP 2: PYTHON DEVELOPER (6 PROJECTS) */}
            <div>
              <div className="pb-3 mb-5 border-b border-cyan-500/25 flex items-center gap-2.5">
                <FiCode className="w-5 h-5 text-cyan-300 shrink-0" aria-hidden="true" />
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Python Developer
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-cyan-500/15 text-cyan-200 border border-cyan-400/30">
                  {pyProjects.length}
                </span>
              </div>

              <ProjectCarousel items={pyProjects} categoryKey="py-all" />
            </div>
          </motion.div>
        )}

        {activeTab === 'data-science' && (
          <motion.div
            key="tab-ds"
            initial={{ opacity: 0, y: 18, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12, rotateX: -4 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="perspective-1000"
          >
            <div className="pb-3 mb-5 border-b border-purple-500/25 flex items-center gap-2.5">
              <FiBarChart2 className="w-5 h-5 text-purple-300 shrink-0" aria-hidden="true" />
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Data Science
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-purple-500/15 text-purple-200 border border-purple-400/30">
                {dsProjects.length}
              </span>
            </div>

            <ProjectCarousel items={dsProjects} categoryKey="ds-filtered" />
          </motion.div>
        )}

        {activeTab === 'python-developer' && (
          <motion.div
            key="tab-py"
            initial={{ opacity: 0, y: 18, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12, rotateX: -4 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="perspective-1000"
          >
            <div className="pb-3 mb-5 border-b border-cyan-500/25 flex items-center gap-2.5">
              <FiCode className="w-5 h-5 text-cyan-300 shrink-0" aria-hidden="true" />
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Python Developer
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-cyan-500/15 text-cyan-200 border border-cyan-400/30">
                {pyProjects.length}
              </span>
            </div>

            <ProjectCarousel items={pyProjects} categoryKey="py-filtered" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
