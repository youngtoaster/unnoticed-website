'use client';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * NeonSign - Inspired by Planes Component Library (useplanes.com/components/neon-sign)
 * 
 * Any word as glass neon tubing. Each letter strikes on with its own stutter as
 * the sign scrolls into view, the bloom spills onto the wall behind it, and now
 * and then a tired tube browns out. Real, selectable text underneath.
 *
 * Props:
 * - children: string (the text on the sign, split into letters so each tube strikes on its own)
 * - as: "h1" | "h2" | "h3" | "h4" | "div" | "span" | "p" (default: "h2")
 * - color: string (default: "#ff3ea5") Gas color driving the glow, wall wash, and unlit tint
 * - delay: number (default: 0.3) Seconds after viewport entry before first tube strikes
 * - flicker: boolean (default: true) Random brown-outs on tubes over time
 * - className: string (Tailwind classes for font, size, tracking, weight)
 */
export function NeonSign({
  children,
  as = 'h2',
  color = '#a855f7',
  delay = 0.3,
  flicker = true,
  className = '',
  ...props
}) {
  const Component = as;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  const text = typeof children === 'string' ? children : String(children || '');
  const characters = useMemo(() => text.split(''), [text]);

  // Track ignited status for each character index
  const [ignitedIndices, setIgnitedIndices] = useState(() =>
    shouldReduceMotion ? characters.map((_, i) => i) : []
  );

  // Track which letter tube is currently brown-outed
  const [brownoutIndex, setBrownoutIndex] = useState(null);

  // Ignition sequence: each letter strikes with an electrical stutter
  useEffect(() => {
    if (shouldReduceMotion || !isInView) return;

    const timeouts = [];
    characters.forEach((char, index) => {
      if (char === ' ') return;
      // Stagger with realistic randomized micro-variance
      const strikeDelay = (delay * 1000) + (index * 85) + (Math.random() * 40);

      const t = setTimeout(() => {
        setIgnitedIndices((prev) => [...new Set([...prev, index])]);
      }, strikeDelay);

      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView, characters, delay, shouldReduceMotion]);

  // Occasional random tube brown-out / flicker after ignition
  useEffect(() => {
    if (!flicker || shouldReduceMotion || !isInView) return;

    let brownoutTimeout;
    const interval = setInterval(() => {
      // Pick a random non-space character to brown out momentarily
      const validIndices = characters
        .map((c, i) => (c !== ' ' ? i : null))
        .filter((i) => i !== null);

      if (validIndices.length === 0) return;
      const targetIndex = validIndices[Math.floor(Math.random() * validIndices.length)];

      setBrownoutIndex(targetIndex);

      // Restore after a brief flicker
      brownoutTimeout = setTimeout(() => {
        setBrownoutIndex(null);
      }, 200 + Math.random() * 250);
    }, 4500 + Math.random() * 3000);

    return () => {
      clearInterval(interval);
      if (brownoutTimeout) clearTimeout(brownoutTimeout);
    };
  }, [flicker, characters, isInView, shouldReduceMotion]);

  // Calculate neon shadows based on gas color
  const litShadow = useMemo(() => {
    return [
      `0 0 4px #ffffff`,
      `0 0 10px #ffffff`,
      `0 0 20px ${color}`,
      `0 0 40px ${color}`,
      `0 0 80px ${color}`,
      `0 0 120px ${color}`
    ].join(', ');
  }, [color]);

  const brownoutShadow = useMemo(() => {
    return [
      `0 0 2px rgba(255, 255, 255, 0.4)`,
      `0 0 8px ${color}66`,
      `0 0 16px ${color}33`
    ].join(', ');
  }, [color]);

  const unlitShadow = useMemo(() => {
    return `0 0 2px ${color}20`;
  }, [color]);

  return (
    <Component
      ref={containerRef}
      className={`relative inline-flex items-center justify-center flex-wrap select-none ${className}`}
      {...props}
    >
      {/* Diffuse Wall Wash Bloom behind the tubing */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ease-out"
        style={{
          opacity: ignitedIndices.length > 0 ? 0.45 : 0,
          background: `radial-gradient(ellipse at center, ${color}40 0%, ${color}15 45%, transparent 75%)`,
          filter: 'blur(36px)',
          transform: 'scale(1.35)'
        }}
      />

      {/* Render each tube letter */}
      {characters.map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="inline-block w-[0.28em]">
              &nbsp;
            </span>
          );
        }

        const isIgnited = shouldReduceMotion || ignitedIndices.includes(index);
        const isBrownout = brownoutIndex === index;

        // Determine current glow state
        let currentShadow = unlitShadow;
        let textColor = `${color}25`;
        let textOpacity = 0.3;

        if (isIgnited) {
          if (isBrownout) {
            currentShadow = brownoutShadow;
            textColor = '#ffffff';
            textOpacity = 0.55;
          } else {
            currentShadow = litShadow;
            textColor = '#ffffff';
            textOpacity = 1;
          }
        }

        return (
          <motion.span
            key={index}
            className="inline-block relative transition-[text-shadow,color,opacity] duration-150"
            initial={shouldReduceMotion ? false : { opacity: 0.18, scale: 0.98 }}
            animate={
              isIgnited
                ? {
                    opacity: textOpacity,
                    scale: 1,
                    transition: { duration: 0.1 }
                  }
                : { opacity: 0.22, scale: 0.98 }
            }
            style={{
              color: textColor,
              textShadow: currentShadow,
              WebkitTextStroke: isIgnited ? `0.5px ${color}` : `1px ${color}33`,
              paintOrder: 'stroke fill'
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </Component>
  );
}

export default NeonSign;
