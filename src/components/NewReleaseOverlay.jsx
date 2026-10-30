import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, ExternalLink, X, Sparkles, Disc3,
  ArrowRight, Radio, Music, Flame
} from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import { SpotifyIcon } from './SocialIcons';
import ShinyText from './reactbits/ShinyText';

// Procedural waveform frequency distribution for authentic studio spectrum
const WAVEFORM_HEIGHTS = [
  25, 40, 65, 85, 45, 60, 90, 100, 75, 55, 70, 85, 95, 80, 65, 50, 75, 90,
  100, 85, 60, 45, 70, 85, 95, 70, 50, 65, 80, 60, 40, 55, 70, 45, 30, 20
];

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function NewReleaseOverlay({ forceOpen = false, onCloseForce, onDismiss }) {
  const { featuredRelease } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const audioRef = useRef(null);

  const release = featuredRelease || {
    popupEnabled: true,
    title: 'Calling for Help',
    artist: 'UNNOTICED',
    releaseType: 'Lead Studio Master',
    badgeText: 'WORLD PREMIERE // NOW STREAMING',
    tagline: 'Atmospheric basslines dissecting nocturnal solitude. Stream the official studio master.',
    cover: 'https://d2hxjpynh54gwb.cloudfront.net/dfc1ac7c-e3a6-4c61-bc39-58e8b3eaa554/card_2x',
    audioUrl: 'https://p.scdn.co/mp3-preview/b6cdb3115927e7db423d2238223b5a6b4a57008b?cid=3bb56cf560444175950d63e79d4febc8',
    sampleStartTime: 12,
    sampleDuration: 28,
    spotifyUrl: 'https://open.spotify.com/artist/5ETABaJMvhYJpsxQku2IQe',
    appleMusicUrl: 'https://music.apple.com/us/artist/ty-sciullo/1218320490'
  };

  const sampleStart = release.sampleStartTime || 0;
  const sampleDuration = release.sampleDuration || 30;

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // Evaluate initial open status on site load
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    if (release.popupEnabled === false) {
      setIsOpen(false);
      if (onDismissRef.current) onDismissRef.current();
      return;
    }

    // Check session storage to avoid annoyance on repetitive soft reloads
    const sessionKey = `unnoticed_seen_release_${release.title}_v1`;
    const seen = sessionStorage.getItem(sessionKey);
    if (seen) {
      setIsOpen(false);
      if (onDismissRef.current) onDismissRef.current();
      return;
    }

    // Delay slightly for smooth page entrance
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 280);
    return () => clearTimeout(timer);
  }, [forceOpen, release.popupEnabled, release.title]);

  // Audio sample playback handling
  useEffect(() => {
    if (!isOpen || !release.audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    let isSubscribed = true;

    const applySampleStartTime = () => {
      try {
        const dur = audio.duration;
        const validStart = (dur && sampleStart < dur) ? sampleStart : 0;
        audio.currentTime = validStart;
      } catch (err) {
        console.warn('Could not set initial sample start time:', err);
      }
    };

    if (audio.readyState >= 1) {
      applySampleStartTime();
    } else {
      audio.addEventListener('loadedmetadata', applySampleStartTime, { once: true });
    }

    const attemptPlay = async () => {
      try {
        await audio.play();
        if (isSubscribed) {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        }
      } catch (err) {
        console.warn('Autoplay restricted by browser policy:', err);
        if (isSubscribed) {
          setAutoplayBlocked(true);
          setIsPlaying(false);
        }
      }
    };

    attemptPlay();

    const handleTimeUpdate = () => {
      if (!isSubscribed) return;
      const current = audio.currentTime;
      let effectiveStart = sampleStart;
      if (audio.duration && sampleStart >= audio.duration) {
        effectiveStart = 0;
      }
      const rawElapsed = current - effectiveStart;
      const elapsed = Math.max(0, rawElapsed);
      setElapsedTime(elapsed);

      const effectiveDuration = Math.min(
        sampleDuration,
        audio.duration ? Math.max(1, audio.duration - effectiveStart) : sampleDuration
      );

      if (elapsed >= effectiveDuration && effectiveDuration > 0) {
        // Loop back to sample start
        try {
          audio.currentTime = effectiveStart;
          setElapsedTime(0);
          setProgress(0);
        } catch {}
      } else {
        const pct = effectiveDuration > 0 ? Math.min(100, Math.max(0, (elapsed / effectiveDuration) * 100)) : 0;
        setProgress(pct);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      isSubscribed = false;
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause();
    };
  }, [isOpen, release.audioUrl, sampleStart, sampleDuration]);

  // Interactive scrubber on waveform
  const handleSeekWaveform = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetElapsed = ratio * sampleDuration;
    const effectiveStart = (audioRef.current.duration && sampleStart >= audioRef.current.duration) ? 0 : sampleStart;
    try {
      audioRef.current.currentTime = effectiveStart + targetElapsed;
      setProgress(ratio * 100);
      setElapsedTime(targetElapsed);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    } catch (err) {
      console.warn('Seek failed:', err);
    }
  };

  // Escape key listener & body lock
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsOpen(false);
    sessionStorage.setItem(`unnoticed_seen_release_${release.title}_v1`, 'true');
    if (onCloseForce) onCloseForce();
    if (onDismissRef.current) onDismissRef.current();
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      }).catch(console.warn);
    }
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none"
        >
          {/* Audio Engine */}
          <audio ref={audioRef} src={release.audioUrl} preload="auto" loop />

          {/* Backdrop Blur & Ambient Shadow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-2xl -z-10 cursor-pointer"
          />

          {/* Ambient Album Glow Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <img
              src={release.cover}
              alt=""
              className="w-full h-full object-cover filter blur-[120px] opacity-25 scale-125"
            />
            {/* Cyber Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          </div>

          {/* Impact Shockwave Ring triggered on high-velocity landing */}
          {shockwave && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-purple-400 pointer-events-none animate-shockwave -z-10" />
          )}

          {/* ======================================================== */}
          {/* HIGH-VELOCITY SLAM-IN MODAL TAKEOVER                      */}
          {/* Enters with extreme lateral velocity from x: 100vw        */}
          {/* ======================================================== */}
          <motion.div
            initial={{ x: '100vw', rotateZ: 7, scale: 0.88, opacity: 0 }}
            animate={{ x: 0, rotateZ: 0, scale: 1, opacity: 1 }}
            exit={{ x: '100vw', rotateZ: -6, scale: 0.88, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 240,
              mass: 1.15
            }}
            onAnimationComplete={() => {
              setShockwave(true);
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl border border-white/[0.18] bg-[#07080f]/95 shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-left"
          >
            {/* Top Bar Telemetry & Close */}
            <div className="px-5 sm:px-7 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.03] backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                  {release.badgeText || 'WORLD PREMIERE // NOW STREAMING'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[10px] text-slate-400 font-mono bg-white/[0.05] px-2 py-1 rounded-md border border-white/[0.08]">
                  Esc to dismiss
                </span>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                  aria-label="Dismiss Takeover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Stage: Dual Column Luxury Bento Display */}
            <div className="flex-1 p-5 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-10 overflow-y-auto custom-scrollbar min-h-0">
              
              {/* Left Column: Prominent 3D Vinyl Artwork with Slide-out Grooves & Live Sonic Ripples */}
              <div className="relative shrink-0 w-60 h-60 sm:w-72 sm:h-72 xl:w-80 xl:h-80 flex items-center justify-center">
                {/* Sonic Audio Ripples (Radiate outward while audio is playing) */}
                {isPlaying && (
                  <>
                    <div className="hidden sm:block absolute inset-0 m-auto w-56 h-56 sm:w-68 sm:h-68 rounded-full border border-cyan-400/40 animate-ping pointer-events-none -z-10" style={{ animationDuration: '3s' }} />
                    <div className="hidden sm:block absolute inset-0 m-auto w-64 h-64 sm:w-76 sm:h-76 rounded-full border border-purple-500/30 animate-pulse pointer-events-none -z-10" />
                  </>
                )}

                {/* Vinyl Disc - Prominently Exposed and Spinning During Preview Playback */}
                <motion.div
                  initial={false}
                  animate={
                    isPlaying
                      ? { x: 80, opacity: 1, scale: 1 }
                      : { x: 0, opacity: 0, scale: 0.9 }
                  }
                  transition={{
                    x: { type: 'spring', stiffness: 130, damping: 20 },
                    scale: { duration: 0.25 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center pointer-events-none z-0"
                >
                  {/* Dedicated rotating vinyl body: separated DOM layer prevents CSS spin transform from overriding Framer Motion translateX */}
                  <div
                    className={`w-full h-full rounded-full bg-[#0d0e14] border-[7px] border-[#161722] shadow-2xl flex items-center justify-center ${
                      isPlaying ? 'animate-vinyl-spin' : ''
                    }`}
                    style={{
                      boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.95)',
                      backgroundImage: 'repeating-radial-gradient(circle, #0e0f16 0px, #0e0f16 2px, #181926 3px, #0e0f16 4px)'
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-purple-400/40 relative shadow-inner flex items-center justify-center">
                      <img src={release.cover} alt="Vinyl Center" className="w-full h-full object-cover" />
                      <div className="absolute w-4 h-4 rounded-full bg-[#07080e] border border-white/50 shadow-sm" />
                    </div>
                  </div>
                </motion.div>

                {/* Album Jacket Sleeve */}
                <motion.div
                  animate={isPlaying ? { x: -35 } : { x: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  className="relative z-10 w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border border-white/[0.22] shadow-[0_25px_60px_rgba(0,0,0,0.9)] group shrink-0 bg-[#0c0d16]"
                >
                  <img
                    src={release.cover}
                    alt={release.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.12] to-transparent pointer-events-none" />
                  
                  {/* Play Overlay with Audio Sonic Pulse Indicator */}
                  <button
                    onClick={handleTogglePlay}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/75 hover:bg-black/90 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xl relative"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current text-white" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5 text-white" />
                    )}
                    {isPlaying && (
                      <span className="absolute -inset-1.5 rounded-full border border-cyan-400/60 animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
                    )}
                  </button>
                </motion.div>
              </div>

              {/* Right Column: Song Intel, Interactive Sample Deck, & Streaming Actions */}
              <div className="flex-1 flex flex-col justify-between w-full min-w-0">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-semibold uppercase mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{release.releaseType || 'Lead Studio Master'}</span>
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                    {release.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                    <span className="text-white font-bold">{release.artist || 'UNNOTICED'}</span>
                    <span className="text-slate-500"> • Official Studio Cut</span>
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mt-3 max-w-lg">
                    {release.tagline || 'Atmospheric basslines dissecting nocturnal solitude. Stream the newest official master cut across every platform.'}
                  </p>
                </div>

                {/* Sample Player Controller Deck with Dynamic Live Audio Waveform Visualizer */}
                <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTogglePlay}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </button>
                      <span className="text-purple-300 font-bold flex items-center gap-2">
                        {isPlaying ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span>Playing Studio Sample</span>
                          </>
                        ) : (
                          <span>Preview Paused</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      {/* Animated Dancing Equalizer Bars */}
                      <span className="flex items-center gap-0.5 h-3.5">
                        <span className={`w-0.5 rounded-full ${isPlaying ? 'bg-cyan-400 animate-equalizer-1' : 'h-1.5 bg-slate-600'}`} style={{ height: isPlaying ? undefined : '6px' }} />
                        <span className={`w-0.5 rounded-full ${isPlaying ? 'bg-purple-400 animate-equalizer-2' : 'h-2 bg-slate-600'}`} style={{ height: isPlaying ? undefined : '10px' }} />
                        <span className={`w-0.5 rounded-full ${isPlaying ? 'bg-pink-400 animate-equalizer-3' : 'h-1 bg-slate-600'}`} style={{ height: isPlaying ? undefined : '4px' }} />
                        <span className={`w-0.5 rounded-full ${isPlaying ? 'bg-cyan-400 animate-equalizer-4' : 'h-2.5 bg-slate-600'}`} style={{ height: isPlaying ? undefined : '12px' }} />
                        <span className={`w-0.5 rounded-full ${isPlaying ? 'bg-indigo-400 animate-equalizer-1' : 'h-1.5 bg-slate-600'}`} style={{ height: isPlaying ? undefined : '7px' }} />
                      </span>

                      <button
                        onClick={handleToggleMute}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Real-time Time Readout */}
                      <span className="text-xs font-mono font-bold text-slate-200 tabular-nums">
                        {formatTime(elapsedTime)} / {formatTime(sampleDuration)}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic 36-Bar Interactive Waveform Visualizer */}
                  <div
                    onClick={handleSeekWaveform}
                    className="relative w-full h-12 flex items-end gap-[3px] sm:gap-1 px-1.5 py-1.5 rounded-xl bg-black/50 border border-white/[0.08] cursor-pointer group select-none overflow-hidden"
                    title="Click anywhere to scrub audio sample"
                  >
                    {/* Background Ambient Progress Glow */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent pointer-events-none transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />

                    {/* 36 Waveform Frequency Bars */}
                    {WAVEFORM_HEIGHTS.map((baseH, idx) => {
                      const barPercent = (idx / WAVEFORM_HEIGHTS.length) * 100;
                      const isPlayed = barPercent <= progress;
                      const animClass = isPlaying ? `animate-equalizer-${(idx % 4) + 1}` : '';
                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col justify-end items-center h-full relative"
                        >
                          <div
                            className={`w-full rounded-full transition-all duration-150 ${
                              isPlayed
                                ? 'bg-gradient-to-t from-cyan-400 via-indigo-400 to-purple-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                                : 'bg-white/[0.12] group-hover:bg-white/[0.22]'
                            } ${animClass}`}
                            style={{
                              height: `${baseH}%`,
                              minHeight: '4px'
                            }}
                          />
                        </div>
                      );
                    })}

                    {/* Live Playhead Needle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_#ffffff] pointer-events-none transition-all duration-100"
                      style={{ left: `${progress}%` }}
                    >
                      <div className="absolute top-0 -left-1 w-2.5 h-1.5 bg-cyan-400 rounded-full shadow-sm" />
                    </div>
                  </div>

                  {/* Autoplay prompt if blocked by browser policy */}
                  {autoplayBlocked && (
                    <button
                      onClick={handleTogglePlay}
                      className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tap to Unmute & Listen to Master Sample</span>
                    </button>
                  )}
                </div>

                {/* Destination Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={release.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[140px] h-11 px-4 rounded-xl bg-[#1ed760] hover:bg-[#1bc458] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-[#1ed760]/20"
                  >
                    <SpotifyIcon className="w-4 h-4 fill-current shrink-0" />
                    <span>Stream on Spotify</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  <a
                    href={release.appleMusicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[140px] h-11 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-rose-500/20"
                  >
                    <Music className="w-4 h-4 shrink-0" />
                    <span>Apple Music</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  <button
                    onClick={handleClose}
                    className="h-11 px-5 rounded-xl border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white font-mono text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Enter Site →
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
