import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFileText, FiChevronDown } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import { subscribeActiveSection, triggerClickBurst } from '../three/hooks/useSceneStore';
import { SingleResumeAction } from './ResumeButtons';

export default function Navbar({ onNavigate }) {
  const [activeSection, setActiveSectionState] = useState('home');
  const [resumePopoverOpen, setResumePopoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoTilt, setLogoTilt] = useState({});
  const popoverRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeActiveSection((sectionId) => {
      setActiveSectionState(sectionId);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setResumePopoverOpen(false);
        setMobileMenuOpen(false);
      }
    };

    const handlePointerDown = (e) => {
      if (
        resumePopoverOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        setResumePopoverOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [resumePopoverOpen]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (e.clientX && e.clientY) {
      triggerClickBurst(e.clientX, e.clientY, '#a855f7');
    }
    setMobileMenuOpen(false);
    setResumePopoverOpen(false);
    onNavigate(sectionId);
  };

  const handleLogoMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setLogoTilt({
      transform: `perspective(400px) rotateX(${(-y * 0.45).toFixed(1)}deg) rotateY(${(
        x * 0.45
      ).toFixed(1)}deg) scale(1.06)`,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-4 pointer-events-none">
      <nav
        aria-label="Primary Navigation"
        className="pointer-events-auto max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3 rounded-full bg-[#090a18]/78 border border-white/12 backdrop-blur-2xl shadow-[0_16px_40px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        {/* 3D Tilt Logo "MK" */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          onMouseMove={handleLogoMouseMove}
          onMouseLeave={() => setLogoTilt({})}
          style={logoTilt}
          aria-label="Mohit Kushwah — Scroll to Home"
          className="inline-flex items-center gap-2.5 group transition-transform duration-150"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/35 via-indigo-600/30 to-cyan-500/35 border border-purple-400/45 shadow-[0_0_20px_rgba(168,85,247,0.35)] font-display font-bold text-base tracking-tight text-white">
            MK
          </span>
          <span className="hidden sm:flex flex-col text-left">
            <span className="font-display font-bold text-sm text-white leading-tight">
              Mohit Kushwah
            </span>
            <span className="text-[11px] text-zinc-400 leading-tight">
              Data Science &amp; Python
            </span>
          </span>
        </a>

        {/* Desktop Section Links */}
        <ul className="hidden lg:flex items-center gap-1">
          {siteConfig.navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-3.5 py-2 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Controls: Resume Glass Popover + Mobile Hamburger */}
        <div className="flex items-center gap-2.5" ref={popoverRef}>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                if (e.clientX && e.clientY) {
                  triggerClickBurst(e.clientX, e.clientY, '#22d3ee');
                }
                setResumePopoverOpen((prev) => !prev);
              }}
              aria-expanded={resumePopoverOpen}
              aria-haspopup="dialog"
              aria-controls="navbar-resume-popover"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600/35 to-cyan-500/35 hover:from-purple-600/50 hover:to-cyan-500/50 border border-cyan-400/40 shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-[0.97]"
            >
              <FiFileText className="w-4 h-4 text-cyan-300" aria-hidden="true" />
              <span>Resume</span>
              <FiChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  resumePopoverOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Glass Resume Popover */}
            <AnimatePresence>
              {resumePopoverOpen && (
                <motion.div
                  id="navbar-resume-popover"
                  role="dialog"
                  aria-label="Download or View Specialized Resumes"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute right-0 mt-3 w-[290px] sm:w-[320px] p-3.5 rounded-2xl bg-[#0b0d1f]/95 border border-white/15 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50"
                >
                  <div className="flex flex-col gap-2.5">
                    {siteConfig.resumes.map((resume) => (
                      <SingleResumeAction
                        key={resume.id}
                        resume={resume}
                        compact
                        onActionComplete={() => setResumePopoverOpen(false)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Animated Hamburger Button (Mobile/Tablet) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-fullscreen-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] border border-white/15 text-white hover:border-cyan-400/40 transition-colors"
          >
            <span className="sr-only">Toggle Menu</span>
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-opacity duration-200 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Glass Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-fullscreen-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto lg:hidden fixed inset-x-4 top-20 rounded-3xl bg-[#080917]/95 border border-white/15 backdrop-blur-2xl p-6 shadow-2xl z-40 max-h-[calc(100dvh-6rem)] overflow-y-auto"
          >
            <ul className="flex flex-col gap-2">
              {siteConfig.navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-display font-semibold transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-400/30'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-xs font-mono-tabular text-zinc-400">
                        0{idx + 1}
                      </span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
