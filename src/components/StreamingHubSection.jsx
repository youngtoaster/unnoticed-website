import React from 'react';
import { motion } from 'framer-motion';
import { Radio, ExternalLink, Sparkles, Disc, Music, Headphones, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import ShinyText from './reactbits/ShinyText';
import { SpotifyIcon, YoutubeIcon } from './SocialIcons';

// Custom Apple Music & SoundCloud vector badges
function AppleMusicIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" style={{ display: 'none' }} />
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.82 1.44-.59.68-1.11 1.76-.97 2.8 1.07.08 2.16-.62 2.78-1.37z" />
    </svg>
  );
}

function SoundcloudIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M1.175 12.225c-.051 0-.094.044-.102.096l-.281 2.569.281 2.544c.008.052.051.096.102.096.052 0 .095-.044.103-.096l.307-2.544-.307-2.569a.097.097 0 0 0-.103-.096zm1.125-.794c-.06 0-.111.05-.119.111l-.23 3.352.23 3.327c.008.061.059.111.119.111.06 0 .11-.05.118-.111l.248-3.327-.248-3.352a.114.114 0 0 0-.118-.111zm1.15-.477c-.068 0-.127.058-.135.127l-.178 3.829.178 3.804c.008.069.067.127.135.127.069 0 .128-.058.136-.127l.195-3.804-.195-3.829a.13.13 0 0 0-.136-.127zm1.168-.196c-.078 0-.144.066-.152.145l-.128 4.025.128 4.001c.008.079.074.145.152.145.078 0 .144-.066.152-.145l.136-4.001-.136-4.025a.148.148 0 0 0-.152-.145zm1.186-.255c-.086 0-.161.074-.17.162l-.076 4.28.076 4.256c.009.088.084.162.17.162.087 0 .162-.074.17-.162l.086-4.256-.086-4.28a.166.166 0 0 0-.17-.162zm1.203.221c-.095 0-.178.082-.187.18l-.026 4.059.026 4.035c.009.098.092.18.187.18.095 0 .178-.082.187-.18l.026-4.035-.026-4.059a.183.183 0 0 0-.187-.18zm1.222-1.396c-.104 0-.195.091-.204.198l-.025 5.455.025 5.431c.009.107.1.198.204.198.104 0 .195-.091.204-.198l.026-5.431-.026-5.455a.201.201 0 0 0-.204-.198zm1.239-.579c-.113 0-.212.099-.221.216l-.017 6.034.017 6.01c.009.117.108.216.221.216.113 0 .212-.099.221-.216l.017-6.01-.017-6.034a.22.22 0 0 0-.221-.216zm1.256-.707c-.122 0-.229.108-.238.234l-.009 6.741.009 6.717c.009.126.116.234.238.234.122 0 .229-.108.238-.234l.008-6.717-.008-6.741a.238.238 0 0 0-.238-.234zm1.274.025c-.13 0-.245.116-.255.251l-.008 6.716.008 6.692c.01.135.125.251.255.251.13 0 .245-.116.255-.251l.009-6.692-.009-6.716a.255.255 0 0 0-.255-.251zm5.289-4.839c-.378 0-.743.064-1.084.184-.251-1.637-1.66-2.894-3.37-2.894-.462 0-.903.094-1.306.264l-.015.006-.035 9.17.035 5.176c.01.144.133.268.272.268h5.503c1.942 0 3.516-1.574 3.516-3.516 0-1.941-1.574-5.658-3.516-5.658z"/>
    </svg>
  );
}

