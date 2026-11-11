import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneState, setActiveSection } from './useSceneStore';
import { siteConfig } from '../../data/site';

gsap.registerPlugin(ScrollTrigger);

const SECTION_ORDER = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];

export function useSmoothScroll({ prefersReducedMotion, isTouch, isMobile }) {
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

      const viewportMiddle = scrollY + window.innerHeight * 0.4;
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

      // Check if user has scrolled into the footer region for the final 3D camera waypoint
      const footerEl = document.getElementById('footer');
      const isAtFooter =
        progress > 0.94 ||
        (footerEl && scrollY + window.innerHeight * 0.72 >= footerEl.offsetTop);

      const waypointKey = isAtFooter ? 'footer' : currentId;
      const wp =
        siteConfig.cameraWaypoints[waypointKey] || siteConfig.cameraWaypoints.home;
      sceneState.targetWaypoint = wp;
    };

    const handlePointerMove = (e) => {
      if (isTouch) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneState.pointer.x = nx;
      sceneState.pointer.y = ny;
    };

    if (!isTouch) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    // Disable Lenis smooth-scroll hijacking on touch / mobile or when reduced motion is preferred
    if (prefersReducedMotion || isTouch || isMobile) {
      let lastY = window.scrollY;
      let ticking = false;

      const onNativeScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentY = window.scrollY;
            const velocity = (currentY - lastY) * 0.15;
            lastY = currentY;
            updateScrollTelemetry(currentY, velocity);
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onNativeScroll, { passive: true });
      updateScrollTelemetry(window.scrollY, 0);

      return () => {
        window.removeEventListener('scroll', onNativeScroll);
        window.removeEventListener('pointermove', handlePointerMove);
      };
    }

    // Desktop Fine-Pointer Smooth Scroll via Lenis
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
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

    updateScrollTelemetry(window.scrollY, 0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [prefersReducedMotion, isTouch, isMobile]);

  const scrollToSection = useCallback(
    (sectionId) => {
      const cleanId = sectionId.replace(/^#/, '');
      const targetEl = document.getElementById(cleanId);
      if (!targetEl && cleanId !== 'home') return;

      if (siteConfig.cameraWaypoints[cleanId]) {
        sceneState.targetWaypoint = siteConfig.cameraWaypoints[cleanId];
        setActiveSection(cleanId);
      }

      const navOffset = cleanId === 'home' ? 0 : -72;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(cleanId === 'home' ? 0 : targetEl, {
          offset: navOffset,
          duration: 1.15,
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
    },
    [prefersReducedMotion]
  );

  return { scrollToSection };
}
