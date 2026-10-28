import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3, ChevronDown, ChevronUp, ExternalLink, Sparkles, Music, Headphones } from 'lucide-react';
import { SpotifyIcon } from './SocialIcons';

export default function AudioPlayerBar({
  currentTrack,
  isPlaying,
  togglePlay,
  onNextTrack,
  onPrevTrack,
  onSelectTrack
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Sync audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.previewAudio;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
      }
    }
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

  return (
    <>
      {/* Hidden native HTML5 audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* FULL-SCREEN EXPANDABLE MOBILE PLAYER SHEET (Apple Music / Spotify Style) */}
      <AnimatePresence>
        {isMobileExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 md:hidden bg-[#0a0b12]/98 backdrop-blur-3xl p-6 flex flex-col justify-between overflow-y-auto safe-bottom"
          >
            {/* Top Drag Pill & Header */}
            <div>
              <div className="flex flex-col items-center mb-6">
                <button
                  onClick={() => setIsMobileExpanded(false)}
                  className="w-12 h-1.5 rounded-full bg-white/20 mb-4 active:scale-95"
                  aria-label="Collapse Player"
                />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                    Now Playing Preview
                  </span>
                  <button
                    onClick={() => setIsMobileExpanded(false)}
                    className="p-1 rounded-full bg-white/[0.06] text-white active:scale-90"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Large Cover Art with Ambient Shadow */}
              <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden border border-white/[0.12] shadow-2xl shadow-purple-600/30 my-4">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1 text-[10px] font-mono text-purple-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>30s Preview</span>
                  </div>
                )}
              </div>

              {/* Track Meta */}
              <div className="text-center mt-6">
                <h3 className="font-display text-2xl font-black text-white">
                  {currentTrack.title}
                </h3>
                <p className="text-sm text-purple-300 font-medium mt-1">
                  UNNOTICED {currentTrack.featuring && `(${currentTrack.featuring})`}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  f.k.a. Ty Sciullo • {currentTrack.releaseYear}
                </p>
              </div>

              {/* Large Scrubbable Progress Bar */}
              <div className="mt-8 px-2">
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
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

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Mobile Expanded Player Big Controls */}
            <div>
              <div className="flex items-center justify-center gap-8 my-6">
                <button
                  onClick={onPrevTrack}
                  className="w-12 h-12 rounded-full bg-white/[0.05] text-slate-200 flex items-center justify-center active:scale-90"
                >
                  <SkipBack className="w-6 h-6 fill-current" />
                </button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-18 h-18 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-white" />
                  ) : (
                    <Play className="w-8 h-8 fill-white ml-1" />
                  )}
                </motion.button>

                <button
                  onClick={onNextTrack}
                  className="w-12 h-12 rounded-full bg-white/[0.05] text-slate-200 flex items-center justify-center active:scale-90"
                >
                  <SkipForward className="w-6 h-6 fill-current" />
                </button>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/[0.08]">
                <a
                  href={currentTrack.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
                >
                  <SpotifyIcon className="w-4 h-4 fill-emerald-400" />
                  <span>Full Song on Spotify</span>
                </a>

                <button
                  onClick={() => {
                    setIsMobileExpanded(false);
                    const el = document.querySelector('#music');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-slate-200 font-semibold text-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Headphones className="w-4 h-4 text-purple-400" />
                  <span>Lyrics</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT FLOATING PLAYER (Mobile Compact Pill + Desktop Studio Bar) */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 max-w-4xl mx-auto z-30"
        >
          <div
            onClick={(e) => {
              // On mobile, tapping the bar background opens the full player sheet
              if (window.innerWidth < 768 && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'A') {
                setIsMobileExpanded(true);
              }
            }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0c0d14]/92 backdrop-blur-2xl shadow-2xl shadow-black/80 px-3 py-2 sm:px-6 sm:py-3 cursor-pointer md:cursor-default"
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
                className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[200px] sm:max-w-[280px]"
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

              {/* Right: Desktop Volume & Streaming Link */}
              <div className="hidden md:flex items-center gap-3">
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
