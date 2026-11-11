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
      className="relative min-h-[100dvh] flex flex-col justify-between pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: High-Contrast, Uncluttered Hero Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left z-10"
        >
          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.06] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-purple-200 via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </h1>

          {/* Subline: "I'm a [typing: Data Scientist | Python Developer]" */}
          <div
            className="mt-5 min-h-[2.75rem] sm:min-h-[3.25rem] flex flex-wrap items-center gap-2.5 font-display text-xl sm:text-3xl font-semibold text-white"
            aria-live="off"
          >
            <span className="text-zinc-200 font-normal">I&apos;m a</span>
            <span className="relative inline-flex items-center px-3.5 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-cyan-200 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              {displayedRole}
              {!prefersReducedMotion && (
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block w-0.5 h-6 bg-cyan-300 animate-pulse"
                />
              )}
            </span>
          </div>

          {/* Short Tagline (13 words) */}
          <p className="mt-6 text-base sm:text-xl text-zinc-100 leading-relaxed max-w-[46ch] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {siteConfig.tagline}
          </p>

          {/* Primary CTAs: Only "View Projects" and "Contact Me" */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button3D
              variant="primary"
              trailingIcon={FiArrowUpRight}
              onClick={() => onNavigate('projects')}
            >
              View Projects
            </Button3D>

            <Button3D
              variant="glass"
              icon={FiMail}
              onClick={() => onNavigate('contact')}
            >
              Contact Me
            </Button3D>
          </div>

          {/* Social Icon Buttons Only (GitHub, LinkedIn, Email) */}
          <div className="mt-8 flex items-center gap-3.5">
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
                  className="group inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.06] hover:bg-purple-500/25 border border-white/15 hover:border-cyan-400/60 text-zinc-100 hover:text-white shadow-lg transition-all duration-200 hover:-translate-y-1 active:scale-95"
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Reserved Clear Space for the 3D Centerpiece */}
        <div className="hidden lg:block lg:col-span-5 min-h-[380px] pointer-events-none" aria-hidden="true" />
      </div>

      {/* Scroll-Down Indicator */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            triggerClickBurst(e.clientX, e.clientY, '#a855f7');
            onNavigate('about');
          }}
          aria-label="Scroll down to About section"
          className="group inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] hover:border-cyan-400/50 transition-colors"
        >
          <FiArrowDown className="w-4 h-4 text-cyan-300 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
