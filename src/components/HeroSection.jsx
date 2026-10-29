import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowDown, Sparkles, MapPin, Radio, Headphones, Layers, Film, Ticket, ShoppingBag, ArrowRight } from 'lucide-react';
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
  onSelectTrack
}) {
  const { artistInfo, tracks } = useSiteData();
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

  const neonConfig = artistInfo?.neonSign || {
    color: '#a855f7',
    font: 'font-display',
    size: 'text-[clamp(2.35rem,11.2vw,9.5rem)] sm:text-8xl md:text-9xl lg:text-[10rem]',
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

  const isIlluminated = backdrop.illuminateOnGlow ?? true;
  const targetOpacity = (backdrop.opacity ?? 45) / 100;
  const blurAmount = backdrop.blurEnabled ? `${(backdrop.blur ?? 6) * 0.4}px` : '0px';

  // Dynamic progressive illumination:
  // Starts pitch black screen (opacity 0), reveals incrementally with each striking letter,
  // reaches full configured opacity and ambient neon bloom once the entire title is fully lit.
  const currentBackdropOpacity = isIlluminated
    ? (ignitionState.isFullyLit
        ? targetOpacity
        : (ignitionState.progress > 0
            ? targetOpacity * (0.12 + 0.88 * Math.pow(ignitionState.progress, 0.95))
            : 0))
    : targetOpacity;

  const currentBackdropBrightness = isIlluminated
    ? (ignitionState.isFullyLit
        ? 1.05
        : (ignitionState.progress > 0
            ? 0.15 + (0.85 * ignitionState.progress)
            : 0))
    : 1;

  // Mask / light cones radiating directly behind each ignited letter during ignition
  const letterBloomOverlay = useMemo(() => {
    if (!isIlluminated || ignitionState.isFullyLit || ignitionState.ignitedIndices.length === 0) {
      return null;
    }
    const gasColor = neonConfig.color || '#a855f7';
    return ignitionState.ignitedIndices.map((idx) => {
      const pct = 14 + (idx / Math.max(1, ignitionState.totalCount - 1)) * 72;
      return `radial-gradient(ellipse at ${pct}% 45%, ${gasColor}66 0%, ${gasColor}20 35%, transparent 68%)`;
    }).join(', ');
  }, [isIlluminated, ignitionState, neonConfig.color]);

  return (
    <section className="relative w-full flex flex-col items-center overflow-x-hidden">
      
      {/* Background ambient light gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] h-[340px] sm:h-[450px] bg-purple-600/12 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* ======================================================== */}
      {/* 1. MAIN HOME VIEWPORT: CINEMATIC TITLE & BIO (FULL VIEW)  */}
      {/* Dedicated full-viewport opening experience               */}
      {/* ======================================================== */}
      <div className="min-h-[100dvh] w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-24 sm:pt-28 pb-6 sm:pb-8 relative z-10">

        {/* Top Spacer / Tour Badge */}
        <div className="w-full flex justify-center min-h-[44px]">
          {artistInfo.tourBadge?.enabled !== false && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.a
                href={artistInfo.tourBadge?.link || '#tour'}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector('#tour');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                animate={{
                  y: [0, -3.5, 0]
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="relative inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-400/40 hover:border-emerald-400/70 bg-gradient-to-r from-purple-950/80 via-[#0e0a1f]/90 to-purple-950/80 backdrop-blur-xl group shadow-xl shadow-purple-900/30 cursor-pointer transition-all hover:scale-105 active:scale-95 max-w-[95vw] overflow-hidden"
                title="Explore Stage Dates & Tickets"
              >
                {/* Dynamic Multicolored Pulsing Aura / Radial Glow */}
                <motion.div
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500/40 via-purple-600/50 to-pink-500/40 blur-md pointer-events-none -z-10"
                  animate={{
                    opacity: [0.45, 0.9, 0.45],
                    scale: [0.98, 1.05, 0.98]
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
                <span className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="animate-pulse absolute -inset-0.5 rounded-full bg-emerald-400/30" />
                  <span className="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-gradient-to-tr from-emerald-400 to-teal-200 shadow-md shadow-emerald-400/80" />
                </span>

                {/* Mini Tag: LIVE */}
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono font-black uppercase text-emerald-300 tracking-wider shrink-0">
                  LIVE
                </span>

                {/* Fluid Text */}
                <ShinyText
                  text={artistInfo.tourBadge?.text || "ON TOUR NOW • 2026-2027 STAGE DATES • GET TICKETS"}
                  className="text-[10px] xs:text-[11px] sm:text-xs font-mono font-bold tracking-wide text-purple-100 max-w-[210px] xs:max-w-none truncate sm:overflow-visible"
                  speed={4}
                />

                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-1 transition-transform shrink-0" />
              </motion.a>
            </motion.div>
          )}
        </div>

        {/* Center Main Stage: Artist Title + Subtitle + Bio Teaser */}
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto py-4 sm:py-8">

          {/* Main Kinetic Title with Planes Neon Sign & Backdrop Illumination */}
          <div className="relative mb-4 sm:mb-6 w-full flex flex-col items-center justify-center">

            {/* BACKDROP IMAGE BEHIND ARTIST TITLE / HERO */}
            {backdrop.enabled && backdrop.image && (
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 overflow-hidden transition-[opacity,filter] duration-300 ease-out ${
                  backdrop.scope === 'hero'
                    ? 'fixed inset-0 w-screen h-screen'
                    : 'w-full max-w-5xl h-[340px] sm:h-[440px] md:h-[540px] rounded-3xl'
                }`}
                style={{
                  opacity: currentBackdropOpacity,
                  filter: `brightness(${currentBackdropBrightness}) blur(${blurAmount})`,
                  maskImage: backdrop.vignette
                    ? 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, transparent 92%)'
                    : 'none',
                  WebkitMaskImage: backdrop.vignette
                    ? 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.6) 65%, transparent 92%)'
                    : 'none',
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
                {letterBloomOverlay && (
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
                      opacity: ignitionState.isFullyLit ? 1 : (ignitionState.progress * 0.4),
                      background: `radial-gradient(ellipse at center, ${neonConfig.color || '#a855f7'}40 0%, ${neonConfig.color || '#a855f7'}15 50%, transparent 80%)`,
                      mixBlendMode: 'color-dodge'
                    }}
                  />
                )}
              </div>
            )}

            {/* Neon Title: Tubes are mounted immediately on page load, then randomly sputter & spark into light */}
            <div className="w-full flex justify-center py-2 px-1 overflow-visible">
              <NeonSign
                as="h1"
                color={neonConfig.color || '#a855f7'}
                delay={0.2}
                flicker={neonConfig.flicker ?? true}
                onIgnitionProgress={setIgnitionState}
                className={`${neonConfig.font || 'font-display'} ${neonConfig.fontWeight || 'font-black'} ${neonConfig.size || 'text-[clamp(2.35rem,11.2vw,9.5rem)] sm:text-8xl md:text-9xl lg:text-[10rem]'} tracking-tight xs:tracking-tighter uppercase leading-[0.95] text-balance text-center justify-center whitespace-nowrap`}
              >
                {artistInfo.name || 'UNNOTICED'}
              </NeonSign>
            </div>

            {/* Subtitle badge with Neon Illumination - Scaled for mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-2 sm:gap-3 mt-3 w-full max-w-xl px-2"
            >
              <div
                className="h-[1.5px] flex-1 max-w-[24px] xs:max-w-[40px] sm:max-w-[90px] md:max-w-[120px] transition-all"
                style={{
                  background: `linear-gradient(to right, transparent, ${neonConfig.color || '#a855f7'})`,
                  boxShadow: `0 0 8px ${neonConfig.color || '#a855f7'}88`
                }}
              />
              <p
                className="font-tech text-[9.5px] xs:text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.14em] xs:tracking-[0.18em] sm:tracking-[0.26em] font-bold text-center px-1 select-none transition-all"
                style={{
                  color: '#ffffff',
                  textShadow: `0 0 4px #ffffff, 0 0 10px ${neonConfig.color || '#a855f7'}, 0 0 20px ${neonConfig.color || '#a855f7'}99, 0 0 35px ${neonConfig.color || '#a855f7'}66`
                }}
              >
                {artistInfo.heroSubtitle || "Once Known As Ty Sciullo • Now A Man Unseen"}
              </p>
              <div
                className="h-[1.5px] flex-1 max-w-[24px] xs:max-w-[40px] sm:max-w-[90px] md:max-w-[120px] transition-all"
                style={{
                  background: `linear-gradient(to left, transparent, ${neonConfig.color || '#a855f7'})`,
                  boxShadow: `0 0 8px ${neonConfig.color || '#a855f7'}88`
                }}
              />
            </motion.div>
          </div>

          {/* Bio Teaser - Hero Centerpiece */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl text-xs sm:text-base md:text-lg text-slate-300 font-light leading-relaxed mt-4 sm:mt-6 text-balance px-2"
          >
            Forged in the blue-collar industrial grit of McKees Rocks. 
            Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind.
          </motion.p>
        </div>

        {/* Bottom of Main Home Viewport: Animated "Scroll to Explore" Prompt */}
        <div className="w-full flex justify-center pb-2">
          <motion.button
            onClick={() => {
              const el = document.querySelector('#hero-revealed-content');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="group flex flex-col items-center gap-1.5 text-slate-400 hover:text-purple-300 transition-colors cursor-pointer py-1"
            aria-label="Scroll to explore archive"
          >
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-slate-400 group-hover:text-purple-300">
              Scroll To Explore
            </span>
            <div className="w-6 h-10 rounded-full border border-white/20 group-hover:border-purple-400/60 p-1 flex justify-center bg-black/40 backdrop-blur-md transition-colors">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-2.5 rounded-full bg-purple-400"
              />
            </div>
            <ArrowDown className="w-3.5 h-3.5 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
          </motion.button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. REVEALED CONTENT ON SCROLL: CONTROLS & BENTO HUB       */}
      {/* Unveils smoothly as user scrolls past main home viewport   */}
      {/* ======================================================== */}
      <motion.div
        id="hero-revealed-content"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 sm:pb-28 text-center"
      >
        {/* Subtle section label */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="h-[1px] w-8 bg-purple-500/30" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-purple-400">
            Audio Studio & Transmission Hub
          </span>
          <span className="h-[1px] w-8 bg-purple-500/30" />
        </div>

        {/* Primary Action Row (Clean Spacing, Zero Overlap) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 w-full px-2">
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
                className="flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 border border-purple-400/30 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                {isFeaturedPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
                <span>{isFeaturedPlaying ? 'Pause Audio Preview' : `Listen: ${featuredTrack.title}`}</span>
                <span className="flex items-center gap-0.5 h-3 ml-1">
                  <span className={`w-0.5 bg-white/80 rounded-full ${isFeaturedPlaying ? 'h-3 animate-equalizer-1' : 'h-1.5'}`} />
                  <span className={`w-0.5 bg-white/80 rounded-full ${isFeaturedPlaying ? 'h-3.5 animate-equalizer-2' : 'h-2'}`} />
                  <span className={`w-0.5 bg-white/80 rounded-full ${isFeaturedPlaying ? 'h-2.5 animate-equalizer-3' : 'h-1'}`} />
                </span>
              </button>
            </Magnet>
          </div>

          {/* Quick Jump Pills */}
          <a
            href="#music"
            className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-semibold active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Headphones className="w-3.5 h-3.5 text-purple-400" />
            <span>Music & Lyrics</span>
          </a>

          <a
            href="#media"
            className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-semibold active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
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
                  className="px-2 py-0.5 rounded text-[10px] font-mono border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:text-white transition-colors active:scale-95"
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
                      Stripped of industry posturing. Highlighting emotional truth, nocturnal storytelling, and raw existential weight.
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
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/[0.06] hover:border-purple-500/30 text-slate-200 transition-all flex items-center gap-2"
                >
                  <Headphones className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Lyrics</span>
                </a>
                <a
                  href="#bio"
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/[0.06] hover:border-purple-500/30 text-slate-200 transition-all flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Story</span>
                </a>
                <a
                  href="#tour"
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/[0.06] hover:border-purple-500/30 text-slate-200 transition-all flex items-center gap-2"
                >
                  <Ticket className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Tour</span>
                </a>
                <a
                  href="#store"
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/[0.06] hover:border-purple-500/30 text-slate-200 transition-all flex items-center gap-2"
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

      </motion.div>

    </section>
  );
}
