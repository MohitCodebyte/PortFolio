import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';

export default function Experience() {
  const timelineRef = useRef(null);

  // Scroll-linked 3D timeline progress for the glowing vertical line and traveling 3D orb
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 35%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const lineScaleY = useTransform(smoothProgress, [0, 1], [0.08, 1]);
  const orbTop = useTransform(smoothProgress, [0, 1], ['6%', '92%']);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="experience-heading"
        title="Work"
        highlight="Experience"
        subtitle="Full-stack Python and backend engineering in production."
        accent="purple"
      />

      <div
        ref={timelineRef}
        className="relative pl-6 sm:pl-12 perspective-1000"
      >
        {/* Base Vertical Timeline Track */}
        <div
          aria-hidden="true"
          className="absolute left-2 sm:left-3.5 top-2 bottom-2 w-[2px] rounded-full bg-white/10"
        />

        {/* Scroll-Linked Glowing Gradient Line */}
        <motion.div
          aria-hidden="true"
          style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
          className="absolute left-2 sm:left-3.5 top-2 bottom-2 w-[2px] rounded-full bg-gradient-to-b from-purple-400 via-indigo-400 to-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
        />

        {/* Scroll-Linked Traveling 3D Glowing Orb */}
        <motion.div
          aria-hidden="true"
          style={{ top: orbTop }}
          className="absolute left-[1px] sm:left-[7px] -translate-y-1/2 z-20 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#e0f2fe,#22d3ee_55%,#7e22ce_100%)] border border-white/60 shadow-[0_0_22px_4px_rgba(34,211,238,0.85),0_0_40px_rgba(168,85,247,0.65)]"
        >
          <span className="absolute -inset-1.5 rounded-full border border-cyan-300/45 animate-ping" />
        </motion.div>

        <div className="space-y-8">
          {siteConfig.experience.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 28, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full"
            >
              <GlassCard
                glow="cyan"
                maxTilt={6}
                className="w-full"
                innerClassName="p-5 sm:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 sm:pb-5 mb-5 border-b border-white/10">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-1">
                      <FiBriefcase className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{exp.company}</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
                      {exp.role}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/35 text-purple-200 font-mono-tabular font-medium">
                      <FiCalendar className="w-3.5 h-3.5 text-purple-300 shrink-0" aria-hidden="true" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/35 text-cyan-200 font-medium">
                      <FiMapPin className="w-3.5 h-3.5 text-cyan-300 shrink-0" aria-hidden="true" />
                      <span>
                        {exp.mode} • {exp.location}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 3 Crisp One-Line Bullets */}
                <ul className="space-y-2.5 mb-5">
                  {exp.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 fluid-body text-zinc-200"
                    >
                      <FiCheckCircle
                        className="w-4 h-4 text-cyan-400 shrink-0 mt-1"
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
      </div>
    </section>
  );
}