export default function StreamingHubSection() {
  const { artistInfo } = useSiteData();
  const info = artistInfo || {};
  const socials = info.socials || {};

  const platforms = [
    {
      id: 'spotify',
      name: 'Spotify',
      tagline: 'Primary Transmission Node',
      metrics: '148,200+ Monthly Listeners • Verified Artist',
      description: 'Stream complete studio masters, algorithmic radio, and curated nocturnal playlist placements.',
      url: socials.spotify || 'https://open.spotify.com/artist/5ETABaJMvhYJpsxQku2IQe',
      accentColor: '#1ed760',
      accentBg: 'rgba(30, 215, 96, 0.12)',
      accentBorder: 'rgba(30, 215, 96, 0.3)',
      badgeText: 'Most Popular',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
      icon: <SpotifyIcon className="w-5 h-5 fill-current" />
    },
    {
      id: 'appleMusic',
      name: 'Apple Music',
      tagline: 'Lossless & Spatial Audio',
      metrics: '24-Bit / 48kHz Digital Masters',
      description: 'Experience high-fidelity lossless studio masters and immersive Spatial Audio playback.',
      url: socials.appleMusic || 'https://music.apple.com/us/artist/ty-sciullo/1218320490',
      accentColor: '#fc3c44',
      accentBg: 'rgba(252, 60, 68, 0.12)',
      accentBorder: 'rgba(252, 60, 68, 0.3)',
      badgeText: 'Spatial Audio',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      buttonClass: 'bg-rose-500 hover:bg-rose-400 text-white font-bold',
      icon: <AppleMusicIcon className="w-5 h-5 fill-current" />
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      tagline: 'Visuals & Motion Broadcasts',
      metrics: 'Official Music Videos & Studio Live Sessions',
      description: 'Stream official cinematic visual broadcasts, lyric videos, and live McKees Rocks studio transmissions.',
      url: socials.youtube || 'https://www.youtube.com/@UnnoticedOfficial',
      accentColor: '#ff0000',
      accentBg: 'rgba(255, 0, 0, 0.12)',
      accentBorder: 'rgba(255, 0, 0, 0.3)',
      badgeText: 'Visuals & 4K',
      badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
      buttonClass: 'bg-red-600 hover:bg-red-500 text-white font-bold',
      icon: <YoutubeIcon className="w-5 h-5 fill-current" />
    },
    {
      id: 'soundcloud',
      name: 'SoundCloud',
      tagline: 'Vault Demos & Underground Cuts',
      metrics: 'Exclusive B-Sides & Late-Night Sketches',
      description: 'Rough industrial demos, experimental late-night sketches, and raw unreleased catalog archives.',
      url: socials.soundcloud || 'https://soundcloud.com/tysciullo',
      accentColor: '#ff5500',
      accentBg: 'rgba(255, 85, 0, 0.12)',
      accentBorder: 'rgba(255, 85, 0, 0.3)',
      badgeText: 'Underground Vault',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      buttonClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
      icon: <SoundcloudIcon className="w-5 h-5 fill-current" />
    }
  ];

  return (
    <section id="stream-locations" className="relative py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[350px] sm:w-[550px] h-[350px] sm:h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] sm:w-[500px] h-[320px] sm:h-[450px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <ShinyText text="GLOBAL STREAMING DIRECTORY" speed={4} />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            STREAM LOCATIONS
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl">
            Stream the official UNNOTICED catalog across major digital streaming networks, lossless audio formats, and underground archives.
          </p>
        </div>

        {/* Quick jump to self-hosted studio discography */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="#music"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0e0f18] hover:bg-[#181928] text-xs font-mono font-semibold text-purple-300 border border-white/[0.12] transition-colors active:scale-95 shadow-md shadow-black"
          >
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span>Studio Discography & Lyrics ↑</span>
          </a>
        </div>
      </div>

      {/* 4-Column DSP Grid - Equal Height & Pixel-Aligned Buttons Across All Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {platforms.map((platform) => (
          <SpotlightCard
            key={platform.id}
            spotlightColor={platform.accentColor ? `${platform.accentColor}33` : 'rgba(168, 85, 247, 0.18)'}
            tilt={false}
            className="p-5 sm:p-6 border-white/[0.1] hover:border-white/[0.25] transition-all duration-300 group h-full"
            innerClassName="h-full flex flex-col justify-between"
          >
            <div className="flex-1 flex flex-col">
              {/* Card Header: Platform Icon + Badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: platform.accentBg,
                    borderColor: platform.accentBorder,
                    color: platform.accentColor
                  }}
                >
                  {platform.icon}
                </div>

                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${platform.badgeClass}`}>
                  {platform.badgeText}
                </span>
              </div>

              {/* Title & Tagline with standardized min-heights */}
              <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-white transition-colors min-h-[28px] flex items-center">
                {platform.name}
              </h3>
              <p className="text-[11px] font-mono font-semibold text-purple-300 mb-2.5 min-h-[18px] flex items-center">
                {platform.tagline}
              </p>

              {/* Metric Pill - Locked to consistent 44px min-height across all 4 cards */}
              <div className="min-h-[44px] flex items-center text-[10px] font-mono text-slate-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1.5 rounded-lg mb-3">
                <span className="leading-snug">{platform.metrics}</span>
              </div>

              {/* Description - Locked to consistent 64px min-height across all 4 cards */}
              <p className="min-h-[64px] text-xs text-slate-300 leading-relaxed font-light mb-4">
                {platform.description}
              </p>
            </div>

            {/* Launch Action Button - Guaranteed strictly pixel-aligned at the bottom */}
            <div className="mt-auto pt-4 border-t border-white/[0.08]">
              <a
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                className={`w-full h-11 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${platform.buttonClass}`}
              >
                <span>Listen on {platform.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Telemetry Summary Bar */}
      <div className="mt-8 p-4 rounded-2xl bg-[#0a0b12] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Official Distribution: <strong>All Major DSPs Synchronized & Verified</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Lossless 24-Bit / 48kHz Masters</span>
          <span className="text-slate-600">•</span>
          <span>Curated Playlist Placements</span>
        </div>
      </div>

    </section>
  );
}
