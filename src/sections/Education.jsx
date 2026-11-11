import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiAward, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';

export default function Education() {
  const { education, certifications } = siteConfig;

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="education-heading"
        title="Education &"
        highlight="Certifications"
        subtitle="Academic foundation and verified industry credentials."
        accent="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch perspective-1000">
        {/* Degree Card: B.Tech, RGPV, 2024-2028, Coursework Chips */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="lg:col-span-6"
        >
          <GlassCard
            glow="purple"
            maxTilt={6}
            className="h-full"
            innerClassName="p-5 sm:p-8 flex flex-col justify-between gap-5"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-400/35 text-purple-200">
                  <FiBookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Degree</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tabular bg-white/[0.05] border border-white/10 text-cyan-300">
                  <FiCalendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>2024 – 2028</span>
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-3xl font-bold text-white leading-snug">
                {education.degree}
              </h3>
              <p className="mt-2 fluid-body font-medium text-purple-200">
                {education.institution}
              </p>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {education.coursework.map((course) => (
                    <Badge key={course} variant="purple">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Certifications: 2 Cards with Floating Bobbing Badges */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="lg:col-span-6 flex flex-col gap-5 sm:gap-6"
        >
          {certifications.map((cert, idx) => {
            const isCyan = cert.badgeColor === 'cyan';
            return (
              <GlassCard
                key={cert.id}
                glow={isCyan ? 'cyan' : 'purple'}
                maxTilt={6}
                className="flex-1"
                innerClassName="p-5 sm:p-7 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                        isCyan ? 'text-cyan-300' : 'text-purple-300'
                      }`}
                    >
                      <FiAward className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Certification</span>
                    </div>
                    <h3 className="font-display text-lg sm:text-2xl font-bold text-white leading-snug">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {cert.issuer}
                    </p>
                  </div>

                  {/* Certificate Badge Floating with a Gentle Bob */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 3.2 + idx * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="shrink-0"
                  >
                    <Badge variant={isCyan ? 'cyan' : 'purple'}>Certified</Badge>
                  </motion.div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-2 fluid-body text-zinc-300">
                  <FiCheckCircle
                    className={`w-4 h-4 shrink-0 ${
                      isCyan ? 'text-cyan-400' : 'text-purple-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{cert.focus}</span>
                </div>
              </GlassCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
