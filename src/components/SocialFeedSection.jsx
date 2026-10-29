import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Music2, ExternalLink, Play, Sparkles } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';

export default function SocialFeedSection() {
  const { socialPosts, artistInfo } = useSiteData();
  const posts = socialPosts || [];
  const info = artistInfo || {};
  const [likesState, setLikesState] = useState({
    'post-1': { count: 4821, liked: false },
    'post-2': { count: 28400, liked: false },
    'post-3': { count: 6190, liked: false },
  });

  const handleToggleLike = (id) => {
    setLikesState((prev) => {
      const item = prev[id] || { count: 100, liked: false };
      return {
        ...prev,
        [id]: {
          count: item.liked ? item.count - 1 : item.count + 1,
          liked: !item.liked
        }
      };
    });
  };

  return (
    <section id="social" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-mono mb-3">
            <InstagramIcon className="w-3.5 h-3.5" /> LIVE COMMUNITY DISPATCH
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            SOCIAL STREAM & REELS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Live updates, studio teasers, and fan interactions synced from Instagram and TikTok.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <a
            href={info.socials?.instagram || '#'}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/25 transition-all"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>@unnoticedmusic</span>
          </a>
        </div>
      </div>

      {/* Social Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => {
          const isLiked = likesState[post.id]?.liked;
          const currentCount = likesState[post.id]?.count.toLocaleString();

          return (
            <SpotlightCard
              key={post.id}
              tilt={true}
              spotlightColor="rgba(236, 72, 153, 0.16)"
              className="p-5 flex flex-col justify-between group"
            >
              <div>
                
                {/* Post Creator Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={info.avatar}
                      alt="UNNOTICED"
                      className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs leading-none">
                        {post.handle}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {post.platform} • {post.date}
                      </span>
                    </div>
                  </div>

                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Media Image / Reel preview with audio pill */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.08] bg-black mb-4">
                  <img
                    src={post.image}
                    alt={post.handle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Sound badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-slate-200 border border-white/[0.1]">
                    <Music2 className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                    <span className="truncate">{post.soundTrack}</span>
                  </div>
                </div>

                {/* Caption Text */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mb-4">
                  {post.content}
                </p>
              </div>

              {/* Engagement Metrics Bar */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isLiked ? 'text-pink-400' : 'hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                    <span className="font-mono">{currentCount}</span>
                  </button>

                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-mono">{post.comments}</span>
                  </span>
                </div>

                <a
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-400 hover:text-pink-300 font-semibold text-[11px] flex items-center gap-1"
                >
                  View Post <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

    </section>
  );
}
