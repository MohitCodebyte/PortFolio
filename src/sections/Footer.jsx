import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import ResumeButtons from '../components/ResumeButtons';
import { triggerClickBurst } from '../three/hooks/useSceneStore';

export default function Footer({ onNavigate }) {
  const [rocketLaunching, setRocketLaunching] = useState(false);

  const handleScrollTop = (e) => {
    if (e.clientX && e.clientY) {
      triggerClickBurst(e.clientX, e.clientY, '#22d3ee');
    }
    setRocketLaunching(true);
    setTimeout(() => {
      onNavigate('home');
    }, 240);
    setTimeout(() => {
      setRocketLaunching(false);
    }, 1100);
  };

  return (
    <footer
      id="footer"
      style={{
        paddingBottom: 'calc(2.25rem + env(safe-area-inset-bottom, 0px))',
      }}
      className="relative z-10 mt-12 border-t border-white/12 bg-[#05060d]/92 backdrop-blur-2xl overflow-hidden"
    >
      {/* Top 3D Strip: Slowly Rotating Wireframe Planet/Globe + Orbiting Particles + Glowing Grid Floor */}
      <div
        aria-hidden="true"
        className="relative w-full h-24 sm:h-28 overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.16)_0%,rgba(34,211,238,0.08)_42%,transparent_75%)] flex items-center justify-center"
      >
        {/* Subtle Glowing Perspective Grid Floor */}
        <div
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(168,85,247,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.18) 1px, transparent 1px)',
            backgroundSize: '36px 18px',
            transform: 'perspective(320px) rotateX(68deg) translateY(18px)',
          }}
          className="absolute inset-x-0 bottom-0 h-24 opacity-45"
        />

        {/* Rotating Wireframe Globe + Orbiting Particles */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-16 h-16 text-cyan-400/55 animate-[spin_22s_linear_infinite]"
          >
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="22"
              ry="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="16"
              fill="none"
              stroke="#a855f7"
              strokeOpacity="0.65"
              strokeWidth="1"
            />
            <line
              x1="12"
              y1="50"
              x2="88"
              y2="50"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="0.9"
            />
            <line
              x1="50"
              y1="12"
              x2="50"
              y2="88"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="0.9"
            />
          </svg>

          {/* Orbiting Ring + Glowing Satellite Dots */}
          <div
            style={{ transform: 'rotateX(66deg) rotateZ(-16deg)' }}
            className="absolute w-28 h-28 rounded-full border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.45)] animate-[spin_10s_linear_infinite]"
          >
            <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            <span className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_10px_#a855f7]" />
          </div>
        </div>
      </div>

      {/* Main Footer Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/*
          Desktop (>=1024px): 3-Column CSS Grid
          Tablet (768-1023px): 2-Column CSS Grid
          Mobile (<768px): 1-Column Centered Stack
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[auto_1fr_auto] items-center lg:items-start gap-8 pb-8 border-b border-white/10">
          {/* COLUMN 1 (Left): Logo + Name + Role on ONE Line, then Two Resume Buttons Side by Side */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 w-full">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/40 to-cyan-500/40 border border-purple-400/45 font-display font-bold text-white shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                MK
              </span>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2.5 text-left">
                <span className="font-display font-bold text-base sm:text-lg text-white whitespace-nowrap">
                  {siteConfig.name}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden sm:inline text-zinc-500"
                >
                  •
                </span>
                <span className="text-xs sm:text-sm font-medium text-cyan-300 whitespace-nowrap">
                  {siteConfig.headline}
                </span>
              </div>
            </div>

            {/* Two Resume Buttons: Stacked full-width on mobile (<768), Side-by-side on md+ */}
            <ResumeButtons compact footerMode />
          </div>

          {/* COLUMN 2 (Center): Nav Links (2-column grid on mobile & 1024px laptop, single non-wrapping row on tablet 768px & desktop 1280px+) */}
          <nav
            aria-label="Footer Navigation"
            className="w-full md:col-span-2 lg:col-span-1 lg:my-auto flex justify-center"
          >
            <ul className="grid grid-cols-2 md:flex md:flex-nowrap lg:grid lg:grid-cols-2 xl:flex xl:flex-nowrap items-center justify-center gap-x-4 gap-y-1 sm:gap-x-3 xl:gap-x-4 text-sm w-full sm:w-auto max-w-xs md:max-w-none">
              {siteConfig.navLinks.map((link) => (
                <li key={link.id} className="flex justify-center lg:justify-start xl:justify-center">
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.id);
                    }}
                    className="inline-flex items-center justify-center min-h-[40px] px-2 py-1 text-zinc-300 hover:text-cyan-300 active:text-white font-medium whitespace-nowrap transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMN 3 (Right): Social Icon Buttons + Email Text Underneath */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2.5 w-full md:col-start-2 md:row-start-1 lg:col-start-3">
            <div className="flex items-center justify-center md:justify-end gap-3">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.05] hover:bg-purple-500/20 border border-white/12 hover:border-purple-400/50 text-zinc-200 hover:text-white active:scale-[0.95] transition-all"
              >
                <FiGithub className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.05] hover:bg-cyan-500/20 border border-white/12 hover:border-cyan-400/50 text-zinc-200 hover:text-white active:scale-[0.95] transition-all"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label={`Email ${siteConfig.email}`}
                className="inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.05] hover:bg-indigo-500/20 border border-white/12 hover:border-indigo-400/50 text-zinc-200 hover:text-white active:scale-[0.95] transition-all"
              >
                <FiMail className="w-4 h-4" />
              </a>
            </div>

            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center min-h-[32px] font-mono-tabular text-xs sm:text-sm text-zinc-300 hover:text-cyan-300 transition-colors"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        {/* Bottom Bar Below Thin Divider: Copyright on Left, 3D Back to Top Button on Right */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          {/* 3D Back to Top Button with Rocket/Arrow Liftoff & Exhaust Trail Animation */}
          <button
            type="button"
            onClick={handleScrollTop}
            aria-label="Back to Top"
            className="group relative inline-flex items-center gap-2.5 min-h-[44px] px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/25 via-indigo-600/25 to-cyan-500/25 hover:from-purple-600/40 hover:to-cyan-500/40 border border-cyan-400/40 text-xs font-semibold text-white shadow-[0_8px_24px_-6px_rgba(34,211,238,0.4)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.96] overflow-hidden"
          >
            <span>Back to Top</span>
            <span className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
              <motion.span
                animate={
                  rocketLaunching
                    ? { y: [0, -26], opacity: [1, 0], scale: [1, 1.25] }
                    : { y: 0, opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.32, ease: 'easeIn' }}
                className="inline-flex items-center justify-center"
              >
                <FiArrowUp
                  className="w-3.5 h-3.5 text-cyan-300 group-hover:-translate-y-0.5 transition-transform"
                  aria-hidden="true"
                />
              </motion.span>

              {/* Short Trail Animation on Liftoff */}
              {rocketLaunching && (
                <motion.span
                  initial={{ height: 0, opacity: 0.9 }}
                  animate={{ height: 18, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  aria-hidden="true"
                  className="absolute bottom-0 w-1 rounded-full bg-gradient-to-t from-transparent via-purple-400 to-cyan-300"
                />
              )}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
