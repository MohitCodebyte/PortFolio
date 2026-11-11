import React, { useState, useId } from 'react';

export default function Tooltip({ content, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  const posClasses =
    position === 'bottom'
      ? 'top-full mt-2 left-1/2 -translate-x-1/2'
      : 'bottom-full mb-2 left-1/2 -translate-x-1/2';

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            'aria-describedby': visible ? tooltipId : undefined,
          })
        : children}
      {visible && content && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-zinc-900/95 border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-100 shadow-xl backdrop-blur-md transition-opacity duration-150 ${posClasses}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}

