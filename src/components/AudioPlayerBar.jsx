import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3,
  ChevronDown, ChevronUp, ExternalLink, Sparkles, Music, Headphones,
  Quote, CheckCircle2, X, Sliders, ArrowUpRight
} from 'lucide-react';
import { SpotifyIcon } from './SocialIcons';
import { useSiteData } from '../context/DataContext';

export default function AudioPlayerBar({
  currentTrack,
  isPlaying,
  togglePlay,
  onNextTrack,
  onPrevTrack,
  onSelectTrack
}) {
  const { artistInfo } = useSiteData();
  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState('player'); // 'player' | 'lyrics'
  const [desktopLyricsOpen, setDesktopLyricsOpen] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  const trackLyrics = currentTrack?.lyrics || [];
  const annotatedCount = trackLyrics.filter((l) => l.annotated).length;

  // Real-time active lyric line index based on playback progress
  const activeLineIndex = trackLyrics.length > 0 && duration > 0
    ? Math.min(trackLyrics.length - 1, Math.floor((currentTime / duration) * trackLyrics.length))
    : 0;

  // Sync audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.previewAudio;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
      }
    }
    setActiveAnnotation(null);
  }, [currentTrack]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.log('Playback error:', err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Auto-scroll active lyric line smoothly into center view
  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.querySelector(`[data-line-idx="${activeLineIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLineIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    onNextTrack();
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const jumpToLine = (idx) => {
    if (!audioRef.current || trackLyrics.length === 0) return;
    const target = (idx / trackLyrics.length) * (duration || 30);
    audioRef.current.currentTime = target;
    setCurrentTime(target);
    if (!isPlaying) togglePlay();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <>
      {/* Hidden native HTML5 audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* ======================================================== */}
      {/* DESKTOP FLOATING GLASS LYRICS MODAL / DRAWER            */}
      {/* ======================================================== */}
      <AnimatePresence>
        {desktopLyricsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="hidden md:flex flex-col fixed bottom-24 right-6 w-[440px] max-h-[640px] z-40 rounded-3xl border border-white/[0.12] bg-[#0c0d16]/96 backdrop-blur-3xl shadow-2xl shadow-black/90 overflow-hidden"
          >
            {/* Ambient glowing rim */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-[80px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />

            {/* Modal Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-white/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded-xl object-cover border border-white/[0.1] shadow-md shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-white text-sm truncate">
                      {currentTrack.title}
                    </h4>
                    {isPlaying && (
                      <span className="flex items-center gap-0.5 h-3">
                        <span className="w-0.5 h-2.5 bg-purple-400 animate-equalizer-1 rounded-full" />
                        <span className="w-0.5 h-3 bg-cyan-400 animate-equalizer-2 rounded-full" />
                        <span className="w-0.5 h-2 bg-purple-300 animate-equalizer-3 rounded-full" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Genius Synchronized Lyrics
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDesktopLyricsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-90"
                  title="Close Lyrics"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Annotation Card (if any selected in desktop modal) */}
            <AnimatePresence>
              {activeAnnotation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-b border-purple-500/30 bg-purple-950/40"
                >
                  <div className="p-4 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={artistInfo.avatar}
                          alt="UNNOTICED"
                          className="w-6 h-6 rounded-full object-cover border border-purple-400"
                        />
                        <span className="font-bold text-white">{activeAnnotation.author}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30">
                          {activeAnnotation.badge}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveAnnotation(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-200 italic leading-relaxed font-sans pl-1">
                      "{activeAnnotation.content}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lyrics Stream List */}
            <div
              ref={lyricsContainerRef}
              className="p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[460px] select-none text-left"
            >
              {trackLyrics.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                const isSelectedAnnot = activeAnnotation?.content === line.annotation?.content;

                return (
                  <motion.div
                    key={idx}
                    data-line-idx={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => jumpToLine(idx)}
                    className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-600/20 border border-purple-500/40 text-white shadow-lg shadow-purple-600/10'
                        : isSelectedAnnot
                        ? 'bg-amber-500/15 border border-amber-500/30 text-white'
                        : 'hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm leading-relaxed ${isActive ? 'font-bold text-white' : 'font-normal'}`}>
                          "{line.text}"
                        </p>

                        {/* Annotation Badge Trigger */}
                        {line.annotated && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAnnotation(
                                  activeAnnotation?.content === line.annotation?.content ? null : line.annotation
                                );
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 transition-all active:scale-95 ${
                                isSelectedAnnot
                                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{isSelectedAnnot ? 'Hide Genius Note' : 'Genius Note'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Line Jump indicator */}
                      <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-purple-300 shrink-0 mt-0.5">
                        Jump ▶
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal Footer with quick sync scrubber */}
            <div className="p-3 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-[11px] text-purple-300">
                Click any line to seek • {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <a
                href={currentTrack.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
              >
                <span>Spotify</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* FULL-SCREEN EXPANDABLE MOBILE PLAYER SHEET               */}
      {/* With fluid tab switcher between 'player' & 'lyrics'      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMobileExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-50 md:hidden bg-[#090a12]/98 backdrop-blur-3xl p-5 flex flex-col justify-between overflow-hidden safe-bottom"
          >
            {/* Ambient lighting in mobile sheet */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Top Drag Handle & Segmented View Switcher (Planes style) */}
            <div className="shrink-0 mb-3">
              <div className="flex flex-col items-center mb-3">
                <button
                  onClick={() => setIsMobileExpanded(false)}
                  className="w-12 h-1.5 rounded-full bg-white/25 mb-3 active:scale-95"
                  aria-label="Collapse Player"
                />
              </div>

              {/* Segmented Control Pill Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center p-1 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-md">
                  <button
                    onClick={() => setMobileTab('player')}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                      mobileTab === 'player' ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {mobileTab === 'player' && (
                      <motion.div
                        layoutId="mobilePlayerViewPill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/30"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Music className="w-3 h-3" />
                      Now Playing
                    </span>
                  </button>

                  <button
                    onClick={() => setMobileTab('lyrics')}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                      mobileTab === 'lyrics' ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {mobileTab === 'lyrics' && (
                      <motion.div
                        layoutId="mobilePlayerViewPill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/30"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Quote className="w-3 h-3" />
                      Lyrics {annotatedCount > 0 && `(${annotatedCount})`}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setIsMobileExpanded(false)}
                  className="p-2 rounded-full bg-white/[0.06] text-white active:scale-90"
                  aria-label="Close"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* TAB CONTENT: PLAYER VS LYRICS (Animated fluidly) */}
            <div className="flex-1 overflow-y-auto min-h-0 py-2">
              <AnimatePresence mode="wait">
                {mobileTab === 'player' ? (
                  <motion.div
                    key="tab-player"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col justify-center items-center h-full text-center py-4"
                  >
                    {/* Large Album Art with Ambient Glow */}
                    <div className="relative aspect-square w-full max-w-[260px] rounded-3xl overflow-hidden border border-white/[0.14] shadow-2xl shadow-purple-600/30 mb-6">
                      <img
                        src={currentTrack.cover}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                      {isPlaying && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-[10px] font-mono text-purple-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Playing Preview</span>
                        </div>
                      )}
                    </div>

                    {/* Track Meta */}
                    <div className="mb-4">
                      <h3 className="font-display text-2xl font-black text-white">
                        {currentTrack.title}
                      </h3>
                      <p className="text-sm text-purple-300 font-semibold mt-1">
                        UNNOTICED {currentTrack.featuring && `(${currentTrack.featuring})`}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        f.k.a. Ty Sciullo • {currentTrack.releaseYear}
                      </p>
                    </div>

                    {/* Quick Lyrics Preview Teaser Pill (tapping flips to lyrics tab!) */}
                    <button
                      onClick={() => setMobileTab('lyrics')}
                      className="mt-2 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-2 active:scale-95"
                    >
                      <Quote className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Full Lyrics & Genius Notes</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-lyrics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="h-full flex flex-col justify-between"
                  >
                    {/* Active Annotation Drawer inside mobile sheet */}
                    <AnimatePresence>
                      {activeAnnotation && (
                        <motion.div
                          initial={{ opacity: 0, y: -15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -15, scale: 0.95 }}
                          className="p-3.5 mb-3 rounded-2xl bg-purple-950/60 border border-purple-500/40 shadow-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={artistInfo.avatar}
                                alt="UNNOTICED"
                                className="w-6 h-6 rounded-full object-cover border border-purple-400"
                              />
                              <span className="font-bold text-xs text-white">{activeAnnotation.author}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200">
                                {activeAnnotation.badge}
                              </span>
                            </div>
                            <button
                              onClick={() => setActiveAnnotation(null)}
                              className="p-1 rounded-full text-slate-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-200 italic leading-relaxed">
                            "{activeAnnotation.content}"
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scrollable Synchronized Lyrics Stream */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-left">
                      {trackLyrics.map((line, idx) => {
                        const isActive = idx === activeLineIndex;
                        const isAnnotated = line.annotated;
                        const isSelectedAnnot = activeAnnotation?.content === line.annotation?.content;

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            onClick={() => jumpToLine(idx)}
                            className={`p-3 rounded-2xl transition-all cursor-pointer ${
                              isActive
                                ? 'bg-purple-600/25 border border-purple-500/50 shadow-lg shadow-purple-600/20'
                                : isSelectedAnnot
                                ? 'bg-amber-500/20 border border-amber-500/40'
                                : 'bg-white/[0.02] border border-white/[0.05] text-slate-400'
                            }`}
                          >
                            <p className={`text-sm leading-relaxed ${isActive ? 'font-bold text-white' : 'text-slate-300'}`}>
                              "{line.text}"
                            </p>

                            {isAnnotated && (
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveAnnotation(
                                      activeAnnotation?.content === line.annotation?.content ? null : line.annotation
                                    );
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 active:scale-95 ${
                                    isSelectedAnnot
                                      ? 'bg-amber-400 text-slate-950 shadow-md'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>{isSelectedAnnot ? 'Close Insight' : 'Genius Insight'}</span>
                                </button>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Controls Bar (always visible in sheet) */}
            <div className="shrink-0 pt-3 border-t border-white/[0.08]">
              {/* Scrubbable Progress Bar */}
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer mb-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
                  style={{ width: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 30}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Seek preview audio"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)} (Preview)</span>
              </div>

              {/* Main Playback Buttons */}
              <div className="flex items-center justify-center gap-6 mb-3">
                <button
                  onClick={onPrevTrack}
                  className="w-11 h-11 rounded-full bg-white/[0.05] text-slate-200 flex items-center justify-center active:scale-90"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-0.5" />
                  )}
                </motion.button>

                <button
                  onClick={onNextTrack}
                  className="w-11 h-11 rounded-full bg-white/[0.05] text-slate-200 flex items-center justify-center active:scale-90"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center gap-2">
                <a
                  href={currentTrack.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
                >
                  <SpotifyIcon className="w-4 h-4 fill-emerald-400" />
                  <span>Full Song on Spotify</span>
                </a>

                {/* Flip between player & lyrics */}
                <button
                  onClick={() => setMobileTab(mobileTab === 'player' ? 'lyrics' : 'player')}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 active:scale-95 border ${
                    mobileTab === 'lyrics'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                      : 'bg-white/[0.06] text-slate-200 border-white/[0.1]'
                  }`}
                >
                  <Quote className="w-3.5 h-3.5 text-purple-300" />
                  <span>{mobileTab === 'lyrics' ? 'Player' : 'Lyrics'}</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* PERSISTENT FLOATING BOTTOM PLAYER BAR                   */}
      {/* Compact pill on mobile, full studio control on desktop   */}
      {/* ======================================================== */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 max-w-4xl mx-auto z-30"
        >
          <div
            onClick={(e) => {
              // On mobile, tapping anywhere in the bar opens the expanded sheet
              if (window.innerWidth < 768 && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A') {
                setIsMobileExpanded(true);
              }
            }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0c0d14]/94 backdrop-blur-2xl shadow-2xl shadow-black/85 px-3 py-2 sm:px-6 sm:py-3 cursor-pointer md:cursor-default"
          >
            {/* Top Glowing Audio Progress Track */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/[0.08] cursor-pointer group">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 relative transition-all"
                style={{ width: `${progressPercent}%` }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md shadow-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 30}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek audio position"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              
              {/* Left: Track Artwork & Info (Tap on mobile opens expanded sheet) */}
              <div
                onClick={() => setIsMobileExpanded(true)}
                className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[200px] sm:max-w-[280px] cursor-pointer"
              >
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-white/[0.1]">
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <Disc3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h5 className="font-bold text-white text-xs sm:text-sm truncate">
                      {currentTrack.title}
                    </h5>
                    <span className="hidden sm:inline-flex text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                      30s Preview
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                    UNNOTICED {currentTrack.featuring && `(${currentTrack.featuring})`}
                  </p>
                </div>
              </div>

              {/* Center: Playback Controls */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                  onClick={onPrevTrack}
                  className="hidden xs:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-90 transition-all"
                  title="Previous Track"
                >
                  <SkipBack className="w-3.5 h-3.5 fill-current" />
                </button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 border border-purple-400/30 active:scale-90"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                  )}
                </motion.button>

                <button
                  onClick={onNextTrack}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-90 transition-all"
                  title="Next Track"
                >
                  <SkipForward className="w-3.5 h-3.5 fill-current" />
                </button>

                {/* Mobile Expand Trigger Pill */}
                <button
                  onClick={() => setIsMobileExpanded(true)}
                  className="md:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.05] text-purple-300 active:scale-90 ml-1"
                  title="Expand Player"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Desktop Lyrics Trigger, Volume & Streaming Link */}
              <div className="hidden md:flex items-center gap-3">
                {/* Desktop Lyrics Button */}
                <button
                  onClick={() => setDesktopLyricsOpen(!desktopLyricsOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    desktopLyricsOpen
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-purple-300 border border-purple-500/30'
                  }`}
                  title="Toggle Synchronized Lyrics"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>Lyrics</span>
                  {annotatedCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    aria-label="Volume control"
                  />
                </div>

                {/* Spotify */}
                <a
                  href={currentTrack.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
