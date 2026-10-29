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
  const { artistInfo } = useSiteData();
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

  const navLinks = [
    { num: '01', label: 'Music & Lyrics', href: '#music' },
    { num: '02', label: 'Biography', href: '#bio' },
    { num: '03', label: 'Videos', href: '#videos' },
    { num: '04', label: 'Tour Dates', href: '#tour' },
    { num: '05', label: 'Merch & Store', href: '#store' },
    { num: '06', label: 'Visual Gallery', href: '#gallery' },
    { num: '07', label: 'Social Stream', href: '#social' },
  ];

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
          scrolled ? 'pt-2.5 pb-2' : 'pt-3.5 pb-2.5 sm:pt-5'
        }`}
      >
        <div className="relative flex items-center justify-between w-full max-w-7xl px-3 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/[0.1] bg-[#090a0f]/85 backdrop-blur-2xl shadow-2xl shadow-black/70">
          
          {/* Left: Brand Identity */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full rounded-full bg-[#090a0f] flex items-center justify-center overflow-hidden">
                <span className="font-display font-extrabold text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                  U
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-black tracking-wider text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
                  UNNOTICED
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-mono tracking-tight bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Ty Sciullo
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block tracking-wide">
                Official Artist Experience
              </p>
            </div>
          </button>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: Audio Mini Pill, EPK, Cart, & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Play Trigger (Desktop/Tablet) */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={togglePlay}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 shadow-md shadow-purple-500/20'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-purple-400/30'
              }`}
            >
              {isPlaying ? (
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2.5 bg-purple-400 animate-pulse" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-bounce" />
                  <span className="w-0.5 h-2 bg-purple-300 animate-pulse" />
                </span>
              ) : (
                <Disc3 className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="max-w-[85px] truncate text-[11px]">
                {isPlaying ? currentTrack.title : 'Play'}
              </span>
            </motion.button>

            {/* EPK Switcher */}
            <button
              onClick={() => setActiveView(activeView === 'epk' ? 'main' : 'epk')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all ${
                activeView === 'epk'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'bg-white/[0.05] text-slate-200 border border-white/[0.08] hover:border-cyan-500/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EPK</span>
            </button>

            {/* Merch Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-200 hover:text-white transition-all active:scale-90"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-purple-500 text-[9px] font-bold text-white shadow-sm shadow-purple-500/50">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button with Fluid Tap Feedback */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:text-white active:scale-90 transition-all"
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

              {/* Dedicated EPK Mobile Button */}
              <motion.button
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                onClick={() => {
                  setActiveView(activeView === 'epk' ? 'main' : 'epk');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full py-3.5 px-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-left mt-2 active:scale-[0.98]"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-cyan-400 font-semibold">08</span>
                  <span className="font-display text-xl font-bold text-cyan-300">
                    Electronic Press Kit (EPK)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200">
                  Press / Booking
                </span>
              </motion.button>
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
