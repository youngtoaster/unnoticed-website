'use client';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * NeonSign - Inspired by Planes Component Library (useplanes.com/components/neon-sign)
 * 
 * Physical glass neon tubing lettering.
 * - On initial page render, cold unlit glass tubes are already physically mounted on the wall.
 * - When ignition kickstarts, letters sputter and spark to life in a RANDOM sequence
 *   across different positions (not sequential left-to-right) until all are brightly illuminated.
 * - Sputter state machine: electrical arc flash -> drop -> rapid strobe -> solid neon ignition.
 * - Ambient wall wash bloom spills behind ignited tubes.
 * - Post-ignition random brown-outs / micro-flickers keep the neon realistic and alive.
 * - Responsive flex-nowrap keeps multi-character words together on mobile viewports.
 */
export function NeonSign({
  children,
  as = 'h2',
  color = '#a855f7',
  delay = 0.2,
  flicker = true,
  className = '',
  canIgnite = true,
  onIgnitionProgress,
  ...props
}) {
  const Component = as;
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();

  const text = typeof children === 'string' ? children : String(children || '');
  const characters = useMemo(() => text.split(''), [text]);

  // Track fully ignited indices
  const [ignitedIndices, setIgnitedIndices] = useState(() =>
    shouldReduceMotion ? characters.map((_, i) => i) : []
  );

  // Track which indices are currently in the mid-spark "sputtering" electrical arc state
  const [sputteringMap, setSputteringMap] = useState({});

  // Track which letter tube is experiencing a tired tube brown-out / voltage dip
  const [brownoutIndex, setBrownoutIndex] = useState(null);

  // Notify parent component of ignition progress (for background illumination reveal)
  useEffect(() => {
    if (typeof onIgnitionProgress === 'function') {
      const validIndices = characters
        .map((c, i) => (c !== ' ' ? i : null))
        .filter((i) => i !== null);
      const totalCount = validIndices.length;
      const count = ignitedIndices.length;
      const progress = totalCount > 0 ? count / totalCount : 0;
      const isFullyLit = count >= totalCount && totalCount > 0;

      onIgnitionProgress({
        ignitedCount: count,
        totalCount,
        progress,
        isFullyLit,
        ignitedIndices
      });
    }
  }, [ignitedIndices, characters, onIgnitionProgress]);

  // Initial Random Ignition Sequence:
  // Randomizes the order of characters and simulates high-voltage transformer sputtering
  useEffect(() => {
    if (!canIgnite) {
      setIgnitedIndices([]);
      setSputteringMap({});
      return;
    }
    if (shouldReduceMotion || !isInView) return;

    // Collect all non-space character indices
    const validIndices = characters
      .map((c, i) => (c !== ' ' ? i : null))
      .filter((i) => i !== null);

    if (validIndices.length === 0) return;

    // Fisher-Yates shuffle to randomize strike order completely across the word
    const randomOrder = [...validIndices];
    for (let i = randomOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomOrder[i], randomOrder[j]] = [randomOrder[j], randomOrder[i]];
    }

    const timeouts = [];
    const baseDelayMs = Math.max(80, delay * 1000);

    // Initial power-transformer kickstart hum: brief sign-wide micro-flash
    const transformerStart = setTimeout(() => {
      // First random tube strikes quickly
    }, baseDelayMs);
    timeouts.push(transformerStart);

    // Schedule each letter's strike in the randomized sequence
    randomOrder.forEach((charIndex, step) => {
      // Stagger each letter by 90ms - 150ms with randomized micro-jitter
      const strikeDelay = baseDelayMs + (step * 115) + (Math.random() * 65);

      // 1. Kick off sputtering electrical arc
      const t1 = setTimeout(() => {
        setSputteringMap((prev) => ({ ...prev, [charIndex]: true }));
      }, strikeDelay);
      timeouts.push(t1);

      // 2. Micro-dip drop during arc
      const t2 = setTimeout(() => {
        setSputteringMap((prev) => ({ ...prev, [charIndex]: 'dip' }));
      }, strikeDelay + 55);
      timeouts.push(t2);

      // 3. Second rapid flash
      const t3 = setTimeout(() => {
        setSputteringMap((prev) => ({ ...prev, [charIndex]: 'flash' }));
      }, strikeDelay + 105);
      timeouts.push(t3);

      // 4. Solid permanent ignition
      const t4 = setTimeout(() => {
        setSputteringMap((prev) => {
          const next = { ...prev };
          delete next[charIndex];
          return next;
        });
        setIgnitedIndices((prev) => (prev.includes(charIndex) ? prev : [...prev, charIndex]));
      }, strikeDelay + 165);
      timeouts.push(t4);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView, characters, delay, shouldReduceMotion, canIgnite]);

  // Occasional random tube brown-out / micro-voltage flicker after ignition
  useEffect(() => {
    if (!flicker || shouldReduceMotion || !isInView || !canIgnite || ignitedIndices.length === 0) return;

    let brownoutTimeout;
    const interval = setInterval(() => {
      const validIndices = characters
        .map((c, i) => (c !== ' ' ? i : null))
        .filter((i) => i !== null);

      if (validIndices.length === 0) return;
      const targetIndex = validIndices[Math.floor(Math.random() * validIndices.length)];

      setBrownoutIndex(targetIndex);

      brownoutTimeout = setTimeout(() => {
        setBrownoutIndex(null);
      }, 160 + Math.random() * 220);
    }, 4000 + Math.random() * 3500);

    return () => {
      clearInterval(interval);
      if (brownoutTimeout) clearTimeout(brownoutTimeout);
    };
  }, [flicker, characters, isInView, shouldReduceMotion, canIgnite, ignitedIndices.length]);

  // Neon shadows calculated dynamically based on gas color
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

  const flashShadow = useMemo(() => {
    return [
      `0 0 6px #ffffff`,
      `0 0 16px #ffffff`,
      `0 0 35px ${color}`,
      `0 0 70px ${color}`
    ].join(', ');
  }, [color]);

  const brownoutShadow = useMemo(() => {
    return [
      `0 0 2px rgba(255, 255, 255, 0.4)`,
      `0 0 8px ${color}66`,
      `0 0 16px ${color}33`
    ].join(', ');
  }, [color]);

  // Cold unlit tube shadow - subtle glass tube reflection
  const unlitShadow = useMemo(() => {
    return `0 0 2px ${color}25`;
  }, [color]);

  return (
    <Component
      ref={containerRef}
      className={`relative inline-flex items-center justify-center flex-nowrap whitespace-nowrap select-none ${className}`}
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

      {/* Render each glass tube letter */}
      {characters.map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="inline-block w-[0.28em]">
              &nbsp;
            </span>
          );
        }

        const isIgnited = shouldReduceMotion || ignitedIndices.includes(index);
        const sputterState = sputteringMap[index];
        const isBrownout = brownoutIndex === index;

        // Visual properties for cold physical glass tube vs sputtering vs ignited
        let currentShadow = unlitShadow;
        let textColor = `${color}25`;
        let textOpacity = 0.36; // Cold unlit glass clearly present and readable
        let strokeColor = `${color}40`;
        let scale = 1;

        if (sputterState) {
          // High-speed electrical arc flicker
          if (sputterState === true || sputterState === 'flash') {
            currentShadow = flashShadow;
            textColor = '#ffffff';
            textOpacity = 1;
            strokeColor = '#ffffff';
            scale = 1.02;
          } else if (sputterState === 'dip') {
            currentShadow = unlitShadow;
            textColor = `${color}40`;
            textOpacity = 0.4;
            strokeColor = `${color}60`;
            scale = 0.99;
          }
        } else if (isIgnited) {
          if (isBrownout) {
            currentShadow = brownoutShadow;
            textColor = '#ffffff';
            textOpacity = 0.55;
            strokeColor = `${color}80`;
            scale = 0.99;
          } else {
            currentShadow = litShadow;
            textColor = '#ffffff';
            textOpacity = 1;
            strokeColor = color;
            scale = 1;
          }
        }

        return (
          <motion.span
            key={index}
            className="inline-block relative transition-[text-shadow,color,opacity] duration-100"
            style={{
              opacity: textOpacity,
              transform: `scale(${scale})`,
              color: textColor,
              textShadow: currentShadow,
              WebkitTextStroke: isIgnited || sputterState ? `0.5px ${strokeColor}` : `1.2px ${strokeColor}`,
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
