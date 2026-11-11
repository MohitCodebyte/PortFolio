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

function detectLowEndDevice() {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return cores <= 4 || memory <= 4;
}

export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        webglSupported: true,
        isMobile: false,
        isTablet: false,
        isTouch: false,
        isLite3D: false,
        prefersReducedMotion: false,
        dpr: 1,
      };
    }
    const width = window.innerWidth;
    const isMobileViewport = width < 768;
    const isTabletViewport = width >= 768 && width <= 1024;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const webglSupported = detectWebGLSupport();
    const isLowEnd = detectLowEndDevice();
    const isLite3D = isMobileViewport || isCoarsePointer || isLowEnd;
    const rawDpr = window.devicePixelRatio || 1;

    return {
      webglSupported,
      isMobile: isMobileViewport,
      isTablet: isTabletViewport,
      isTouch: isCoarsePointer,
      isLite3D,
      prefersReducedMotion,
      dpr: isLite3D ? Math.min(rawDpr, 1.2) : Math.min(rawDpr, 1.5),
    };
  });

  useEffect(() => {
    const pointerMq = window.matchMedia('(pointer: coarse)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isLowEnd = detectLowEndDevice();

    const update = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width <= 1024;
      const isTouch = pointerMq.matches;
      const prefersReducedMotion = motionMq.matches;
      const isLite3D = isMobile || isTouch || isLowEnd;
      const rawDpr = window.devicePixelRatio || 1;

      setCapabilities((prev) => ({
        ...prev,
        isMobile,
        isTablet,
        isTouch,
        isLite3D,
        prefersReducedMotion,
        dpr: isLite3D ? Math.min(rawDpr, 1.2) : Math.min(rawDpr, 1.5),
      }));
    };

    pointerMq.addEventListener('change', update);
    motionMq.addEventListener('change', update);
    window.addEventListener('resize', update, { passive: true });

    return () => {
      pointerMq.removeEventListener('change', update);
      motionMq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return capabilities;
}
