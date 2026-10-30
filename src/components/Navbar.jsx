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
  const { artistInfo, sectionsVisibility } = useSiteData();
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
        <div className="relative flex items-center justify-between w-full max-w-6xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/[0.12] bg-[#07080e]/90 backdrop-blur-2xl shadow-xl shadow-black/80">
          
          {/* Left: Brand Identity */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-md shadow-purple-500/20">
              <div className="w-full h-full rounded-full bg-[#08090f] flex items-center justify-center overflow-hidden">
                <span className="font-display font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-cyan-200">
                  U
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black tracking-wider text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                  UNNOTICED
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[8.5px] font-mono tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase font-semibold">
                  Ty Sciullo
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 font-mono tracking-wide hidden sm:block">
                Official Artist Experience
              </p>
            </div>
          </button>

          {/* Center: Desktop Navigation Links (Planes/Apple Luxury Glass Capsule) */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-white/[0.04] p-1 rounded-full border border-white/[0.08] shadow-inner">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="relative px-3.5 py-1.5 rounded-full text-[12px] font-medium tracking-wide text-slate-300 hover:text-white transition-all duration-200 hover:bg-white/[0.08] active:scale-95 cursor-pointer"
              >
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Right: Audio Mini Pill, EPK, Cart, & Mobile Hamburger (Uniform height & organized styling) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Play Trigger (Desktop/Tablet) */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              className={`hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-purple-600/25 border-purple-500/50 text-purple-200 shadow-md shadow-purple-600/30'
                  : 'bg-white/[0.04] border-white/[0.1] text-slate-300 hover:border-purple-400/40 hover:text-white'
              }`}
              title={isPlaying ? `Pause: ${currentTrack?.title || 'Preview'}` : `Play: ${currentTrack?.title || 'Studio Preview'}`}
            >
              {isPlaying ? (
                <span className="flex items-center gap-[2px] h-3">
                  <span className="w-0.5 h-2 bg-purple-400 animate-pulse rounded-full" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-bounce rounded-full" />
                  <span className="w-0.5 h-1.5 bg-purple-300 animate-pulse rounded-full" />
                </span>
              ) : (
                <Disc3 className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span className="max-w-[80px] truncate text-[11px] font-semibold">
                {isPlaying ? (currentTrack?.title || 'Playing') : 'Play'}
              </span>
            </motion.button>

            {/* Merch Cart Button */}
            <button
              onClick={openCart}
              className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.1] text-slate-300 hover:text-white hover:border-purple-400/40 transition-all active:scale-90 cursor-pointer"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-[9px] font-bold text-white shadow-md shadow-purple-600/50 border border-purple-300/30">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button with Fluid Tap Feedback */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:text-white active:scale-90 transition-all cursor-pointer"
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden bg-[#060608]/96 backdrop-blur-3xl flex flex-col justify-between p-6 overflow-y-auto safe-bottom"
          >
            {/* Top Bar inside Menu */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-purple-600/50">
                  U
                </div>
                <div>
                  <h4 className="font-display font-black text-white text-base tracking-wider">
                    UNNOTICED
                  </h4>
                  <p className="text-[10px] text-purple-300 font-mono">
                    Formerly Ty Sciullo • McKees Rocks, PA
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kinetic Typography Nav Links with Stagger */}
            <div className="py-6 flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center justify-between w-full py-3 px-4 rounded-2xl bg-white/[0.02] hover:bg-purple-600/15 border border-transparent hover:border-purple-500/30 text-left transition-all active:scale-[0.98]"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-purple-400 font-semibold">
                      {link.num}
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {link.label}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </motion.button>
              ))}
            </div>

            {/* Now Playing Mini-Card inside Menu */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> Currently Loaded Track
                </span>
                <span className="text-[10px] font-mono text-slate-400">{currentTrack.duration}</span>
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
                  className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 active:scale-90 shadow-md shadow-purple-600/40"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Social Icons Footer */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a href={info.socials?.instagram || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 active:scale-90">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a href={info.socials?.twitter || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 active:scale-90">
                  <TwitterIcon className="w-3.5 h-3.5" />
                </a>
                <a href={info.socials?.youtube || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 active:scale-90">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
                <a href={info.socials?.spotify || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 active:scale-90">
                  <SpotifyIcon className="w-3.5 h-3.5" />
                </a>
              </div>

              <span className="text-[10px] font-mono text-slate-500">
                © 2026 UNNOTICED
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
