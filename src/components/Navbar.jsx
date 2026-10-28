import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ShoppingBag, Menu, X, Disc3, Radio, FileText, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { ARTIST_INFO } from '../data/artistData';

export default function Navbar({
  currentTrack,
  isPlaying,
  togglePlay,
  cartCount,
  openCart,
  activeView,
  setActiveView
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Music', href: '#music' },
    { label: 'Bio', href: '#bio' },
    { label: 'Videos', href: '#videos' },
    { label: 'Tour', href: '#tour' },
    { label: 'Merch', href: '#store' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Community', href: '#social' },
  ];

  const handleNavClick = (href) => {
    if (activeView !== 'main') {
      setActiveView('main');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="relative flex items-center justify-between w-full max-w-7xl px-4 sm:px-6 py-2.5 rounded-full border border-white/[0.1] bg-[#090a0f]/80 backdrop-blur-2xl shadow-2xl shadow-black/60 transition-all duration-300">
        
        {/* Left: Brand Identity with Morphing Subtitle */}
        <button
          onClick={() => {
            setActiveView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full rounded-full bg-[#090a0f] flex items-center justify-center overflow-hidden">
              <span className="font-display font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                U
              </span>
            </div>
            {/* Ambient pulse */}
            <span className="absolute -inset-1 rounded-full bg-purple-500/20 blur-sm -z-10 group-hover:bg-purple-500/40 transition-colors" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold tracking-wider text-base text-white group-hover:text-purple-300 transition-colors">
                UNNOTICED
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight bg-purple-500/10 text-purple-300 border border-purple-500/20">
                f.k.a. Ty Sciullo
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Official Artist Experience
            </p>
          </div>
        </button>

        {/* Center: Desktop Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Audio Mini Pill, EPK Toggle & Merch Cart */}
        <div className="flex items-center gap-2.5">
          {/* Audio Quick Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
              isPlaying
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-200 shadow-lg shadow-purple-500/20'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-purple-400/30'
            }`}
            title={isPlaying ? 'Pause preview audio' : 'Play preview clip'}
          >
            {isPlaying ? (
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2.5 bg-purple-400 animate-pulse" />
                <span className="w-0.5 h-3 bg-cyan-400 animate-bounce" />
                <span className="w-0.5 h-2 bg-purple-300 animate-pulse" />
              </span>
            ) : (
              <Disc3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300" />
            )}
            <span className="hidden sm:inline max-w-[90px] truncate text-[11px]">
              {isPlaying ? currentTrack.title : 'Play Music'}
            </span>
          </motion.button>

          {/* EPK Mode Switcher */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveView(activeView === 'epk' ? 'main' : 'epk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeView === 'epk'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'bg-white/[0.05] text-slate-200 border border-white/[0.08] hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EPK</span>
          </motion.button>

          {/* Cart Drawer Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCart}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-200 hover:border-purple-400/30 hover:text-white transition-all"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-purple-500 text-[9px] font-bold text-white shadow-sm shadow-purple-500/50">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden absolute top-20 left-4 right-4 p-5 rounded-3xl border border-white/[0.1] bg-[#0b0c13]/95 backdrop-blur-3xl shadow-2xl z-50 flex flex-col gap-3"
          >
            <div className="pb-2 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="font-display font-bold text-white text-base">UNNOTICED</span>
                <p className="text-xs text-purple-400">Formerly Ty Sciullo</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                LIVE EXPERIENCE
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setActiveView(activeView === 'epk' ? 'main' : 'epk');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-colors flex items-center justify-between"
              >
                <span>Electronic Press Kit (EPK)</span>
                <span className="text-xs font-mono bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-200">
                  Media & Booking
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
