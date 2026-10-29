import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Eye, Clock, X, ExternalLink, Bell, Sparkles,
  ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon, Video, Film,
  Plus, Upload, Link as LinkIcon, Check, AlertCircle, FileVideo
} from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import ShinyText from './reactbits/ShinyText';
import Magnet from './reactbits/Magnet';
import { extractYouTubeId, getYouTubeThumbnail, isDirectVideo } from '../utils/videoHelper';

export default function MediaSection() {
  const { videos, galleryImages, artistInfo, updateData } = useSiteData();
  const [activeMediaTab, setActiveMediaTab] = useState('videos'); // 'videos' | 'gallery'
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  // Add Video Form State
  const [addMode, setAddMode] = useState('youtube'); // 'youtube' | 'upload'
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('Music Video');
  const [videoDuration, setVideoDuration] = useState('3:20');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);
  const [uploadedVideoPreview, setUploadedVideoPreview] = useState(null);
  const [detectedYouTubeId, setDetectedYouTubeId] = useState('');
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  // Gallery state
  const images = galleryImages && galleryImages.length > 0 ? galleryImages : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  useEffect(() => {
    if (!isAutoplay || isLightboxOpen || images.length === 0 || activeMediaTab !== 'gallery') return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoplay, isLightboxOpen, images.length, activeMediaTab]);

  const handleNextSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex] || {
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    title: 'UNNOTICED ARCHIVE',
    subtitle: 'STUDIO SNAPSHOT',
    caption: 'Visual stillness from the production sanctuary.'
  };

  // Detect YouTube ID as user types
  const handleYouTubeUrlChange = (val) => {
    setVideoInputUrl(val);
    setFormError('');
    const id = extractYouTubeId(val);
    setDetectedYouTubeId(id);
  };

  // Handle local video file upload
  const handleVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setFormError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setUploadedVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadedVideoPreview(objectUrl);
    setFormError('');
    if (!videoTitle) {
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  // Submit new video to site collection
  const handleAddVideoSubmit = (e) => {
    e.preventDefault();

    if (addMode === 'youtube') {
      const ytId = extractYouTubeId(videoInputUrl);
      if (!ytId) {
        setFormError('Please enter a valid YouTube link or 11-character video ID.');
        return;
      }

      const newVid = {
        id: `vid-${Date.now()}`,
        title: videoTitle.trim() || 'UNNOTICED — Music Video',
        thumbnail: getYouTubeThumbnail(ytId),
        youtubeEmbedId: ytId,
        views: 'New Release',
        duration: videoDuration || '3:30',
        category: videoCategory || 'Music Video',
        description: videoDescription.trim() || 'Official visual project by UNNOTICED.',
        type: 'youtube'
      };

      updateData((prev) => ({ ...prev, videos: [newVid, ...(prev.videos || [])] }));
      closeAddModal();
    } else {
      // Upload mode
      if (!uploadedVideoPreview) {
        setFormError('Please choose a video file to upload.');
        return;
      }

      const newVid = {
        id: `vid-upload-${Date.now()}`,
        title: videoTitle.trim() || uploadedVideoFile?.name || 'Uploaded Visual',
        thumbnail: artistInfo?.avatar || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        videoUrl: uploadedVideoPreview,
        views: 'Studio Cut',
        duration: videoDuration || 'Uploaded',
        category: videoCategory || 'Studio Upload',
        description: videoDescription.trim() || 'Directly uploaded studio master clip.',
        type: 'upload'
      };

      updateData((prev) => ({ ...prev, videos: [newVid, ...(prev.videos || [])] }));
      closeAddModal();
    }
  };

  const closeAddModal = () => {
    setShowAddVideoModal(false);
    setVideoInputUrl('');
    setVideoTitle('');
    setVideoDescription('');
    setUploadedVideoFile(null);
    setUploadedVideoPreview(null);
    setDetectedYouTubeId('');
    setFormError('');
  };

  return (
    <section id="media" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header with Segmented Tab Switcher (Planes style) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <Film className="w-3.5 h-3.5" />
            <ShinyText text="VISUAL & MEDIA ARCHIVE" speed={4} />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            VIDEOS & PHOTO EXHIBIT
          </h2>
          <p className="text-slate-400 text-xs sm:text-base mt-2 max-w-xl">
            Cinematic official music videos, uploaded studio cuts, and curated high-resolution photography.
          </p>
        </div>

        {/* Media Mode Switcher & Add Video Trigger */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <button
              onClick={() => setActiveMediaTab('videos')}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors active:scale-95 ${
                activeMediaTab === 'videos' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeMediaTab === 'videos' && (
                <motion.div
                  layoutId="mediaTabPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/30"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                Music Videos ({videos?.length || 0})
              </span>
            </button>

            <button
              onClick={() => setActiveMediaTab('gallery')}
              className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors active:scale-95 ${
                activeMediaTab === 'gallery' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeMediaTab === 'gallery' && (
                <motion.div
                  layoutId="mediaTabPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/30"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Photo Gallery ({images.length})
              </span>
            </button>
          </div>

          {/* Quick Add Video Pill Button */}
          {activeMediaTab === 'videos' && (
            <button
              onClick={() => setShowAddVideoModal(true)}
              className="px-3.5 py-2 rounded-full bg-purple-500/15 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Add a YouTube link or upload video file"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Video</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CINEMATIC YOUTUBE & UPLOADED VIDEOS               */}
      {/* ======================================================== */}
      {activeMediaTab === 'videos' && (
        <div>
          {/* Two-Column Video Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {(videos || []).map((video) => {
              const ytId = extractYouTubeId(video.youtubeEmbedId || video.youtubeId || video.url);
              const isUpload = video.type === 'upload' || isDirectVideo(video.videoUrl);
              const thumbSrc = video.thumbnail || (ytId ? getYouTubeThumbnail(ytId) : artistInfo?.avatar);

              return (
                <SpotlightCard
                  key={video.id}
                  tilt={false}
                  spotlightColor="rgba(168, 85, 247, 0.18)"
                  className="p-4 sm:p-5 flex flex-col justify-between group cursor-pointer transition-all duration-300"
                  onClick={() => setActiveModalVideo({ ...video, extractedId: ytId })}
                >
                  <div>
                    {/* Thumbnail with Hover Play Button */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.1] mb-4 sm:mb-5 bg-[#08080c]">
                      <img
                        src={thumbSrc}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                      {/* Floating Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-purple-600/90 group-hover:bg-purple-600 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 backdrop-blur-sm border border-purple-400/40 group-hover:scale-110 transition-all">
                          <Play className="w-6 h-6 fill-white ml-1" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-slate-200 border border-white/[0.1]">
                          {video.category}
                        </span>
                        {isUpload && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[9px] font-mono font-bold">
                            Direct Upload
                          </span>
                        )}
                      </div>

                      {/* Duration Badge */}
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" /> {video.duration}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                      {video.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4 font-light">
                      {video.description}
                    </p>
                  </div>

                  {/* Meta Row */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Eye className="w-3.5 h-3.5 text-purple-400" /> {video.views}
                    </span>
                    <span className="text-purple-300 font-semibold flex items-center gap-1 text-xs">
                      {isUpload ? 'Play Video' : 'Watch on Player'} <Play className="w-3 h-3 fill-current ml-0.5" />
                    </span>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* YouTube Channel Subscribe Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
                <YoutubeIcon className="w-6 h-6 fill-red-500" />
              </div>
              <div>
                <h4 className="font-display text-base sm:text-lg font-bold text-white">
                  Official YouTube Channel
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Subscribe to receive alerts for new music videos, studio sessions, and live tours.
                </p>
              </div>
            </div>

            <a
              href={artistInfo.socials?.youtube || 'https://youtube.com'}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              <YoutubeIcon className="w-4 h-4 fill-white" />
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CURATED PHOTO EXHIBIT & SLIDESHOW                */}
      {/* ======================================================== */}
      {activeMediaTab === 'gallery' && (
        <div>
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
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Slide Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col md:flex-row md:items-end justify-between gap-3 text-left">
                    <div className="max-w-xl">
                      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-purple-400 block mb-0.5">
                        {currentImage.subtitle}
                      </span>
                      <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-extrabold text-white mb-1">
                        {currentImage.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-sans line-clamp-2 sm:line-clamp-none font-light">
                        {currentImage.caption}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <span className="text-[11px] sm:text-xs font-mono text-purple-300 px-2.5 py-1 rounded-full bg-black/60 border border-white/[0.1] backdrop-blur-md">
                        {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : '0 / 0'}
                      </span>

                      <button
                        onClick={handlePrevSlide}
                        className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/[0.15] flex items-center justify-center active:scale-90"
                        title="Previous"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleNextSlide}
                        className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/[0.15] flex items-center justify-center active:scale-90"
                        title="Next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Selector Strip */}
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
        </div>
      )}

      {/* ======================================================== */}
      {/* VIDEO MODAL PLAYER (YOUTUBE OR UPLOADED HTML5 VIDEO)     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeModalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-2xl"
            onClick={() => setActiveModalVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0c0d16] border border-white/[0.15] rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08]">
                <div className="text-left min-w-0 pr-4">
                  <h4 className="font-display font-bold text-white text-base sm:text-lg truncate">
                    {activeModalVideo.title}
                  </h4>
                  <span className="text-[11px] font-mono text-purple-400">
                    {activeModalVideo.category} • {activeModalVideo.duration} • {activeModalVideo.views}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Body */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                {activeModalVideo.type === 'upload' || isDirectVideo(activeModalVideo.videoUrl) ? (
                  /* Native HTML5 Video for uploaded files */
                  <video
                    controls
                    autoPlay
                    src={activeModalVideo.videoUrl}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* YouTube Iframe Player with resolved ID */
                  (() => {
                    const ytId = extractYouTubeId(
                      activeModalVideo.youtubeEmbedId ||
                      activeModalVideo.youtubeId ||
                      activeModalVideo.url ||
                      activeModalVideo.extractedId ||
                      'dQw4w9WgXcQ'
                    );

                    return (
                      <iframe
                        title={activeModalVideo.title}
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    );
                  })()
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 text-left">
                <p className="line-clamp-2 sm:line-clamp-1">{activeModalVideo.description}</p>
                {activeModalVideo.extractedId && (
                  <a
                    href={`https://youtube.com/watch?v=${activeModalVideo.extractedId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-300 hover:text-white flex items-center gap-1 shrink-0 font-mono"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* ADD VIDEO MODAL: PULL FROM YOUTUBE OR UPLOAD FILE        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showAddVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={closeAddModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#0e101a] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                    Video Integration
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">
                    Add Video to Showcase
                  </h3>
                </div>
                <button
                  onClick={closeAddModal}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Source Switcher */}
              <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAddMode('youtube');
                    setFormError('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    addMode === 'youtube'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Pull from YouTube Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAddMode('upload');
                    setFormError('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    addMode === 'upload'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Video File</span>
                </button>
              </div>

              {formError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleAddVideoSubmit} className="space-y-4">
                {addMode === 'youtube' ? (
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      YouTube URL or Video ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. https://www.youtube.com/watch?v=... or youtu.be/..."
                      value={videoInputUrl}
                      onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 font-mono"
                    />

                    {detectedYouTubeId && (
                      <div className="mt-2.5 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-3">
                        <img
                          src={getYouTubeThumbnail(detectedYouTubeId)}
                          alt="Thumbnail preview"
                          className="w-16 h-10 object-cover rounded-lg border border-white/[0.1]"
                        />
                        <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>YouTube ID Detected: {detectedYouTubeId}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Choose Video File (.mp4, .webm, .mov)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileSelect}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/[0.15] hover:border-purple-400/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]"
                    >
                      <FileVideo className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-white mb-1">
                        {uploadedVideoFile ? uploadedVideoFile.name : 'Click to select local video file'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {uploadedVideoFile ? `${(uploadedVideoFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Direct browser playback via HTML5 video'}
                      </p>
                    </div>

                    {uploadedVideoPreview && (
                      <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-black border border-white/[0.1]">
                        <video src={uploadedVideoPreview} controls className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                )}

                {/* Video Meta Fields */}
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Video Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNNOTICED — Andale (Official Music Video)"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Category</label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#141520] border border-white/[0.1] text-white text-xs focus:outline-none"
                    >
                      <option value="Music Video">Music Video</option>
                      <option value="Acoustic Session">Acoustic Session</option>
                      <option value="Visualizer">Visualizer</option>
                      <option value="Short Documentary">Short Documentary</option>
                      <option value="Tour Vlog">Tour Vlog</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Duration Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. 3:15"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the visual piece..."
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                  >
                    Add to Showcase
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* FULLSCREEN LIGHTBOX MODAL                                */}
      {/* ======================================================== */}
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
              <div className="text-left">
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
                  handlePrevSlide();
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
                  handleNextSlide();
                }}
                className="absolute right-1 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 text-white border border-white/[0.15] flex items-center justify-center active:scale-90 z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="text-center z-10 pb-2">
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto px-4 font-light">
                {currentImage.caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
