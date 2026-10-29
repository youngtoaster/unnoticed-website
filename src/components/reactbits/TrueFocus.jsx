import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TrueFocus({
  items = [],
  activeIndex = 0,
  onItemClick,
  borderColor = '#a855f7',
  glowColor = 'rgba(168, 85, 247, 0.4)',
  className = ''
}) {
  const containerRef = useRef(null);
  const [focusRect, setFocusRect] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector(`[data-index="${activeIndex}"]`);
    if (activeEl) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setFocusRect({
        top: elRect.top - containerRect.top,
        left: elRect.left - containerRect.left,
        width: elRect.width,
        height: elRect.height,
      });
    }
  }, [activeIndex, items]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Dynamic Animated Focus Frame */}
      {focusRect && (
        <motion.div
          layoutId="trueFocusFrame"
          className="pointer-events-none absolute rounded-xl border border-purple-400 z-10"
          initial={false}
          animate={{
            top: focusRect.top - 2,
            left: focusRect.left - 4,
            width: focusRect.width + 8,
            height: focusRect.height + 4,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            borderColor,
            boxShadow: `0 0 16px ${glowColor}, inset 0 0 8px ${glowColor}`,
          }}
        >
          {/* Corner brackets */}
          <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-white" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-white" />
          <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-white" />
          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-white" />
        </motion.div>
      )}

      {/* Items list */}
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            data-index={idx}
            onClick={() => onItemClick && onItemClick(idx)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
              idx === activeIndex
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
