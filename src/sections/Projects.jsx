import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiCode, FiLayers, FiClock } from 'react-icons/fi';
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
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <SectionHeading
          id="projects-heading"
          title="Featured"
          highlight="Projects"
          subtitle="Production machine learning platforms and full-stack Python applications."
          accent="cyan"
          className="mb-0"
        />

        {/* ONE Row with Both Resume Buttons Above the Tabs (Requirement 6) */}
        <ResumeButtons compact />
      </div>

      {/* Category Filter Tabs: All | Data Science | Python Developer */}
      <div className="mb-10">
        <div
          role="tablist"
          aria-label="Filter projects by specialization"
          className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#090a18]/85 border border-white/12 backdrop-blur-xl"
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
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? cat.id === 'python-developer'
                      ? 'bg-cyan-500/25 text-cyan-100 border border-cyan-400/50 shadow-[0_0_24px_-4px_rgba(34,211,238,0.5)]'
                      : 'bg-purple-600/25 text-purple-100 border border-purple-400/50 shadow-[0_0_24px_-4px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{cat.shortLabel}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-tabular bg-white/10 text-zinc-200">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Category Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'all' && (
          <motion.div
            key="tab-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-16"
          >
            {/* GROUP 1: DATA SCIENCE (3 PROJECTS) */}
            <div>
              <div className="pb-4 mb-6 border-b border-purple-500/25">
                <div className="flex items-center gap-2.5">
                  <FiBarChart2 className="w-5 h-5 text-purple-300" aria-hidden="true" />
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Data Science
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-purple-500/15 text-purple-200 border border-purple-400/30">
                    {dsProjects.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-300">
                  Predictive modeling, customer intelligence, and NLP analytics.
                </p>
              </div>

              <ProjectCarousel items={dsProjects} categoryKey="ds-all" />
            </div>

            {/* GROUP 2: PYTHON DEVELOPER (6 PROJECTS) */}
            <div>
              <div className="pb-4 mb-6 border-b border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <FiCode className="w-5 h-5 text-cyan-300" aria-hidden="true" />
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Python Developer
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-cyan-500/15 text-cyan-200 border border-cyan-400/30">
                    {pyProjects.length}
                  </span>
                </div>
                <p className="inline-flex items-center gap-1.5 text-xs text-amber-300/90">
                  <FiClock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Render-hosted demos may take 30–50s to wake up.</span>
                </p>
              </div>

              <ProjectCarousel items={pyProjects} categoryKey="py-all" />
            </div>
          </motion.div>
        )}

        {activeTab === 'data-science' && (
          <motion.div
            key="tab-ds"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="pb-4 mb-6 border-b border-purple-500/25">
              <div className="flex items-center gap-2.5">
                <FiBarChart2 className="w-5 h-5 text-purple-300" aria-hidden="true" />
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Data Science
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-purple-500/15 text-purple-200 border border-purple-400/30">
                  {dsProjects.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-300">
                Predictive modeling, customer intelligence, and NLP analytics.
              </p>
            </div>

            <ProjectCarousel items={dsProjects} categoryKey="ds-filtered" />
          </motion.div>
        )}

        {activeTab === 'python-developer' && (
          <motion.div
            key="tab-py"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="pb-4 mb-6 border-b border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <FiCode className="w-5 h-5 text-cyan-300" aria-hidden="true" />
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Python Developer
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tabular bg-cyan-500/15 text-cyan-200 border border-cyan-400/30">
                  {pyProjects.length}
                </span>
              </div>
              <p className="inline-flex items-center gap-1.5 text-xs text-amber-300/90">
                <FiClock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Render-hosted demos may take 30–50s to wake up.</span>
              </p>
            </div>

            <ProjectCarousel items={pyProjects} categoryKey="py-filtered" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
