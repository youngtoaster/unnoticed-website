import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowUpRight, Sparkles, MapPin, Radio, Headphones, Layers } from 'lucide-react';
import { ARTIST_INFO, TRACKS } from '../data/artistData';
import SpotlightCard from './SpotlightCard';

export default function HeroSection({
  currentTrack,
  isPlaying,
  togglePlay,
  onSelectTrack
}) {
  const [identityMode, setIdentityMode] = useState('unnoticed'); // 'unnoticed' or 'ty'
  const featuredTrack = TRACKS[0]; // Andale

  return (
    <section className="relative min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden">
      
      {/* Background ambient light gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[340px] sm:h-[500px] bg-purple-600/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">

        {/* Top Status Pill: Planes / Designeer Micro-Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/25 backdrop-blur-md mb-6 sm:mb-8 group cursor-pointer hover:border-purple-400/60 transition-all shadow-lg shadow-purple-500/5 active:scale-95"
          onClick={() => {
            onSelectTrack(featuredTrack);
            if (!isPlaying) togglePlay();
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] sm:text-xs font-mono tracking-wide text-purple-200">
            STREAMING: <strong className="text-white font-semibold">{featuredTrack.title}</strong>
          </span>
          <span className="text-slate-500 text-xs">|</span>
          <span className="text-[11px] sm:text-xs text-purple-300 font-medium flex items-center gap-0.5">
            Preview <ArrowUpRight className="w-3 h-3" />
          </span>
        </motion.div>

        {/* Main Kinetic Title: Responsive Sizing */}
        <div className="relative mb-4 sm:mb-6 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-display text-5xl xs:text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-black tracking-tighter uppercase leading-[0.95] select-none text-balance"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
              UNNOTICED
            </span>
          </motion.h1>

          {/* Subtitle badge with responsive typography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3"
          >
            <div className="h-[1px] w-6 sm:w-20 bg-gradient-to-r from-transparent to-purple-500/60" />
            <p className="font-tech text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-purple-300 font-semibold px-2">
              Once Known As Ty Sciullo • Now A Man Unseen
            </p>
            <div className="h-[1px] w-6 sm:w-20 bg-gradient-to-l from-transparent to-purple-500/60" />
          </motion.div>
        </div>

        {/* Bio Teaser */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl text-xs sm:text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8 sm:mb-10 text-balance px-2"
        >
          Forged in the blue-collar industrial grit of McKees Rocks, PA. 
          Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind.
        </motion.p>

        {/* Interactive Action Buttons (Stacked cleanly on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-md sm:max-w-none flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 px-2"
        >
          {/* Primary Play Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentTrack.id !== featuredTrack.id) {
                onSelectTrack(featuredTrack);
              }
              togglePlay();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 border border-purple-400/30 active:scale-95"
          >
            {isPlaying && currentTrack.id === featuredTrack.id ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>{isPlaying && currentTrack.id === featuredTrack.id ? 'Pause Preview' : 'Play Featured Track (Ándale)'}</span>
            <span className="flex items-center gap-0.5 h-3 ml-1">
              <span className={`w-0.5 bg-white/80 rounded-full ${isPlaying ? 'h-3 animate-equalizer-1' : 'h-1.5'}`} />
              <span className={`w-0.5 bg-white/80 rounded-full ${isPlaying ? 'h-3.5 animate-equalizer-2' : 'h-2'}`} />
              <span className={`w-0.5 bg-white/80 rounded-full ${isPlaying ? 'h-2.5 animate-equalizer-3' : 'h-1'}`} />
            </span>
          </motion.button>

          {/* Secondary Mobile Actions Row */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <a
              href="#music"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-semibold active:scale-95 transition-all"
            >
              <Headphones className="w-3.5 h-3.5 text-purple-400" />
              <span>Discography</span>
            </a>

            <a
              href="#tour"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-semibold active:scale-95 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tour Dates</span>
            </a>
          </div>
        </motion.div>

        {/* Hero Bento Cards: Swipeable on Mobile, Grid on Tablet/Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="w-full max-w-5xl"
        >
          {/* Mobile Swipe Hint */}
          <div className="md:hidden flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 px-1">
            <span>Swipe across for artist stats</span>
            <span className="text-purple-400">1 / 3 →</span>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 text-left no-scrollbar pb-2">
            
            {/* Card 1: Interactive Identity Morph */}
            <div className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center">
              <SpotlightCard
                tilt={false}
                className="p-5 sm:p-6 h-full flex flex-col justify-between"
                spotlightColor="rgba(168, 85, 247, 0.2)"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono tracking-wider text-purple-400 uppercase flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Metamorphosis
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdentityMode(identityMode === 'unnoticed' ? 'ty' : 'unnoticed');
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-mono border border-purple-500/30 bg-purple-500/10 text-purple-300 active:scale-95"
                    >
                      Flip Persona ⟳
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {identityMode === 'unnoticed' ? (
                      <motion.div
                        key="unnoticed"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1">
                          UNNOTICED
                        </h3>
                        <p className="text-xs text-purple-300 font-mono mb-2">
                          Current Era • The Man Unseen
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Stripped of industry posturing. Highlighting emotional truth, cinematic nocturnes, and raw existential weight.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="ty"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1">
                          TY SCIULLO
                        </h3>
                        <p className="text-xs text-cyan-300 font-mono mb-2">
                          2016–2023 • The Genesis
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Emerging from McKees Rocks with early releases like 'Cold Night' and 'Insanity', establishing underground roots.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Hometown</span>
                  <span className="text-slate-200 font-medium">McKees Rocks, PA</span>
                </div>
              </SpotlightCard>
            </div>

            {/* Card 2: Featured Track Mini-Controller */}
            <div className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center">
              <SpotlightCard
                tilt={false}
                className="p-5 sm:p-6 h-full flex flex-col justify-between"
                spotlightColor="rgba(56, 189, 248, 0.2)"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" /> High Rotation
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {featuredTrack.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={featuredTrack.cover}
                      alt={featuredTrack.title}
                      className="w-12 h-12 rounded-xl object-cover border border-white/[0.1]"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
                        {featuredTrack.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {featuredTrack.featuring || 'UNNOTICED'}
                      </p>
                      <p className="text-[10px] text-cyan-300 font-mono">
                        {featuredTrack.duration} • 2024
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {featuredTrack.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectTrack(featuredTrack);
                      togglePlay();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 active:scale-95"
                  >
                    {isPlaying && currentTrack.id === featuredTrack.id ? 'Pause Preview' : 'Play 30s Snippet'}
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                  <a
                    href={featuredTrack.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    Spotify <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </SpotlightCard>
            </div>

            {/* Card 3: Streaming Metrics */}
            <div className="w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center">
              <SpotlightCard
                tilt={false}
                className="p-5 sm:p-6 h-full flex flex-col justify-between"
                spotlightColor="rgba(236, 72, 153, 0.2)"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono tracking-wider text-pink-400 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Streaming Metrics
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      ● Verified
                    </span>
                  </div>

                  <div className="space-y-2 mb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Monthly Listeners</span>
                      <span className="font-display text-xl sm:text-2xl font-black text-white">{ARTIST_INFO.stats.monthlyListeners}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Lifetime Streams</span>
                      <span className="font-display text-lg font-bold text-slate-200">{ARTIST_INFO.stats.totalStreams}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Key Markets</span>
                  <span className="text-slate-200 font-medium">Pittsburgh & NYC</span>
                </div>
              </SpotlightCard>
            </div>

          </div>
        </motion.div>

        {/* Streaming Platform Icons Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-400"
        >
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 w-full sm:w-auto mb-1 sm:mb-0">
            Worldwide Streams:
          </span>
          <a
            href={ARTIST_INFO.socials.spotify}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] active:scale-95 text-xs text-slate-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Spotify
          </a>
          <a
            href={ARTIST_INFO.socials.appleMusic}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] active:scale-95 text-xs text-slate-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Apple Music
          </a>
          <a
            href={ARTIST_INFO.socials.youtube}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] active:scale-95 text-xs text-slate-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> YouTube
          </a>
          <a
            href={ARTIST_INFO.socials.soundcloud}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] active:scale-95 text-xs text-slate-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> SoundCloud
          </a>
        </motion.div>

      </div>
    </section>
  );
}
