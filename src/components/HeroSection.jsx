import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowDown, Sparkles, MapPin, Radio, Headphones, Layers, Film, Ticket, ShoppingBag } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import ShinyText from './reactbits/ShinyText';
import DecryptedText from './reactbits/DecryptedText';
import Magnet from './reactbits/Magnet';

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

  return (
    <section className="relative min-h-[90vh] pt-28 sm:pt-36 pb-16 sm:pb-24 flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden">
      
      {/* Background ambient light gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] h-[340px] sm:h-[450px] bg-purple-600/12 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">

        {/* Top Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 backdrop-blur-md mb-6 sm:mb-8 group shadow-lg shadow-purple-500/5"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <ShinyText
            text="OFFICIAL ARTIST ATELIER • McKEES ROCKS, PA"
            className="text-[11px] sm:text-xs font-mono tracking-wide"
            speed={4.5}
          />
        </motion.div>

        {/* Main Kinetic Title */}
        <div className="relative mb-4 sm:mb-6 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-display text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.95] select-none text-balance"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
              UNNOTICED
            </span>
          </motion.h1>

          {/* Subtitle badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-2 mt-3"
          >
            <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
            <p className="font-tech text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-purple-300 font-semibold px-2">
              Once Known As Ty Sciullo • Now A Man Unseen
            </p>
            <div className="h-[1px] w-6 sm:w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </motion.div>
        </div>

        {/* Bio Teaser */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl text-xs sm:text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8 sm:mb-10 text-balance px-2"
        >
          Forged in the blue-collar industrial grit of McKees Rocks. 
          Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind.
        </motion.p>

        {/* Primary Action Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none"
        >
          {/* Main Play Button with React Bits Magnet */}
          <Magnet padding={80} magnetStrength={3} className="w-full sm:w-auto">
            <button
              onClick={() => {
                if (currentTrack?.id !== featuredTrack.id) {
                  onSelectTrack(featuredTrack);
                } else {
                  togglePlay();
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 border border-purple-400/30 active:scale-95 transition-all cursor-pointer"
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

          {/* Quick Jump Pills */}
          <a
            href="#music"
            className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-semibold active:scale-95 transition-all flex items-center gap-2"
          >
            <Headphones className="w-3.5 h-3.5 text-purple-400" />
            <span>Music & Lyrics</span>
          </a>

          <a
            href="#media"
            className="px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-semibold active:scale-95 transition-all flex items-center gap-2"
          >
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span>Media Archive</span>
          </a>
        </motion.div>

        {/* Clean, Balanced 3-Card Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
        >
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
                <MapPin className="w-3 h-3 text-purple-400" /> Origin
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
        </motion.div>

      </div>
    </section>
  );
}
