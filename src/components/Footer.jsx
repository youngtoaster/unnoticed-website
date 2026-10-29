import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Disc, Radio, ExternalLink, Sparkles } from 'lucide-react';
import { InstagramIcon, TwitterIcon, YoutubeIcon, SpotifyIcon } from './SocialIcons';
import { useSiteData } from '../context/DataContext';

export default function Footer({ onOpenEPK, onOpenAdmin }) {
  const { artistInfo } = useSiteData();
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Secret Easter Egg trigger: Tap "©" 3 times in 1.5 seconds to open admin login
  const handleSecretCopyrightClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (nextCount >= 3) {
      setClickCount(0);
      if (onOpenAdmin) onOpenAdmin();
    } else {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500);
    }
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#07080c] pt-20 pb-28 px-4 sm:px-6">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        
        {/* Brand Left */}
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl text-white tracking-wider">
              {artistInfo.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              f.k.a. {artistInfo.previousName}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {artistInfo.tagline} Alternative hip-hop, dark pop, and nocturnal storytelling from {artistInfo.location}.
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
          <a href="#media" className="hover:text-purple-300 transition-colors">Media Archive</a>
          <a href="#tour" className="hover:text-purple-300 transition-colors">Tour Dates</a>
          <a href="#store" className="hover:text-purple-300 transition-colors">Official Merch</a>
          <a href="#community" className="hover:text-purple-300 transition-colors">Community</a>
          <button onClick={onOpenEPK} className="text-purple-300 hover:text-white transition-colors font-semibold cursor-pointer">
            EPK & Booking
          </button>
        </div>

        {/* Social Icons & Back to Top */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a
              href={artistInfo.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-purple-600 hover:text-white text-slate-300 border border-white/[0.08] flex items-center justify-center transition-colors"
              title="Instagram @unnoticedmusic"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={artistInfo.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-cyan-600 hover:text-white text-slate-300 border border-white/[0.08] flex items-center justify-center transition-colors"
              title="Twitter @Unnoticedmusic"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href={artistInfo.socials.youtube}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-red-600 hover:text-white text-slate-300 border border-white/[0.08] flex items-center justify-center transition-colors"
              title="YouTube @Unnoticed"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a
              href={artistInfo.socials.spotify}
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

      {/* Bottom Copyright Row with Secret Admin Triggers */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
        <div>
          {/* Secret Trigger 1: Triple-clicking the copyright symbol opens the login modal */}
          <span
            onClick={handleSecretCopyrightClick}
            className="cursor-default select-none transition-colors hover:text-slate-400"
            title=""
          >
            © 2026 {artistInfo.name} ({artistInfo.legalName || 'Tyler R. Sciullo'}). All rights reserved.
          </span>

          {/* Secret Trigger 2: A stealth 1.5px invisible micro-button right here */}
          <button
            onClick={onOpenAdmin}
            aria-label=""
            tabIndex={-1}
            className="w-1.5 h-1.5 rounded-full bg-white/[0.03] hover:bg-purple-500/40 inline-block align-middle ml-2.5 opacity-25 cursor-default focus:outline-none"
          />
        </div>

        <span>Fluid motion inspired by Planes & Designeer</span>
      </div>

    </footer>
  );
}
