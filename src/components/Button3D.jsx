import React, { useState, useRef } from 'react';
import { triggerClickBurst } from '../three/hooks/useSceneStore';

const VARIANT_MAP = {
  primary:
    'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white border border-white/20 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.65)] hover:shadow-[0_14px_38px_-8px_rgba(34,211,238,0.65)]',
  purple:
    'bg-purple-600/20 hover:bg-purple-600/30 text-purple-100 border border-purple-400/45 shadow-[0_0_25px_-5px_rgba(168,85,247,0.45)] hover:shadow-[0_0_32px_-2px_rgba(168,85,247,0.7)]',
  cyan:
    'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-400/45 shadow-[0_0_25px_-5px_rgba(34,211,238,0.45)] hover:shadow-[0_0_32px_-2px_rgba(34,211,238,0.7)]',
  glass:
    'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-100 border border-white/15 hover:border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
};

export default function Button3D({
  children,
  variant = 'primary',
  href,
  download,
  target,
  rel,
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  trailingIcon: TrailingIcon,
  burstColor = '#22d3ee',
  type = 'button',
  ariaLabel,
  ...rest
}) {
  const [ripples, setRipples] = useState([]);
  const [tiltStyle, setTiltStyle] = useState({});
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (disabled || !btnRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = (-y / (rect.height / 2)) * 6;
    const rotY = (x / (rect.width / 2)) * 6;
    setTiltStyle({
      transform: `perspective(600px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(
        1
      )}deg) translateY(-2px) translateZ(6px)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({});
  };

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
      const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    if (e.clientX && e.clientY) {
      triggerClickBurst(
        e.clientX,
        e.clientY,
        variant === 'purple' ? '#a855f7' : burstColor
      );
    }

    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = `group relative inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold tracking-tight overflow-hidden select-none transition-all duration-200 ease-out active:scale-[0.97] disabled:opacity-45 disabled:pointer-events-none ${
    VARIANT_MAP[variant] || VARIANT_MAP.primary
  } ${className}`;

  const content = (
    <>
      {/* Ripple Layer */}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute w-10 h-10 rounded-full bg-white/30 animate-ripple"
          aria-hidden="true"
        />
      ))}
      {Icon && (
        <Icon
          className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10">{children}</span>
      {TrailingIcon && (
        <span className="relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <TrailingIcon className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        ref={btnRef}
        href={href}
        download={download}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={baseClasses}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={baseClasses}
      {...rest}
    >
      {content}
    </button>
  );
}

