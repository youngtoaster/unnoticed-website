import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, ExternalLink, Disc, Music, CheckCircle2, Quote, Sparkles,
  Volume2, Share2, Info, X, ChevronRight, Copy, Check, Eye, EyeOff,
  Radio, Compass, ChevronLeft, ArrowRight
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

  // Keep selectedTrack in sync if tracks update from CMS
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      const match = tracks.find((t) => t.id === selectedTrackForLyrics?.id);
      if (match) {
        setSelectedTrackForLyrics(match);
      } else {
        setSelectedTrackForLyrics(tracks[0]);
      }
    }
  }, [tracks]);

  // When selected track changes, set default active annotation
  const handleSelectTrack = (track) => {
    setSelectedTrackForLyrics(track);
    const firstAnnotated = track.lyrics?.find((l) => l.annotated);
    if (firstAnnotated) {
      setActiveAnnotation(firstAnnotated.annotation);
      setActiveLyricText(firstAnnotated.text);
    } else {
      setActiveAnnotation(null);
      setActiveLyricText('');
    }
    if (window.innerWidth < 1024) {
      setMobileSubTab('lyrics');
    }
  };

  const handleLyricClick = (line) => {
    if (line.annotated && line.annotation) {
      setActiveAnnotation(line.annotation);
      setActiveLyricText(line.text);
    }
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
    <section id="music" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <Music className="w-3.5 h-3.5" />
            <ShinyText text="SONIC ARCHIVE & TELEMETRY" speed={4} />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            DISCOGRAPHY & GENIUS INSIGHTS
          </h2>
          <p className="text-slate-400 text-xs sm:text-base mt-2 max-w-xl">
            Stream high-fidelity studio previews, dissect verified line-by-line Genius breakdowns, or launch external DSPs.
          </p>
        </div>

        {/* View Switcher Tabs (Planes-Style Sliding Segmented Control) */}
        <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md self-start md:self-auto overflow-x-auto no-scrollbar max-w-full">
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
      {/* TAB 1: STUDIO TRACKS & OVERHAULED GENIUS LYRICS         */}
      {/* ======================================================== */}
      {activeTab === 'tracks' && (
        <div>
          {/* Mobile Sub-Switcher: Tracks vs Lyrics */}
          <div className="lg:hidden flex items-center justify-center p-1 rounded-2xl bg-white/[0.05] border border-white/[0.1] mb-6">
            <button
              onClick={() => setMobileSubTab('list')}
              className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                mobileSubTab === 'list' ? 'text-white' : 'text-slate-400'
              }`}
            >
              {mobileSubTab === 'list' && (
                <motion.div
                  layoutId="mobileMusicSubTab"
                  className="absolute inset-0 rounded-xl bg-purple-600 shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Discography List ({tracks.length})</span>
            </button>

            <button
              onClick={() => setMobileSubTab('lyrics')}
              className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                mobileSubTab === 'lyrics' ? 'text-white' : 'text-slate-400'
              }`}
            >
              {mobileSubTab === 'lyrics' && (
                <motion.div
                  layoutId="mobileMusicSubTab"
                  className="absolute inset-0 rounded-xl bg-purple-600 shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 truncate px-2">Lyrics: {selectedTrackForLyrics.title}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Discography Tracks Rail (5 Cols) */}
            <div className={`lg:col-span-5 space-y-3 ${mobileSubTab === 'lyrics' ? 'hidden lg:block' : 'block'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  Select Track To Inspect Lyrics
                </span>
                <span className="text-[10px] font-mono text-purple-300 lg:hidden">
                  Tap card to view
                </span>
              </div>

              {tracks.map((track, trackIdx) => {
                const isSelected = selectedTrackForLyrics.id === track.id;
                const isThisPlaying = isPlaying && currentTrack.id === track.id;

                return (
                  <SpotlightCard
                    key={track.id}
                    spotlightColor="rgba(168, 85, 247, 0.18)"
                    tilt={false}
                    onClick={() => handleSelectTrack(track)}
                    className={`p-3.5 cursor-pointer transition-all duration-300 active:scale-[0.99] group ${
                      isSelected
                        ? 'border-purple-500/70 bg-purple-950/25 shadow-xl shadow-purple-950/30'
                        : 'hover:border-white/[0.2] bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        
                        {/* Cover Thumbnail with Hover Play Button */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/[0.1] shadow-md">
                          <img
                            src={track.cover}
                            alt={track.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentTrack.id !== track.id) {
                                onSelectTrack(track);
                              } else {
                                togglePlay();
                              }
                              handleSelectTrack(track);
                            }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title={isThisPlaying ? 'Pause' : 'Play'}
                          >
                            {isThisPlaying ? (
                              <Pause className="w-5 h-5 fill-white" />
                            ) : (
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            )}
                          </button>
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-display font-bold text-sm truncate ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                              {track.title}
                            </h4>
                            {isThisPlaying && (
                              <span className="flex items-center gap-0.5 h-3">
                                <span className="w-0.5 h-3 bg-purple-400 animate-equalizer-1 rounded-full" />
                                <span className="w-0.5 h-3 bg-cyan-400 animate-equalizer-2 rounded-full" />
                                <span className="w-0.5 h-3 bg-purple-300 animate-equalizer-3 rounded-full" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {track.featuring || 'Solo'} • {track.releaseYear}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Annotated count chip */}
                        {track.lyrics?.some((l) => l.annotated) && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 hidden xs:inline-flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{track.lyrics.filter((l) => l.annotated).length} Notes</span>
                          </span>
                        )}

                        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                          {track.duration}
                        </span>
                        
                        {/* Mini Play Toggle Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentTrack.id !== track.id) {
                              onSelectTrack(track);
                            } else {
                              togglePlay();
                            }
                            handleSelectTrack(track);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
                            isThisPlaying
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                              : 'bg-white/[0.05] hover:bg-purple-600 hover:text-white text-slate-300'
                          }`}
                        >
                          {isThisPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>

                        <ChevronRight className="w-4 h-4 text-slate-500 lg:hidden" />
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>

            {/* Right Column: Overhauled Genius Lyric Experience & Inspector (7 Cols) */}
            <div className={`lg:col-span-7 ${mobileSubTab === 'list' ? 'hidden lg:block' : 'block'}`}>
              <SpotlightCard
                className="p-5 sm:p-8 relative overflow-hidden"
                spotlightColor="rgba(168, 85, 247, 0.2)"
                tilt={false}
              >
                {/* Designeer-Style Sonic Telemetry Top Bar */}
                <div className="flex flex-wrap items-center justify-between pb-5 border-b border-white/[0.08] gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Genius Verified Lyrics
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        24-Bit Master • {annotatedLines.length} Verified Notes
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                      {selectedTrackForLyrics.title}
                    </h3>

                    <p className="text-xs text-purple-300 font-medium mt-0.5">
                      UNNOTICED {selectedTrackForLyrics.featuring && `(${selectedTrackForLyrics.featuring})`}
                    </p>
                  </div>

                  {/* Planes-Style Lyric Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                    <button
                      onClick={() => setFilterMode('all')}
                      className={`relative px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-colors active:scale-95 ${
                        filterMode === 'all' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {filterMode === 'all' && (
                        <motion.div
                          layoutId="lyricFilterPill"
                          className="absolute inset-0 rounded-full bg-purple-600 shadow-sm"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">All Verses</span>
                    </button>

                    <button
                      onClick={() => setFilterMode('annotated')}
                      className={`relative px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-colors active:scale-95 ${
                        filterMode === 'annotated' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {filterMode === 'annotated' && (
                        <motion.div
                          layoutId="lyricFilterPill"
                          className="absolute inset-0 rounded-full bg-purple-600 shadow-sm"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">Notes Only ({annotatedLines.length})</span>
                    </button>

                    <button
                      onClick={() => setFilterMode(filterMode === 'focus' ? 'all' : 'focus')}
                      className={`relative px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-colors active:scale-95 ${
                        filterMode === 'focus' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Dim other lines to spotlight selected line"
                    >
                      {filterMode === 'focus' && (
                        <motion.div
                          layoutId="lyricFilterPill"
                          className="absolute inset-0 rounded-full bg-amber-500 shadow-sm"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1">
                        {filterMode === 'focus' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        Focus
                      </span>
                    </button>
                  </div>
                </div>

                {/* Interactive Lyrics Typography Display */}
                <div className="space-y-3 mb-8">
                  {selectedTrackForLyrics.lyrics?.map((line, idx) => {
                    const isAnnotated = line.annotated;
                    const isSelected = activeAnnotation?.content === line.annotation?.content;

                    // Filter mode logic
                    if (filterMode === 'annotated' && !isAnnotated) return null;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.3 }}
                        className={`relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-950/50 via-purple-900/30 to-amber-950/20 border border-purple-500/50 shadow-xl shadow-purple-950/40 scale-[1.01]'
                            : filterMode === 'focus' && !isSelected
                            ? 'opacity-35 blur-[0.4px] hover:opacity-80 hover:blur-none'
                            : 'hover:bg-white/[0.03] border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Monospace Line Number & Audio Timestamp */}
                          <span className="font-mono text-[10px] text-slate-500 select-none mt-1 shrink-0 w-8">
                            #{idx < 9 ? `0${idx + 1}` : idx + 1}
                          </span>

                          <div className="flex-1 min-w-0">
                            {isAnnotated ? (
                              <button
                                onClick={() => handleLyricClick(line)}
                                className={`text-left text-sm sm:text-base leading-relaxed tracking-wide transition-all cursor-pointer font-sans ${
                                  isSelected
                                    ? 'text-white font-bold'
                                    : 'text-amber-200/90 hover:text-white'
                                }`}
                              >
                                <span className={`inline relative py-0.5 px-1.5 rounded-md ${
                                  isSelected
                                    ? 'bg-amber-400/25 border-b-2 border-amber-400 shadow-sm shadow-amber-400/30'
                                    : 'bg-amber-500/10 hover:bg-amber-500/20 border-b-2 border-dashed border-amber-500/50'
                                }`}>
                                  "{line.text}"
                                </span>
                              </button>
                            ) : (
                              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                "{line.text}"
                              </p>
                            )}
                          </div>

                          {/* Annotation Badge Trigger */}
                          {isAnnotated && (
                            <button
                              onClick={() => handleLyricClick(line)}
                              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 transition-all active:scale-95 ${
                                isSelected
                                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30'
                                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{isSelected ? 'Active' : 'Genius'}</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ======================================================== */}
                {/* GENIUS VERIFIED ARTIST EDITORIAL INSPECTOR (Designeer)  */}
                {/* ======================================================== */}
                <AnimatePresence mode="wait">
                  {activeAnnotation ? (
                    <motion.div
                      key={activeAnnotation.content}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#141224] to-[#0d0d16] border border-purple-500/40 shadow-2xl shadow-purple-950/50 relative overflow-hidden text-left"
                    >
                      {/* Glow Ambient Corner */}
                      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                      {/* Inspector Header: Verified Artist Badge & Navigation */}
                      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/[0.08] gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={artistInfo.avatar}
                              alt="UNNOTICED"
                              className="w-10 h-10 rounded-full object-cover border-2 border-purple-400 shadow-md"
                            />
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-white text-[9px] border border-black">
                              ✓
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-display font-bold text-white text-sm">
                                {activeAnnotation.author}
                              </h5>
                              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                                {activeAnnotation.badge}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Verified Official Commentary
                            </span>
                          </div>
                        </div>

                        {/* Prev / Next Annotation Navigation */}
                        {annotatedLines.length > 1 && (
                          <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-full border border-white/[0.08]">
                            <button
                              onClick={handlePrevAnnotation}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors active:scale-90"
                              title="Previous Annotation"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono text-purple-300 px-1">
                              {currentAnnotIndex + 1} / {annotatedLines.length}
                            </span>
                            <button
                              onClick={handleNextAnnotation}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors active:scale-90"
                              title="Next Annotation"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Selected Lyric Pull-Quote Highlight */}
                      {activeLyricText && (
                        <div className="mb-4 pl-3.5 border-l-2 border-amber-400 py-0.5">
                          <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest block mb-0.5">
                            Annotated Line:
                          </span>
                          <p className="font-display italic text-sm sm:text-base text-amber-100 font-semibold leading-relaxed">
                            "{activeLyricText}"
                          </p>
                        </div>
                      )}

                      {/* In-depth Artist Story / Commentary */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mb-5 font-light">
                        {activeAnnotation.content}
                      </p>

                      {/* Action Toolbar */}
                      <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <button
                          onClick={() => copyToClipboard(`"${activeLyricText}" — UNNOTICED: ${activeAnnotation.content}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white font-mono text-[11px] transition-colors active:scale-95"
                        >
                          {copiedQuote ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedQuote ? 'Copied Insight!' : 'Copy Quote'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (currentTrack?.id !== selectedTrackForLyrics.id) {
                              onSelectTrack(selectedTrackForLyrics);
                            }
                            if (!isPlaying) togglePlay();
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-[11px] shadow-md shadow-purple-600/30 transition-all active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isCurrentTrackPlaying ? 'Currently Playing' : 'Listen Preview'}</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                      <p className="font-display text-white text-sm font-semibold">
                        Select Any Underlined Line Above
                      </p>
                      <p className="max-w-md text-slate-400 leading-relaxed">
                        Tap any underlined verse to unpack verified artist commentary, songwriting inspirations, and behind-the-scenes stories from UNNOTICED.
                      </p>
                    </div>
                  )}
                </AnimatePresence>

                {/* Bottom Back Button on Mobile */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => setMobileSubTab('list')}
                    className="lg:hidden text-xs text-purple-300 font-mono underline"
                  >
                    ← Back to Discography List
                  </button>

                  <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Disc className={`w-3.5 h-3.5 text-purple-400 ${isCurrentTrackPlaying ? 'animate-spin' : ''}`} />
                    <span>Loaded: <strong className="text-white">{selectedTrackForLyrics.title}</strong></span>
                  </div>

                  <a
                    href={selectedTrackForLyrics.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>Full Song on Spotify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </SpotlightCard>
            </div>

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

    </section>
  );
}
