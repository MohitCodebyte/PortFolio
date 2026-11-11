import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneState, setActiveSection } from './useSceneStore';
import { siteConfig } from '../../data/site';

gsap.registerPlugin(ScrollTrigger);

const SECTION_ORDER = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];

export function useSmoothScroll(prefersReducedMotion) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const updateScrollTelemetry = (scrollY, velocity = 0) => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      sceneState.scrollProgress = progress;
      sceneState.scrollVelocity = velocity;

      // Determine active section and interpolate camera waypoints
      const viewportMiddle = scrollY + window.innerHeight * 0.38;
      let currentId = 'home';

      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (viewportMiddle >= top) {
            currentId = id;
          }
        }
      }

      setActiveSection(currentId);
      const wp = siteConfig.cameraWaypoints[currentId] || siteConfig.cameraWaypoints.home;
      sceneState.targetWaypoint = wp;
    };

    const handlePointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneState.pointer.x = nx;
      sceneState.pointer.y = ny;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    if (prefersReducedMotion) {
      const onNativeScroll = () => {
        updateScrollTelemetry(window.scrollY, 0);
      };
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      onNativeScroll();
      return () => {
        window.removeEventListener('scroll', onNativeScroll);
        window.removeEventListener('pointermove', handlePointerMove);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      updateScrollTelemetry(e.scroll, e.velocity || 0);
    });

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Initial calculation
    updateScrollTelemetry(window.scrollY, 0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [prefersReducedMotion]);

  const scrollToSection = useCallback((sectionId) => {
    const cleanId = sectionId.replace(/^#/, '');
    const targetEl = document.getElementById(cleanId);
    if (!targetEl) return;

    // Immediately set waypoint & active section for responsive 3D feedback
    if (siteConfig.cameraWaypoints[cleanId]) {
      sceneState.targetWaypoint = siteConfig.cameraWaypoints[cleanId];
      setActiveSection(cleanId);
    }

    const navOffset = cleanId === 'home' ? 0 : -80;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(cleanId === 'home' ? 0 : targetEl, {
        offset: navOffset,
        duration: 1.25,
      });
    } else {
      const top =
        cleanId === 'home'
          ? 0
          : targetEl.getBoundingClientRect().top + window.scrollY + navOffset;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [prefersReducedMotion]);

  return { scrollToSection };
}

