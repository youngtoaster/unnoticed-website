import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Music, Sparkles, Award, ArrowRight, Quote } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';

export default function BioSection() {
  const { artistInfo, biography } = useSiteData();
  const [activeBioTab, setActiveBioTab] = useState(0);

  return (
    <section id="bio" className="relative py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Background subtle glow */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        
        {/* Left Column: Artist Photo & Coordinates Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <SpotlightCard
            tilt={false}
            spotlightColor="rgba(168, 85, 247, 0.25)"
            className="p-3 w-full max-w-[320px] sm:max-w-md group mx-auto"
          >
            {/* Main Portrait */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/[0.1] bg-[#0c0d14]">
              <img
                src={artistInfo.avatar}
                alt="UNNOTICED (Formerly Ty Sciullo)"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
              
              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Holographic Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/[0.15] text-[10px] sm:text-[11px] font-mono text-purple-300">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>ARCHIVE PORTRAIT</span>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-purple-400 block mb-0.5">
                  Tyler R. Sciullo
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                  UNNOTICED
                </h3>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-300 font-mono mt-1.5 pt-1.5 border-t border-white/[0.15]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> McKees Rocks, PA
                  </span>
                  <span>Est. 2016</span>
                </div>
              </div>
            </div>

            {/* Sub-card: Verified Origin Info */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400">
              <span>LAT/LONG: 40.46° N, 80.07° W</span>
              <span className="text-purple-300">#RustBeltRoots</span>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Multi-Paragraph Interactive Biography (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-2">
              <Calendar className="w-3.5 h-3.5" /> ARTIST CHRONICLE
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              FROM McKEES ROCKS TO THE UNSEEN
            </h2>
            <p className="text-purple-300 font-tech text-xs sm:text-sm font-medium mt-1">
              "Once known as Ty Sciullo, now a man unseen."
            </p>
          </div>

          {/* Interactive Chapter Selector Pills (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {biography.map((para, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBioTab(idx)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  activeBioTab === idx
                    ? 'theme-primary-btn'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                0{idx + 1}. {para.title.split(':')[0].replace('The Industrial Roots of ', '')}
              </button>
            ))}
          </div>

          {/* Active Chapter Card */}
          <SpotlightCard className="p-5 sm:p-8" spotlightColor="rgba(168, 85, 247, 0.15)">
            <div className="mb-3 sm:mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-[10px] sm:text-xs font-mono text-purple-400 uppercase tracking-wider">
                Chapter 0{activeBioTab + 1} {biography[activeBioTab]?.era ? `• ${biography[activeBioTab].era}` : ''}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-400">
                Verified Historical Context
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
              {biography[activeBioTab]?.title}
            </h3>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-sans font-normal whitespace-pre-line">
              {biography[activeBioTab]?.text || biography[activeBioTab]?.content}
            </p>

            <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>Next chapter</span>
              <button
                onClick={() => setActiveBioTab((activeBioTab + 1) % biography.length)}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors active:scale-95"
              >
                Continue Reading <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </SpotlightCard>

          {/* Pull-Quote Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-purple-500/20 flex gap-3 sm:gap-4 items-start">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 shrink-0 opacity-60 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
                "{artistInfo.quote || "I grew up watching family members give their best years to jobs that drained their souls. I realized that whatever pain comes with chasing your art is nothing compared to the regret of never trying at all."}"
              </p>
              <span className="text-[11px] sm:text-xs font-mono text-purple-300 block mt-2">
                — {artistInfo.quoteAuthor || "Tyler Sciullo (UNNOTICED)"}
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
