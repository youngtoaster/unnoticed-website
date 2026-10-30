import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowDown, Sparkles, MapPin, Radio, Headphones, Layers, Film, Ticket, ShoppingBag, ArrowRight, Zap } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import ShinyText from './reactbits/ShinyText';
import DecryptedText from './reactbits/DecryptedText';
import Magnet from './reactbits/Magnet';
import NeonSign from './ui/NeonSign';

export default function HeroSection({
  currentTrack,
  isPlaying,
  togglePlay,
  onSelectTrack,
  canIgnite = true
}) {
  const { artistInfo, tracks, siteTheme, sectionsVisibility, toggleSectionVisibility } = useSiteData();
  const theme = siteTheme || artistInfo?.theme || { primary: '#a855f7', secondary: '#6366f1', accent: '#06b6d4' };
  const [identityMode, setIdentityMode] = useState('unnoticed'); // 'unnoticed' or 'ty'
  const featuredTrack = tracks[0] || currentTrack;
  const isFeaturedPlaying = isPlaying && currentTrack?.id === featuredTrack?.id;

  // Track real-time letter ignition status from NeonSign component
  const [ignitionState, setIgnitionState] = useState({
    ignitedCount: 0,
    totalCount: 9,
    progress: 0,
    isFullyLit: false,
    ignitedIndices: []
  });

  // Light Explosion Shockwave & Background Reveal State
  const [explosionActive, setExplosionActive] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [explosionKey, setExplosionKey] = useState(0);
  const hasTriggeredInitialRef = useRef(false);

  // Faceted Anamorphic Supersonic Wavefront Keyframes
  // Replaces the boring geometric circle with a sleek cybernetic 12-vertex polygonal shockwave
  // that bursts laterally across the wide "UNNOTICED" title and surges outward into the full screen.
  const FACETED_WAVEFRONT_KEYFRAMES = useMemo(() => [
    // 0% - Collapsed central ignition node (Zero image revealed)
    'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    // 18% - Razor-sharp lateral laser swath slicing directly across the letters
    'polygon(50% 38%, 66% 43%, 84% 48%, 98% 50%, 84% 52%, 66% 57%, 50% 62%, 34% 57%, 16% 52%, 2% 50%, 16% 48%, 34% 43%)',
    // 48% - Supersonic faceted diamond-hex energy burst surging outwards across the screen
    'polygon(50% 12%, 74% 22%, 98% 38%, 122% 50%, 98% 62%, 74% 78%, 50% 88%, 26% 78%, 2% 62%, -22% 50%, 2% 38%, 26% 22%)',
    // 78% - Shattered supersonic wave sweeping into the outer corners
    'polygon(50% -28%, 86% -12%, 126% 18%, 150% 50%, 126% 82%, 86% 112%, 50% 128%, 14% 112%, -26% 82%, -50% 50%, -26% 18%, 14% -12%)',
    // 100% - Fully scattered and dissipated beyond all screen boundaries (100% visible)
    'polygon(50% -75%, 125% -55%, 175% 0%, 195% 50%, 175% 100%, 125% 155%, 50% 175%, -25% 155%, -75% 100%, -95% 50%, -75% 0%, -25% -55%)'
  ], []);

  // 28 Anamorphic Scattered Light Sparks radiating outwards on detonation
  const shockwaveSparks = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * 360;
      const rad = (angle * Math.PI) / 180;
      // Stretched horizontally to match the anamorphic aspect ratio of the title
      const distanceX = (Math.cos(rad) * (260 + (i % 5) * 80)) * 1.55;
      const distanceY = (Math.sin(rad) * (140 + (i % 4) * 60));
      const size = 3 + (i % 4) * 2;
      const duration = 0.85 + (i % 6) * 0.15;
      const delay = (i % 5) * 0.03;
      return { id: i, distanceX, distanceY, size, duration, delay };
    });
  }, []);

  // Trigger huge explosion of light when the neon sign lights up into full ignition
  const triggerExplosion = useCallback(() => {
    setHasRevealed(false);
    setExplosionActive(true);
    setExplosionKey((prev) => prev + 1);
    // 2.2s allows the wavefront to expand completely past screen edges,
    // settle its brightness, and smoothly fade back into the final resting backdrop exposure
    setTimeout(() => {
      setHasRevealed(true);
      setExplosionActive(false);
    }, 2200);
  }, []);

  // When ignition reaches full completion on page load, add a pre-detonation tension pause:
  // All letters lock in solid, voltage hums for 220ms, then the light pulse DETONATES!
  useEffect(() => {
    if (canIgnite && ignitionState.isFullyLit && !hasTriggeredInitialRef.current) {
      hasTriggeredInitialRef.current = true;
      const timer = setTimeout(() => {
        triggerExplosion();
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [canIgnite, ignitionState.isFullyLit, triggerExplosion]);

  // Guaranteed ignition safety fallback: ensures backdrop and hero reveal never stay locked dark
  useEffect(() => {
    if (canIgnite && !hasTriggeredInitialRef.current && !hasRevealed) {
      const fallbackTimer = setTimeout(() => {
        if (!hasTriggeredInitialRef.current) {
          hasTriggeredInitialRef.current = true;
          triggerExplosion();
        }
      }, 2800);
      return () => clearTimeout(fallbackTimer);
    }
  }, [canIgnite, hasRevealed, triggerExplosion]);

  const neonConfig = artistInfo?.neonSign || {
    color: '#a855f7',
    font: 'font-display',
    size: 'text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem]',
    fontWeight: 'font-black',
    flicker: true
  };

  const backdrop = artistInfo?.heroBackdrop || {
    enabled: true,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    blur: 6,
    blurEnabled: true,
    opacity: 45,
    zoom: 105,
    positionX: 50,
    positionY: 45,
    scope: "title",
    blendMode: "screen",
    vignette: true,
    illuminateOnGlow: true,
    glowIntensity: 85
  };

  const isBackdropVisible = (backdrop.enabled ?? true) && (sectionsVisibility?.heroBackdrop !== false);
  const isIlluminated = backdrop.illuminateOnGlow ?? true;
  const targetOpacity = (backdrop.opacity ?? 45) / 100;
  const blurAmount = backdrop.blurEnabled ? `${(backdrop.blur ?? 6) * 0.4}px` : '0px';

  // Dynamic progressive illumination:
  // Held completely pitch dark (0) until the light pulse detonates,
  // revealing only through the expanding wavefront of the pulse,
  // then settling at targetOpacity once the pulse is fully scattered.
  const currentBackdropOpacity = !canIgnite
    ? 0
    : isIlluminated
      ? (hasRevealed || explosionActive ? targetOpacity : 0)
      : targetOpacity;

  const currentBackdropBrightness = !canIgnite
    ? 0
    : isIlluminated
      ? (hasRevealed ? 1.05 : (explosionActive ? 1.5 : 0))
      : 1;

  // Mask / light cones radiating directly behind each ignited letter during ignition
  const letterBloomOverlay = useMemo(() => {
    if (!canIgnite || !isIlluminated || !explosionActive) {
      return null;
    }
    const gasColor = neonConfig.color || theme?.primary || '#a855f7';
    return ignitionState.ignitedIndices.map((idx) => {
      const pct = 14 + (idx / Math.max(1, ignitionState.totalCount - 1)) * 72;
      return `radial-gradient(ellipse at ${pct}% 45%, ${gasColor}66 0%, ${gasColor}20 35%, transparent 68%)`;
    }).join(', ');
  }, [canIgnite, isIlluminated, explosionActive, ignitionState, neonConfig.color, theme?.primary]);

  const align = neonConfig.align || 'center';
  const gasColor = neonConfig.color || theme?.primary || '#a855f7';

  // Dynamic alignment classes for hero stage
  const alignmentContainerClass = 
    align === 'left' ? 'items-start text-left' :
    align === 'right' ? 'items-end text-right' :
    'items-center text-center';

  const titleJustifyClass = 
    align === 'left' ? 'justify-start text-left' :
    align === 'right' ? 'justify-end text-right' :
    'justify-center text-center';

  const subtitleJustifyClass =
    align === 'left' ? 'justify-start' :
    align === 'right' ? 'justify-end' :
    'justify-center';

  const bioAlignClass =
    align === 'left' ? 'text-left mr-auto ml-0' :
    align === 'right' ? 'text-right ml-auto mr-0' :
    'text-center mx-auto';

  const tourBadgeAlignClass =
    align === 'left' ? 'self-start' :
    align === 'right' ? 'self-end' :
    'self-center';

  // Bio visibility toggle and synchronized narrative text
  const isHeroBioVisible = (artistInfo.showHeroBio ?? true) && (sectionsVisibility?.heroBio !== false);
  const heroBioText = artistInfo.heroBio || artistInfo.bio || "Forged in the blue-collar industrial grit of McKees Rocks. Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind.";

  // Dynamic caption illumination (lights up progressively as the neon sign ignites)
  const isCaptionLit = canIgnite && ignitionState.isFullyLit;
  const captionProgress = canIgnite ? ignitionState.progress : 0;
  const captionShadow = isCaptionLit
    ? `0 0 4px #ffffff, 0 0 10px #ffffff, 0 0 20px ${gasColor}, 0 0 35px ${gasColor}aa`
    : (captionProgress > 0
        ? `0 0 2px #ffffff, 0 0 8px ${gasColor}88`
        : `0 0 2px ${gasColor}20`);
  const captionOpacity = isCaptionLit
    ? 1
    : (captionProgress > 0 ? 0.4 + (0.6 * captionProgress) : 0.35);
  const captionTextColor = (isCaptionLit || captionProgress > 0.4) ? '#ffffff' : `${gasColor}90`;

  return (
    <section className="relative w-full flex flex-col items-center overflow-x-hidden">
      
      {/* Background ambient light gradients with dynamic theme color */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] h-[340px] sm:h-[450px] rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-500"
        style={{ backgroundColor: `${theme.primary || '#a855f7'}20` }}
      />

      {/* ======================================================== */}
      {/* 1. MAIN HOME VIEWPORT: FULL-HEIGHT CINEMATIC STAGE        */}
      {/* Fills 100vh with centered artist name, subtitle, & bio     */}
      {/* ======================================================== */}
      <div className="relative w-full min-h-screen min-h-[100dvh] flex flex-col justify-center items-center px-4 sm:px-6 pt-16 pb-16 overflow-hidden z-10">

        {/* ======================================================== */}
        {/* HUGE EXPLOSION OF LIGHT EXPANDING OUTWARDS FROM TITLE     */}
        {/* Detonates when neon light turns on to reveal background   */}
        {/* ======================================================== */}
        <AnimatePresence>
          {explosionActive && (
            <motion.div
              key={`explosion-fx-${explosionKey}`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex items-center justify-center"
            >
              {/* 1. Full Viewport Blinding Detonation Flash with Soft Dissipation Bloom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0.4, 0] }}
                transition={{ duration: 1.8, times: [0, 0.1, 0.4, 1], ease: 'easeOut' }}
                className="absolute inset-0 bg-radial from-white via-purple-500/30 to-transparent mix-blend-screen"
              />

              {/* 2. Primary Anamorphic Cyber-Diamond Wavefront (Faceted Supersonic Blast) */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0, 0.45, 1.5, 3.4, 5.8],
                  opacity: [0, 1, 0.95, 0.45, 0],
                  rotate: [0, -3, 2, 0]
                }}
                transition={{
                  duration: 1.65,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.15, 0.45, 0.75, 1]
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[180px] sm:w-[500px] sm:h-[250px] md:w-[680px] md:h-[300px] pointer-events-none"
                style={{
                  clipPath: 'polygon(50% 0%, 76% 16%, 98% 50%, 76% 84%, 50% 100%, 24% 84%, 2% 50%, 24% 16%)',
                  background: `radial-gradient(ellipse at center, transparent 48%, ${gasColor} 68%, #ffffff 84%, transparent 92%)`,
                  filter: `drop-shadow(0 0 35px #ffffff) drop-shadow(0 0 75px ${gasColor})`,
                  mixBlendMode: 'screen',
                }}
              />

              {/* 3. Secondary Faceted Supersonic Mach-Cone Ripple (Offset Delay) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 0.65, 2.2, 4.8],
                  opacity: [0, 0.9, 0.45, 0]
                }}
                transition={{
                  duration: 1.45,
                  delay: 0.05,
                  ease: 'easeOut',
                  times: [0, 0.2, 0.65, 1]
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[160px] sm:w-[440px] sm:h-[220px] md:w-[580px] md:h-[260px] pointer-events-none border-[7px] sm:border-[12px]"
                style={{
                  borderColor: gasColor,
                  borderRadius: '45% 45% 45% 45% / 25% 25% 25% 25%',
                  boxShadow: `0 0 50px #ffffff, 0 0 110px ${gasColor}, inset 0 0 45px ${gasColor}`,
                  mixBlendMode: 'color-dodge',
                }}
              />

              {/* 4. Horizontal Anamorphic Laser Blade Slicing Across Title */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: [0, 1.6, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-3 sm:h-4 rounded-full pointer-events-none"
                style={{
                  background: `linear-gradient(to right, transparent 0%, ${gasColor} 20%, #ffffff 50%, ${gasColor} 80%, transparent 100%)`,
                  boxShadow: `0 0 40px #ffffff, 0 0 90px ${gasColor}`,
                  filter: 'blur(1px)',
                  mixBlendMode: 'screen',
                }}
              />

              {/* 5. Volumetric Celestial Radial Light Starburst */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0, rotate: 0 }}
                animate={{
                  scale: [0.2, 1.8, 3.6],
                  opacity: [0, 0.8, 0],
                  rotate: [0, 35]
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${gasColor}70 8deg, transparent 16deg, #ffffff80 24deg, transparent 32deg, ${gasColor}70 45deg, transparent 58deg, #ffffff80 68deg, transparent 80deg, ${gasColor}70 95deg, transparent 110deg, #ffffff80 125deg, transparent 140deg, ${gasColor}70 160deg, transparent 175deg, #ffffff80 190deg, transparent 205deg, ${gasColor}70 225deg, transparent 240deg, #ffffff80 255deg, transparent 270deg, ${gasColor}70 295deg, transparent 310deg, #ffffff80 325deg, transparent 340deg, ${gasColor}70 355deg, transparent 360deg)`,
                  filter: 'blur(8px)',
                  mixBlendMode: 'screen',
                }}
              />

              {/* 6. Scattered Anamorphic Ember Sparks Radiating in 360 Degrees */}
              {shockwaveSparks.map((spark) => (
                <motion.div
                  key={spark.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: [0, spark.distanceX * 0.4, spark.distanceX],
                    y: [0, spark.distanceY * 0.4, spark.distanceY],
                    scale: [0, 1.6, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: spark.duration,
                    delay: spark.delay,
                    ease: 'easeOut'
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width: `${spark.size}px`,
                    height: `${spark.size}px`,
                    backgroundColor: '#ffffff',
                    boxShadow: `0 0 10px #ffffff, 0 0 20px ${gasColor}`,
                    mixBlendMode: 'screen',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1A. FULL HERO VIEWPORT BACKDROP IMAGE (SCOPE === 'HERO') */}
        {/* Revealed dynamically by the expanding faceted light pulse, showing only covered areas */}
        {isBackdropVisible && backdrop.image && backdrop.scope === 'hero' && (
          <motion.div
            key={`hero-bg-${explosionKey}`}
            initial={!hasRevealed && isIlluminated ? {
              clipPath: FACETED_WAVEFRONT_KEYFRAMES[0],
              opacity: 0
            } : false}
            animate={
              !canIgnite
                ? {
                    clipPath: FACETED_WAVEFRONT_KEYFRAMES[0],
                    opacity: 0,
                    filter: `brightness(0) blur(${blurAmount})`
                  }
                : explosionActive
                ? {
                    clipPath: FACETED_WAVEFRONT_KEYFRAMES,
                    opacity: [0, targetOpacity * 0.9, targetOpacity, targetOpacity, targetOpacity],
                    filter: [
                      `brightness(3.2) blur(0px) contrast(1.35)`,
                      `brightness(2.4) blur(1px) contrast(1.2)`,
                      `brightness(1.6) blur(${blurAmount}) contrast(1.08)`,
                      `brightness(1.2) blur(${blurAmount}) contrast(1.02)`,
                      `brightness(1.05) blur(${blurAmount}) contrast(1)`
                    ]
                  }
                : hasRevealed || !isIlluminated
                ? {
                    clipPath: FACETED_WAVEFRONT_KEYFRAMES[4],
                    opacity: targetOpacity,
                    filter: `brightness(1.05) blur(${blurAmount})`
                  }
                : {
                    clipPath: FACETED_WAVEFRONT_KEYFRAMES[0],
                    opacity: 0,
                    filter: `brightness(0) blur(${blurAmount})`
                  }
            }
            transition={
              explosionActive
                ? {
                    duration: 2.2,
                    ease: [0.16, 1, 0.3, 1],
                    times: [0, 0.16, 0.44, 0.74, 1]
                  }
                : { duration: 0.8, ease: 'easeOut' }
            }
            className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
            style={{
              maskImage: backdrop.vignette
                ? 'radial-gradient(ellipse 95% 90% at 50% 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.6) 80%, transparent 100%)'
                : 'none',
              WebkitMaskImage: backdrop.vignette
                ? 'radial-gradient(ellipse 95% 90% at 50% 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.6) 80%, transparent 100%)'
                : 'none',
            }}
          >
            <img
              src={backdrop.image}
              alt="Full Hero Backdrop"
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{
                objectPosition: `${backdrop.positionX ?? 50}% ${backdrop.positionY ?? 50}%`,
                transform: `scale(${(backdrop.zoom ?? 105) / 100})`,
                mixBlendMode: backdrop.blendMode || 'screen',
              }}
            />

            {/* Dynamic Letter Spotlight Blooms radiating from ignited letters during progressive strike */}
            {letterBloomOverlay && !hasRevealed && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-200"
                style={{
                  backgroundImage: letterBloomOverlay,
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* Dynamic Neon Gas Wall Wash Blooming Over Backdrop when fully lit */}
            {isIlluminated && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{
                  opacity: (ignitionState.isFullyLit || hasRevealed) ? 1 : (ignitionState.progress * 0.4),
                  background: `radial-gradient(ellipse at center, ${gasColor}40 0%, ${gasColor}15 50%, transparent 80%)`,
                  mixBlendMode: 'color-dodge'
                }}
              />
            )}

            {/* Smooth bottom & top ambient fades into deep black background */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060608] via-[#060608]/70 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#060608]/75 to-transparent pointer-events-none" />
          </motion.div>
        )}

        {/* Center Main Stage: Tour Badge + Artist Title + Subtitle + Bio Teaser */}
        <div className={`w-full max-w-5xl mx-auto flex flex-col justify-center my-auto transition-all duration-500 translate-y-5 sm:translate-y-8 ${alignmentContainerClass}`}>

          {/* Top On Tour Look-At-Me Button */}
          {artistInfo.tourBadge?.enabled !== false && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={canIgnite ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className={`mb-4 sm:mb-5 ${tourBadgeAlignClass}`}
            >
            <motion.a
              href={artistInfo.tourBadge?.link || '#tour'}
              onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector('#tour');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              animate={{
                y: [0, -2.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-purple-400/40 hover:border-emerald-400/70 bg-gradient-to-r from-purple-950/80 via-[#0e0a1f]/90 to-purple-950/80 backdrop-blur-xl group shadow-lg shadow-purple-900/25 cursor-pointer transition-all hover:scale-105 active:scale-95 max-w-[95vw] overflow-hidden"
              title="Explore Stage Dates & Tickets"
            >
              {/* Dynamic Multicolored Pulsing Aura / Radial Glow */}
              <motion.div
                className="absolute -inset-1 rounded-full blur-md pointer-events-none -z-10"
                style={{
                  background: 'linear-gradient(to right, var(--theme-accent, #06b6d4) 0%, var(--theme-primary, #a855f7) 50%, var(--theme-secondary, #6366f1) 100%)',
                }}
                animate={{
                  opacity: [0.4, 0.85, 0.4],
                  scale: [0.98, 1.04, 0.98]
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              {/* Sweeping Fluid Light Glint / Sheen across badge */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <motion.div
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{
                    x: ['-160%', '320%']
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 1.2
                  }}
                />
              </div>

              {/* Dual Concentric Radar Beacon */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="animate-pulse absolute -inset-0.5 rounded-full bg-emerald-400/30" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-tr from-emerald-400 to-teal-200 shadow-md shadow-emerald-400/80" />
              </span>

              {/* Mini Tag: LIVE */}
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-400/40 text-[8.5px] font-mono font-black uppercase text-emerald-300 tracking-wider shrink-0">
                LIVE
              </span>

              {/* Fluid Text */}
              <ShinyText
                text={artistInfo.tourBadge?.text || "ON TOUR NOW • 2026-2027 STAGE DATES • GET TICKETS"}
                className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wide text-purple-100 whitespace-nowrap"
                speed={4}
              />

              <ArrowRight className="w-3 h-3 text-emerald-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.a>
          </motion.div>
        )}

        {/* Main Kinetic Title with Planes Neon Sign & Backdrop Illumination */}
        <div className={`relative mb-2 sm:mb-3 w-full flex flex-col ${alignmentContainerClass}`}>

            {/* 1B. TITLE-ONLY BACKDROP IMAGE (localized right behind artist name when scope === 'title') */}
            {isBackdropVisible && backdrop.image && backdrop.scope !== 'hero' && (
              <motion.div
                key={`title-bg-${explosionKey}`}
                initial={!hasRevealed && isIlluminated ? {
                  clipPath: FACETED_WAVEFRONT_KEYFRAMES[0],
                  opacity: 0
                } : false}
                animate={
                  !canIgnite
                    ? {
                        clipPath: FACETED_WAVEFRONT_KEYFRAMES[0],
                        opacity: 0,
                        filter: `brightness(0) blur(${blurAmount})`
                      }
                    : explosionActive
                    ? {
                        clipPath: FACETED_WAVEFRONT_KEYFRAMES,
                        opacity: [0, targetOpacity * 0.9, targetOpacity, targetOpacity, targetOpacity],
                        filter: [
                          `brightness(3.2) blur(0px) contrast(1.35)`,
                          `brightness(2.4) blur(1px) contrast(1.2)`,
                          `brightness(1.6) blur(${blurAmount}) contrast(1.08)`,
                          `brightness(1.2) blur(${blurAmount}) contrast(1.02)`,
                          `brightness(1.05) blur(${blurAmount}) contrast(1)`
                        ]
                      }
                    : hasRevealed || !isIlluminated
                    ? {
                        clipPath: FACETED_WAVEFRONT_KEYFRAMES[4],
                        opacity: targetOpacity,
                        filter: `brightness(1.05) blur(${blurAmount})`
                      }
                    : {
                        clipPath: FACETED_WAVEFRONT_KEYFRAMES[0],
                        opacity: 0,
                        filter: `brightness(0) blur(${blurAmount})`
                      }
                }
                transition={
                  explosionActive
                    ? {
                        duration: 2.2,
                        ease: [0.16, 1, 0.3, 1],
                        times: [0, 0.16, 0.44, 0.74, 1]
                      }
                    : { duration: 0.8, ease: 'easeOut' }
                }
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 overflow-hidden w-full max-w-4xl h-[260px] sm:h-[320px] md:h-[380px]"
                style={{
                  maskImage: backdrop.vignette
                    ? 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.55) 60%, transparent 95%)'
                    : 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.7) 75%, transparent 100%)',
                  WebkitMaskImage: backdrop.vignette
                    ? 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.55) 60%, transparent 95%)'
                    : 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.7) 75%, transparent 100%)',
                }}
              >
                <img
                  src={backdrop.image}
                  alt="Artist Title Backdrop"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out"
                  style={{
                    objectPosition: `${backdrop.positionX ?? 50}% ${backdrop.positionY ?? 45}%`,
                    transform: `scale(${(backdrop.zoom ?? 105) / 100})`,
                    mixBlendMode: backdrop.blendMode || 'screen',
                  }}
                />

                {/* Dynamic Letter Spotlight Blooms radiating from ignited letters during progressive strike */}
                {letterBloomOverlay && !hasRevealed && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-200"
                    style={{
                      backgroundImage: letterBloomOverlay,
                      mixBlendMode: 'screen',
                    }}
                  />
                )}

                {/* Dynamic Neon Gas Wall Wash Blooming Over Backdrop when fully lit */}
                {isIlluminated && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{
                      opacity: (ignitionState.isFullyLit || hasRevealed) ? 1 : (ignitionState.progress * 0.4),
                      background: `radial-gradient(ellipse at center, ${gasColor}40 0%, ${gasColor}15 50%, transparent 80%)`,
                      mixBlendMode: 'color-dodge'
                    }}
                  />
                )}
              </motion.div>
            )}

            {/* Neon Title: Tubes are mounted immediately on page load, then randomly sputter & spark into light */}
            {/* Clicking title triggers power surge re-ignition & massive explosion of light */}
            <div
              onClick={triggerExplosion}
              className={`w-full flex ${titleJustifyClass} py-1 px-1 overflow-visible cursor-pointer select-none group/title transition-transform duration-200 active:scale-[0.99]`}
              title="Click to detonate light explosion and re-illuminate backdrop"
            >
              <NeonSign
                as="h1"
                color={gasColor}
                delay={0.2}
                flicker={neonConfig.flicker ?? true}
                canIgnite={canIgnite}
                onIgnitionProgress={setIgnitionState}
                style={neonConfig.fontSizeRem ? { fontSize: `clamp(2rem, 5.2vw, ${neonConfig.fontSizeRem}rem)` } : undefined}
                className={`${neonConfig.font || 'font-display'} ${neonConfig.fontWeight || 'font-black'} ${neonConfig.size || 'text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem]'} tracking-tight xs:tracking-tighter uppercase leading-[0.98] ${titleJustifyClass} whitespace-nowrap`}
              >
                {artistInfo.name || 'UNNOTICED'}
              </NeonSign>
            </div>

            {/* Subtitle badge with Dynamic Neon Illumination - Lights up with neon sign */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={canIgnite ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`flex items-center ${subtitleJustifyClass} gap-2 sm:gap-2.5 mt-2.5 sm:mt-3 w-full max-w-xl px-2`}
            >
              {(align === 'center' || align === 'right') && (
                <div
                  className="h-[1px] flex-1 max-w-[20px] xs:max-w-[32px] sm:max-w-[65px] md:max-w-[90px] transition-all duration-500"
                  style={{
                    background: isCaptionLit
                      ? `linear-gradient(to right, transparent, ${gasColor})`
                      : `linear-gradient(to right, transparent, ${gasColor}40)`,
                    boxShadow: isCaptionLit ? `0 0 6px ${gasColor}` : 'none',
                    opacity: isCaptionLit ? 1 : (captionProgress > 0 ? 0.6 : 0.3)
                  }}
                />
              )}
              <p
                className="font-tech text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.22em] font-bold px-1 select-none transition-all duration-300"
                style={{
                  color: captionTextColor,
                  opacity: captionOpacity,
                  textShadow: captionShadow
                }}
              >
                {artistInfo.heroSubtitle || "Once Known As Ty Sciullo • Now A Man Unseen"}
              </p>
              {(align === 'center' || align === 'left') && (
                <div
                  className="h-[1px] flex-1 max-w-[20px] xs:max-w-[32px] sm:max-w-[65px] md:max-w-[90px] transition-all duration-500"
                  style={{
                    background: isCaptionLit
                      ? `linear-gradient(to left, transparent, ${gasColor})`
                      : `linear-gradient(to left, transparent, ${gasColor}40)`,
                    boxShadow: isCaptionLit ? `0 0 6px ${gasColor}` : 'none',
                    opacity: isCaptionLit ? 1 : (captionProgress > 0 ? 0.6 : 0.3)
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Bio Teaser - Dynamic Alignment & Balanced Scale with Smooth Collapse */}
          <AnimatePresence>
            {isHeroBioVisible && (
              <motion.p
                key="hero-bio-statement"
                initial={{ opacity: 0, height: 0, y: 10, marginTop: 0 }}
                animate={canIgnite ? { opacity: 1, height: 'auto', y: 0, marginTop: '1rem' } : { opacity: 0, height: 0, y: 10, marginTop: 0 }}
                exit={{ opacity: 0, height: 0, y: -8, marginTop: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className={`max-w-lg text-xs sm:text-sm text-slate-300 font-light leading-relaxed text-balance px-2 whitespace-pre-line overflow-hidden ${bioAlignClass}`}
              >
                {heroBioText}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom of Main Home Viewport: Animated "Scroll to Explore" Prompt (Anchored to page bottom) */}
        <div className="absolute bottom-2 sm:bottom-3 inset-x-0 mx-auto w-full flex flex-col items-center z-20 pointer-events-auto">
          <motion.button
            onClick={() => {
              const target = sectionsVisibility?.transmissionHub !== false 
                ? '#hero-revealed-content' 
                : (sectionsVisibility?.featuredRelease !== false ? '#featured-release' : '#music');
              const el = document.querySelector(target);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            initial={{ opacity: 0 }}
            animate={canIgnite ? { opacity: 1, y: [0, 4, 0] } : { opacity: 0 }}
            transition={canIgnite ? {
              opacity: { duration: 0.5, delay: 0.5 },
              y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            } : { duration: 0.2 }}
            className="group flex flex-col items-center gap-1.5 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer py-1"
            aria-label="Scroll to explore archive"
          >
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400 group-hover:text-purple-300">
              Scroll To Explore
            </span>
            <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-purple-400/60 p-0.5 flex justify-center bg-black/40 backdrop-blur-md transition-colors">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 rounded-full bg-purple-400"
              />
            </div>
            <ArrowDown className="w-3 h-3 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
          </motion.button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. REVEALED CONTENT ON SCROLL: CONTROLS & BENTO HUB       */}
      {/* Unveils smoothly as user scrolls past main home viewport   */}
      {/* ======================================================== */}
      {sectionsVisibility?.transmissionHub !== false && (
      <motion.div
        id="hero-revealed-content"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-20 bg-[#060608] border-t border-white/[0.08] pt-8 sm:pt-12 pb-16 sm:pb-20 text-center shadow-[0_-25px_50px_rgba(0,0,0,0.9)]"
      >
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          {/* Subtle section label with solid background */}
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
            <span className="h-[1px] w-6 bg-purple-500/30" />
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-purple-300 px-3.5 py-1 rounded-full bg-[#0d0e17] border border-purple-500/30 shadow-md">
              Audio Studio & Transmission Hub
            </span>
            <span className="h-[1px] w-6 bg-purple-500/30" />
          </div>

          {/* Primary Action Row with Solid Opaque Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-8 sm:mb-10 w-full px-2">
            {/* Main Play Button with controlled Magnet */}
            <div className="relative shrink-0">
              <Magnet padding={20} magnetStrength={2}>
                <button
                  onClick={() => {
                    if (currentTrack?.id !== featuredTrack.id) {
                      onSelectTrack(featuredTrack);
                    } else {
                      togglePlay();
                    }
                  }}
                  className="theme-primary-btn flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm border active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary || '#a855f7'} 0%, ${theme.secondary || '#6366f1'} 100%)`,
                    borderColor: `${theme.primary || '#a855f7'}60`,
                    boxShadow: `0 10px 25px -5px ${theme.primary || '#a855f7'}40`
                  }}
                >
                  {isFeaturedPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                  <span>{isFeaturedPlaying ? 'Pause Preview' : `Listen: ${featuredTrack.title}`}</span>
                  <span className="flex items-center gap-0.5 h-2.5 ml-1">
                    <span className={`w-0.5 bg-current rounded-full ${isFeaturedPlaying ? 'h-2.5 animate-equalizer-1' : 'h-1'}`} />
                    <span className={`w-0.5 bg-current rounded-full ${isFeaturedPlaying ? 'h-3 animate-equalizer-2' : 'h-1.5'}`} />
                    <span className={`w-0.5 bg-current rounded-full ${isFeaturedPlaying ? 'h-2 animate-equalizer-3' : 'h-1'}`} />
                  </span>
                </button>
              </Magnet>
            </div>

            {/* Quick Jump Pills (Solid Opaque Luxury Backgrounds) */}
            <a
              href="#music"
              className="px-4 py-2.5 rounded-full bg-[#0e0f18] hover:bg-[#181928] text-white border border-white/[0.14] text-xs font-semibold active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg shadow-black/60"
            >
              <Headphones className="w-3.5 h-3.5 text-purple-400" />
              <span>Music & Lyrics</span>
            </a>

            <a
              href="#media"
              className="px-4 py-2.5 rounded-full bg-[#0e0f18] hover:bg-[#181928] text-white border border-white/[0.14] text-xs font-semibold active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg shadow-black/60"
            >
              <Film className="w-3.5 h-3.5 text-purple-400" />
              <span>Media Archive</span>
            </a>
          </div>

          {/* Clean, Balanced 3-Card Bento Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Card 1: Artist Persona & Origin */}
            <SpotlightCard
              tilt={false}
              className="p-5 flex flex-col justify-between"
              spotlightColor="rgba(168, 85, 247, 0.18)"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Metamorphosis
                  </span>
                  <button
                    onClick={() => setIdentityMode(identityMode === 'unnoticed' ? 'ty' : 'unnoticed')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono border border-purple-500/30 bg-[#12131e] text-purple-200 hover:bg-purple-600/30 hover:text-white transition-colors active:scale-95 cursor-pointer shadow-sm"
                  >
                    Flip Persona ⟳
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {identityMode === 'unnoticed' ? (
                    <motion.div
                      key="unnoticed"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-display text-lg font-bold text-white mb-0.5">
                        <DecryptedText text="UNNOTICED" speed={40} />
                      </h3>
                      <p className="text-[11px] text-purple-300 font-mono mb-2">
                        Current Era • The Man Unseen
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {artistInfo.metamorphosisBio || "Stripped of industry posturing. Highlighting emotional truth, nocturnal storytelling, and raw existential weight."}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ty"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-display text-lg font-bold text-white mb-0.5">
                        <DecryptedText text="TY SCIULLO" speed={40} />
                      </h3>
                      <p className="text-[11px] text-purple-300 font-mono mb-2">
                        2016–2023 • The Roots
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        Emerging from McKees Rocks with early recordings like 'Cold Night', laying the foundation for what was to come.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" /> Origin
                </span>
                <span className="text-white font-medium">McKees Rocks, PA</span>
              </div>
            </SpotlightCard>

            {/* Card 2: Key Streaming Telemetry */}
            <SpotlightCard
              tilt={false}
              className="p-5 flex flex-col justify-between"
              spotlightColor="rgba(168, 85, 247, 0.18)"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" /> Streaming Reach
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Global Metrics
                  </span>
                </div>

                <div className="space-y-3 my-2">
                  <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs text-slate-400">Monthly Listeners</span>
                    <span className="font-display text-xl font-black text-white">
                      <ShinyText text={artistInfo.stats?.monthlyListeners || '142,500'} speed={3.5} />
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs text-slate-400">Catalog Streams</span>
                    <span className="font-display text-xl font-black text-white">
                      <ShinyText text={artistInfo.stats?.totalStreams || '4.2M'} speed={3} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Core Audience</span>
                <span className="text-purple-300">18–34 Demographics</span>
              </div>
            </SpotlightCard>

            {/* Card 3: Quick Navigation Hub */}
            <SpotlightCard
              tilt={false}
              className="p-5 flex flex-col justify-between"
              spotlightColor="rgba(168, 85, 247, 0.18)"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Navigation Hub
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Direct Jump
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-1 text-xs">
                  <a
                    href="#music"
                    className="p-2.5 rounded-xl bg-[#12131e] hover:bg-[#1a1c2b] border border-white/[0.1] hover:border-purple-500/40 text-slate-100 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Headphones className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-medium">Lyrics</span>
                  </a>
                  <a
                    href="#bio"
                    className="p-2.5 rounded-xl bg-[#12131e] hover:bg-[#1a1c2b] border border-white/[0.1] hover:border-purple-500/40 text-slate-100 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-medium">Story</span>
                  </a>
                  <a
                    href="#tour"
                    className="p-2.5 rounded-xl bg-[#12131e] hover:bg-[#1a1c2b] border border-white/[0.1] hover:border-purple-500/40 text-slate-100 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Ticket className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-medium">Tour</span>
                  </a>
                  <a
                    href="#store"
                    className="p-2.5 rounded-xl bg-[#12131e] hover:bg-[#1a1c2b] border border-white/[0.1] hover:border-purple-500/40 text-slate-100 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-medium">Store</span>
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Electronic Press Kit</span>
                <a href="#epk" className="text-purple-300 hover:text-white transition-colors">
                  View EPK →
                </a>
              </div>
            </SpotlightCard>
          </div>
        </div>

      </motion.div>
      )}

    </section>
  );
}
