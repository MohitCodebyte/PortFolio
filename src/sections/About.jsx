import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCheckCircle, FiMapPin, FiMail, FiCpu, FiCode } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import SectionHeading from '../components/SectionHeading';
import GlassCard from '../components/GlassCard';
import Avatar from '../components/Avatar';

function AnimatedCounter({ value, suffix = '', label, detail, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 900;
    const startTime = performance.now();

    let rafId;
    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const current = Math.round(progress * value);
      setCount(current);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value]);

  return (
    <GlassCard
      glow="purple"
      maxTilt={6}
      className={className}
      innerClassName="p-4 sm:p-6 flex flex-col justify-between"
    >
      <div ref={ref}>
        <div className="font-display font-mono-tabular text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
          {count}
          {suffix}
        </div>
        <h3 className="mt-1.5 sm:mt-2 font-display text-sm sm:text-base font-bold text-white">
          {label}
        </h3>
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{detail}</p>
      </div>
    </GlassCard>
  );
}

export default function About({ prefersReducedMotion = false }) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionHeading
        id="about-heading"
        title="About"
        highlight="Me"
        subtitle="Turning complex data into predictive models and production web applications."
        accent="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left / Top on Mobile: Cartoon Avatar Card (max 320px centered on mobile, full column on lg) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 w-full max-w-[320px] sm:max-w-md lg:max-w-none mx-auto"
        >
          <GlassCard
            glow="cyan"
            maxTilt={8}
            className="h-full"
            innerClassName="p-5 sm:p-8 flex flex-col justify-between gap-5"
          >
            <div>
              {/* Glowing Gradient 3D Tilt Frame with Animated Developer Cartoon Avatar */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-3xl p-1 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                <div className="w-full h-full rounded-[20px] overflow-hidden bg-[#080917] flex items-center justify-center relative">
                  <Avatar prefersReducedMotion={prefersReducedMotion} />
                </div>
              </div>

              <div className="mt-5 text-center">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {siteConfig.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-cyan-300">
                  {siteConfig.headline}
                </p>

                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-300">
                  <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                    <FiMapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" aria-hidden="true" />
                    <span>{siteConfig.location}</span>
                  </span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 hover:text-cyan-200 active:scale-[0.97] transition-all"
                  >
                    <FiMail className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{siteConfig.email}</span>
                  </a>
                </div>
              </div>

              {/* Dual Specialization Pillars */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-400/25">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                    <FiCpu className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Data Science &amp; ML</span>
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                    Predictive modeling, SMOTE class balancing, NLP transformers &amp; BI analytics.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/25">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                    <FiCode className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Python Engineering</span>
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                    Flask, FastAPI, Django, SQL/MySQL architectures &amp; cloud deployments.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/10 text-center">
              <p className="text-[11px] text-zinc-400">
                B.Tech (2024–2028) • RGPV • Development Intern @ NexvoraTech
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Right / Below on Mobile: Professional Summary, Highlights & 2-Column Mobile Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="lg:col-span-7 flex flex-col justify-between gap-6"
        >
          <GlassCard
            glow="purple"
            tilt={false}
            innerClassName="p-5 sm:p-8 flex flex-col justify-between gap-5"
          >
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Engineering Focus
              </h3>
              <p className="mt-3 fluid-body text-zinc-300">
                {siteConfig.about.summary}
              </p>

              <ul className="mt-5 space-y-3">
                {siteConfig.about.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 fluid-body text-zinc-200"
                  >
                    <FiCheckCircle
                      className="w-4 h-4 text-cyan-400 shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          {/* Animated Counters Grid: 2-column grid on mobile, 3-column on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {siteConfig.about.stats.map((stat, idx) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                detail={stat.detail}
                className={idx === 2 ? 'col-span-2 sm:col-span-1' : ''}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
