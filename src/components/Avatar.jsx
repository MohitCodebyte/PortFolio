import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Avatar({ prefersReducedMotion = false }) {
  const svgRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  // Cursor-tracking pupils
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePointerMove = (e) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.42;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy) || 1;
      const maxShift = 3.2;
      const factor = Math.min(1, dist / 240);
      setPupilOffset({
        x: (dx / dist) * maxShift * factor,
        y: (dy / dist) * (maxShift * 0.75) * factor,
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [prefersReducedMotion]);

  // Periodic natural eye blink
  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId;
    const scheduleBlink = () => {
      const nextDelay = 2800 + Math.random() * 2400;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, nextDelay);
    };

    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, [prefersReducedMotion]);

  const triggerWave = () => {
    if (prefersReducedMotion) return;
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1400);
  };

  return (
    <div
      onMouseEnter={() => !prefersReducedMotion && setIsWaving(true)}
      onMouseLeave={() => setIsWaving(false)}
      onClick={triggerWave}
      role="img"
      aria-label="Animated developer avatar of Mohit Kushwah wearing glasses and a purple-cyan hoodie, working on a laptop"
      className="relative w-full h-full flex items-center justify-center bg-[#070816] overflow-hidden cursor-pointer select-none"
    >
      {/* Ambient Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,0.28),rgba(34,211,238,0.12)_55%,transparent_80%)]"
      />

      <svg
        ref={svgRef}
        viewBox="0 0 240 240"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hoodieGrad" x1="40" y1="130" x2="200" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="55%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="rimCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="laptopBody" x1="65" y1="168" x2="175" y2="225" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="screenGlow" cx="50%" cy="65%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.48" />
            <stop offset="60%" stopColor="#a855f7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#06060e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Laptop Screen Upward Glow on Character */}
        <motion.ellipse
          cx="120"
          cy="165"
          rx="72"
          ry="48"
          fill="url(#screenGlow)"
          animate={
            prefersReducedMotion
              ? {}
              : { opacity: [0.65, 1, 0.65], scale: [0.98, 1.04, 0.98] }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Breathing / Floating Character Group */}
        <motion.g
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, -3.5, 0] }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Hoodie Back Hood */}
          <path
            d="M72 136 C68 116, 172 116, 168 136 Z"
            fill="#3b0764"
            stroke="#a855f7"
            strokeWidth="1.5"
          />

          {/* Torso / Purple-Cyan Tech Hoodie */}
          <path
            d="M54 222 C56 164, 78 142, 120 142 C162 142, 184 164, 186 222 Z"
            fill="url(#hoodieGrad)"
            stroke="url(#rimCyan)"
            strokeWidth="2"
          />

          {/* Hoodie V-Neck & Cyan Neon Seams */}
          <path
            d="M102 142 L120 166 L138 142"
            fill="#0f172a"
            stroke="#22d3ee"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hoodie Drawstrings */}
          <path
            d="M108 152 Q106 172 109 182"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M132 152 Q134 172 131 182"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Neck */}
          <rect x="108" y="122" width="24" height="24" rx="10" fill="#e0a98b" />
          <path d="M108 132 Q120 140 132 132" fill="#c98d6d" opacity="0.5" />

          {/* Ears */}
          <circle cx="80" cy="96" r="8" fill="#e0a98b" />
          <circle cx="160" cy="96" r="8" fill="#e0a98b" />

          {/* Head */}
          <rect
            x="82"
            y="54"
            width="76"
            height="76"
            rx="34"
            fill="#edb89a"
            stroke="#a855f7"
            strokeWidth="1.2"
            strokeOpacity="0.35"
          />

          {/* Eyebrows */}
          <path
            d="M95 81 Q104 77 112 80"
            stroke="#1e1b2e"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M128 80 Q136 77 145 81"
            stroke="#1e1b2e"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Eyes (Whites + Cursor-Tracking Pupils + Blink Eyelids) */}
          {isBlinking ? (
            <>
              <path
                d="M96 93 Q104 96 112 93"
                stroke="#1e1b2e"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <path
                d="M128 93 Q136 96 144 93"
                stroke="#1e1b2e"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse cx="104" cy="93" rx="7.5" ry="6.5" fill="#ffffff" />
              <g
                transform={`translate(${pupilOffset.x.toFixed(2)}, ${pupilOffset.y.toFixed(2)})`}
              >
                <circle cx="104" cy="93" r="4" fill="#1e1b4b" />
                <circle cx="105.5" cy="91.5" r="1.4" fill="#22d3ee" />
              </g>

              {/* Right Eye */}
              <ellipse cx="136" cy="93" rx="7.5" ry="6.5" fill="#ffffff" />
              <g
                transform={`translate(${pupilOffset.x.toFixed(2)}, ${pupilOffset.y.toFixed(2)})`}
              >
                <circle cx="136" cy="93" r="4" fill="#1e1b4b" />
                <circle cx="137.5" cy="91.5" r="1.4" fill="#22d3ee" />
              </g>
            </>
          )}

          {/* Developer Glasses (Cyan / Purple Neon Rim) */}
          <rect
            x="91"
            y="83"
            width="26"
            height="20"
            rx="6"
            fill="rgba(34, 211, 238, 0.08)"
            stroke="#22d3ee"
            strokeWidth="2.2"
          />
          <rect
            x="123"
            y="83"
            width="26"
            height="20"
            rx="6"
            fill="rgba(34, 211, 238, 0.08)"
            stroke="#22d3ee"
            strokeWidth="2.2"
          />
          {/* Glasses Bridge & Temples */}
          <path d="M117 91 H123" stroke="#a855f7" strokeWidth="2.2" />
          <path d="M82 91 H91" stroke="#22d3ee" strokeWidth="2" />
          <path d="M149 91 H158" stroke="#22d3ee" strokeWidth="2" />
          {/* Subtle Lens Glint */}
          <path d="M95 86 L99 90" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          <path d="M127 86 L131 90" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />

          {/* Nose & Confident Friendly Smile */}
          <path
            d="M120 96 L118 104 L122 105"
            stroke="#c68665"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M111 113 Q120 120 129 113"
            stroke="#7c2d12"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Styled Dark Hair with Neon Rim Highlight */}
          <path
            d="M79 84 C77 56, 98 40, 122 42 C148 40, 164 56, 161 84 C157 68, 146 62, 134 64 C122 66, 111 59, 98 64 C88 67, 83 74, 79 84 Z"
            fill="#131124"
          />
          <path
            d="M84 62 Q105 45 136 48"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M122 44 Q146 46 156 64"
            stroke="#22d3ee"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Waving / Thumbs-Up Hand on Hover or Click */}
          <motion.g
            style={{ originX: '185px', originY: '175px' }}
            animate={
              isWaving && !prefersReducedMotion
                ? {
                    rotate: [0, -18, 14, -16, 10, 0],
                    y: [-6, -12, -12, -12, -6, 0],
                  }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          >
            {/* Right Arm Sleeve */}
            <path
              d="M174 176 Q194 162 198 144"
              stroke="#6d28d9"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Hand + Thumbs-up / Wave */}
            <circle cx="200" cy="136" r="9.5" fill="#edb89a" stroke="#22d3ee" strokeWidth="1.2" />
            <path
              d="M194 134 L191 124"
              stroke="#edb89a"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>

        {/* Desk & Glowing Laptop Foreground */}
        <g>
          {/* Laptop Lid */}
          <rect
            x="74"
            y="168"
            width="92"
            height="50"
            rx="7"
            fill="url(#laptopBody)"
            stroke="url(#rimCyan)"
            strokeWidth="2"
          />
          {/* Glowing Python / Neural Emblem on Laptop Lid */}
          <circle
            cx="120"
            cy="193"
            r="9"
            fill="#090d1f"
            stroke="#22d3ee"
            strokeWidth="1.8"
          />
          <motion.circle
            cx="120"
            cy="193"
            r="4"
            fill="#a855f7"
            animate={
              prefersReducedMotion
                ? {}
                : { opacity: [0.5, 1, 0.5], r: [3.5, 5, 3.5] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Desk Surface Line */}
          <rect x="36" y="218" width="168" height="6" rx="3" fill="#1e1b4b" />
          <line x1="46" y1="218" x2="194" y2="218" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

