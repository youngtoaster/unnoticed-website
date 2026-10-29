import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ExternalLink, Disc, Music, CheckCircle2, Quote, Sparkles, Volume2, Share2, Info, X, ChevronRight } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';

export default function MusicSection({
  currentTrack,
  isPlaying,
  togglePlay,
  onSelectTrack
}) {
  const { tracks, artistInfo } = useSiteData();
  const [selectedTrackForLyrics, setSelectedTrackForLyrics] = useState(tracks[0] || currentTrack);
  const [activeAnnotation, setActiveAnnotation] = useState(
    (tracks[0] || currentTrack).lyrics?.find((l) => l.annotated)?.annotation || null
  );
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks', 'spotifyEmbed', 'platforms'
  const [mobileSubTab, setMobileSubTab] = useState('list'); // 'list' or 'lyrics'

  const handleLyricClick = (line) => {
    if (line.annotated && line.annotation) {
      setActiveAnnotation(line.annotation);
    }
  };

  const handleSelectTrackMobile = (track) => {
    setSelectedTrackForLyrics(track);
    const firstAnn = track.lyrics.find((l) => l.annotated)?.annotation;
    if (firstAnn) setActiveAnnotation(firstAnn);
    // On small screens, transition to lyrics or offer smooth switch
    if (window.innerWidth < 1024) {
      setMobileSubTab('lyrics');
    }
  };

  return (
    <section id="music" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <Music className="w-3.5 h-3.5" /> SONIC ARCHIVE
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            DISCOGRAPHY & LYRICS
          </h2>
          <p className="text-slate-400 text-xs sm:text-base mt-2 max-w-xl">
            Stream high-fidelity preview clips, dissect verified Genius-style lyric breakdowns, or launch your preferred DSP.
          </p>
        </div>

        {/* View Switcher Tabs (Horizontally scrollable on mobile) */}
        <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md self-start md:self-auto overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'tracks'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Studio Tracks ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab('spotifyEmbed')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'spotifyEmbed'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Spotify Player
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'platforms'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Streaming Hub
          </button>
        </div>
      </div>

      {/* TAB 1: STUDIO TRACKS & GENIUS-STYLE LYRIC ANNOTATIONS */}
      {activeTab === 'tracks' && (
        <div>
          {/* Mobile Sub-Switcher: Tracks vs Lyrics */}
          <div className="lg:hidden flex items-center justify-center p-1 rounded-2xl bg-white/[0.05] border border-white/[0.1] mb-6">
            <button
              onClick={() => setMobileSubTab('list')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mobileSubTab === 'list'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400'
              }`}
            >
              Tracks List ({tracks.length})
            </button>
            <button
              onClick={() => setMobileSubTab('lyrics')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mobileSubTab === 'lyrics'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400'
              }`}
            >
              Lyrics: {selectedTrackForLyrics.title}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Tracklist (Visible on mobile if mobileSubTab === 'list') */}
            <div className={`lg:col-span-5 space-y-3 ${mobileSubTab === 'lyrics' ? 'hidden lg:block' : 'block'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Select Track To Inspect Lyrics:
                </span>
                <span className="text-[10px] font-mono text-purple-300 lg:hidden">
                  Tap card to view lyrics
                </span>
              </div>

              {tracks.map((track) => {
                const isSelected = selectedTrackForLyrics.id === track.id;
                const isCurrentlyPlayingThis = isPlaying && currentTrack.id === track.id;

                return (
                  <SpotlightCard
                    key={track.id}
                    spotlightColor="rgba(168, 85, 247, 0.18)"
                    tilt={false}
                    onClick={() => handleSelectTrackMobile(track)}
                    className={`p-3.5 cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected ? 'border-purple-500/60 bg-purple-950/20' : 'hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        
                        {/* Cover Thumbnail */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/[0.1] group">
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
                              }
                              togglePlay();
                              setSelectedTrackForLyrics(track);
                            }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {isCurrentlyPlayingThis ? (
                              <Pause className="w-5 h-5 fill-white" />
                            ) : (
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            )}
                          </button>
                        </div>

                        {/* Track Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                              {track.title}
                            </h4>
                            {isCurrentlyPlayingThis && (
                              <span className="flex items-center gap-0.5 h-3">
                                <span className="w-0.5 h-3 bg-purple-400 animate-equalizer-1 rounded-full" />
                                <span className="w-0.5 h-3 bg-cyan-400 animate-equalizer-2 rounded-full" />
                                <span className="w-0.5 h-3 bg-purple-300 animate-equalizer-3 rounded-full" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {track.featuring || 'Solo'} • {track.releaseYear}
                          </p>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-slate-400 hidden xs:inline">
                          {track.duration}
                        </span>
                        
                        {/* Play button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentTrack.id !== track.id) {
                              onSelectTrack(track);
                            }
                            togglePlay();
                            setSelectedTrackForLyrics(track);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
                            isCurrentlyPlayingThis
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/[0.05] hover:bg-purple-600 hover:text-white text-slate-300'
                          }`}
                        >
                          {isCurrentlyPlayingThis ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>

                        {/* Chevron on mobile to indicate lyrics view */}
                        <ChevronRight className="w-4 h-4 text-slate-500 lg:hidden" />
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>

            {/* Right Column: Genius-Style Lyrics & Verified Annotation Drawer (7 Cols) */}
            <div className={`lg:col-span-7 ${mobileSubTab === 'list' ? 'hidden lg:block' : 'block'}`}>
              <SpotlightCard className="p-5 sm:p-8 h-full flex flex-col justify-between" spotlightColor="rgba(168, 85, 247, 0.15)">
                <div>
                  
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between pb-4 sm:pb-6 border-b border-white/[0.08] gap-3 mb-6">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
                        <Quote className="w-3 h-3" /> Genius-Style Lyric Insights
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                        {selectedTrackForLyrics.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400">
                        Tap underlined lines to read verified artist breakdown.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={selectedTrackForLyrics.spotifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-medium transition-colors"
                      >
                        Spotify <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Lyrics Container */}
                  <div className="space-y-3 mb-8 text-sm sm:text-base leading-relaxed font-sans">
                    {selectedTrackForLyrics.lyrics.map((line, idx) => (
                      <div key={idx}>
                        {line.annotated ? (
                          <button
                            onClick={() => handleLyricClick(line)}
                            className={`lyric-annotated text-left ${
                              activeAnnotation?.content === line.annotation?.content ? 'active' : ''
                            }`}
                          >
                            "{line.text}"
                          </button>
                        ) : (
                          <p className="text-slate-400 pl-1">
                            "{line.text}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Verified Artist Annotation Box */}
                  <AnimatePresence mode="wait">
                    {activeAnnotation ? (
                      <motion.div
                        key={activeAnnotation.content}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 shadow-lg shadow-purple-950/40 relative"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={artistInfo.avatar}
                              alt="UNNOTICED"
                              className="w-8 h-8 rounded-full object-cover border border-purple-400 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-white">
                                  {activeAnnotation.author}
                                </span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
                              </div>
                              <span className="text-[10px] font-mono text-purple-300">
                                {activeAnnotation.badge}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300/80 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                            Verified
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                          "{activeAnnotation.content}"
                        </p>
                      </motion.div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400 flex items-center gap-2">
                        <Info className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>Select any underlined lyric line above to read UNNOTICED's personal commentary.</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Track Controls & Preview Trigger */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => setMobileSubTab('list')}
                    className="lg:hidden text-xs text-purple-300 font-mono underline"
                  >
                    ← Back to Tracks List
                  </button>

                  <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
                    <Disc className={`w-4 h-4 text-purple-400 ${isPlaying && currentTrack.id === selectedTrackForLyrics.id ? 'animate-spin' : ''}`} />
                    <span>Selected: <strong className="text-white">{selectedTrackForLyrics.title}</strong></span>
                  </div>

                  <button
                    onClick={() => {
                      if (currentTrack.id !== selectedTrackForLyrics.id) {
                        onSelectTrack(selectedTrackForLyrics);
                      }
                      togglePlay();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    {isPlaying && currentTrack.id === selectedTrackForLyrics.id ? (
                      <>
                        <Pause className="w-3 h-3 fill-white" /> Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-white" /> Listen Preview
                      </>
                    )}
                  </button>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPOTIFY OFFICIAL EMBEDDED PLAYER */}
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
            
            <p className="text-xs text-slate-400 mt-4 text-center">
              Requires Spotify app or account for full song lengths. For instant snippets, tap play on any track card!
            </p>
          </div>
        </SpotlightCard>
      )}

      {/* TAB 3: STREAMING PLATFORM LINKS HUB */}
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
