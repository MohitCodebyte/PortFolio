import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="experience-heading"
        title="Work"
        highlight="Experience"
        subtitle="Building and deploying full-stack Python applications in production."
        accent="purple"
      />

      <div className="relative pl-6 sm:pl-10 border-l-2 border-purple-500/35 space-y-10">
        {siteConfig.experience.map((exp) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Glowing 3D Timeline Node */}
            <div
              aria-hidden="true"
              className="absolute -left-[35px] sm:-left-[51px] top-6 w-5 h-5 rounded-full bg-[#06060e] border-2 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.9)] flex items-center justify-center"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>

            <GlassCard
              glow="cyan"
              maxTilt={5}
              innerClassName="p-6 sm:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-1.5">
                    <FiBriefcase className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{exp.company}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {exp.role}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/35 text-purple-200 font-mono-tabular font-medium">
                    <FiCalendar className="w-3.5 h-3.5 text-purple-300" aria-hidden="true" />
                    {exp.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/35 text-cyan-200 font-medium">
                    <FiMapPin className="w-3.5 h-3.5 text-cyan-300" aria-hidden="true" />
                    {exp.mode} • {exp.location}
                  </span>
                </div>
              </div>

              {/* 3 Bullets */}
              <ul className="space-y-3.5 mb-6">
                {exp.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm sm:text-base text-zinc-200 leading-relaxed"
                  >
                    <FiCheckCircle
                      className="w-4 h-4 text-cyan-400 shrink-0 mt-1.5"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Chips */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                {exp.tech.map((t) => (
                  <Badge key={t} variant="cyan">
                    {t}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
