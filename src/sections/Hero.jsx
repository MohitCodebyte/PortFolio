import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowDown,
  FiArrowUpRight,
} from 'react-icons/fi';
import { siteConfig } from '../data/site';
import Button3D from '../components/Button3D';
import { triggerClickBurst } from '../three/hooks/useSceneStore';

export default function Hero({ onNavigate, prefersReducedMotion }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState(siteConfig.roles[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing / rotating roles ("Data Scientist" | "Python Developer")
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedRole(siteConfig.roles.join(' | '));
      return;
    }

    const currentFullRole = siteConfig.roles[roleIndex];
    const typeSpeed = isDeleting ? 42 : 82;

    const timer = setTimeout(() => {
      if (!isDeleting && displayedRole === currentFullRole) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && displayedRole === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % siteConfig.roles.length);
      } else {
        const nextText = isDeleting
          ? currentFullRole.substring(0, displayedRole.length - 1)
          : currentFullRole.substring(0, displayedRole.length + 1);
        setDisplayedRole(nextText);
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayedRole, isDeleting, roleIndex, prefersReducedMotion]);

  const socialItems = [
    {
      label: 'GitHub Profile',
      href: siteConfig.links.github,
      icon: FiGithub,
      external: true,
    },
    {
      label: 'LinkedIn Profile',
      href: siteConfig.links.linkedin,
      icon: FiLinkedin,
      external: true,
    },
    {
      label: `Email ${siteConfig.email}`,
      href: siteConfig.links.email,
      icon: FiMail,
      external: false,
    },
  ];

  return (
    <section
      id="home"
      aria-label="Introduction and Hero"
      className="relative min-h-[100svh] flex flex-col justify-between pt-20 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        {/* Mobile 3D Centerpiece Stage (34-38svh height above text so 3D never overlaps text) */}
        <div
          aria-hidden="true"
          className="lg:hidden relative w-full h-[35svh] min-h-[195px] max-h-[275px] pointer-events-none flex items-end justify-center"
        >
          <div className="w-full h-16 bg-gradient-to-t from-[#06060e]/85 via-[#06060e]/30 to-transparent rounded-b-2xl" />
        </div>

        {/* Left Column (Desktop) / Below 3D Stage (Mobile): High-Contrast Hero Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col items-center text-center sm:items-start sm:text-left z-10 w-full rounded-3xl lg:rounded-none bg-[#06060e]/70 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 sm:p-6 lg:p-0 border border-white/8 lg:border-0"
        >
          {/* Heading (fluid clamp 2.1-2.6rem on mobile, 6xl/7xl on desktop) */}
          <h1 className="font-display fluid-hero-h1 sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-purple-200 via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </h1>

          {/* Subline: "I'm a [typing: Data Scientist | Python Developer]" */}
          <div
            className="mt-3.5 sm:mt-5 min-h-[2.5rem] sm:min-h-[3.25rem] flex flex-wrap items-center justify-center sm:justify-start gap-2 font-display text-lg sm:text-2xl lg:text-3xl font-semibold text-white"
            aria-live="off"
          >
            <span className="text-zinc-200 font-normal">I&apos;m a</span>
            <span className="relative inline-flex items-center px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-cyan-200 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              {displayedRole}
              {!prefersReducedMotion && (
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block w-0.5 h-5 sm:h-6 bg-cyan-300 animate-pulse"
                />
              )}
            </span>
          </div>

          {/* One Short Line (max 18 words, fluid 15-16px body on mobile) */}
          <p className="mt-4 sm:mt-6 fluid-body sm:text-xl text-zinc-100 max-w-[44ch] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {siteConfig.tagline}
          </p>

          {/* Primary CTAs: Full-width stacked on mobile, side-by-side on sm+ */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button3D
              variant="primary"
              trailingIcon={FiArrowUpRight}
              onClick={() => onNavigate('projects')}
              className="w-full sm:w-auto min-h-[48px]"
            >
              View Projects
            </Button3D>

            <Button3D
              variant="glass"
              icon={FiMail}
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto min-h-[48px]"
            >
              Contact Me
            </Button3D>
          </div>

          {/* Row of 3 Social Icon Buttons (GitHub, LinkedIn, Email) >= 44x44px with 12px+ gap */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center sm:justify-start gap-3.5">
            {socialItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  onClick={(e) =>
                    triggerClickBurst(e.clientX, e.clientY, '#22d3ee')
                  }
                  className="group inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-purple-500/25 active:bg-purple-500/35 border border-white/15 hover:border-cyan-400/60 text-zinc-100 hover:text-white shadow-lg touch-manipulation transition-all duration-200 sm:hover:-translate-y-1 active:scale-[0.95]"
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column (Desktop): Reserved Clear Space for the 3D Centerpiece */}
        <div
          className="hidden lg:block lg:col-span-5 min-h-[380px] pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Scroll-Down Indicator (>= 44x44px tap target) */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            triggerClickBurst(e.clientX, e.clientY, '#a855f7');
            onNavigate('about');
          }}
          aria-label="Scroll down to About section"
          className="group inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/15 bg-white/[0.04] hover:border-cyan-400/50 active:scale-[0.95] touch-manipulation transition-all"
        >
          <FiArrowDown className="w-4 h-4 text-cyan-300 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
