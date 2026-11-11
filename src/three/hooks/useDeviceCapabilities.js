import { useState, useEffect } from 'react';

function detectWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        webglSupported: true,
        isMobile: false,
        isTouch: false,
        prefersReducedMotion: false,
        dpr: 1,
      };
    }
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const webglSupported = detectWebGLSupport();
    const rawDpr = window.devicePixelRatio || 1;

    return {
      webglSupported,
      isMobile: isMobileViewport || isCoarsePointer,
      isTouch: isCoarsePointer,
      prefersReducedMotion,
      dpr: isMobileViewport || isCoarsePointer ? Math.min(rawDpr, 1.15) : Math.min(rawDpr, 1.5),
    };
  });

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 768px)');
    const pointerMq = window.matchMedia('(pointer: coarse)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      const isMobile = mobileMq.matches || pointerMq.matches;
      const isTouch = pointerMq.matches;
      const prefersReducedMotion = motionMq.matches;
      const rawDpr = window.devicePixelRatio || 1;
      setCapabilities((prev) => ({
        ...prev,
        isMobile,
        isTouch,
        prefersReducedMotion,
        dpr: isMobile ? Math.min(rawDpr, 1.15) : Math.min(rawDpr, 1.5),
      }));
    };

    mobileMq.addEventListener('change', update);
    pointerMq.addEventListener('change', update);
    motionMq.addEventListener('change', update);
    window.addEventListener('resize', update, { passive: true });

    return () => {
      mobileMq.removeEventListener('change', update);
      pointerMq.removeEventListener('change', update);
      motionMq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return capabilities;
}

