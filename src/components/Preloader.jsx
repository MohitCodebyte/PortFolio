import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { sceneState } from '../three/hooks/useSceneStore';

export default function Preloader({ prefersReducedMotion = false }) {
  const { active, progress: dreiProgress } = useProgress();
  const [syntheticProgress, setSyntheticProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      sceneState.preloaderDone = true;
      setDismissed(true);
      return;
    }

    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 300);

    const startTime = performance.now();
    const duration = 680; // Fast, cinematic ramp that never delays LCP or blocks interaction

    let rafId;
    const tick = (now) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - ratio, 3);
      const nextVal = Math.round(eased * 100);
      setSyntheticProgress(nextVal);

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        sceneState.preloaderDone = true;
        setDismissed(true);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(skipTimer);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  const effectiveProgress = active
    ? Math.max(syntheticProgress, Math.round(dreiProgress))
    : syntheticProgress;

  const handleSkip = () => {
    sceneState.preloaderDone = true;
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06060e] px-6 text-center select-none"
          role="status"
          aria-live="polite"
          aria-label="Loading Mohit Kushwah 3D Portfolio"
        >
          {/* Ambient background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_55%)]"
          />

          {/* Rotating 3D Wireframe / Neural Polyhedron SVG Emblem */}
          <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-purple-500/40 border-t-cyan-400 shadow-[0_0_30px_rgba(168,85,247,0.35)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-3 rounded-full border border-cyan-400/35 border-b-purple-400"
            />
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                MK
              </span>
              <span className="font-mono-tabular text-xs text-cyan-300 mt-0.5">
                {effectiveProgress}%
              </span>
            </div>
          </div>

          {/* Name & Role Reveal */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            Mohit Kushwah
          </motion.p>
          <p className="mt-1.5 text-xs sm:text-sm uppercase tracking-[0.22em] text-zinc-400">
            Data Scientist &amp; Python Developer
          </p>

          {/* Progress Bar */}
          <div className="mt-6 w-56 sm:w-64 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              style={{ width: `${effectiveProgress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-100"
            />
          </div>

          {/* Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className={`mt-7 px-4 py-1.5 rounded-full text-xs font-medium border border-white/15 text-zinc-300 hover:text-white hover:border-cyan-400/50 transition-all ${
              canSkip ? 'opacity-100' : 'opacity-70'
            }`}
          >
            Skip Intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

