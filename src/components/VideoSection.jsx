import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, Clock, X, ExternalLink, Bell, Sparkles } from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';

export default function VideoSection() {
  const { videos, artistInfo } = useSiteData();
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  return (
    <section id="videos" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono mb-3">
            <YoutubeIcon className="w-3.5 h-3.5 text-red-500" /> VISUAL REEL
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            OFFICIAL VIDEOS & VISUALIZERS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Cinematic music videos, intimate acoustic studio performances, and behind-the-scenes documentaries.
          </p>
        </div>

        <a
          href={artistInfo.socials.youtube}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors self-start md:self-auto shadow-lg shadow-red-600/30"
        >
          <YoutubeIcon className="w-4 h-4 fill-white" />
          <span>YouTube Channel</span>
        </a>
      </div>

      {/* Two-Column YouTube Video Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {videos.map((video) => (
          <SpotlightCard
            key={video.id}
            tilt={true}
            spotlightColor="rgba(239, 68, 68, 0.15)"
            className="p-5 flex flex-col justify-between group cursor-pointer"
            onClick={() => setActiveModalVideo(video)}
          >
            <div>
              {/* Video Thumbnail with Hover Play Button */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.1] mb-5 bg-[#08080c]">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Big Floating Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/50 backdrop-blur-sm border border-red-400/40"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </motion.div>
                </div>

                {/* Top Category Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono font-medium text-slate-200 border border-white/[0.1]">
                  {video.category}
                </span>

                {/* Bottom Duration Badge */}
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-400" /> {video.duration}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-xl font-bold text-white group-hover:text-red-300 transition-colors mb-2">
                {video.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                {video.description}
              </p>
            </div>

            {/* Bottom Meta Row */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5 text-red-400" /> {video.views}
              </span>
              <span className="text-red-400 group-hover:text-red-300 font-semibold flex items-center gap-1 transition-colors">
                Watch Video <Play className="w-3 h-3 fill-current" />
              </span>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Channel Subscription Call-to-Action Banner */}
      <SpotlightCard
        className="p-8 sm:p-12 relative overflow-hidden"
        spotlightColor="rgba(239, 68, 68, 0.25)"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono mb-3">
              <Bell className="w-3.5 h-3.5 animate-bounce" /> OFFICIAL YOUTUBE NETWORK
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              NEVER MISS A PREMIERE OR TOUR LOG
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Subscribe to <strong className="text-white">@Unnoticed</strong> for instant notifications on official music videos, acoustic live leaks, and tour behind-the-scenes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => setHasSubscribed(true)}
              className={`px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2.5 transition-all shadow-xl ${
                hasSubscribed
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/40 hover:scale-105'
              }`}
            >
              <YoutubeIcon className="w-5 h-5 fill-white" />
              <span>{hasSubscribed ? 'Subscribed to @Unnoticed ✓' : 'Subscribe to YouTube'}</span>
            </button>

            <a
              href={artistInfo.socials.youtube}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Visit Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </SpotlightCard>

      {/* Video Modal / Theatre Mode */}
      <AnimatePresence>
        {activeModalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setActiveModalVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base sm:text-lg">
                    {activeModalVideo.title}
                  </h4>
                  <p className="text-xs text-red-400 font-mono">
                    {activeModalVideo.category} • {activeModalVideo.duration}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Frame with Animated Visualizer */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeModalVideo.thumbnail}
                  alt={activeModalVideo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
                />
                
                {/* Simulated Studio Visualizer Screen */}
                <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mb-4 shadow-xl shadow-red-600/50 animate-pulse">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <h5 className="font-display text-xl font-bold text-white mb-2">
                    {activeModalVideo.title}
                  </h5>
                  <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                    Watch the official HD stream directly on YouTube for high quality 4K and Dolby audio.
                  </p>
                  <a
                    href={artistInfo.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-600/40 transition-all"
                  >
                    <YoutubeIcon className="w-4 h-4 fill-white" />
                    <span>Open on YouTube App</span>
                  </a>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
                <span>{activeModalVideo.description}</span>
                <span className="font-mono text-red-300">{activeModalVideo.views}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
