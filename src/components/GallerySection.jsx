import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/artistData';
import SpotlightCard from './SpotlightCard';

export default function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Autoplay interval
  useEffect(() => {
    if (!isAutoplay || isLightboxOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoplay, isLightboxOpen]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  const currentImage = GALLERY_IMAGES[currentIndex];

  return (
    <section id="gallery" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <ImageIcon className="w-3.5 h-3.5" /> VISUAL EXHIBIT
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            VISUAL GALLERY & ARCHIVE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Atmospheric studio stills, editorial portraits, and covert artifacts from the transformation into UNNOTICED.
          </p>
        </div>

        {/* Slideshow Controls Bar */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`px-3.5 py-2 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              isAutoplay
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
            }`}
          >
            {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoplay ? 'Autoplay Active' : 'Paused'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white border border-white/[0.08] flex items-center justify-center transition-colors"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white border border-white/[0.08] flex items-center justify-center transition-colors"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Width Carousel Slide Container */}
      <SpotlightCard
        className="p-3 sm:p-5 relative overflow-hidden"
        spotlightColor="rgba(168, 85, 247, 0.2)"
        tilt={false}
      >
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full"
            >
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="w-full h-full object-cover object-center filter brightness-90"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Lightbox Trigger Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/[0.15] transition-all cursor-pointer hover:scale-105"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Slide Caption Details Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 block mb-1">
                    {currentImage.subtitle}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    {currentImage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans">
                    {currentImage.caption}
                  </p>
                </div>

                <div className="text-xs font-mono text-purple-300 px-3 py-1.5 rounded-full bg-black/60 border border-white/[0.1] backdrop-blur-md self-start md:self-auto shrink-0">
                  {currentIndex + 1} / {GALLERY_IMAGES.length}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3 mt-4">
          {GALLERY_IMAGES.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-video rounded-xl overflow-hidden border transition-all ${
                currentIndex === idx
                  ? 'border-purple-500 scale-[1.02] shadow-lg shadow-purple-500/20'
                  : 'border-white/[0.08] opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </SpotlightCard>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <div>
                <h4 className="font-bold text-white text-base sm:text-lg">
                  {currentImage.title}
                </h4>
                <p className="text-xs text-purple-400 font-mono">
                  {currentImage.subtitle}
                </p>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center Image with Navigation arrows */}
            <div className="relative flex-1 flex items-center justify-center py-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/[0.15] flex items-center justify-center transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/[0.1]"
                onClick={(e) => e.stopPropagation()}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/[0.15] flex items-center justify-center transition-all z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="text-center z-10">
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                {currentImage.caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
