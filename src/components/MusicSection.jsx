import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, ExternalLink, Disc, Music, CheckCircle2, Quote, Sparkles,
  Volume2, Share2, Info, X, ChevronRight, Copy, Check, Eye, EyeOff,
  Radio, Compass, ChevronLeft, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import ShinyText from './reactbits/ShinyText';
import Magnet from './reactbits/Magnet';
import { SpotifyIcon } from './SocialIcons';

export default function MusicSection({
  currentTrack,
  isPlaying,
  togglePlay,
  onSelectTrack
}) {
  const { tracks, artistInfo } = useSiteData();
  const [focusedTrack, setFocusedTrack] = useState(null);
  const [selectedTrackForLyrics, setSelectedTrackForLyrics] = useState(tracks[0] || currentTrack);
  const [activeAnnotation, setActiveAnnotation] = useState(
    (tracks[0] || currentTrack)?.lyrics?.find((l) => l.annotated)?.annotation || null
  );
  const [activeLyricText, setActiveLyricText] = useState(
    (tracks[0] || currentTrack)?.lyrics?.find((l) => l.annotated)?.text || ''
  );
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'annotated' | 'focus'
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Keep selectedTrack and focusedTrack in sync if tracks update from CMS
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      if (focusedTrack) {
        const matchFocused = tracks.find((t) => t.id === focusedTrack.id);
        if (matchFocused) setFocusedTrack(matchFocused);
      }
      const match = tracks.find((t) => t.id === selectedTrackForLyrics?.id);
      if (match) {
        setSelectedTrackForLyrics(match);
      } else {
        setSelectedTrackForLyrics(tracks[0]);
      }
    }
  }, [tracks]);

  // Escape key listener & body scroll lock for Inspect Lyrics Pop-Up
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && focusedTrack) {
        setFocusedTrack(null);
      }
    };
    if (focusedTrack) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedTrack]);

  // When focused track changes, set default active annotation
  const handleFocusTrack = (track) => {
    setFocusedTrack(track);
    setSelectedTrackForLyrics(track);
    const firstAnnotated = track.lyrics?.find((l) => l.annotated);
    if (firstAnnotated) {
      setActiveAnnotation(firstAnnotated.annotation);
      setActiveLyricText(firstAnnotated.text);
    } else {
      setActiveAnnotation(null);
      setActiveLyricText('');
    }
  };

  const handleLyricClick = (line) => {
    if (line.annotated && line.annotation) {
      setActiveAnnotation(line.annotation);
      setActiveLyricText(line.text);
    }
  };

  // Cycle focused tracks (Prev / Next) while staying in focused lyric inspection mode
  const handleNextFocusedTrack = () => {
    if (!tracks || tracks.length === 0) return;
    const currentIdx = tracks.findIndex((t) => t.id === focusedTrack?.id);
    const nextIdx = (currentIdx + 1) % tracks.length;
    handleFocusTrack(tracks[nextIdx]);
  };

  const handlePrevFocusedTrack = () => {
    if (!tracks || tracks.length === 0) return;
    const currentIdx = tracks.findIndex((t) => t.id === focusedTrack?.id);
    const prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    handleFocusTrack(tracks[prevIdx]);
  };

  // Tour through annotations
  const annotatedLines = (selectedTrackForLyrics?.lyrics || []).filter((l) => l.annotated);
  const currentAnnotIndex = annotatedLines.findIndex((l) => l.annotation?.content === activeAnnotation?.content);

  const handleNextAnnotation = () => {
    if (annotatedLines.length === 0) return;
    const nextIdx = (currentAnnotIndex + 1) % annotatedLines.length;
    setActiveAnnotation(annotatedLines[nextIdx].annotation);
    setActiveLyricText(annotatedLines[nextIdx].text);
  };

  const handlePrevAnnotation = () => {
    if (annotatedLines.length === 0) return;
    const prevIdx = (currentAnnotIndex - 1 + annotatedLines.length) % annotatedLines.length;
    setActiveAnnotation(annotatedLines[prevIdx].annotation);
    setActiveLyricText(annotatedLines[prevIdx].text);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const isCurrentTrackPlaying = isPlaying && currentTrack?.id === selectedTrackForLyrics?.id;

  return (
    <section id="music" className="relative py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-2">
            <Music className="w-3.5 h-3.5" />
            <ShinyText text="SONIC ARCHIVE & TELEMETRY" speed={4} />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            DISCOGRAPHY & GENIUS INSIGHTS
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-lg">
            Stream high-fidelity studio previews, dissect verified line-by-line Genius breakdowns, or launch external DSPs.
          </p>
        </div>

        {/* Direct Navigation to Stream Locations Section */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="#stream-locations"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0e0f18] hover:bg-[#181928] text-xs font-mono font-semibold text-purple-300 border border-white/[0.12] transition-colors active:scale-95 shadow-md shadow-black"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Where to Stream →</span>
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STUDIO TRACKS DISCOGRAPHY CATALOG GRID                  */}
      {/* Clicking any track opens the Inspect Lyrics Pop-Up Menu  */}
      {/* ======================================================== */}
      <div className="space-y-6">
          {/* Discography Grid Sub-Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
                Studio Catalog ({tracks.length} Master Releases)
              </span>
              <span className="text-slate-500 font-mono text-xs hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Click any song to inspect line-by-line Genius lyrics
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              24-Bit Studio Masters • Verified Songwriting Telemetry
            </span>
          </div>

          {/* Responsive Track Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {tracks.map((track, trackIdx) => {
              const isThisPlaying = isPlaying && currentTrack?.id === track.id;
              const trackAnnotatedCount = (track.lyrics || []).filter((l) => l.annotated).length;
              const firstAnnotatedLine = track.lyrics?.find((l) => l.annotated);

              return (
                <SpotlightCard
                  key={track.id}
                  spotlightColor="rgba(168, 85, 247, 0.22)"
                  tilt={false}
                  onClick={() => handleFocusTrack(track)}
                  className="p-5 cursor-pointer transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-950/40 group flex flex-col justify-between"
                >
                  <div>
                    {/* High-Res Artwork Showcase with Hover Play Overlay */}
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 border border-white/[0.1] shadow-lg bg-black/40">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090a10]/80 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                          #{trackIdx < 9 ? `0${trackIdx + 1}` : trackIdx + 1} • {track.releaseYear}
                        </span>
                        {trackAnnotatedCount > 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 font-bold shadow-md flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {trackAnnotatedCount} Genius Notes
                          </span>
                        )}
                      </div>

                      {/* Center Play Button Overlay */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentTrack?.id !== track.id) {
                            onSelectTrack(track);
                          } else {
                            togglePlay();
                          }
                        }}
                        className={`absolute inset-0 m-auto w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isThisPlaying
                            ? 'theme-primary-btn scale-100 opacity-100'
                            : 'bg-black/60 text-white border border-white/30 backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:scale-100 hover:scale-105'
                        }`}
                        title={isThisPlaying ? 'Pause Studio Preview' : 'Play Studio Preview'}
                        aria-label={`Play preview for ${track.title}`}
                      >
                        {isThisPlaying ? (
                          <Pause className="w-6 h-6 fill-current" />
                        ) : (
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Playing Status Pill on Card */}
                      {isThisPlaying && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-400/40 text-[10px] font-mono text-purple-200">
                          <span className="flex items-center gap-0.5 h-2.5">
                            <span className="w-0.5 h-2.5 bg-purple-400 animate-pulse" />
                            <span className="w-0.5 h-3 bg-cyan-400 animate-bounce" />
                            <span className="w-0.5 h-2 bg-purple-300 animate-pulse" />
                          </span>
                          <span>Now Playing</span>
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-300">
                        {track.duration}
                      </div>
                    </div>

                    {/* Track Info */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-black text-xl text-white group-hover:text-purple-300 transition-colors truncate">
                          {track.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate">
                        UNNOTICED {track.featuring ? `(feat. ${track.featuring})` : '• Solo Release'}
                      </p>

                      {/* Lyric Excerpt Teaser */}
                      {firstAnnotatedLine && (
                        <div className="pt-2">
                          <p className="text-xs text-slate-400 italic font-sans line-clamp-2 border-l-2 border-purple-500/40 pl-2">
                            "{firstAnnotatedLine.text}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    {/* Quick Listen Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTrack?.id !== track.id) {
                          onSelectTrack(track);
                        } else {
                          togglePlay();
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer ${
                        isThisPlaying
                          ? 'bg-purple-600/30 text-purple-200 border border-purple-400/50'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08]'
                      }`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-3 h-3 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Preview</span>
                        </>
                      )}
                    </button>

                    {/* Focus / Inspect Lyrics Trigger Button */}
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all">
                      <span>Inspect Lyrics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

      {/* ======================================================== */}
      {/* OVERHAULED INSPECT LYRICS POP-UP OVERLAY (UI SITES SPEC)  */}
      {/* Prominent vinyl artwork, Apple Music/Genius fluid layout  */}
      {/* ======================================================== */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {focusedTrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-xl"
              onClick={() => setFocusedTrack(null)}
            >
              {/* Modal Window Shell (Modern Glass & Obsidian Frame) */}
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 340 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-7xl h-[92vh] max-h-[820px] rounded-3xl border border-white/[0.14] bg-[#07080f] shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-left"
              >
                {/* 1. DYNAMIC AMBIENT ARTWORK BACKDROP WASH */}
                {/* Bathes the entire pop-up in the track's authentic album art colors */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl -z-10">
                  <img
                    src={focusedTrack.cover}
                    alt=""
                    className="w-full h-full object-cover filter blur-[90px] opacity-25 scale-125 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-[#07080f]/80 backdrop-blur-2xl" />
                  {/* Subtle dot matrix grid texture from modern UI libraries */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
                </div>

                {/* Ambient Radial Lights */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-[110px] pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-[110px] pointer-events-none -z-10" />

                {/* 2. OVERHAULED MODAL FLOATING TOP BAR */}
                <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-white/[0.03] backdrop-blur-md">
                  {/* Track Stepper (Prev / Track N / Next) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={handlePrevFocusedTrack}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-mono transition-all active:scale-95 cursor-pointer shadow-sm"
                      title="Previous Master Track"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Prev</span>
                    </button>

                    <span className="text-xs font-mono text-purple-300 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 font-semibold whitespace-nowrap shadow-sm">
                      Track {(tracks.findIndex((t) => t.id === focusedTrack.id) + 1)} of {tracks.length}
                    </span>

                    <button
                      onClick={handleNextFocusedTrack}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-mono transition-all active:scale-95 cursor-pointer shadow-sm"
                      title="Next Master Track"
                    >
                      <span className="hidden xs:inline">Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Centered Track Badge with ShinyText */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <ShinyText text={`INSPECTING: ${focusedTrack.title.toUpperCase()}`} speed={4} />
                  </div>

                  {/* Esc Key & Close Button */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-[10px] text-slate-400 font-mono bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.08]">
                      Esc
                    </span>
                    <button
                      onClick={() => setFocusedTrack(null)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 hover:rotate-90"
                      aria-label="Close Inspect Lyrics Modal"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* 3. MAIN CONTENT STAGE (3 COLUMNS ON DESKTOP, BALANCED & SCALED) */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0">
                  
                  {/* ======================================================== */}
                  {/* COLUMN 1: PROMINENT VINYL ARTWORK & AUDIO STUDIO DECK     */}
                  {/* ======================================================== */}
                  <div className="lg:w-[370px] xl:w-[410px] shrink-0 p-5 xl:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-black/35 backdrop-blur-md overflow-hidden">
                    <div>
                      {/* PROMINENT 3D VINYL SLEEVE & DISC DISPLAY (Fixed Height Container: Zero Layout Jitter) */}
                      {/* Disc slides out prominently with dramatic exposure */}
                      <div className="relative w-full max-w-[340px] xl:max-w-[380px] h-48 sm:h-52 xl:h-56 mx-auto my-2 flex items-center justify-center shrink-0">
                        {/* Vinyl Disc Sliding Out Prominently Behind Sleeve When Playing, Put Away Inside Sleeve When Paused */}
                        <motion.div
                          animate={
                            isPlaying && currentTrack?.id === focusedTrack.id
                              ? { rotate: 360, x: 125, scale: 1, opacity: 1 }
                              : { rotate: 0, x: 0, scale: 0.92, opacity: 0 }
                          }
                          transition={
                            isPlaying && currentTrack?.id === focusedTrack.id
                              ? {
                                  rotate: { duration: 4.5, repeat: Infinity, ease: 'linear' },
                                  x: { type: 'spring', stiffness: 120, damping: 18 },
                                  opacity: { duration: 0.25 },
                                  scale: { type: 'spring', stiffness: 120, damping: 18 }
                                }
                              : {
                                  rotate: { duration: 0.3 },
                                  x: { type: 'spring', stiffness: 140, damping: 20 },
                                  opacity: { duration: 0.2 },
                                  scale: { type: 'spring', stiffness: 140, damping: 20 }
                                }
                          }
                          className="absolute w-44 h-44 sm:w-48 sm:h-48 xl:w-52 xl:h-52 rounded-full bg-[#0d0e14] border-[7px] border-[#161722] shadow-2xl flex items-center justify-center pointer-events-none z-0"
                          style={{
                            boxShadow: '0 15px 40px rgba(0,0,0,0.85), inset 0 0 25px rgba(0,0,0,0.9)',
                            backgroundImage: 'repeating-radial-gradient(circle, #0e0f16 0px, #0e0f16 2px, #181926 3px, #0e0f16 4px)'
                          }}
                        >
                          {/* Vinyl Center Label */}
                          <div className="w-18 h-18 sm:w-20 sm:h-20 xl:w-22 xl:h-22 rounded-full overflow-hidden border-2 border-purple-400/40 relative shadow-inner flex items-center justify-center">
                            <img
                              src={focusedTrack.cover}
                              alt="Vinyl Center"
                              className="w-full h-full object-cover"
                            />
                            {/* Center Spindle Hole */}
                            <div className="absolute w-3.5 h-3.5 rounded-full bg-[#07080e] border border-white/50 shadow-sm" />
                          </div>
                        </motion.div>

                        {/* Main High-Res Album Jacket / Sleeve (Smoothly slides left when playing, centered when not playing) */}
                        <motion.div
                          animate={
                            isPlaying && currentTrack?.id === focusedTrack.id
                              ? { x: -60 }
                              : { x: 0 }
                          }
                          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                          className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 xl:w-52 xl:h-52 rounded-2xl overflow-hidden border border-white/[0.18] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group shrink-0 bg-[#0c0d16]"
                        >
                          <img
                            src={focusedTrack.cover}
                            alt={focusedTrack.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Gloss sheen line overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.1] to-transparent pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                            <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20 font-semibold shadow-md">
                              {focusedTrack.releaseYear} Cut
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
                            <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-slate-200 font-semibold shadow-md">
                              {focusedTrack.duration}
                            </span>
                          </div>

                          {/* Center Hover / Playing Audio Trigger Overlay */}
                          <button
                            onClick={() => {
                              if (currentTrack?.id !== focusedTrack.id) {
                                onSelectTrack(focusedTrack);
                              } else {
                                togglePlay();
                              }
                            }}
                            className={`absolute inset-0 m-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                              isPlaying && currentTrack?.id === focusedTrack.id
                                ? 'theme-primary-btn scale-100 opacity-100'
                                : 'bg-black/65 text-white border border-white/30 backdrop-blur-md opacity-0 group-hover:opacity-100 hover:scale-105'
                            }`}
                            title={isPlaying && currentTrack?.id === focusedTrack.id ? 'Pause Preview' : 'Play Preview'}
                          >
                            {isPlaying && currentTrack?.id === focusedTrack.id ? (
                              <Pause className="w-5 h-5 fill-current" />
                            ) : (
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            )}
                          </button>
                        </motion.div>
                      </div>

                      {/* Track Identity Header (Locked Heights: 100% Elimination of Any UI Jumping) */}
                      <div className="text-center mt-2 mb-1 shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase font-semibold mb-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Studio Discography Master</span>
                        </div>

                        <div className="h-7 sm:h-8 flex items-center justify-center">
                          <h3 className="font-display font-black text-xl xl:text-2xl text-white tracking-tight truncate">
                            {focusedTrack.title}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-300 font-mono h-5 flex items-center justify-center">
                          <span className="text-white font-semibold">UNNOTICED</span>{' '}
                          {focusedTrack.featuring && !focusedTrack.featuring.toLowerCase().includes('unnoticed') && (
                            <span className="text-purple-300 font-normal">
                              • feat. {focusedTrack.featuring.replace(/^(feat\.|ft\.)\s*/i, '')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Audio Controls & DSP Destination Action Row (Fixed Heights to Prevent Any UI Jumping) */}
                    <div className="space-y-2.5 pt-3 border-t border-white/[0.08] mt-auto shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (currentTrack?.id !== focusedTrack.id) {
                            onSelectTrack(focusedTrack);
                          } else {
                            togglePlay();
                          }
                        }}
                        className="w-full h-11 sm:h-12 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 active:scale-95 transition-all cursor-pointer theme-primary-btn overflow-hidden"
                      >
                        {isPlaying && currentTrack?.id === focusedTrack.id ? (
                          <>
                            <Pause className="w-4 h-4 fill-current shrink-0" />
                            <span>Pause Studio Preview</span>
                            <span className="flex items-center gap-0.5 h-3 ml-1 shrink-0">
                              <span className="w-0.5 h-2.5 bg-current rounded-full animate-equalizer-1" />
                              <span className="w-0.5 h-3.5 bg-current rounded-full animate-equalizer-2" />
                              <span className="w-0.5 h-2 bg-current rounded-full animate-equalizer-3" />
                            </span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current ml-0.5 shrink-0" />
                            <span>Play Studio Preview ({focusedTrack.duration})</span>
                          </>
                        )}
                      </motion.button>

                      <div className="grid grid-cols-2 gap-2 shrink-0">
                        <a
                          href={focusedTrack.spotifyUrl || artistInfo.socials?.spotify}
                          target="_blank"
                          rel="noreferrer"
                          className="h-10 px-3 rounded-xl bg-[#1ed760]/15 hover:bg-[#1ed760]/25 border border-[#1ed760]/40 text-[#1ed760] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 shrink-0"
                        >
                          <SpotifyIcon className="w-4 h-4 fill-current shrink-0" />
                          <span className="truncate">Spotify</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                        </a>

                        <a
                          href={focusedTrack.appleMusicUrl || artistInfo.socials?.appleMusic}
                          target="_blank"
                          rel="noreferrer"
                          className="h-10 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 shrink-0"
                        >
                          <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate">Apple Music</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                        </a>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 shrink-0">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Genius Insights: <strong className="text-amber-300 font-bold">{annotatedLines.length}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* COLUMN 2: OVERHAULED GENIUS SYNCHRONIZED LYRICS          */}
                  {/* ======================================================== */}
                  <div className="flex-1 p-5 xl:p-6 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col min-h-0 bg-black/15">
                    {/* Lyrics Header & Filter Pills */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 shrink-0">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Genius Synchronized Lyrics
                        </span>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Click any highlighted line to reveal verified backstory
                        </p>
                      </div>

                      {/* Filter Segmented Control */}
                      <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] shadow-inner">
                        <button
                          onClick={() => setFilterMode('all')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all active:scale-95 cursor-pointer ${
                            filterMode === 'all' ? 'theme-primary-btn font-bold' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          All ({selectedTrackForLyrics.lyrics?.length || 0})
                        </button>
                        <button
                          onClick={() => setFilterMode('annotated')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all active:scale-95 cursor-pointer ${
                            filterMode === 'annotated' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Genius Notes ({annotatedLines.length})
                        </button>
                        <button
                          onClick={() => setFilterMode(filterMode === 'focus' ? 'all' : 'focus')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all active:scale-95 cursor-pointer ${
                            filterMode === 'focus' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Focus
                        </button>
                      </div>
                    </div>

                    {/* Scrollable & Centered Dynamic Lyrics Window */}
                    <div className={`flex-1 overflow-y-auto pr-2 min-h-0 select-none custom-scrollbar flex flex-col ${
                      (selectedTrackForLyrics.lyrics?.length || 0) <= 5 ? 'justify-center py-4' : 'space-y-1.5 py-1'
                    }`}>
                      {selectedTrackForLyrics.lyrics?.map((line, idx) => {
                        const isAnnotated = line.annotated;
                        const isSelected = activeAnnotation?.content === line.annotation?.content;

                        if (filterMode === 'annotated' && !isAnnotated) return null;

                        return (
                          <div
                            key={idx}
                            className={`rounded-2xl px-3.5 py-2.5 transition-all duration-200 ${
                              isSelected
                                ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-transparent border-l-4 border-amber-400 shadow-[0_4px_20px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/30'
                                : filterMode === 'focus' && !isSelected
                                ? 'opacity-25 blur-[0.4px] hover:opacity-75 hover:blur-none transition-all'
                                : 'hover:bg-white/[0.04] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              {/* Monospace Line Number */}
                              <span className="font-mono text-[10px] text-slate-500 select-none shrink-0 w-7">
                                #{idx < 9 ? `0${idx + 1}` : idx + 1}
                              </span>

                              {/* Lyric Text */}
                              <div className="flex-1 min-w-0">
                                {isAnnotated ? (
                                  <button
                                    onClick={() => handleLyricClick(line)}
                                    className={`text-left text-sm sm:text-base leading-relaxed tracking-wide transition-all cursor-pointer font-sans block w-full ${
                                      isSelected ? 'text-white font-bold' : 'text-amber-200/95 hover:text-white'
                                    }`}
                                  >
                                    <span className={`inline relative py-0.5 px-2 rounded-lg ${
                                      isSelected
                                        ? 'bg-amber-400/25 border-b-2 border-amber-400 shadow-sm shadow-amber-400/30'
                                        : 'bg-amber-500/10 hover:bg-amber-500/20 border-b border-dashed border-amber-400/60'
                                    }`}>
                                      "{line.text}"
                                    </span>
                                  </button>
                                ) : (
                                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                                    "{line.text}"
                                  </p>
                                )}
                              </div>

                              {/* Interactive Genius Chip */}
                              {isAnnotated && (
                                <button
                                  onClick={() => handleLyricClick(line)}
                                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                                    isSelected
                                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/40'
                                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>{isSelected ? 'Active' : 'Genius'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Equalizer Telemetry Strip */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-2 bg-purple-400 animate-pulse rounded-full" />
                          <span className="w-0.5 h-3 bg-cyan-400 animate-bounce rounded-full" />
                          <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse rounded-full" />
                        </span>
                        <span>Genius Verified Sync</span>
                      </div>
                      <span className="text-slate-500">Tap any line to inspect</span>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* COLUMN 3: OVERHAULED GENIUS VERIFIED ARTIST DOSSIER      */}
                  {/* ======================================================== */}
                  <div className="lg:w-[340px] xl:w-[380px] shrink-0 p-5 xl:p-6 flex flex-col min-h-0 bg-black/35 backdrop-blur-md">
                    {/* Header: Verified Artist Badge & Note Navigation */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 shrink-0">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src={artistInfo.avatar}
                            alt="UNNOTICED"
                            className="w-8 h-8 rounded-full object-cover border-2 border-purple-400 shadow-md"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[8px] font-black border border-black shadow">
                            ✓
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display font-bold text-white text-xs">
                              UNNOTICED Verified
                            </h4>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          </div>
                          <span className="text-[9.5px] text-purple-300 font-mono">Official Editorial Note</span>
                        </div>
                      </div>

                      {/* Prev / Next Annotation Navigation */}
                      {annotatedLines.length > 1 && (
                        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.08] shadow-inner">
                          <button
                            onClick={handlePrevAnnotation}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors active:scale-90 cursor-pointer"
                            title="Previous Genius Note"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono text-purple-300 px-1.5 font-bold">
                            {currentAnnotIndex + 1} / {annotatedLines.length}
                          </span>
                          <button
                            onClick={handleNextAnnotation}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors active:scale-90 cursor-pointer"
                            title="Next Genius Note"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Active Annotation Pull Quote Card */}
                    {activeLyricText && (
                      <div className="mb-3 p-3 border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl shrink-0 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-mono text-amber-300 uppercase tracking-widest font-bold flex items-center gap-1">
                            <Quote className="w-3 h-3 text-amber-400" /> Annotated Verse
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">Genius Original</span>
                        </div>
                        <p className="font-display italic text-xs xl:text-sm text-amber-100 font-bold leading-snug">
                          "{activeLyricText}"
                        </p>
                      </div>
                    )}

                    {/* Narrative Commentary Body */}
                    {activeAnnotation ? (
                      <div className="flex-1 overflow-y-auto pr-1.5 text-xs sm:text-[13px] text-slate-200 font-sans font-light leading-relaxed custom-scrollbar min-h-0 mb-3 space-y-3">
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-sm">
                          <p className="whitespace-pre-line text-slate-200 leading-relaxed font-sans">
                            {activeAnnotation.content}
                          </p>
                        </div>

                        {/* Songwriting Dossier Chips */}
                        <div className="p-3 rounded-2xl bg-[#090a14] border border-white/[0.06] space-y-1.5 text-[10px] font-mono">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Author:</span>
                            <span className="text-white font-semibold">{activeAnnotation.author || 'UNNOTICED'}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Verification:</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <span>✓</span> Official Artist Wax
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Origin:</span>
                            <span className="text-purple-300">McKees Rocks, Pennsylvania</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                        </div>
                        <div>
                          <p className="font-display text-white text-sm font-bold">Select Any Highlighted Verse</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                            Click any underlined line in the middle column to unpack verified artist commentary and songwriting insights.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Toolbar */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 mt-auto shrink-0">
                      <button
                        onClick={() => copyToClipboard(`"${activeLyricText}" — UNNOTICED: ${activeAnnotation?.content || ''}`)}
                        disabled={!activeAnnotation}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white font-mono text-[11px] transition-all active:scale-95 disabled:opacity-40 cursor-pointer border border-white/[0.08]"
                      >
                        {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedQuote ? 'Copied Insight!' : 'Copy Quote'}</span>
                      </button>

                      <button
                        onClick={() => setFocusedTrack(null)}
                        className="px-5 py-2 rounded-full font-bold text-xs theme-primary-btn transition-all active:scale-95 cursor-pointer"
                      >
                        Done Reading
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
}
