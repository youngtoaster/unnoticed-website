import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';

export default function GallerySection() {
  const { galleryImages } = useSiteData();
  const images = galleryImages && galleryImages.length > 0 ? galleryImages : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Keep index within bounds if gallery length changes
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  // Autoplay interval
  useEffect(() => {
    if (!isAutoplay || isLightboxOpen || images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoplay, isLightboxOpen, images.length]);

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex] || {
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    title: 'UNNOTICED ARCHIVE',
    subtitle: 'STUDIO SNAPSHOT',
    caption: 'Visual stillness from the production sanctuary.'
  };

  return (
    <section id="gallery" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <ImageIcon className="w-3.5 h-3.5" /> VISUAL EXHIBIT
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            VISUAL GALLERY & ARCHIVE
          </h2>
          <p className="text-slate-400 text-xs sm:text-base mt-2 max-w-xl">
            Atmospheric studio stills, editorial portraits, and covert artifacts from the transformation into UNNOTICED.
          </p>
        </div>

        {/* Slideshow Controls Bar */}
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-colors active:scale-95 ${
              isAutoplay
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
            }`}
          >
            {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoplay ? 'Autoplay' : 'Paused'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white border border-white/[0.08] flex items-center justify-center transition-colors active:scale-90"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white border border-white/[0.08] flex items-center justify-center transition-colors active:scale-90"
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
        <div className="relative aspect-[4/3] xs:aspect-[16/10] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full"
            >
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="w-full h-full object-cover object-center filter brightness-90"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

              {/* Lightbox Trigger Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/[0.15] transition-all cursor-pointer active:scale-95"
                title="View Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Slide Caption Details Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div className="max-w-xl">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-purple-400 block mb-0.5">
                    {currentImage.subtitle}
                  </span>
                  <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-extrabold text-white mb-1">
                    {currentImage.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-sans line-clamp-2 sm:line-clamp-none">
                    {currentImage.caption}
                  </p>
                </div>

                <div className="text-[11px] sm:text-xs font-mono text-purple-300 px-2.5 py-1 rounded-full bg-black/60 border border-white/[0.1] backdrop-blur-md self-start md:self-auto shrink-0">
                  {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : '0 / 0'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Selector Strip (Scrollable horizontally on mobile) */}
        <div className="flex sm:grid sm:grid-cols-6 gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-video w-20 sm:w-auto shrink-0 rounded-xl overflow-hidden border transition-all active:scale-95 ${
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 safe-bottom"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <div>
                <h4 className="font-bold text-white text-sm sm:text-lg">
                  {currentImage.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-purple-400 font-mono">
                  {currentImage.subtitle}
                </p>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-white flex items-center justify-center active:scale-90"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Center Image */}
            <div className="relative flex-1 flex items-center justify-center py-2 sm:py-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-1 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 text-white border border-white/[0.15] flex items-center justify-center active:scale-90 z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="max-h-[70vh] sm:max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/[0.1]"
                onClick={(e) => e.stopPropagation()}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-1 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 text-white border border-white/[0.15] flex items-center justify-center active:scale-90 z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="text-center z-10 pb-2">
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto px-4">
                {currentImage.caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
