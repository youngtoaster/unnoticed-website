import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3, Maximize2, Minimize2, ExternalLink, Sparkles } from 'lucide-react';
import { TRACKS } from '../data/artistData';

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
  const [isMinimized, setIsMinimized] = useState(false);

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

      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 max-w-4xl mx-auto z-40"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0c0d14]/90 backdrop-blur-2xl shadow-2xl shadow-black/80 px-4 py-3 sm:px-6 sm:py-3.5">
            
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

            <div className="flex items-center justify-between gap-4">
              
              {/* Left: Track Artwork & Info */}
              <div className="flex items-center gap-3 min-w-0 max-w-[220px] sm:max-w-[280px]">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/[0.1]">
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <Disc3 className="w-5 h-5 text-purple-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-white text-xs sm:text-sm truncate">
                      {currentTrack.title}
                    </h5>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                      30s HD Preview
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    UNNOTICED {currentTrack.featuring && `(${currentTrack.featuring})`}
                  </p>
                </div>
              </div>

              {/* Center: Playback Controls */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={onPrevTrack}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                    title="Previous Track"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 border border-purple-400/30"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </motion.button>

                  <button
                    onClick={onNextTrack}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Timestamp */}
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right: Volume & Streaming Launcher */}
              <div className="flex items-center gap-3">
                
                {/* Volume Slider */}
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
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

                {/* Spotify Launch Pill */}
                <a
                  href={currentTrack.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
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
