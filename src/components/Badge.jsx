import React from 'react';

const VARIANT_STYLES = {
  purple:
    'bg-purple-500/12 text-purple-200 border-purple-400/30 shadow-[inset_0_1px_0_rgba(168,85,247,0.2)]',
  cyan:
    'bg-cyan-500/12 text-cyan-200 border-cyan-400/30 shadow-[inset_0_1px_0_rgba(34,211,238,0.2)]',
  blue:
    'bg-indigo-500/12 text-indigo-200 border-indigo-400/30 shadow-[inset_0_1px_0_rgba(99,102,241,0.2)]',
  neutral:
    'bg-white/[0.04] text-zinc-300 border-white/10 hover:border-white/20 hover:text-white',
  core:
    'bg-emerald-500/12 text-emerald-200 border-emerald-400/30',
  working:
    'bg-sky-500/12 text-sky-200 border-sky-400/25',
};

export default function Badge({
  children,
  variant = 'neutral',
  icon: Icon,
  className = '',
}) {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${style} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

