import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { skillGroups } from '../data/skills';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import SkillOrbit from '../components/SkillOrbit';

export default function Skills({ prefersReducedMotion = false }) {
  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="skills-heading"
        title="Technical"
        highlight="Skills"
        subtitle="Core technologies across machine learning, Python backends, and cloud tooling."
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Interactive Orbiting Icon Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 lg:sticky lg:top-28"
        >
          <GlassCard
            glow="cyan"
            tilt={false}
            innerClassName="p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  3D Skill Orbit
                </h3>
                <p className="text-xs text-zinc-400">
                  Click any node to highlight below
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono-tabular bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                39 Skills
              </span>
            </div>

            <SkillOrbit
              selectedSkillName={selectedSkill?.name}
              onSelectSkill={(node) => setSelectedSkill(node)}
              prefersReducedMotion={prefersReducedMotion}
            />
          </GlassCard>
        </motion.div>

        {/* Right Column: Categorized Glass Skill Cards */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {skillGroups.map((group, idx) => {
            const isPurple = group.accent === 'purple';
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
              >
                <GlassCard
                  glow={isPurple ? 'purple' : 'cyan'}
                  maxTilt={4}
                  innerClassName="p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      {group.title}
                    </h3>
                    <span className="font-mono-tabular text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300">
                      {group.skills.length}
                    </span>
                  </div>

                  {/* Skill Pills with Core / Working Tier Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-200 ${
                            isHighlighted
                              ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                              : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/8 hover:border-white/20'
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
                              <span className="font-display text-sm font-semibold text-white truncate">
                                {skill.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5 pl-4 truncate">
                              {skill.detail}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono-tabular uppercase tracking-wider font-semibold border ${
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
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
