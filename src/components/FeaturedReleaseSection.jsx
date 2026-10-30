import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, Sparkles, ExternalLink, Disc3,
  Quote, Music, Radio, ChevronRight, Share2, Check
} from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import ShinyText from './reactbits/ShinyText';
import { SpotifyIcon, AppleMusicIcon, YoutubeIcon } from './SocialIcons';

export default function FeaturedReleaseSection({ onSelectTrack }) {
  const { featuredRelease, sectionsVisibility, artistInfo, tracks } = useSiteData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);

  const release = featuredRelease || {
    sectionEnabled: true,
    title: 'Calling for Help',
    artist: 'UNNOTICED',
    releaseType: 'Lead Studio Master',
    releaseDate: '2024 Cut',
    badgeText: 'WORLD PREMIERE // NOW STREAMING',
    tagline: 'Atmospheric basslines dissecting nocturnal solitude. Stream the official studio master cut.',
    cover: 'https://d2hxjpynh54gwb.cloudfront.net/dfc1ac7c-e3a6-4c61-bc39-58e8b3eaa554/card_2x',
    audioUrl: 'https://p.scdn.co/mp3-preview/b6cdb3115927e7db423d2238223b5a6b4a57008b?cid=3bb56cf560444175950d63e79d4febc8',
    lyricsExcerpt: 'Praying for a signal just to know that I\'m alive...',
    spotifyUrl: 'https://open.spotify.com/artist/5ETABaJMvhYJpsxQku2IQe',
    appleMusicUrl: 'https://music.apple.com/us/artist/ty-sciullo/1218320490',
    youtubeUrl: 'https://www.youtube.com/@UnnoticedOfficial',
    soundcloudUrl: 'https://soundcloud.com/tysciullo'
  };

  // Visibility check
  if (release.sectionEnabled === false || sectionsVisibility?.featuredRelease === false) {
    return null;
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#showcase');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="showcase" className="relative py-8 sm:py-12 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24">
      {/* Hidden Audio Engine */}
      <audio
        ref={audioRef}
        src={release.audioUrl}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Ambient background glow matching album palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/12 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Editorial Bento Showcase Card */}
      <SpotlightCard
        className="p-6 sm:p-10 border border-white/[0.12] bg-[#080912]/90 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] relative overflow-hidden"
        spotlightColor="rgba(168, 85, 247, 0.2)"
        tilt={false}
      >
        {/* Subtle dot matrix texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40 -z-10" />

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* ======================================================== */}
          {/* LEFT: 3D VINYL SLEEVE & DISC DISPLAY                     */}
          {/* ======================================================== */}
          <div className="relative shrink-0 w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 flex items-center justify-center">
            {/* Spinning Vinyl Disc with Grooves */}
            <motion.div
              initial={false}
              animate={
                isPlaying
                  ? { x: 70, scale: 1, opacity: 1 }
                  : { x: 0, scale: 0.9, opacity: 0 }
              }
              transition={{
                x: { type: 'spring', stiffness: 130, damping: 20 },
                scale: { duration: 0.25 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-[#0d0e14] border-[7px] border-[#161722] shadow-2xl flex items-center justify-center pointer-events-none z-0"
              style={{
                boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 0 25px rgba(0,0,0,0.95)',
                backgroundImage: 'repeating-radial-gradient(circle, #0e0f16 0px, #0e0f16 2px, #181926 3px, #0e0f16 4px)'
              }}
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-purple-400/40 relative shadow-inner flex items-center justify-center ${isPlaying ? 'animate-[spin_4.5s_linear_infinite]' : ''}`}>
                <img src={release.cover} alt="Vinyl Center" className="w-full h-full object-cover" />
                <div className="absolute w-4 h-4 rounded-full bg-[#07080e] border border-white/50 shadow-sm" />
              </div>
            </motion.div>

            {/* Album Sleeve */}
            <motion.div
              initial={false}
              animate={isPlaying ? { x: -35 } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 130, damping: 20 }}
              className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border border-white/[0.2] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group shrink-0 bg-[#0c0d16]"
            >
              <img
                src={release.cover}
                alt={release.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.1] to-transparent pointer-events-none" />

              {/* Corner Badge */}
              <div className="absolute top-2.5 left-2.5 pointer-events-none">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-purple-300 border border-purple-400/30 font-semibold shadow-md">
                  {release.releaseDate || '2024 Cut'}
                </span>
              </div>

              {/* Trigger Audio Button */}
              <button
                onClick={handleTogglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: TRACK DOSSIER & FULL AUDIO PLAYER DECK           */}
          {/* ======================================================== */}
          <div className="flex-1 w-full min-w-0 flex flex-col justify-between">
            <div>
              {/* Header Badge Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <ShinyText text={release.badgeText || 'WORLD PREMIERE // NOW STREAMING'} speed={3.5} />
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-mono transition-colors border border-white/[0.08] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Share Track'}</span>
                </button>
              </div>

              {/* Song Title & Moniker */}
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                {release.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                <span className="text-white font-bold">{release.artist || 'UNNOTICED'}</span>
                <span className="text-purple-300"> • {release.releaseType || 'Studio Discography Master'}</span>
              </p>

              {/* Tagline */}
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mt-3 max-w-xl">
                {release.tagline || 'Atmospheric basslines dissecting nocturnal solitude. Stream the newest master cut across every platform.'}
              </p>

              {/* Verified Songwriting Pull-Quote */}
              {release.lyricsExcerpt && (
                <div className="mt-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 flex items-start gap-2.5 max-w-xl shadow-inner">
                  <Quote className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-200 font-mono italic leading-snug">
                    "{release.lyricsExcerpt}"
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Audio Player Controller Deck */}
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              {/* Controls & Equalizer telemetry */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTogglePlay}
                    className="w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center cursor-pointer theme-primary-btn"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </motion.button>

                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      {isPlaying ? 'Master Audio Playing' : 'Official Master Preview'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Lossless 24-Bit / 48kHz Digital Cut
                    </span>
                  </div>
                </div>

                {/* Right audio tools: time + volume */}
                <div className="flex items-center gap-3">
                  {isPlaying && (
                    <span className="hidden sm:flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-2 bg-purple-400 animate-pulse rounded-full" />
                      <span className="w-0.5 h-3.5 bg-cyan-400 animate-bounce rounded-full" />
                      <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse rounded-full" />
                      <span className="w-0.5 h-3 bg-purple-400 animate-bounce rounded-full" />
                    </span>
                  )}

                  <span className="text-xs font-mono text-purple-300 font-bold tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration || 198)}
                  </span>

                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      onClick={handleToggleMute}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 accent-purple-400 cursor-pointer h-1 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Audio Scrubber Timeline */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-white/[0.08] rounded-lg transition-all"
              />
            </div>

            {/* Direct DSP Streaming Launch Bar */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3 rounded-xl bg-[#1ed760]/15 hover:bg-[#1ed760]/25 border border-[#1ed760]/40 text-[#1ed760] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <SpotifyIcon className="w-4 h-4 fill-current shrink-0" />
                <span className="truncate">Spotify</span>
                <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
              </a>

              <a
                href={release.appleMusicUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <AppleMusicIcon className="w-4 h-4 fill-current shrink-0" />
                <span className="truncate">Apple Music</span>
                <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
              </a>

              <a
                href={release.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <YoutubeIcon className="w-4 h-4 fill-current shrink-0" />
                <span className="truncate">YouTube</span>
                <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
              </a>

              <a
                href={release.soundcloudUrl}
                target="_blank"
                rel="noreferrer"
                className="h-10 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <Radio className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">SoundCloud</span>
                <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
              </a>
            </div>

          </div>

        </div>
      </SpotlightCard>
    </section>
  );
}
