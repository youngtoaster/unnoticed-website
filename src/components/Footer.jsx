import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Disc, Radio, ExternalLink, Sparkles, FileText, Download, ShieldCheck, ArrowRight } from 'lucide-react';
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
    <footer className="relative border-t border-white/[0.08] bg-[#07080c] pt-16 sm:pt-20 pb-28 px-4 sm:px-6">
      
      {/* ======================================================== */}
      {/* PROMINENT OFFICIAL ELECTRONIC PRESS KIT (EPK) ACTION BAR */}
      {/* Located prominently at the bottom of the site             */}
      {/* ======================================================== */}
      <div className="max-w-6xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0d1224]/90 via-[#0a0c16]/90 to-[#120e24]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/30"
        >
          {/* Ambient rim glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  Media, Curators & Promoters
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Updated 2026/2027
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
                Official Electronic Press Kit (EPK)
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Access high-resolution print portraiture, venue tech rider & stage plots, streaming telemetry, verified biographical dossier, and industry booking representation.
              </p>
            </div>

            {/* Prominent Press Kit Action Trigger Button */}
            <div className="flex items-center gap-3 shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenEPK}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 border border-cyan-300/40 cursor-pointer active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4 text-cyan-200" />
                <span>Open Electronic Press Kit</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        
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
          <button onClick={onOpenEPK} className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold cursor-pointer flex items-center gap-1">
            <span>Press Kit</span>
            <ArrowRight className="w-3 h-3" />
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
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
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
