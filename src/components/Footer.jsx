import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Disc, Radio, ExternalLink, Sparkles } from 'lucide-react';
import { InstagramIcon, TwitterIcon, YoutubeIcon, SpotifyIcon } from './SocialIcons';
import { ARTIST_INFO } from '../data/artistData';

export default function Footer({ onOpenEPK }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#07080c] pt-20 pb-28 px-4 sm:px-6">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        
        {/* Brand Left */}
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl text-white tracking-wider">
              UNNOTICED
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              f.k.a. Ty Sciullo
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Once known as Ty Sciullo, now a man unseen. Alternative hip-hop, dark pop, and nocturnal storytelling from McKees Rocks, PA.
          </p>

          <div className="pt-1 flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span>PITTSBURGH, PA</span>
            <span>•</span>
            <span>WORLDWIDE</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium text-slate-300">
          <a href="#music" className="hover:text-purple-300 transition-colors">Music & Lyrics</a>
          <a href="#bio" className="hover:text-purple-300 transition-colors">Artist Bio</a>
          <a href="#videos" className="hover:text-purple-300 transition-colors">Videos</a>
          <a href="#tour" className="hover:text-purple-300 transition-colors">Tour Dates</a>
          <a href="#store" className="hover:text-purple-300 transition-colors">Official Merch</a>
          <a href="#gallery" className="hover:text-purple-300 transition-colors">Gallery</a>
          <button onClick={onOpenEPK} className="text-cyan-300 hover:text-cyan-200 transition-colors font-semibold">
            EPK & Booking
          </button>
        </div>

        {/* Social Icons & Back to Top */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a
              href={ARTIST_INFO.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-purple-600 hover:text-white text-slate-300 border border-white/[0.08] flex items-center justify-center transition-colors"
              title="Instagram @unnoticedmusic"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={ARTIST_INFO.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-cyan-600 hover:text-white text-slate-300 border border-white/[0.08] flex items-center justify-center transition-colors"
              title="Twitter @Unnoticedmusic"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href={ARTIST_INFO.socials.youtube}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-red-600 hover:text-white text-slate-300 border border-white/[0.08] flex items-center justify-center transition-colors"
              title="YouTube @Unnoticed"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a
              href={ARTIST_INFO.socials.spotify}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-emerald-600 hover:text-white text-slate-300 border border-white/[0.08] flex items-center justify-center transition-colors"
              title="Spotify"
            >
              <SpotifyIcon className="w-4 h-4" />
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 flex items-center justify-center transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
        <span>© 2026 UNNOTICED (Tyler R. Sciullo). All rights reserved.</span>
        <span>Fluid motion inspired by Planes & Designeer</span>
      </div>

    </footer>
  );
}
