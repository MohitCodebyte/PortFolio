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
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="education-heading"
        title="Education &"
        highlight="Certifications"
        subtitle="Academic foundation in computer science, mathematics, and industry certifications."
        accent="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: B.Tech Degree Card (RGPV — No CGPA or college city per spec) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6"
        >
          <GlassCard
            glow="purple"
            maxTilt={6}
            className="h-full"
            innerClassName="p-6 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-400/35 text-purple-200">
                  <FiBookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Degree</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tabular bg-white/[0.05] border border-white/10 text-cyan-300">
                  <FiCalendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {education.period} ({education.status})
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {education.degree}
              </h3>
              <p className="mt-2 text-base font-medium text-purple-200">
                {education.institution}
              </p>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  Coursework
                </p>
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

        {/* Right: Professional Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-6 flex flex-col gap-6"
        >
          {certifications.map((cert) => {
            const isCyan = cert.badgeColor === 'cyan';
            return (
              <GlassCard
                key={cert.id}
                glow={isCyan ? 'cyan' : 'purple'}
                maxTilt={6}
                className="flex-1"
                innerClassName="p-6 sm:p-7 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                        isCyan ? 'text-cyan-300' : 'text-purple-300'
                      }`}
                    >
                      <FiAward className="w-4 h-4" aria-hidden="true" />
                      <span>Certification</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {cert.issuer}
                    </p>
                  </div>
                  <Badge variant={isCyan ? 'cyan' : 'purple'}>Certified</Badge>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
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
