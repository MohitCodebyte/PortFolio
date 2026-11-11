import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({
  title,
  highlight,
  subtitle,
  align = 'left',
  accent = 'purple',
  id,
  className = 'mb-10 md:mb-12',
}) {
  const alignClasses =
    align === 'center'
      ? 'items-center text-center mx-auto'
      : 'items-start text-left';

  const gradientColors =
    accent === 'cyan'
      ? 'from-cyan-300 via-sky-300 to-purple-400'
      : 'from-purple-300 via-indigo-300 to-cyan-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col max-w-2xl ${alignClasses} ${className}`}
    >
      <h2
        id={id}
        className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.12]"
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span
              className={`bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent`}
            >
              {highlight}
            </span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-sm sm:text-base text-zinc-300 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
