import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { skillGroups } from '../data/skills';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import SkillOrbit from '../components/SkillOrbit';

export default function Skills({ prefersReducedMotion = false }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  // On mobile, first 2 groups are expanded by default; users can toggle any group accordion
  const [openGroups, setOpenGroups] = useState(() => ({
    [skillGroups[0]?.id]: true,
    [skillGroups[1]?.id]: true,
  }));

  const toggleGroup = (id) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectSkill = (node) => {
    setSelectedSkill(node);
    if (node) {
      // Automatically expand any group that matches the tapped skill on mobile
      const matchingGroup = skillGroups.find((g) =>
        g.skills.some(
          (s) =>
            s.name.toLowerCase().includes(node.name.toLowerCase()) ||
            node.name.toLowerCase().includes(s.name.toLowerCase())
        )
      );
      if (matchingGroup) {
        setOpenGroups((prev) => ({ ...prev, [matchingGroup.id]: true }));
      }
    }
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="skills-heading"
        title="Technical"
        highlight="Skills"
        subtitle="Core technologies across machine learning, Python backends, and cloud tooling."
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (or Top Strip on Mobile): 3D Skill Orbit / Compact Floating Icon Strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-5 lg:sticky lg:top-28"
        >
          <GlassCard glow="cyan" tilt={false} innerClassName="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  <span className="md:hidden">Core Tech Strip</span>
                  <span className="hidden md:inline">3D Skill Orbit</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Tap any skill to highlight below
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono-tabular bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                39 Skills
              </span>
            </div>

            <SkillOrbit
              selectedSkillName={selectedSkill?.name}
              onSelectSkill={handleSelectSkill}
              prefersReducedMotion={prefersReducedMotion}
            />
          </GlassCard>
        </motion.div>

        {/* Right Column: Categorized Glass Skill Cards (Accordion + 2-Column Chip Grid on Mobile) */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
          {skillGroups.map((group, idx) => {
            const isPurple = group.accent === 'purple';
            const isOpenMobile = Boolean(openGroups[group.id]);

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <GlassCard
                  glow={isPurple ? 'purple' : 'cyan'}
                  maxTilt={4}
                  innerClassName="p-4 sm:p-6 md:p-7"
                >
                  {/* Accordion Header on Mobile / Static Header on md+ */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isOpenMobile}
                    className="w-full min-h-[48px] flex items-center justify-between gap-2 text-left md:cursor-default touch-manipulation"
                  >
                    <h3 className="font-display text-base sm:text-xl font-bold text-white">
                      {group.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono-tabular text-xs px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300">
                        {group.skills.length}
                      </span>
                      <FiChevronDown
                        className={`md:hidden w-5 h-5 text-zinc-300 transition-transform duration-200 ${
                          isOpenMobile ? 'rotate-180 text-cyan-300' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {/* 2-Column Chip Grid (Collapsible on mobile, always visible on md+) */}
                  <AnimatePresence initial={false}>
                    <div
                      className={`${
                        isOpenMobile ? 'block' : 'hidden'
                      } md:block pt-3.5 mt-3.5 border-t border-white/10`}
                    >
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                        {group.skills.map((skill) => {
                          const isHighlighted =
                            selectedSkill &&
                            (selectedSkill.name
                              .toLowerCase()
                              .includes(skill.name.toLowerCase()) ||
                              skill.name
                                .toLowerCase()
                                .includes(selectedSkill.name.toLowerCase()));

                          return (
                            <div
                              key={skill.name}
                              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 p-3 rounded-xl border transition-all duration-200 min-w-0 ${
                                isHighlighted
                                  ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                      skill.tier === 'Core'
                                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                        : 'bg-sky-400'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  <span className="font-display text-xs sm:text-sm font-semibold text-white truncate">
                                    {skill.name}
                                  </span>
                                </div>
                                <p className="hidden sm:block text-xs text-zinc-400 mt-0.5 pl-4 truncate">
                                  {skill.detail}
                                </p>
                              </div>

                              <span
                                className={`self-start sm:self-center shrink-0 px-2 py-0.5 rounded-md text-xs font-mono-tabular font-semibold border ${
                                  skill.tier === 'Core'
                                    ? 'bg-emerald-500/12 text-emerald-300 border-emerald-400/30'
                                    : 'bg-sky-500/12 text-sky-300 border-sky-400/25'
                                }`}
                              >
                                {skill.tier}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
