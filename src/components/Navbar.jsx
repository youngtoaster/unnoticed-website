import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ShoppingBag, Menu, X, Disc3, Radio, FileText, Sparkles, Volume2, VolumeX, ArrowRight, Play, Pause } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import { InstagramIcon, TwitterIcon, YoutubeIcon, SpotifyIcon } from './SocialIcons';

export default function Navbar({
  currentTrack,
  isPlaying,
  togglePlay,
  cartCount,
  openCart,
  activeView,
  setActiveView,
  onOpenAdmin
}) {
  const { artistInfo, sectionsVisibility, siteTheme } = useSiteData();
  const theme = siteTheme || artistInfo?.theme || { primary: '#a855f7', secondary: '#6366f1', accent: '#06b6d4' };
  const info = artistInfo || { socials: {} };
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoClicksRef = useRef({ count: 0, timer: null });

  const handleLogoClick = () => {
    logoClicksRef.current.count += 1;
    if (logoClicksRef.current.timer) clearTimeout(logoClicksRef.current.timer);
    if (logoClicksRef.current.count >= 5) {
      logoClicksRef.current.count = 0;
      if (onOpenAdmin) onOpenAdmin();
      return;
    }
    logoClicksRef.current.timer = setTimeout(() => {
      logoClicksRef.current.count = 0;
    }, 1500);

    setActiveView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const rawNavLinks = [
    { id: 'music', num: '01', label: 'Music & Lyrics', href: '#music' },
    { id: 'bio', num: '02', label: 'Biography', href: '#bio' },
    { id: 'media', num: '03', label: 'Visual Media', href: '#media' },
    { id: 'tour', num: '04', label: 'Tour Dates', href: '#tour' },
    { id: 'store', num: '05', label: 'Merch Store', href: '#store' },
    { id: 'social', num: '06', label: 'Community', href: '#community' },
  ];

  // Dynamically hide navigation links when their corresponding section is disabled
  const navLinks = rawNavLinks.filter((link) => sectionsVisibility?.[link.id] !== false);

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (activeView !== 'main') {
      setActiveView('main');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 transition-all duration-300 ${
          scrolled ? 'pt-2 pb-1.5' : 'pt-3 pb-2 sm:pt-4'
        }`}
      >
        <div className="relative flex items-center justify-between w-full max-w-6xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/[0.14] bg-[#07080e] shadow-2xl shadow-black">
          
          {/* Left: Brand Identity */}
          <button
            onClick={handleLogoClick}
            className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0 py-0.5"
          >
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-display font-black tracking-wider text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                  {artistInfo.name || 'UNNOTICED'}
                </span>
                {artistInfo.showNavbarMoniker !== false && (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[8.5px] font-mono tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase font-semibold">
                    {artistInfo.navbarMoniker ?? artistInfo.previousName ?? 'Ty Sciullo'}
                  </span>
                )}
              </div>
              {artistInfo.showNavbarTagline !== false && (
                <p className="text-[9.5px] text-slate-400 font-mono tracking-wide hidden sm:block">
                  {artistInfo.navbarTagline || 'Official Artist Experience'}
                </p>
              )}
            </div>
          </button>

          {/* Center: Desktop Navigation Links (Solid Luxury Obsidian Capsule) */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-[#0e0f18] p-1 rounded-full border border-white/[0.12] shadow-inner">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="relative px-3.5 py-1.5 rounded-full text-[12px] font-medium tracking-wide text-slate-300 hover:text-white transition-all duration-200 hover:bg-[#181928] active:scale-95 cursor-pointer"
              >
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Right: Audio Mini Pill, Cart, & Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Play Trigger (Desktop/Tablet) */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-mono transition-all cursor-pointer shadow-sm"
              style={isPlaying ? {
                backgroundColor: `${theme.primary}25`,
                borderColor: `${theme.primary}70`,
                color: '#ffffff',
                boxShadow: `0 0 10px ${theme.primary}30`
              } : {
                backgroundColor: '#12131e',
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#e2e8f0'
              }}
              title={isPlaying ? `Pause: ${currentTrack?.title || 'Preview'}` : `Play: ${currentTrack?.title || 'Studio Preview'}`}
            >
              {isPlaying ? (
                <span className="flex items-center gap-[2px] h-3">
                  <span className="w-0.5 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                  <span className="w-0.5 h-3 rounded-full animate-bounce" style={{ backgroundColor: theme.accent }} />
                  <span className="w-0.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.secondary }} />
                </span>
              ) : (
                <Disc3 className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              )}
              <span className="max-w-[80px] truncate text-[11px] font-semibold">
                {isPlaying ? (currentTrack?.title || 'Playing') : 'Play'}
              </span>
            </motion.button>

            {/* Merch Cart Button */}
            <button
              onClick={openCart}
              className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#12131e] border border-white/[0.12] text-slate-200 hover:text-white transition-all active:scale-90 cursor-pointer shadow-sm"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold text-[#08090e] bg-white border border-white/60 shadow-sm tabular-nums"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button with Quiet Neutral Chrome */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.14] bg-white/[0.06] text-white active:scale-90 transition-all cursor-pointer hover:bg-white/[0.12]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* FULL-SCREEN OVERHAULED MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 lg:hidden bg-[#07080e]/98 backdrop-blur-3xl flex flex-col justify-between p-6 overflow-y-auto safe-bottom"
          >
            {/* Top Bar inside Menu */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h4 className="font-display font-black text-white text-base tracking-wider">
                  {artistInfo.name || 'UNNOTICED'}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  {artistInfo.tagline || 'Formerly Ty Sciullo • McKees Rocks, PA'}
                </p>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center active:scale-90 transition-all"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Kinetic Typography Nav Links with Stagger */}
            <div className="py-6 flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx, duration: 0.25 }}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center justify-between w-full py-3.5 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.12] text-left transition-all active:scale-[0.98]"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-slate-400 font-semibold tabular-nums">
                      {link.num}
                    </span>
                    <span className="font-display text-lg font-bold text-white tracking-tight">
                      {link.label}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </motion.button>
              ))}
            </div>

            {/* Now Playing Mini-Card inside Menu (Quiet Craft) */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Disc3 className="w-3 h-3 text-slate-400" /> Current Track
                </span>
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">{currentTrack.duration}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={currentTrack.cover}
                    alt={currentTrack.title}
                    className="w-10 h-10 rounded-xl object-cover border border-white/[0.1] shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-sm text-white truncate">{currentTrack.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">UNNOTICED</p>
                  </div>
                </div>

                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-white text-[#08090e] hover:bg-slate-200 flex items-center justify-center shrink-0 active:scale-90 shadow-md font-bold"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Social Icons Footer */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <a href={info.socials?.instagram || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white active:scale-90" aria-label="Instagram">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a href={info.socials?.twitter || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white active:scale-90" aria-label="Twitter">
                  <TwitterIcon className="w-3.5 h-3.5" />
                </a>
                <a href={info.socials?.youtube || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white active:scale-90" aria-label="YouTube">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
                <a href={info.socials?.spotify || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white active:scale-90" aria-label="Spotify">
                  <SpotifyIcon className="w-3.5 h-3.5" />
                </a>
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                © 2026 UNNOTICED
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
