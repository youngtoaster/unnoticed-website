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
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks', 'spotifyEmbed', 'platforms'
  const [mobileSubTab, setMobileSubTab] = useState('list'); // 'list' or 'lyrics'
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

        {/* View Switcher Tabs (Planes-Style Sliding Segmented Control) */}
        <div className="flex items-center p-1 rounded-full bg-[#0e0f18] border border-white/[0.12] self-start md:self-auto overflow-x-auto no-scrollbar max-w-full shadow-lg shadow-black">
          {[
            { id: 'tracks', label: `Studio Tracks (${tracks.length})` },
            { id: 'spotifyEmbed', label: 'Spotify Player' },
            { id: 'platforms', label: 'Streaming Hub' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 active:scale-95 ${
                activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="musicTabPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: STUDIO TRACKS DISCOGRAPHY CATALOG GRID            */}
      {/* Clicking any track opens the Inspect Lyrics Pop-Up Menu  */}
      {/* ======================================================== */}
      {activeTab === 'tracks' && (
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
                            ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/60 scale-100 opacity-100'
                            : 'bg-black/60 text-white border border-white/30 backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:scale-100 hover:bg-purple-600 hover:border-purple-400'
                        }`}
                        title={isThisPlaying ? 'Pause Studio Preview' : 'Play Studio Preview'}
                        aria-label={`Play preview for ${track.title}`}
                      >
                        {isThisPlaying ? (
                          <Pause className="w-6 h-6 fill-white" />
                        ) : (
                          <Play className="w-6 h-6 fill-white ml-0.5" />
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
      )}

      {/* ======================================================== */}
      {/* TAB 2: SPOTIFY OFFICIAL EMBEDDED PLAYER                 */}
      {/* ======================================================== */}
      {activeTab === 'spotifyEmbed' && (
        <SpotlightCard className="p-5 sm:p-10" spotlightColor="rgba(16, 185, 129, 0.18)">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-white/[0.08] gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Spotify Official Player
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Listen to Full Releases on Spotify
                </h3>
              </div>

              <a
                href={artistInfo.socials.spotify}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                Follow on Spotify <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Official Spotify Iframe Player */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/[0.1]">
              <iframe
                title="Spotify Embed Player"
                src="https://open.spotify.com/embed/album/5R2zsn8QgVVOpFY8NUVCcp?utm_source=generator&theme=0"
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl"
              />
            </div>
            
            <p className="text-xs text-slate-400 mt-4 text-center font-mono">
              Requires Spotify app or account for full song lengths. For instant self-hosted snippets, tap play on any track card!
            </p>
          </div>
        </SpotlightCard>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STREAMING PLATFORM LINKS HUB                     */}
      {/* ======================================================== */}
      {activeTab === 'platforms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'Spotify',
              desc: 'Official artist catalog, curated playlists, and algorithmic radio.',
              url: artistInfo.socials.spotify,
              badge: 'Most Popular',
              accent: 'bg-emerald-500'
            },
            {
              name: 'Apple Music',
              desc: 'Lossless audio streaming, Spatial Audio masters, and artist radio.',
              url: artistInfo.socials.appleMusic,
              badge: 'Lossless Audio',
              accent: 'bg-pink-500'
            },
            {
              name: 'YouTube Music',
              desc: 'Official music videos, visualizers, live performance sessions.',
              url: artistInfo.socials.youtube,
              badge: 'Video & Audio',
              accent: 'bg-red-500'
            },
            {
              name: 'SoundCloud',
              desc: 'Exclusive early demo snippets, unreleased beats, and bootleg mixes.',
              url: artistInfo.socials.soundcloud,
              badge: 'Underground',
              accent: 'bg-amber-500'
            }
          ].map((platform) => (
            <SpotlightCard
              key={platform.name}
              className="p-5 sm:p-6 flex flex-col justify-between"
              spotlightColor="rgba(255, 255, 255, 0.08)"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-3 h-3 rounded-full ${platform.accent}`} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">
                    {platform.badge}
                  </span>
                </div>
                <h4 className="font-display text-xl font-bold text-white mb-2">
                  {platform.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {platform.desc}
                </p>
              </div>

              <a
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                Open {platform.name} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* INSPECT LYRICS POP-UP OVERLAY (OVERLAYS SITE MENU BAR)   */}
      {/* Pop-up dialog overlaying site menu with zero desktop scroll */}
      {/* ======================================================== */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {focusedTrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md"
              onClick={() => setFocusedTrack(null)}
            >
              {/* Modal Window Container */}
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl h-[92vh] max-h-[760px] rounded-3xl border border-white/[0.14] bg-[#0c0d16] shadow-2xl shadow-black flex flex-col overflow-hidden text-left"
              >
                {/* Glowing Backlight */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

                {/* 1. Modal Top Bar */}
                <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-white/[0.02]">
                  {/* Stepper Between Tracks */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={handlePrevFocusedTrack}
                      className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-all active:scale-95 cursor-pointer"
                      title="Previous Track"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Prev</span>
                    </button>

                    <span className="text-xs font-mono text-purple-300 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 whitespace-nowrap">
                      Track {(tracks.findIndex((t) => t.id === focusedTrack.id) + 1)} of {tracks.length}
                    </span>

                    <button
                      onClick={handleNextFocusedTrack}
                      className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-all active:scale-95 cursor-pointer"
                      title="Next Track"
                    >
                      <span className="hidden xs:inline">Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Center Info Title (Desktop/Tablet) */}
                  <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspecting: <strong className="text-white">{focusedTrack.title}</strong></span>
                  </div>

                  {/* Close (X) Button */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-[10px] text-slate-400 font-mono bg-white/[0.04] px-2 py-1 rounded border border-white/[0.08]">
                      Esc
                    </span>
                    <button
                      onClick={() => setFocusedTrack(null)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                      aria-label="Close Inspect Lyrics Modal"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* 2. Main Modal Content Stage: 3 Columns on Desktop (Zero Window Scroll), 1 Column on Mobile (Scrollable) */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0">
                  
                  {/* COLUMN 1: TRACK SHOWCASE & AUDIO CONTROLS (Left, ~250px on desktop) */}
                  <div className="lg:w-60 xl:w-68 shrink-0 p-4 xl:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-black/20">
                    {/* Artwork with Vinyl Spin Overlay */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 xl:w-44 xl:h-44 mx-auto rounded-xl overflow-hidden mb-3 border border-white/[0.12] shadow-xl shrink-0 group">
                      <img
                        src={focusedTrack.cover}
                        alt={focusedTrack.title}
                        className="w-full h-full object-cover"
                      />
                      {isPlaying && currentTrack?.id === focusedTrack.id && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                          <Disc className="w-12 h-12 text-purple-400 animate-spin" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                          {focusedTrack.releaseYear} Cut
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-slate-300">
                          {focusedTrack.duration}
                        </span>
                      </div>
                    </div>

                    {/* Track Title & Artist Info */}
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono uppercase font-semibold mb-1">
                        Now Inspecting
                      </div>
                      <h3 className="font-display font-black text-base xl:text-lg text-white tracking-tight truncate">
                        {focusedTrack.title}
                      </h3>
                      <p className="text-xs text-purple-300 font-mono mt-0.5 truncate">
                        UNNOTICED {focusedTrack.featuring && `(feat. ${focusedTrack.featuring})`}
                      </p>
                    </div>

                    {/* Playback Controls & Spotify Link */}
                    <div className="space-y-2 mt-auto">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          if (currentTrack?.id !== focusedTrack.id) {
                            onSelectTrack(focusedTrack);
                          } else {
                            togglePlay();
                          }
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
                      >
                        {isPlaying && currentTrack?.id === focusedTrack.id ? (
                          <>
                            <Pause className="w-4 h-4 fill-white" />
                            <span>Pause Preview</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                            <span>Play Preview ({focusedTrack.duration})</span>
                          </>
                        )}
                      </motion.button>

                      <a
                        href={focusedTrack.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                      >
                        <span>Full Song on Spotify</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Genius Notes: <strong className="text-amber-300">{annotatedLines.length}</strong></span>
                        <span>24-Bit Studio Master</span>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2: COMPLETE LYRICS STREAM (Center, flex-1) */}
                  <div className="flex-1 p-4 xl:p-5 border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col min-h-0">
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-2.5 shrink-0">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1 font-bold">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Genius Synchronized Lyrics
                        </span>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Click any underlined line to inspect notes
                        </p>
                      </div>

                      {/* Filter Pills */}
                      <div className="flex items-center gap-1 p-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                        <button
                          onClick={() => setFilterMode('all')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-colors active:scale-95 cursor-pointer ${
                            filterMode === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setFilterMode('annotated')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-colors active:scale-95 cursor-pointer ${
                            filterMode === 'annotated' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Notes ({annotatedLines.length})
                        </button>
                        <button
                          onClick={() => setFilterMode(filterMode === 'focus' ? 'all' : 'focus')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-colors active:scale-95 cursor-pointer ${
                            filterMode === 'focus' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Focus
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Lyrics Window */}
                    <div className="flex-1 overflow-y-auto pr-1.5 space-y-1 min-h-0 select-none custom-scrollbar">
                      {selectedTrackForLyrics.lyrics?.map((line, idx) => {
                        const isAnnotated = line.annotated;
                        const isSelected = activeAnnotation?.content === line.annotation?.content;

                        if (filterMode === 'annotated' && !isAnnotated) return null;

                        return (
                          <div
                            key={idx}
                            className={`rounded-xl px-2.5 py-1.5 transition-all duration-150 ${
                              isSelected
                                ? 'bg-gradient-to-r from-purple-950/70 via-purple-900/40 to-amber-950/20 border border-purple-500/50 shadow-md shadow-purple-950/30'
                                : filterMode === 'focus' && !isSelected
                                ? 'opacity-30 blur-[0.3px] hover:opacity-80 hover:blur-none'
                                : 'hover:bg-white/[0.04] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[9px] text-slate-500 select-none shrink-0 w-6">
                                #{idx < 9 ? `0${idx + 1}` : idx + 1}
                              </span>

                              <div className="flex-1 min-w-0">
                                {isAnnotated ? (
                                  <button
                                    onClick={() => handleLyricClick(line)}
                                    className={`text-left text-xs sm:text-[13px] leading-relaxed tracking-wide transition-all cursor-pointer font-sans block w-full ${
                                      isSelected ? 'text-white font-bold' : 'text-amber-200/90 hover:text-white'
                                    }`}
                                  >
                                    <span className={`inline relative py-0.5 px-1.5 rounded-md ${
                                      isSelected
                                        ? 'bg-amber-400/25 border-b-2 border-amber-400 shadow-sm shadow-amber-400/30'
                                        : 'bg-amber-500/10 hover:bg-amber-500/20 border-b border-dashed border-amber-500/50'
                                    }`}>
                                      "{line.text}"
                                    </span>
                                  </button>
                                ) : (
                                  <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                                    "{line.text}"
                                  </p>
                                )}
                              </div>

                              {isAnnotated && (
                                <button
                                  onClick={() => handleLyricClick(line)}
                                  className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-mono flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                                    isSelected
                                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/30'
                                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{isSelected ? 'Active' : 'Genius'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* COLUMN 3: GENIUS VERIFIED ARTIST EDITORIAL INSPECTOR (Right, ~320px on desktop) */}
                  <div className="lg:w-80 xl:w-96 shrink-0 p-4 xl:p-5 flex flex-col min-h-0 bg-black/20">
                    {/* Header: Verified Artist Badge & Navigation */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-2.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <img
                            src={artistInfo.avatar}
                            alt="UNNOTICED"
                            className="w-7 h-7 rounded-full object-cover border border-purple-400"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-purple-600 flex items-center justify-center text-white text-[7px] border border-black">
                            ✓
                          </span>
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-white text-xs">
                            UNNOTICED Verified
                          </h4>
                          <span className="text-[9px] text-slate-400 font-mono">Official Editorial Note</span>
                        </div>
                      </div>

                      {/* Prev / Next Annotation Navigation */}
                      {annotatedLines.length > 1 && (
                        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-full border border-white/[0.08]">
                          <button
                            onClick={handlePrevAnnotation}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors active:scale-90 cursor-pointer"
                            title="Previous Annotation"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <span className="text-[9.5px] font-mono text-purple-300 px-1">
                            {currentAnnotIndex + 1} / {annotatedLines.length}
                          </span>
                          <button
                            onClick={handleNextAnnotation}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors active:scale-90 cursor-pointer"
                            title="Next Annotation"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Active Annotation Pull Quote */}
                    {activeLyricText && (
                      <div className="mb-2.5 pl-2.5 border-l-2 border-amber-400 py-1 bg-amber-500/[0.04] rounded-r-lg shrink-0">
                        <span className="text-[9px] font-mono text-amber-400/80 uppercase tracking-widest block mb-0.5">
                          Annotated Line:
                        </span>
                        <p className="font-display italic text-xs xl:text-sm text-amber-100 font-semibold leading-snug">
                          "{activeLyricText}"
                        </p>
                      </div>
                    )}

                    {/* Narrative Commentary Body */}
                    {activeAnnotation ? (
                      <div className="flex-1 overflow-y-auto pr-1 text-xs text-slate-300 font-sans font-light leading-relaxed custom-scrollbar min-h-0 mb-3">
                        {activeAnnotation.content}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                        <p className="font-display text-white text-xs font-semibold">Select Any Highlighted Verse</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Click any underlined line in the middle column to unpack verified artist commentary and songwriting insights.
                        </p>
                      </div>
                    )}

                    {/* Bottom Action Toolbar */}
                    <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2 mt-auto shrink-0">
                      <button
                        onClick={() => copyToClipboard(`"${activeLyricText}" — UNNOTICED: ${activeAnnotation?.content || ''}`)}
                        disabled={!activeAnnotation}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white font-mono text-[10px] transition-colors active:scale-95 disabled:opacity-40 cursor-pointer"
                      >
                        {copiedQuote ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedQuote ? 'Copied Insight!' : 'Copy Quote'}</span>
                      </button>

                      <button
                        onClick={() => setFocusedTrack(null)}
                        className="px-3 py-1.5 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-[10px] font-mono transition-colors active:scale-95 cursor-pointer"
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
