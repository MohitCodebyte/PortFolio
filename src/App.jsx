import React, { Suspense, lazy } from 'react';
import { useDeviceCapabilities } from './three/hooks/useDeviceCapabilities';
import { useSmoothScroll } from './three/hooks/useSmoothScroll';
import Preloader from './components/Preloader';
import Cursor3D from './components/Cursor3D';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Education from './sections/Education';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

const GlobalCanvas = lazy(() => import('./three/scenes/GlobalCanvas'));

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.18),transparent_55%),#06060e]"
        />
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const capabilities = useDeviceCapabilities();
  const { scrollToSection } = useSmoothScroll(capabilities);

  return (
    <div className="relative min-h-[100dvh] max-w-full overflow-x-clip bg-[#06060e] text-zinc-100 selection:bg-purple-500/30 selection:text-cyan-200">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-cyan-500 focus:text-slate-950 focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Cinematic 3D Preloader */}
      <Preloader prefersReducedMotion={capabilities.prefersReducedMotion} />

      {/* Custom 3D Desktop Cursor + Particle Burst Canvas (Disabled on touch devices) */}
      <Cursor3D enabled={!capabilities.isTouch && !capabilities.prefersReducedMotion} />

      {/* Persistent Fixed 3D WebGL Canvas Behind All Sections */}
      <CanvasErrorBoundary>
        <Suspense
          fallback={
            <div
              aria-hidden="true"
              className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.2),transparent_55%),#06060e]"
            />
          }
        >
          <GlobalCanvas capabilities={capabilities} />
        </Suspense>
      </CanvasErrorBoundary>

      {/* Sticky Glassmorphism Navbar */}
      <Navbar onNavigate={scrollToSection} />

      {/* Foreground HTML Sections Synced with 3D Camera Depth */}
      <main id="main-content" className="relative z-10 max-w-full overflow-x-clip">
        <Hero
          onNavigate={scrollToSection}
          prefersReducedMotion={capabilities.prefersReducedMotion}
        />
        <About prefersReducedMotion={capabilities.prefersReducedMotion} />
        <Skills prefersReducedMotion={capabilities.prefersReducedMotion} />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>

      {/* Footer with Back-to-Top 3D Camera Return */}
      <Footer onNavigate={scrollToSection} />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
