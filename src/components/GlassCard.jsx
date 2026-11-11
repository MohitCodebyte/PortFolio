import React, { useRef, useEffect } from 'react';
import VanillaTilt from 'vanilla-tilt';

export default function GlassCard({
  children,
  className = '',
  innerClassName = '',
  tilt = true,
  maxTilt = 6,
  glow = 'purple', // 'purple' | 'cyan' | 'none'
  as: Component = 'div',
  ...rest
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !tilt) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) return;

    VanillaTilt.init(el, {
      max: maxTilt,
      speed: 450,
      glare: true,
      'max-glare': 0.12,
      scale: 1.01,
      perspective: 1100,
    });

    return () => {
      if (el.vanillaTilt) {
        el.vanillaTilt.destroy();
      }
    };
  }, [tilt, maxTilt]);

  const glowClasses =
    glow === 'cyan'
      ? 'hover:border-cyan-400/35 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.18)]'
      : glow === 'purple'
      ? 'hover:border-purple-400/35 hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.18)]'
      : '';

  return (
    <Component
      ref={cardRef}
      className={`double-bezel-shell preserve-3d ${glowClasses} ${className}`}
      {...rest}
    >
      <div className={`double-bezel-core h-full w-full ${innerClassName}`}>
        {children}
      </div>
    </Component>
  );
}

