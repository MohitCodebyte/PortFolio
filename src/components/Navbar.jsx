import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFileText, FiChevronDown, FiX } from 'react-icons/fi';
import { siteConfig } from '../data/site';
import { subscribeActiveSection, triggerClickBurst } from '../three/hooks/useSceneStore';
import { SingleResumeAction } from './ResumeButtons';

export default function Navbar({ onNavigate }) {
  const [activeSection, setActiveSectionState] = useState('home');
  const [resumePopoverOpen, setResumePopoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResumeSheetOpen, setMobileResumeSheetOpen] = useState(false);
  const [logoTilt, setLogoTilt] = useState({});
  const popoverRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeActiveSection((sectionId) => {
      setActiveSectionState(sectionId);
    });
    return unsubscribe;
  }, []);

  // Lock body scroll while fullscreen mobile menu or mobile resume bottom sheet is open
  useEffect(() => {
    const shouldLock = mobileMenuOpen || mobileResumeSheetOpen;
    if (shouldLock) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow || '';
      };
    }
  }, [mobileMenuOpen, mobileResumeSheetOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (mobileResumeSheetOpen) {
          setMobileResumeSheetOpen(false);
          return;
        }
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
  }, [resumePopoverOpen, mobileResumeSheetOpen]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (e.clientX && e.clientY) {
      triggerClickBurst(e.clientX, e.clientY, '#a855f7');
    }
    setMobileMenuOpen(false);
    setMobileResumeSheetOpen(false);
    setResumePopoverOpen(false);
    onNavigate(sectionId);
  };

  const handleLogoMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
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
    <>
      <header
        style={{
          paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
        }}
        className="fixed top-0 left-0 right-0 z-40 sm:px-6 sm:pt-3.5 pointer-events-none"
      >
        <nav
          aria-label="Primary Navigation"
          className="pointer-events-auto max-w-7xl mx-auto h-14 lg:h-auto flex items-center justify-between gap-2 px-3.5 sm:px-5 lg:py-2.5 rounded-full bg-[#090a18]/82 border border-white/12 backdrop-blur-2xl shadow-[0_16px_40px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)]"
        >
          {/* 3D Tilt Logo "MK" (>= 44x44px tap target) */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            onMouseMove={handleLogoMouseMove}
            onMouseLeave={() => setLogoTilt({})}
            style={logoTilt}
            aria-label="Mohit Kushwah — Scroll to Home"
            className="inline-flex items-center gap-2.5 min-h-[44px] group transition-transform duration-150 active:scale-[0.97]"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/35 via-indigo-600/30 to-cyan-500/35 border border-purple-400/45 shadow-[0_0_20px_rgba(168,85,247,0.35)] font-display font-bold text-sm sm:text-base tracking-tight text-white shrink-0">
              MK
            </span>
            <span className="flex flex-col text-left">
              <span className="font-display font-bold text-xs sm:text-sm text-white leading-tight">
                Mohit Kushwah
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight">
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
                    className={`relative inline-flex items-center min-h-[44px] px-3.5 py-2 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                        : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right Controls: Desktop Resume Popover + Mobile Hamburger */}
          <div className="flex items-center gap-2" ref={popoverRef}>
            {/* Desktop Resume Dropdown */}
            <div className="hidden lg:block relative">
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
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600/35 to-cyan-500/35 hover:from-purple-600/50 hover:to-cyan-500/50 border border-cyan-400/40 shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-[0.97]"
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

              {/* Desktop Glass Resume Popover */}
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
                    className="absolute right-0 mt-3 w-[320px] p-3.5 rounded-2xl bg-[#0b0d1f]/95 border border-white/15 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] z-50"
                  >
                    <div className="flex flex-col gap-2.5">
                      {siteConfig.resumes.map((resume) => (
                        <SingleResumeAction
                          key={resume.id}
                          resume={resume}
                          compact
                          fullWidthMobile={false}
                          onActionComplete={() => setResumePopoverOpen(false)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Animated Hamburger Button (Mobile/Tablet, 44x44px tap target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-fullscreen-menu"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.06] border border-white/15 text-white hover:border-cyan-400/40 active:scale-[0.95] transition-all touch-manipulation"
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
      </header>

      {/* Fullscreen Mobile Glass Menu (locks body scroll, closes on link tap / outside tap / Esc) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              paddingTop: 'calc(4.75rem + env(safe-area-inset-top, 0px))',
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
              paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
              paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
            }}
            className="lg:hidden fixed inset-0 z-30 bg-[#06060e]/92 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-auto flex flex-col gap-2 my-auto"
            >
              <ul className="flex flex-col gap-2">
                {siteConfig.navLinks.map((link, idx) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ delay: idx * 0.035, duration: 0.22 }}
                    >
                      <a
                        href={`#${link.id}`}
                        onClick={(e) => handleNavClick(e, link.id)}
                        className={`flex items-center justify-between min-h-[48px] px-4 py-3 rounded-2xl text-base font-display font-semibold transition-all active:scale-[0.98] ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-500/25 to-cyan-500/20 text-white border border-purple-400/40 shadow-[0_0_24px_-6px_rgba(168,85,247,0.45)]'
                            : 'bg-white/[0.03] text-zinc-200 border border-white/8 hover:bg-white/[0.07] hover:text-white'
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

              {/* "Resume" inside mobile menu opens the BOTTOM SHEET */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: siteConfig.navLinks.length * 0.035 + 0.04 }}
                className="pt-2"
              >
                <button
                  type="button"
                  onClick={() => setMobileResumeSheetOpen(true)}
                  className="w-full min-h-[50px] px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600/35 via-indigo-600/30 to-cyan-500/35 border border-cyan-400/45 text-white font-display font-semibold text-base flex items-center justify-between shadow-[0_0_28px_-6px_rgba(34,211,238,0.5)] active:scale-[0.98] transition-transform"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <FiFileText className="w-5 h-5 text-cyan-300" aria-hidden="true" />
                    <span>Resume (Data Science / Python)</span>
                  </span>
                  <FiChevronDown className="w-5 h-5 text-cyan-200" aria-hidden="true" />
                </button>
              </motion.div>
            </div>

            <p className="text-center text-xs text-zinc-400 pt-4">
              Tap anywhere outside or press Esc to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Resume Bottom Sheet (Swipe down or tap outside to close) */}
      <AnimatePresence>
        {mobileResumeSheetOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Choose a Resume to Download or View"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileResumeSheetOpen(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 70 || info.velocity.y > 400) {
                  setMobileResumeSheetOpen(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
              }}
              className="w-full max-w-lg rounded-t-3xl bg-[#0b0d1f] border-t border-white/15 px-5 pt-3 shadow-[0_-20px_60px_rgba(0,0,0,0.9)]"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Select Role Resume
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Download PDF directly or open in a new tab
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileResumeSheetOpen(false)}
                  aria-label="Close resume sheet"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.06] border border-white/12 text-zinc-300 hover:text-white active:scale-95"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {siteConfig.resumes.map((resume) => (
                  <SingleResumeAction
                    key={resume.id}
                    resume={resume}
                    fullWidthMobile
                    onActionComplete={() => {
                      setMobileResumeSheetOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
