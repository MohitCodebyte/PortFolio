import React, { useEffect, useRef } from 'react';

export default function Cursor3D({ enabled = true }) {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) return;

    document.body.classList.add('custom-cursor-enabled');

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const mouse = { x: width / 2, y: height / 2 };
    const ring = { x: width / 2, y: height / 2, scale: 1 };
    let isHoveringInteractive = false;
    let isPressed = false;
    let magneticTarget = null;

    const trail = [];
    const bursts = [];
    const shockwaves = [];

    const spawnBurst = (x, y, color = '#22d3ee') => {
      shockwaves.push({
        x,
        y,
        radius: 6,
        maxRadius: 58,
        alpha: 0.9,
        color,
      });

      const count = 22;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 2.2 + Math.random() * 5.2;
        bursts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 2.8,
          alpha: 1,
          color: i % 2 === 0 ? color : '#a855f7',
        });
      }
    };

    const onPointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Trail particle
      trail.push({
        x: mouse.x,
        y: mouse.y,
        size: isHoveringInteractive ? 4.2 : 2.8,
        alpha: 0.55,
      });
      if (trail.length > 18) trail.shift();

      const targetEl = e.target?.closest?.(
        'a, button, [role="button"], input, textarea, select, [data-cursor-interactive]'
      );
      isHoveringInteractive = Boolean(targetEl);
      magneticTarget = targetEl || null;
    };

    const onPointerDown = (e) => {
      isPressed = true;
      spawnBurst(e.clientX, e.clientY, isHoveringInteractive ? '#a855f7' : '#22d3ee');
    };

    const onPointerUp = () => {
      isPressed = false;
    };

    const onCustomBurst = (e) => {
      if (e.detail && typeof e.detail.x === 'number') {
        spawnBurst(e.detail.x, e.detail.y, e.detail.color || '#22d3ee');
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('portfolio:click-burst', onCustomBurst);

    let rafId;
    const render = () => {
      let targetX = mouse.x;
      let targetY = mouse.y;

      // Subtle magnetic pull toward interactive buttons/links
      if (magneticTarget && document.body.contains(magneticTarget)) {
        const rect = magneticTarget.getBoundingClientRect();
        if (rect.width < 340 && rect.height < 120) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          targetX += (centerX - mouse.x) * 0.22;
          targetY += (centerY - mouse.y) * 0.22;
        }
      }

      ring.x += (targetX - ring.x) * 0.2;
      ring.y += (targetY - ring.y) * 0.2;
      const desiredScale = isPressed ? 0.78 : isHoveringInteractive ? 1.55 : 1;
      ring.scale += (desiredScale - ring.scale) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) scale(${
          isPressed ? 0.75 : isHoveringInteractive ? 1.3 : 1
        })`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ring.scale.toFixed(
          3
        )})`;
        ringRef.current.style.borderColor = isHoveringInteractive
          ? 'rgba(34, 211, 238, 0.85)'
          : 'rgba(168, 85, 247, 0.55)';
      }

      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        // Draw smooth trail
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          p.alpha *= 0.88;
          if (p.alpha < 0.03) {
            trail.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha * 0.55})`;
          ctx.fill();
        }

        // Draw shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];
          sw.radius += (sw.maxRadius - sw.radius) * 0.16;
          sw.alpha *= 0.88;
          if (sw.alpha < 0.03) {
            shockwaves.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.globalAlpha = sw.alpha;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Draw click burst particles
        for (let i = bursts.length - 1; i >= 0; i--) {
          const b = bursts[i];
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.94;
          b.vy *= 0.94;
          b.alpha *= 0.91;
          if (b.alpha < 0.04) {
            bursts.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = b.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('portfolio:click-burst', onCustomBurst);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 hidden md:block"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Outer Magnetic Glow Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-purple-400/60 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-colors duration-150 will-change-transform"
      />
      {/* Inner 3D Glowing Sphere */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-gradient-to-br from-cyan-300 via-purple-400 to-indigo-500 shadow-[0_0_14px_rgba(34,211,238,0.95)] will-change-transform"
      />
    </div>
  );
}

