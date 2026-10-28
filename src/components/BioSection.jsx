import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Music, Sparkles, Award, ArrowRight, Quote } from 'lucide-react';
import { ARTIST_INFO, BIOGRAPHY_PARAGRAPHS } from '../data/artistData';
import SpotlightCard from './SpotlightCard';

export default function BioSection() {
  const [activeBioTab, setActiveBioTab] = useState(0);

  return (
    <section id="bio" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Background subtle glow */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Artist Photo & Coordinates Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <SpotlightCard
            tilt={true}
            spotlightColor="rgba(168, 85, 247, 0.25)"
            className="p-3 w-full max-w-md group"
          >
            {/* Main Portrait with Subtle Film Grain / Glitch aesthetic */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/[0.1] bg-[#0c0d14]">
              <img
                src={ARTIST_INFO.avatar}
                alt="UNNOTICED (Formerly Ty Sciullo)"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
              
              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Holographic Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/[0.15] text-[11px] font-mono text-purple-300">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>ARCHIVE PORTRAIT</span>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 block mb-0.5">
                  Tyler R. Sciullo
                </span>
                <h3 className="font-display text-2xl font-black text-white">
                  UNNOTICED
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono mt-2 pt-2 border-t border-white/[0.15]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> McKees Rocks, PA
                  </span>
                  <span>Est. 2016</span>
                </div>
              </div>
            </div>

            {/* Sub-card: Verified Origin Info */}
            <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>LAT/LONG: 40.46° N, 80.07° W</span>
              <span className="text-purple-300">#RustBeltRoots</span>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Multi-Paragraph Interactive Biography (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
              <Calendar className="w-3.5 h-3.5" /> ARTIST CHRONICLE
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
              FROM McKEES ROCKS TO THE UNSEEN
            </h2>
            <p className="text-purple-300 font-tech text-sm sm:text-base font-medium mt-1">
              "Once known as Ty Sciullo, now a man unseen."
            </p>
          </div>

          {/* Interactive Chapter Selector Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {BIOGRAPHY_PARAGRAPHS.map((para, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBioTab(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeBioTab === idx
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                }`}
              >
                0{idx + 1}. {para.title.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Active Chapter Card */}
          <SpotlightCard className="p-6 md:p-8" spotlightColor="rgba(168, 85, 247, 0.15)">
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                Chapter 0{activeBioTab + 1}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Verified Historical Context
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white mb-4">
              {BIOGRAPHY_PARAGRAPHS[activeBioTab].title}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-normal">
              {BIOGRAPHY_PARAGRAPHS[activeBioTab].text}
            </p>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>Read next chapter</span>
              <button
                onClick={() => setActiveBioTab((activeBioTab + 1) % BIOGRAPHY_PARAGRAPHS.length)}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
              >
                Continue Reading <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </SpotlightCard>

          {/* Pull-Quote Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/20 border border-purple-500/20 flex gap-4 items-start">
            <Quote className="w-8 h-8 text-purple-400 shrink-0 opacity-60 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed">
                "I grew up watching family members give their best years to jobs that drained their souls. I realized that whatever pain comes with chasing your art is nothing compared to the regret of never trying at all."
              </p>
              <span className="text-xs font-mono text-purple-300 block mt-2">
                — Tyler Sciullo (UNNOTICED)
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
