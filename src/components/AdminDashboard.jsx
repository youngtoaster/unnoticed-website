import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, Music, FileText, Ticket, ShoppingBag, Image as ImageIcon,
  ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit3, Save,
  RotateCcw, Download, Upload, Check, AlertTriangle, Eye, Shield, Sparkles, ExternalLink,
  Film, Video, Play, Link as LinkIcon, X, Calendar, Mail, Tag, DollarSign, Globe, Award,
  Zap, Palette, Type, RefreshCw, Crop, Sun, Moon, Info
} from 'lucide-react';
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import MediaUploadOrLink from './MediaUploadOrLink';
import { extractYouTubeId, getYouTubeThumbnail, isDirectVideo } from '../utils/videoHelper';
import { fetchMediaMetadata, formatViewsCount, detectProvider } from '../services/metadataService';
import NeonSign from './ui/NeonSign';

export default function AdminDashboard({ onReturnToSite }) {
  const {
    artistInfo, tracks, biography, videos, tourDates, pastTours,
    merchProducts, galleryImages, socialPosts, epkData,
    updateData, reorderCollection, logoutAdmin, resetToDefaults, exportBackup, importBackup
  } = useSiteData();

  const [activeTab, setActiveTab] = useState('tracks');
  const [toastMessage, setToastMessage] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // { type, isNew, data, index }
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [previewIlluminated, setPreviewIlluminated] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [metaFeedback, setMetaFeedback] = useState(null);
  const [quickLinkInput, setQuickLinkInput] = useState('');
  const [quickLinkResult, setQuickLinkResult] = useState(null);
  const [isQuickFetching, setIsQuickFetching] = useState(false);

  const neonConfig = artistInfo?.neonSign || {
    color: '#a855f7',
    font: 'font-display',
    size: 'text-[clamp(2.35rem,11.2vw,9.5rem)] sm:text-8xl md:text-9xl lg:text-[10rem]',
    fontWeight: 'font-black',
    flicker: true
  };

  const backdrop = artistInfo?.heroBackdrop || {
    enabled: true,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    blur: 6,
    blurEnabled: true,
    opacity: 45,
    zoom: 105,
    positionX: 50,
    positionY: 45,
    scope: "title",
    blendMode: "screen",
    vignette: true,
    illuminateOnGlow: true,
    glowIntensity: 85
  };

  const updateBackdrop = (partial) => {
    updateData({
      artistInfo: {
        ...artistInfo,
        heroBackdrop: {
          ...(artistInfo.heroBackdrop || backdrop),
          ...partial
        }
      }
    });
  };

  // Quick universal link metadata fetcher
  const handleQuickLinkExtract = async (urlToFetch) => {
    const targetUrl = urlToFetch || quickLinkInput;
    if (!targetUrl || !targetUrl.trim()) {
      showToast('Please enter a link to fetch metadata');
      return;
    }
    setIsQuickFetching(true);
    setQuickLinkResult(null);
    try {
      const res = await fetchMediaMetadata(targetUrl.trim());
      if (res && res.success) {
        setQuickLinkResult(res);
        showToast(`Pulled metadata: ${res.title}`);
      } else {
        showToast(res.error || 'Could not pull metadata from link');
      }
    } catch (e) {
      showToast('Error pulling metadata');
    } finally {
      setIsQuickFetching(false);
    }
  };

  const handleAutoFetchVideoInModal = async (url) => {
    if (!url || !url.trim()) return;
    setIsFetchingMeta(true);
    setMetaFeedback(null);
    try {
      const res = await fetchMediaMetadata(url.trim());
      if (res && res.success) {
        setEditingItem((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            title: res.title || prev.data.title,
            category: res.category || prev.data.category || 'Music Video',
            duration: res.duration || prev.data.duration,
            views: res.views || prev.data.views,
            description: res.description || prev.data.description,
            thumbnail: res.thumbnail || prev.data.thumbnail,
            youtubeEmbedId: res.embedId || res.videoId || prev.data.youtubeEmbedId
          }
        }));
        setMetaFeedback('✓ Video metadata pulled & auto-updated! All fields below are fully editable.');
        showToast('Auto-fetched video metadata');
      } else {
        setMetaFeedback(res.error || 'Could not fetch metadata from link');
      }
    } catch (err) {
      setMetaFeedback('Failed to pull link metadata');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleAutoFetchTrackInModal = async (url) => {
    if (!url || !url.trim()) return;
    setIsFetchingMeta(true);
    setMetaFeedback(null);
    try {
      const res = await fetchMediaMetadata(url.trim());
      if (res && res.success) {
        setEditingItem((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            title: res.title || prev.data.title,
            featuring: res.artist && res.artist !== 'UNNOTICED' ? `feat. ${res.artist}` : (prev.data.featuring || ''),
            duration: res.duration || prev.data.duration,
            cover: res.thumbnail || res.cover || prev.data.cover,
            spotifyUrl: res.spotifyUrl || prev.data.spotifyUrl || url,
            description: res.description || prev.data.description
          }
        }));
        setMetaFeedback('✓ Track metadata pulled & auto-updated! All fields below are fully editable.');
        showToast('Auto-fetched track metadata');
      } else {
        setMetaFeedback(res.error || 'Could not fetch metadata from link');
      }
    } catch (err) {
      setMetaFeedback('Failed to pull link metadata');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Reorganize helper
  const handleMove = (key, index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    reorderCollection(key, index, targetIndex);
    showToast(`Reorganized ${key}`);
  };

  const handleDelete = (key, index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      updateData((prev) => {
        const list = [...(prev[key] || [])];
        list.splice(index, 1);
        return { ...prev, [key]: list };
      });
      showToast('Item removed successfully');
    }
  };

  // Unified save handler for modals
  const handleSaveEditingItem = () => {
    if (!editingItem || !editingItem.data) return;
    const { type, isNew, data, index } = editingItem;

    if (type === 'track') {
      if (isNew) {
        updateData((prev) => ({ ...prev, tracks: [data, ...(prev.tracks || [])] }));
      } else {
        const list = [...tracks];
        list[index] = data;
        updateData({ tracks: list });
      }
      showToast(isNew ? 'Added new track' : 'Saved track changes');
    } else if (type === 'video') {
      if (data.type === 'upload' && !data.videoUrl) {
        alert('Please choose a video file or provide a video link.');
        return;
      }
      if (isNew) {
        updateData((prev) => ({ ...prev, videos: [data, ...(prev.videos || [])] }));
      } else {
        const list = [...videos];
        list[index] = data;
        updateData({ videos: list });
      }
      showToast(isNew ? 'Added video to showcase' : 'Saved video changes');
    } else if (type === 'tour') {
      if (isNew) {
        updateData((prev) => ({ ...prev, tourDates: [data, ...(prev.tourDates || [])] }));
      } else {
        const list = [...tourDates];
        list[index] = data;
        updateData({ tourDates: list });
      }
      showToast(isNew ? 'Added tour date' : 'Saved tour date');
    } else if (type === 'merch') {
      if (isNew) {
        updateData((prev) => ({ ...prev, merchProducts: [data, ...(prev.merchProducts || [])] }));
      } else {
        const list = [...merchProducts];
        list[index] = data;
        updateData({ merchProducts: list });
      }
      showToast(isNew ? 'Added merch product' : 'Saved product');
    } else if (type === 'gallery') {
      if (isNew) {
        updateData((prev) => ({ ...prev, galleryImages: [data, ...(prev.galleryImages || [])] }));
      } else {
        const list = [...galleryImages];
        list[index] = data;
        updateData({ galleryImages: list });
      }
      showToast(isNew ? 'Added gallery slide' : 'Saved slide');
    } else if (type === 'social') {
      if (isNew) {
        updateData((prev) => ({ ...prev, socialPosts: [data, ...(prev.socialPosts || [])] }));
      } else {
        const list = [...socialPosts];
        list[index] = data;
        updateData({ socialPosts: list });
      }
      showToast(isNew ? 'Added social post' : 'Saved post');
    }

    setEditingItem(null);
  };

  // Import JSON handler
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const ok = importBackup(content);
        if (ok) {
          showToast('Backup restored successfully!');
        } else {
          alert('Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'tracks', label: 'Music & Audio', icon: Music, count: tracks.length },
    { id: 'lyrics', label: 'Genius Lyrics', icon: FileText, count: tracks.length },
    { id: 'profile', label: 'Profile & Bio', icon: Sparkles, count: biography.length },
    { id: 'videos', label: 'Videos & Visuals', icon: Youtube, count: videos.length },
    { id: 'tour', label: 'Tour Schedule', icon: Ticket, count: tourDates.length },
    { id: 'merch', label: 'Merch Catalog', icon: ShoppingBag, count: merchProducts.length },
    { id: 'gallery', label: 'Gallery Slides', icon: ImageIcon, count: galleryImages.length },
    { id: 'social', label: 'Social Feed', icon: Instagram, count: socialPosts.length },
    { id: 'epk', label: 'EPK & Press', icon: Shield, count: null },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 pt-20 pb-32 px-4 sm:px-6 max-w-7xl mx-auto text-left safe-bottom">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-purple-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2 border border-purple-400"
          >
            <Check className="w-4 h-4" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-white/[0.1] gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              LIVE SYSTEM COMMAND CENTRE
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            UNNOTICED CMS // ADMIN
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time content management, upload local files or paste web links, and reorganize live site modules.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onReturnToSite}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={exportBackup}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 border border-white/[0.1] flex items-center gap-1.5 transition-colors active:scale-95"
            title="Download JSON backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 border border-white/[0.1] flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import JSON</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-red-950/40 text-xs font-semibold text-red-300 border border-red-500/20 flex items-center gap-1.5 transition-colors active:scale-95"
            title="Reset site to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* CMS Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-white/[0.06]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-purple-800 text-purple-200' : 'bg-white/[0.08] text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: TRACKS & DISCOGRAPHY ================= */}
      {activeTab === 'tracks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>Audio Tracks & Playlist Sequencer</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
                  {tracks.length} tracks
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage track order, upload audio clips, attach custom cover art, and update streaming URLs.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem({
                  type: 'track',
                  isNew: true,
                  data: {
                    id: `track-${Date.now()}`,
                    title: 'New Single',
                    featuring: '',
                    type: 'Single',
                    duration: '3:00',
                    releaseYear: '2026',
                    previewAudio: 'https://p.scdn.co/mp3-preview/07e6651dfa67afa6f3b9b820f7c2382ce546399a?cid=3bb56cf560444175950d63e79d4febc8',
                    cover: artistInfo.avatar,
                    spotifyUrl: artistInfo.socials?.spotify || 'https://open.spotify.com',
                    appleMusicUrl: artistInfo.socials?.appleMusic || 'https://music.apple.com',
                    deezerUrl: 'https://deezer.com',
                    description: 'Brand new track release by UNNOTICED.',
                    lyrics: [
                      { text: 'New lyric verse bar one...', annotated: false },
                      { text: 'Annotated punchline with meaning...', annotated: true, annotation: { author: 'UNNOTICED', badge: 'Verified Artist', content: 'Story behind the verse.' } }
                    ]
                  }
                });
                setMetaFeedback(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-600/20 w-fit cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Track</span>
            </button>
          </div>

          {/* Quick Track Auto-Pull from Link */}
          <SpotlightCard className="p-4 sm:p-5 border-purple-500/30 bg-purple-950/20" tilt={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Smart Track Metadata Auto-Fetcher
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Spotify • SoundCloud • Direct Audio
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Pulls Title, Artist, Cover Artwork & Duration
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Paste any Spotify track URL, SoundCloud link, or audio file..."
                value={quickLinkInput}
                onChange={(e) => setQuickLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQuickLinkExtract();
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.12] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="button"
                disabled={isQuickFetching}
                onClick={() => handleQuickLinkExtract()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isQuickFetching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-200" />
                    <span>Pulling Metadata...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Auto-Pull Details</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Preview Card if extracted */}
            {quickLinkResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3.5 p-3.5 rounded-xl bg-black/80 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  {(quickLinkResult.thumbnail || quickLinkResult.cover) && (
                    <img
                      src={quickLinkResult.thumbnail || quickLinkResult.cover}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-white/20 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-xs text-white truncate">{quickLinkResult.title}</h5>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 uppercase">
                        {quickLinkResult.provider}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {quickLinkResult.duration} • {quickLinkResult.artist || quickLinkResult.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem({
                        type: 'track',
                        isNew: true,
                        data: {
                          id: `track-${Date.now()}`,
                          title: quickLinkResult.title,
                          featuring: quickLinkResult.artist && quickLinkResult.artist !== 'UNNOTICED' ? `feat. ${quickLinkResult.artist}` : '',
                          type: 'Single',
                          duration: quickLinkResult.duration || '3:00',
                          releaseYear: new Date().getFullYear().toString(),
                          previewAudio: 'https://p.scdn.co/mp3-preview/07e6651dfa67afa6f3b9b820f7c2382ce546399a?cid=3bb56cf560444175950d63e79d4febc8',
                          cover: quickLinkResult.cover || quickLinkResult.thumbnail || artistInfo.avatar,
                          spotifyUrl: quickLinkResult.spotifyUrl || quickLinkInput,
                          appleMusicUrl: artistInfo.socials?.appleMusic || 'https://music.apple.com',
                          deezerUrl: 'https://deezer.com',
                          description: quickLinkResult.description || 'Studio recording mastered by UNNOTICED.',
                          lyrics: [
                            { text: 'New lyric verse bar one...', annotated: false },
                            { text: 'Annotated punchline with meaning...', annotated: true, annotation: { author: 'UNNOTICED', badge: 'Verified Artist', content: 'Story behind the verse.' } }
                          ]
                        }
                      });
                      setQuickLinkResult(null);
                      setQuickLinkInput('');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Import to Discography</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickLinkResult(null)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </SpotlightCard>

          <div className="space-y-3">
            {tracks.map((track, idx) => (
              <SpotlightCard key={track.id} className="p-4 sm:p-5" tilt={false}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Reorder Controls + Artwork + Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    
                    {/* Reorder Buttons (Up / Down) */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMove('tracks', idx, 'up')}
                        className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-purple-600 disabled:opacity-20 text-white flex items-center justify-center transition-colors active:scale-90"
                        title="Move Track Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === tracks.length - 1}
                        onClick={() => handleMove('tracks', idx, 'down')}
                        className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-purple-600 disabled:opacity-20 text-white flex items-center justify-center transition-colors active:scale-90"
                        title="Move Track Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Position Number */}
                    <span className="font-mono text-xs font-bold text-slate-500 w-5 text-center">
                      {idx + 1}
                    </span>

                    {/* Cover Art */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/[0.1] bg-black shrink-0">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Track Titles */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm sm:text-base truncate">
                          {track.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {track.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {track.featuring ? `feat. ${track.featuring}` : 'Solo'} • {track.duration} • {track.releaseYear}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => setEditingItem({ type: 'track', isNew: false, data: { ...track }, index: idx })}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center gap-1.5 active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit Track & Media</span>
                    </button>

                    <button
                      onClick={() => handleDelete('tracks', idx)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 active:scale-90"
                      title="Delete Track"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: GENIUS LYRICS & ANNOTATIONS ================= */}
      {activeTab === 'lyrics' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Genius-Style Lyrics & Verified Annotations
            </h2>
            <p className="text-xs text-slate-400">
              Select any song to edit verses, annotate clickable lines, author verified commentary, and set timestamps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Track Selector */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-2">Select Song:</span>
              {tracks.map((track, tIdx) => (
                <button
                  key={track.id}
                  onClick={() => setEditingItem({ type: 'lyrics', trackIndex: tIdx })}
                  className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    editingItem?.trackIndex === tIdx
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:bg-white/[0.08]'
                  }`}
                >
                  <img src={track.cover} alt={track.title} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs truncate">{track.title}</h5>
                    <p className="text-[10px] text-slate-400">{(track.lyrics || []).length} lyric lines</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Lyrics Editor */}
            <div className="lg:col-span-8">
              {editingItem?.type === 'lyrics' && tracks[editingItem.trackIndex] ? (
                (() => {
                  const currentTrack = tracks[editingItem.trackIndex];
                  const lyricsList = currentTrack.lyrics || [];

                  return (
                    <SpotlightCard className="p-6" tilt={false}>
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-amber-400">Song Lyrics Editor</span>
                          <h3 className="font-display text-xl font-bold text-white">{currentTrack.title}</h3>
                        </div>

                        <button
                          onClick={() => {
                            const newLyric = { text: 'New lyric bar...', annotated: false };
                            const updated = [...lyricsList, newLyric];
                            const newTracks = [...tracks];
                            newTracks[editingItem.trackIndex].lyrics = updated;
                            updateData({ tracks: newTracks });
                            showToast('Added lyric line');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Line</span>
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                        {lyricsList.map((line, lIdx) => (
                          <div key={lIdx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-slate-500">Bar #{lIdx + 1}</span>
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-xs text-purple-300 font-mono cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={line.annotated || false}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const newTracks = [...tracks];
                                      newTracks[editingItem.trackIndex].lyrics[lIdx].annotated = checked;
                                      if (checked && !newTracks[editingItem.trackIndex].lyrics[lIdx].annotation) {
                                        newTracks[editingItem.trackIndex].lyrics[lIdx].annotation = {
                                          author: 'UNNOTICED',
                                          badge: 'Verified Artist',
                                          content: 'Add your insight behind this lyric...'
                                        };
                                      }
                                      updateData({ tracks: newTracks });
                                    }}
                                    className="rounded accent-purple-600"
                                  />
                                  <span>Genius Annotated</span>
                                </label>
                                <button
                                  onClick={() => {
                                    const newTracks = [...tracks];
                                    newTracks[editingItem.trackIndex].lyrics.splice(lIdx, 1);
                                    updateData({ tracks: newTracks });
                                    showToast('Removed line');
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={line.text}
                              onChange={(e) => {
                                const newTracks = [...tracks];
                                newTracks[editingItem.trackIndex].lyrics[lIdx].text = e.target.value;
                                updateData({ tracks: newTracks });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                            />

                            {line.annotated && line.annotation && (
                              <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/20 space-y-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Author badge (e.g. Verified Artist)"
                                    value={line.annotation.badge || ''}
                                    onChange={(e) => {
                                      const newTracks = [...tracks];
                                      newTracks[editingItem.trackIndex].lyrics[lIdx].annotation.badge = e.target.value;
                                      updateData({ tracks: newTracks });
                                    }}
                                    className="px-2 py-1 rounded bg-black/50 border border-white/[0.1] text-[11px] text-purple-300 w-1/2 focus:outline-none"
                                  />
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Verified commentary explaining the bar..."
                                  value={line.annotation.content || ''}
                                  onChange={(e) => {
                                    const newTracks = [...tracks];
                                    newTracks[editingItem.trackIndex].lyrics[lIdx].annotation.content = e.target.value;
                                    updateData({ tracks: newTracks });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded bg-black/50 border border-white/[0.1] text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </SpotlightCard>
                  );
                })()
              ) : (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-slate-400 text-xs">
                  Select a song from the left to edit its full lyrics and Genius annotations.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PROFILE & BIOGRAPHY ================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Artist Profile & Multi-Chapter Biography
            </h2>
            <p className="text-xs text-slate-400">
              Update artist name, metrics, tags, location, avatar imagery, and narrative chapters.
            </p>
          </div>

          <SpotlightCard className="p-6 space-y-5" tilt={false}>
            <h3 className="font-display text-lg font-bold text-white pb-2 border-b border-white/[0.08]">
              Primary Metadata & Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Artist Name</label>
                <input
                  type="text"
                  value={artistInfo.name}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, name: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Previous Moniker (Ty Sciullo)</label>
                <input
                  type="text"
                  value={artistInfo.previousName || ''}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, previousName: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Hometown Location</label>
                <input
                  type="text"
                  value={artistInfo.location}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, location: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Status Mode Tag</label>
                <input
                  type="text"
                  value={artistInfo.statusTag || 'Recording Mode // Pittsburgh'}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, statusTag: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Monthly Listeners</label>
                <input
                  type="text"
                  value={artistInfo.stats?.monthlyListeners || ''}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, stats: { ...artistInfo.stats, monthlyListeners: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Total Lifetime Streams</label>
                <input
                  type="text"
                  value={artistInfo.stats?.totalStreams || ''}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, stats: { ...artistInfo.stats, totalStreams: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Media Upload or Link for Artist Avatar */}
            <div className="pt-2">
              <MediaUploadOrLink
                label="Artist Portrait / Avatar Image (Upload Local File or Paste Link)"
                type="image"
                value={artistInfo.avatar}
                onChange={(val) => {
                  updateData({ artistInfo: { ...artistInfo, avatar: val } });
                  showToast('Updated artist portrait');
                }}
                helperText="Appears on hero bento card, navigation badges, and author quotes."
              />
            </div>
          </SpotlightCard>

          {/* ================= PLANES NEON SIGN TITLE CONTROLS ================= */}
          <SpotlightCard className="p-6 space-y-6" tilt={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-fuchsia-400 uppercase font-bold">
                    PLANES UI // COMPONENT INTEGRATION
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <Zap className="w-5 h-5 text-fuchsia-400" />
                  <span>Homepage Neon Sign Title Customizer</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Configure the animated glass neon tubing on the homepage header for "{artistInfo.name || 'UNNOTICED'}".
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 text-[10px] font-mono font-bold w-fit">
                Planes Neon Tube Engine
              </span>
            </div>

            {/* LIVE PREVIEW OF NEON SIGN */}
            <div className="p-8 sm:p-12 rounded-2xl bg-black border border-white/[0.12] flex flex-col items-center justify-center text-center overflow-hidden relative group">
              <div className="absolute top-2.5 left-3.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-fuchsia-400" /> Live Neon Sign Preview
              </div>

              <div className="py-6 w-full flex justify-center">
                <NeonSign
                  key={`${neonConfig.color}-${neonConfig.font}-${neonConfig.size}-${neonConfig.fontWeight}-${neonConfig.flicker}`}
                  as="h2"
                  color={neonConfig.color || '#a855f7'}
                  delay={0.1}
                  flicker={neonConfig.flicker ?? true}
                  className={`${neonConfig.font || 'font-display'} ${neonConfig.fontWeight || 'font-black'} text-4xl sm:text-6xl md:text-7xl tracking-tighter uppercase leading-[0.95] text-center justify-center`}
                >
                  {artistInfo.name || 'UNNOTICED'}
                </NeonSign>
              </div>

              <span className="text-[10px] font-mono text-slate-500 mt-2">
                Gas Color: {neonConfig.color || '#a855f7'} • Font: {neonConfig.font || 'font-display'} • Weight: {neonConfig.fontWeight || 'font-black'}
              </span>
            </div>

            {/* CONTROLS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Color Preset & Picker */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Neon Gas Color & Ionization Bloom</span>
                </label>

                {/* Swatches */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Electric Violet', hex: '#a855f7' },
                    { name: 'Hot Magenta', hex: '#ff3ea5' },
                    { name: 'Cyan Laser', hex: '#06b6d4' },
                    { name: 'Acid Emerald', hex: '#10b981' },
                    { name: 'Amber Glow', hex: '#f59e0b' },
                    { name: 'Ice White', hex: '#ffffff' },
                    { name: 'Blood Crimson', hex: '#ef4444' },
                    { name: 'Neon Toxic', hex: '#eab308' }
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => {
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            neonSign: { ...neonConfig, color: preset.hex }
                          }
                        });
                        showToast(`Neon color set to ${preset.name}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all ${
                        (neonConfig.color || '#a855f7').toLowerCase() === preset.hex.toLowerCase()
                          ? 'border-white bg-white/10 text-white shadow-md'
                          : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: preset.hex, boxShadow: `0 0 6px ${preset.hex}` }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="color"
                    value={neonConfig.color || '#a855f7'}
                    onChange={(e) => {
                      updateData({
                        artistInfo: {
                          ...artistInfo,
                          neonSign: { ...neonConfig, color: e.target.value }
                        }
                      });
                    }}
                    className="w-10 h-9 rounded-xl bg-black border border-white/[0.15] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    placeholder="#a855f7"
                    value={neonConfig.color || '#a855f7'}
                    onChange={(e) => {
                      updateData({
                        artistInfo: {
                          ...artistInfo,
                          neonSign: { ...neonConfig, color: e.target.value }
                        }
                      });
                    }}
                    className="w-36 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">Custom hex</span>
                </div>
              </div>

              {/* Font Family, Weight & Size */}
              <div className="space-y-3">
                <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Typography, Tubing Weight & Scale</span>
                </label>

                {/* Font Family */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Font Family Style</span>
                  <select
                    value={neonConfig.font || 'font-display'}
                    onChange={(e) => {
                      updateData({
                        artistInfo: {
                          ...artistInfo,
                          neonSign: { ...neonConfig, font: e.target.value }
                        }
                      });
                      showToast('Updated neon font');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  >
                    <option value="font-display">Syne (Heavy Geometric Display)</option>
                    <option value="font-tech">Space Grotesk (Tech Cyber Headline)</option>
                    <option value="font-sans">Plus Jakarta Sans (Modern Ultra-Clean)</option>
                    <option value="font-mono">JetBrains Mono (Industrial Monospace)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Font Weight */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Tubing Weight</span>
                    <select
                      value={neonConfig.fontWeight || 'font-black'}
                      onChange={(e) => {
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            neonSign: { ...neonConfig, fontWeight: e.target.value }
                          }
                        });
                        showToast('Updated tubing weight');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="font-black">Black (900 Heavy Tubing)</option>
                      <option value="font-extrabold">ExtraBold (800 Thick Glass)</option>
                      <option value="font-bold">Bold (700 Classic Neon)</option>
                      <option value="font-semibold">SemiBold (600 Sleek Tubing)</option>
                    </select>
                  </div>

                  {/* Size Preset */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Sign Scale Preset</span>
                    <select
                      value={neonConfig.size || 'text-[clamp(2.35rem,11.2vw,9.5rem)] sm:text-8xl md:text-9xl lg:text-[10rem]'}
                      onChange={(e) => {
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            neonSign: { ...neonConfig, size: e.target.value }
                          }
                        });
                        showToast('Updated neon size');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="text-[clamp(2.35rem,11.2vw,9.5rem)] sm:text-8xl md:text-9xl lg:text-[10rem]">Monumental Hero (Mobile Fluid 10rem)</option>
                      <option value="text-[clamp(2.1rem,9.8vw,8.5rem)] sm:text-7xl md:text-8xl lg:text-9xl">Massive Stage (Mobile Fluid 9xl)</option>
                      <option value="text-[clamp(1.9rem,8.6vw,7.5rem)] sm:text-6xl md:text-7xl lg:text-8xl">Bold Large (Mobile Fluid 8xl)</option>
                      <option value="text-[clamp(1.7rem,7.5vw,6.5rem)] sm:text-5xl md:text-6xl lg:text-7xl">Compact Club (Mobile Fluid 7xl)</option>
                    </select>
                  </div>
                </div>

                {/* Flicker Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors">
                    <input
                      type="checkbox"
                      checked={neonConfig.flicker ?? true}
                      onChange={(e) => {
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            neonSign: { ...neonConfig, flicker: e.target.checked }
                          }
                        });
                        showToast(e.target.checked ? 'Tube flicker enabled' : 'Steady glow enabled');
                      }}
                      className="rounded accent-fuchsia-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Ambient Tube Brown-Out (Flicker)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Subtle intermittent brown-out on random letter tubes every few seconds for hyper-realistic glass tube behavior.
                      </span>
                    </div>
                  </label>
                </div>

              </div>

            </div>

            {/* ILLUMINATED CAPTION & ON TOUR BADGE EDIT BOXES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
              {/* Separate Edit Box for Caption below Artist Name */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-purple-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Illuminated Caption Below Artist Name</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">Lights up with neon</span>
                </div>
                <input
                  type="text"
                  placeholder="Once Known As Ty Sciullo • Now A Man Unseen"
                  value={artistInfo.heroSubtitle || ''}
                  onChange={(e) => {
                    updateData({
                      artistInfo: {
                        ...artistInfo,
                        heroSubtitle: e.target.value
                      }
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  Displays centered beneath the main neon title flanked by neon-ionized accent lines.
                </p>
              </div>

              {/* Edit Box & Toggle for On Tour Announcement Badge */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-mono font-bold text-white block">
                        Top "On Tour" Animated Fluid Button
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Eye-catching animated beacon button at the top of the hero
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer bg-white/[0.05] hover:bg-white/[0.08] px-3 py-1.5 rounded-xl border border-white/[0.1] transition-all">
                    <input
                      type="checkbox"
                      checked={artistInfo.tourBadge?.enabled !== false}
                      onChange={(e) => {
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            tourBadge: {
                              ...(artistInfo.tourBadge || {}),
                              enabled: e.target.checked
                            }
                          }
                        });
                        showToast(e.target.checked ? 'On Tour badge visible on home' : 'On Tour badge hidden from home');
                      }}
                      className="rounded accent-emerald-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-emerald-300">
                      {artistInfo.tourBadge?.enabled !== false ? 'Badge Visible' : 'Badge Hidden'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 uppercase">
                      Badge Text / Announcement
                    </label>
                    <input
                      type="text"
                      placeholder="ON TOUR NOW • 2026-2027 STAGE DATES • GET TICKETS"
                      value={artistInfo.tourBadge?.text || ''}
                      onChange={(e) => {
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            tourBadge: {
                              ...(artistInfo.tourBadge || {}),
                              text: e.target.value
                            }
                          }
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 uppercase">
                      Target Link / Anchor
                    </label>
                    <input
                      type="text"
                      placeholder="#tour"
                      value={artistInfo.tourBadge?.link || '#tour'}
                      onChange={(e) => {
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            tourBadge: {
                              ...(artistInfo.tourBadge || {}),
                              link: e.target.value
                            }
                          }
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Live Preview in Admin */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/30 p-3 rounded-xl border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-slate-400">
                    Live Button Appearance:
                  </span>
                  <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-950/80 via-[#0e0a1f]/90 to-purple-950/80 shadow-md">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                    <span className="px-1 py-0.2 rounded bg-emerald-500/25 text-[8px] font-mono font-bold text-emerald-300">
                      LIVE
                    </span>
                    <span className="text-[10px] font-mono font-bold text-purple-100">
                      {artistInfo.tourBadge?.text || "ON TOUR NOW • 2026-2027 STAGE DATES"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* ======================================================== */}
          {/* ARTIST TITLE & HERO BACKDROP ILLUMINATION STUDIO         */}
          {/* Live visualizer, crop, zoom, blur %, and glow reveal     */}
          {/* ======================================================== */}
          <SpotlightCard className="p-6 space-y-6" tilt={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="font-display text-lg font-bold text-white">
                    Artist Title & Hero Backdrop Illumination Studio
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Live Visualizer & Crop
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Place custom imagery behind the neon artist title. Configure crop zoom, focal alignment, blur percentage, and dynamic neon light reveal.
                </p>
              </div>

              {/* Master Enable/Disable Switch */}
              <label className="flex items-center gap-2 cursor-pointer bg-white/[0.04] px-3.5 py-1.5 rounded-xl border border-white/[0.08] self-start sm:self-auto hover:bg-white/[0.08] transition-colors">
                <input
                  type="checkbox"
                  checked={backdrop.enabled ?? true}
                  onChange={(e) => {
                    updateBackdrop({ enabled: e.target.checked });
                    showToast(e.target.checked ? 'Backdrop image enabled' : 'Backdrop image disabled');
                  }}
                  className="rounded accent-purple-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-white">
                  {backdrop.enabled ? 'Backdrop Active' : 'Backdrop Disabled'}
                </span>
              </label>
            </div>

            {/* INTERACTIVE LIVE VISUALIZER PREVIEW */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-purple-300 font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Real-Time Visualizer (Live Crop, Blur & Illumination)</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewIlluminated(true);
                    setTimeout(() => setPreviewIlluminated(false), 2600);
                  }}
                  className="px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-[11px] font-bold shadow-md hover:brightness-110 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  title="Test the neon glow light-up reveal effect"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>⚡ Test Glow Illumination Reveal</span>
                </button>
              </div>

              {/* Scaled Preview Frame */}
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/[0.14] bg-[#07080d] flex items-center justify-center shadow-2xl">
                {/* Ambient Room Darkness */}
                <div className="absolute inset-0 bg-radial from-purple-950/25 via-transparent to-black pointer-events-none" />

                {/* The Configured Backdrop Image in Preview */}
                {backdrop.enabled && backdrop.image ? (
                  <motion.div
                    animate={
                      previewIlluminated && (backdrop.illuminateOnGlow ?? true)
                        ? {
                            opacity: [(backdrop.opacity ?? 45) / 100, 0.95, (backdrop.opacity ?? 45) / 100],
                            filter: [
                              `brightness(0.3) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})`,
                              `brightness(1.45) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})`,
                              `brightness(1.05) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})`
                            ],
                            scale: [1, 1.02, 1]
                          }
                        : {
                            opacity: (backdrop.opacity ?? 45) / 100,
                            filter: `brightness(1) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})`,
                            scale: 1
                          }
                    }
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                    style={{
                      maskImage: backdrop.vignette
                        ? 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.5) 65%, transparent 95%)'
                        : 'none',
                      WebkitMaskImage: backdrop.vignette
                        ? 'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.5) 65%, transparent 95%)'
                        : 'none',
                    }}
                  >
                    <img
                      src={backdrop.image}
                      alt="Hero Backdrop Preview"
                      className="w-full h-full object-cover transition-all"
                      style={{
                        objectPosition: `${backdrop.positionX ?? 50}% ${backdrop.positionY ?? 45}%`,
                        transform: `scale(${(backdrop.zoom ?? 105) / 100})`,
                        mixBlendMode: backdrop.blendMode || 'screen',
                      }}
                    />

                    {/* Neon Light Wash when illuminated */}
                    {(previewIlluminated || (backdrop.illuminateOnGlow ?? true)) && (
                      <div
                        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                          previewIlluminated ? 'opacity-100' : 'opacity-40'
                        }`}
                        style={{
                          background: `radial-gradient(ellipse at center, ${neonConfig.color || '#a855f7'}45 0%, ${neonConfig.color || '#a855f7'}15 50%, transparent 80%)`,
                          mixBlendMode: 'color-dodge'
                        }}
                      />
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center text-slate-500 font-mono text-xs p-6">
                    No backdrop image selected. Upload a file or paste an image link below.
                  </div>
                )}

                {/* Overlaid Neon Title in Preview */}
                <div className="relative z-10 text-center select-none pointer-events-none px-4">
                  <h1
                    className="font-display font-black text-4xl sm:text-6xl tracking-tight uppercase"
                    style={{
                      color: '#ffffff',
                      textShadow: previewIlluminated
                        ? `0 0 8px #ffffff, 0 0 25px ${neonConfig.color || '#a855f7'}, 0 0 60px ${neonConfig.color || '#a855f7'}`
                        : `0 0 4px #ffffff, 0 0 15px ${neonConfig.color || '#a855f7'}`
                    }}
                  >
                    {artistInfo.name || 'UNNOTICED'}
                  </h1>
                  <p
                    className="text-[10px] font-mono tracking-widest uppercase mt-1 font-bold text-slate-200"
                    style={{
                      textShadow: `0 0 6px ${neonConfig.color || '#a855f7'}`
                    }}
                  >
                    {artistInfo.heroSubtitle || "Once Known As Ty Sciullo • Now A Man Unseen"}
                  </p>

                  {previewIlluminated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Neon Glow Illuminating & Revealing Background Image</span>
                    </motion.div>
                  )}
                </div>

                {/* Floating Status Pill in Preview */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  <span>Zoom: {backdrop.zoom ?? 105}%</span>
                  <span>•</span>
                  <span>Focal: {backdrop.positionX ?? 50}%x, {backdrop.positionY ?? 45}%y</span>
                  <span>•</span>
                  <span>Blur: {backdrop.blurEnabled ? `${backdrop.blur ?? 6}%` : 'Off'}</span>
                  <span>•</span>
                  <span>Reveal: {backdrop.illuminateOnGlow ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>

            {/* SETTINGS CONTROLS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              
              {/* Left Column: Image Source & Upload */}
              <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>1. Image Source & Upload</span>
                </h4>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Image URL or Local Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or paste link"
                      value={backdrop.image || ''}
                      onChange={(e) => updateBackdrop({ image: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                    <label className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              updateBackdrop({ image: ev.target.result });
                              showToast('Uploaded backdrop image');
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Framing Scope */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Framing Scope</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateBackdrop({ scope: 'title' })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        (backdrop.scope ?? 'title') === 'title'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                      }`}
                    >
                      Framed Behind Artist Title
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBackdrop({ scope: 'hero' })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        backdrop.scope === 'hero'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                      }`}
                    >
                      Full Hero Section
                    </button>
                  </div>
                </div>

                {/* Blend Mode & Vignette */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Blend Mode</label>
                    <select
                      value={backdrop.blendMode || 'screen'}
                      onChange={(e) => updateBackdrop({ blendMode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#12131f] border border-white/[0.1] text-xs text-white focus:outline-none"
                    >
                      <option value="screen">Screen (Luminous)</option>
                      <option value="overlay">Overlay (High Contrast)</option>
                      <option value="soft-light">Soft Light (Subtle)</option>
                      <option value="luminosity">Luminosity (Monochrome)</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Edge Vignette</label>
                    <label className="flex items-center gap-2 h-9 px-3 rounded-xl bg-black/40 border border-white/[0.1] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={backdrop.vignette ?? true}
                        onChange={(e) => updateBackdrop({ vignette: e.target.checked })}
                        className="rounded accent-purple-500 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-slate-200">Feathered Edges</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Illumination Reveal, Blur %, Crop & Opacity */}
              <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>2. Glow Illumination, Blur & Crop Settings</span>
                </h4>

                {/* Glow Illumination Reveal Toggle (Requested by User) */}
                <div className="p-3 rounded-xl bg-purple-950/25 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={backdrop.illuminateOnGlow ?? true}
                        onChange={(e) => updateBackdrop({ illuminateOnGlow: e.target.checked })}
                        className="rounded accent-purple-500 w-4 h-4"
                      />
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Illuminate Image on Neon Title Glow</span>
                      </span>
                    </label>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {backdrop.illuminateOnGlow ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-light leading-relaxed">
                    When turned on, the neon sign strikes on and casts physical neon bloom onto the background image, revealing it through the light!
                  </p>
                </div>

                {/* Blur Percentage Setting & On/Off Toggle (Requested by User) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={backdrop.blurEnabled ?? true}
                        onChange={(e) => updateBackdrop({ blurEnabled: e.target.checked })}
                        className="rounded accent-purple-500 w-3.5 h-3.5"
                      />
                      <span className="text-[11px] font-mono text-slate-300">
                        Blur Filter: <strong className="text-white">{backdrop.blurEnabled ? `${backdrop.blur ?? 6}%` : 'Disabled'}</strong>
                      </span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">0% (Sharp) - 100% (Abstract)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    disabled={!backdrop.blurEnabled}
                    value={backdrop.blur ?? 6}
                    onChange={(e) => updateBackdrop({ blur: parseInt(e.target.value, 10) })}
                    className="w-full accent-purple-500 cursor-pointer disabled:opacity-30"
                  />
                </div>

                {/* Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span>Backdrop Opacity: <strong className="text-white">{backdrop.opacity ?? 45}%</strong></span>
                    <span className="text-[10px] text-slate-500">0% (Invisible) - 100% (Solid)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={backdrop.opacity ?? 45}
                    onChange={(e) => updateBackdrop({ opacity: parseInt(e.target.value, 10) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Crop & Zoom Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                      <Crop className="w-3.5 h-3.5 text-purple-400" />
                      <span>Crop Zoom / Scale: <strong className="text-white">{backdrop.zoom ?? 105}%</strong></span>
                    </span>
                    <span className="text-[10px] text-slate-500">100% (Full) - 250% (Tight)</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="250"
                    step="5"
                    value={backdrop.zoom ?? 105}
                    onChange={(e) => updateBackdrop({ zoom: parseInt(e.target.value, 10) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Focal Position X & Y */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Focal Point X ({backdrop.positionX ?? 50}%)</span>
                    </div>
                    <div className="flex gap-1 mb-1">
                      {[
                        { label: 'Left', val: 15 },
                        { label: 'Center', val: 50 },
                        { label: 'Right', val: 85 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => updateBackdrop({ positionX: preset.val })}
                          className={`flex-1 py-1 text-[9px] font-mono rounded ${
                            (backdrop.positionX ?? 50) === preset.val
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/[0.04] text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={backdrop.positionX ?? 50}
                      onChange={(e) => updateBackdrop({ positionX: parseInt(e.target.value, 10) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Focal Point Y ({backdrop.positionY ?? 45}%)</span>
                    </div>
                    <div className="flex gap-1 mb-1">
                      {[
                        { label: 'Top', val: 15 },
                        { label: 'Center', val: 50 },
                        { label: 'Bottom', val: 85 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => updateBackdrop({ positionY: preset.val })}
                          className={`flex-1 py-1 text-[9px] font-mono rounded ${
                            (backdrop.positionY ?? 45) === preset.val
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/[0.04] text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={backdrop.positionY ?? 45}
                      onChange={(e) => updateBackdrop({ positionY: parseInt(e.target.value, 10) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

              </div>

            </div>
          </SpotlightCard>

          {/* Biography Paragraphs */}
          <SpotlightCard className="p-6 space-y-4" tilt={false}>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="font-display text-lg font-bold text-white">
                Multi-Paragraph Biography Chapters ({biography.length})
              </h3>
              <button
                onClick={() => {
                  const newChapter = {
                    title: `Chapter 0${biography.length + 1}: Next Horizon`,
                    text: 'New chapter narrative...'
                  };
                  updateData({ biography: [...biography, newChapter] });
                  showToast('Added chapter');
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Chapter</span>
              </button>
            </div>

            <div className="space-y-4">
              {biography.map((para, bIdx) => (
                <div key={bIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400">Chapter 0{bIdx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={bIdx === 0}
                        onClick={() => handleMove('biography', bIdx, 'up')}
                        className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        disabled={bIdx === biography.length - 1}
                        onClick={() => handleMove('biography', bIdx, 'down')}
                        className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete('biography', bIdx)}
                        className="p-1 rounded bg-red-500/10 text-red-400 ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={para.title}
                    onChange={(e) => {
                      const updated = [...biography];
                      updated[bIdx].title = e.target.value;
                      updateData({ biography: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-bold text-white focus:outline-none"
                  />

                  <textarea
                    rows={4}
                    value={para.text}
                    onChange={(e) => {
                      const updated = [...biography];
                      updated[bIdx].text = e.target.value;
                      updateData({ biography: updated });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-slate-300 focus:outline-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* ================= TAB 4: VIDEOS ================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>YouTube Videos & Visualizer Grid</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-mono border border-red-500/20">
                  {videos.length} visuals
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Add YouTube links or upload video files directly, edit metadata, and reorganize the showcase.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem({
                  type: 'video',
                  isNew: true,
                  data: {
                    id: `vid-${Date.now()}`,
                    title: '',
                    category: 'Music Video',
                    duration: '3:30',
                    views: 'New Release',
                    description: '',
                    type: 'youtube',
                    youtubeEmbedId: '',
                    videoUrl: '',
                    thumbnail: artistInfo?.avatar || ''
                  }
                });
                setMetaFeedback(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-600/20 w-fit cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video to Showcase</span>
            </button>
          </div>

          {/* Quick Link Metadata Auto-Fetcher Banner */}
          <SpotlightCard className="p-4 sm:p-5 border-purple-500/30 bg-purple-950/20" tilt={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Smart Link Metadata Auto-Fetcher
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  YouTube • Spotify • SoundCloud
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Auto-extracts Title, HD Thumbnail, Duration, Views & Metadata
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Paste any YouTube video, visualizer, Spotify, or SoundCloud link..."
                value={quickLinkInput}
                onChange={(e) => setQuickLinkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQuickLinkExtract();
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.12] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="button"
                disabled={isQuickFetching}
                onClick={() => handleQuickLinkExtract()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isQuickFetching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-200" />
                    <span>Pulling Metadata...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Auto-Pull Details</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Preview Card if extracted */}
            {quickLinkResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3.5 p-3.5 rounded-xl bg-black/80 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  {quickLinkResult.thumbnail && (
                    <img
                      src={quickLinkResult.thumbnail}
                      alt="Preview"
                      className="w-16 h-11 object-cover rounded-lg border border-white/20 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-xs text-white truncate">{quickLinkResult.title}</h5>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 uppercase">
                        {quickLinkResult.provider}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {quickLinkResult.duration} • {quickLinkResult.views || 'Verified'} • {quickLinkResult.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem({
                        type: 'video',
                        isNew: true,
                        data: {
                          id: `vid-${Date.now()}`,
                          title: quickLinkResult.title,
                          category: quickLinkResult.category || 'Music Video',
                          duration: quickLinkResult.duration || '3:30',
                          views: quickLinkResult.views || '340K views',
                          description: quickLinkResult.description || '',
                          type: 'youtube',
                          youtubeEmbedId: quickLinkResult.embedId || quickLinkResult.videoId || quickLinkInput,
                          videoUrl: quickLinkResult.videoUrl || '',
                          thumbnail: quickLinkResult.thumbnail || artistInfo?.avatar
                        }
                      });
                      setQuickLinkResult(null);
                      setQuickLinkInput('');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Import as Music Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickLinkResult(null)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </SpotlightCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((vid, idx) => {
              const isUpload = vid.type === 'upload' || isDirectVideo(vid.videoUrl);
              const ytId = extractYouTubeId(vid.youtubeEmbedId || vid.youtubeId || vid.url);

              return (
                <SpotlightCard key={vid.id || idx} className="p-4 sm:p-5" tilt={false}>
                  <div className="space-y-3">
                    {/* Top Row: Tag, Type & Reorder */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          isUpload ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {isUpload ? 'Uploaded File' : 'YouTube Embed'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {vid.category} • {vid.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove('videos', idx, 'up')}
                          className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-20 text-white transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === videos.length - 1}
                          onClick={() => handleMove('videos', idx, 'down')}
                          className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-20 text-white transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete('videos', idx)}
                          className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 ml-1 transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Media Preview Box */}
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black group">
                      {isUpload && vid.videoUrl ? (
                        <video
                          src={vid.videoUrl}
                          className="w-full h-full object-cover"
                          controls={false}
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={vid.thumbnail || (ytId ? getYouTubeThumbnail(ytId) : artistInfo?.avatar)}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <Play className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                        {vid.views || 'Visualizer'}
                      </div>
                    </div>

                    {/* Quick Fields */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Video Title</label>
                      <input
                        type="text"
                        value={vid.title}
                        onChange={(e) => {
                          const updated = [...videos];
                          updated[idx].title = e.target.value;
                          updateData({ videos: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Edit Video Link / File Button */}
                    <button
                      onClick={() => setEditingItem({ type: 'video', isNew: false, data: { ...vid }, index: idx })}
                      className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-purple-300 hover:text-white border border-white/[0.08] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit Source, Thumbnail & Details</span>
                    </button>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 5: TOUR DATES ================= */}
      {activeTab === 'tour' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>Tour Schedule & Stage Dates</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/20">
                  {tourDates.length} shows
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Add tour stops, modify venue names, adjust ticket availability statuses, and reorganize.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem({
                  type: 'tour',
                  isNew: true,
                  data: {
                    id: `tour-${Date.now()}`,
                    date: 'MAR 20, 2027',
                    city: 'Pittsburgh, PA',
                    venue: 'Stage AE',
                    status: 'On Sale',
                    ticketLink: 'https://ticketmaster.com',
                    vipAvailable: true
                  }
                });
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tour Date</span>
            </button>
          </div>

          <div className="space-y-3">
            {tourDates.map((tour, idx) => (
              <SpotlightCard key={tour.id} className="p-4" tilt={false}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button disabled={idx === 0} onClick={() => handleMove('tourDates', idx, 'up')} className="w-6 h-6 rounded bg-white/[0.05] disabled:opacity-20 text-white flex items-center justify-center">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button disabled={idx === tourDates.length - 1} onClick={() => handleMove('tourDates', idx, 'down')} className="w-6 h-6 rounded bg-white/[0.05] disabled:opacity-20 text-white flex items-center justify-center">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <span className="font-mono text-xs font-bold text-cyan-400">{tour.date}</span>
                      <h4 className="font-bold text-white text-sm">{tour.city} — {tour.venue}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Status: {tour.status} {tour.vipAvailable ? '• VIP Available' : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setEditingItem({ type: 'tour', isNew: false, data: { ...tour }, index: idx })}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs text-white flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3 text-cyan-400" />
                      <span>Edit</span>
                    </button>
                    <button onClick={() => handleDelete('tourDates', idx)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: MERCH CATALOG ================= */}
      {activeTab === 'merch' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>Merch Atelier & Store Catalog</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
                  {merchProducts.length} items
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Update merchandise pricing, product photography (upload or link), sizing arrays, and reorder.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem({
                  type: 'merch',
                  isNew: true,
                  data: {
                    id: `merch-${Date.now()}`,
                    name: 'New Tour Merchandise',
                    price: 45.0,
                    category: 'Apparel',
                    badge: 'New Arrival',
                    image: artistInfo.avatar,
                    sizes: ['S', 'M', 'L', 'XL'],
                    colors: ['Black'],
                    description: 'Premium heavyweight custom artist garment.',
                    externalLink: 'https://unnoticed.shop'
                  }
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {merchProducts.map((prod, idx) => (
              <SpotlightCard key={prod.id} className="p-4 flex flex-col justify-between" tilt={false}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-purple-400">{prod.category}</span>
                    <div className="flex items-center gap-1">
                      <button disabled={idx === 0} onClick={() => handleMove('merchProducts', idx, 'up')} className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button disabled={idx === merchProducts.length - 1} onClick={() => handleMove('merchProducts', idx, 'down')} className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete('merchProducts', idx)} className="p-1 rounded bg-red-500/10 text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-square rounded-xl overflow-hidden border border-white/[0.08] mb-3 bg-black">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>

                  <h4 className="font-bold text-sm text-white">{prod.name}</h4>
                  <p className="font-mono text-xs font-bold text-purple-300 mt-0.5">${Number(prod.price).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => setEditingItem({ type: 'merch', isNew: false, data: { ...prod }, index: idx })}
                  className="mt-3 w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Edit Product & Photos</span>
                </button>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 7: GALLERY SLIDES ================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>Gallery Slideshow Manager</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
                  {galleryImages.length} slides
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Reorder slide progression, edit captions, and upload or link high-resolution photos.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem({
                  type: 'gallery',
                  isNew: true,
                  data: {
                    url: artistInfo.avatar,
                    title: 'New Exhibition Still',
                    subtitle: 'Studio Archive',
                    caption: 'Behind the scenes visual artifact.'
                  }
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <SpotlightCard key={idx} className="p-4" tilt={false}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400">Slide #{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button disabled={idx === 0} onClick={() => handleMove('galleryImages', idx, 'up')} className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button disabled={idx === galleryImages.length - 1} onClick={() => handleMove('galleryImages', idx, 'down')} className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete('galleryImages', idx)} className="p-1 rounded bg-red-500/10 text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-xs truncate">{img.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{img.caption}</p>
                  </div>

                  <button
                    onClick={() => setEditingItem({ type: 'gallery', isNew: false, data: { ...img }, index: idx })}
                    className="w-full py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3 text-purple-400" />
                    <span>Edit Photo & Caption</span>
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 8: SOCIAL FEED ================= */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>Social Feed Stream</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-mono border border-pink-500/20">
                  {socialPosts.length} posts
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Update social post cards, upload media imagery, set likes/comments counts, and reorder.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem({
                  type: 'social',
                  isNew: true,
                  data: {
                    id: `post-${Date.now()}`,
                    platform: 'Instagram',
                    handle: '@unnoticedmusic',
                    date: 'Just now',
                    content: 'New studio updates dropping soon. Link in bio.',
                    likes: '5,000',
                    comments: '250',
                    image: artistInfo.avatar,
                    soundTrack: 'UNNOTICED • New Release',
                    link: artistInfo.socials?.instagram || 'https://instagram.com'
                  }
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-md shadow-pink-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Social Post</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialPosts.map((post, idx) => (
              <SpotlightCard key={post.id} className="p-4 flex flex-col justify-between" tilt={false}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-pink-400">{post.platform} • {post.date}</span>
                    <div className="flex items-center gap-1">
                      <button disabled={idx === 0} onClick={() => handleMove('socialPosts', idx, 'up')} className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button disabled={idx === socialPosts.length - 1} onClick={() => handleMove('socialPosts', idx, 'down')} className="p-1 rounded bg-white/[0.05] disabled:opacity-20 text-white">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete('socialPosts', idx)} className="p-1 rounded bg-red-500/10 text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-square rounded-xl overflow-hidden border border-white/[0.08] bg-black">
                    <img src={post.image} alt={post.handle} className="w-full h-full object-cover" />
                  </div>

                  <p className="text-xs text-white line-clamp-2">{post.content}</p>
                  <p className="text-[10px] font-mono text-slate-400">{post.likes} likes • {post.comments} comments</p>
                </div>

                <button
                  onClick={() => setEditingItem({ type: 'social', isNew: false, data: { ...post }, index: idx })}
                  className="mt-3 w-full py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3 text-pink-400" />
                  <span>Edit Post & Media</span>
                </button>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 9: EPK & PRESS KIT ================= */}
      {activeTab === 'epk' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Electronic Press Kit (EPK) Settings
            </h2>
            <p className="text-xs text-slate-400">
              Update industry booking emails, critical press quotes, and downloadable high-res media asset files.
            </p>
          </div>

          <SpotlightCard className="p-6 space-y-4" tilt={false}>
            <h3 className="font-display text-lg font-bold text-white pb-2 border-b border-white/[0.08]">
              Industry Contact Inquiries
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Management Email</label>
                <input
                  type="email"
                  value={epkData.industryContacts?.management || ''}
                  onChange={(e) => updateData({ epkData: { ...epkData, industryContacts: { ...epkData.industryContacts, management: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Booking Agency Email</label>
                <input
                  type="email"
                  value={epkData.industryContacts?.booking || ''}
                  onChange={(e) => updateData({ epkData: { ...epkData, industryContacts: { ...epkData.industryContacts, booking: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Press Inquiries Email</label>
                <input
                  type="email"
                  value={epkData.industryContacts?.pressInquiries || ''}
                  onChange={(e) => updateData({ epkData: { ...epkData, industryContacts: { ...epkData.industryContacts, pressInquiries: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Sync Licensing Email</label>
                <input
                  type="email"
                  value={epkData.industryContacts?.syncLicensing || ''}
                  onChange={(e) => updateData({ epkData: { ...epkData, industryContacts: { ...epkData.industryContacts, syncLicensing: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-white pt-4 pb-2 border-b border-white/[0.08]">
              Short Press Bio One-Sheet
            </h3>
            <textarea
              rows={4}
              value={epkData.shortBio || ''}
              onChange={(e) => updateData({ epkData: { ...epkData, shortBio: e.target.value } })}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none leading-relaxed"
            />
          </SpotlightCard>

          {/* Downloadable Press Assets */}
          <SpotlightCard className="p-6 space-y-4" tilt={false}>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="font-display text-lg font-bold text-white">
                Downloadable Media Assets Kit ({epkData.downloadableAssets?.length || 0})
              </h3>
              <button
                onClick={() => {
                  const newAsset = {
                    name: 'New Press Kit Asset',
                    size: '15.0 MB',
                    desc: 'High-resolution press asset file.',
                    url: ''
                  };
                  updateData({ epkData: { ...epkData, downloadableAssets: [newAsset, ...(epkData.downloadableAssets || [])] } });
                  showToast('Added asset entry');
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Asset</span>
              </button>
            </div>

            <div className="space-y-4">
              {(epkData.downloadableAssets || []).map((asset, aIdx) => (
                <div key={aIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400">Asset #{aIdx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = [...epkData.downloadableAssets];
                        updated.splice(aIdx, 1);
                        updateData({ epkData: { ...epkData, downloadableAssets: updated } });
                        showToast('Removed asset');
                      }}
                      className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Asset Name</label>
                      <input
                        type="text"
                        value={asset.name}
                        onChange={(e) => {
                          const updated = [...epkData.downloadableAssets];
                          updated[aIdx].name = e.target.value;
                          updateData({ epkData: { ...epkData, downloadableAssets: updated } });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Size Tag (e.g. 48.2 MB)</label>
                      <input
                        type="text"
                        value={asset.size}
                        onChange={(e) => {
                          const updated = [...epkData.downloadableAssets];
                          updated[aIdx].size = e.target.value;
                          updateData({ epkData: { ...epkData, downloadableAssets: updated } });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Description</label>
                    <input
                      type="text"
                      value={asset.desc}
                      onChange={(e) => {
                        const updated = [...epkData.downloadableAssets];
                        updated[aIdx].desc = e.target.value;
                        updateData({ epkData: { ...epkData, downloadableAssets: updated } });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none"
                    />
                  </div>

                  <MediaUploadOrLink
                    label="Attach Asset File (Upload Local File or Paste Cloud Storage Link)"
                    type="file"
                    value={asset.url || ''}
                    onChange={(val) => {
                      const updated = [...epkData.downloadableAssets];
                      updated[aIdx].url = val;
                      updateData({ epkData: { ...epkData, downloadableAssets: updated } });
                      showToast('Attached asset file');
                    }}
                  />
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* ======================================================== */}
      {/* UNIVERSAL MODALS (TRACK, VIDEO, TOUR, MERCH, GALLERY, SOCIAL) */}
      {/* ======================================================== */}
      <AnimatePresence>
        
        {/* MODAL 1: TRACK (EDIT / ADD) */}
        {editingItem?.type === 'track' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md safe-bottom"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  <span>{editingItem.isNew ? 'Add New Track' : `Edit: ${editingItem.data.title}`}</span>
                </h3>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Metadata Auto-Pull from Link */}
              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-purple-300 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto-Pull Track Metadata from Link (Spotify / SoundCloud / YouTube)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Auto-fills Title, Artist, Cover, Duration</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste Spotify track, SoundCloud, or YouTube link..."
                    value={editingItem.data.spotifyUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, spotifyUrl: e.target.value } })}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    disabled={isFetchingMeta}
                    onClick={() => handleAutoFetchTrackInModal(editingItem.data.spotifyUrl)}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isFetchingMeta ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
                    <span>Pull Details</span>
                  </button>
                </div>
                {metaFeedback && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 pt-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>{metaFeedback}</span>
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Track Title</label>
                  <input
                    type="text"
                    value={editingItem.data.title}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Featuring Artist (or leave blank)</label>
                  <input
                    type="text"
                    value={editingItem.data.featuring || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, featuring: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Release Type</label>
                  <select
                    value={editingItem.data.type || 'Single'}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="Single">Single</option>
                    <option value="EP Track">EP Track</option>
                    <option value="Album Track">Album Track</option>
                    <option value="Remix">Remix</option>
                    <option value="Acoustic">Acoustic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Duration (e.g. 2:54)</label>
                  <input
                    type="text"
                    value={editingItem.data.duration || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Release Year</label>
                  <input
                    type="text"
                    value={editingItem.data.releaseYear || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, releaseYear: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Cover Artwork Media Input */}
              <MediaUploadOrLink
                label="Cover Artwork Image (Upload Local File or Paste Link)"
                type="image"
                value={editingItem.data.cover}
                onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, cover: val } })}
              />

              {/* Preview Audio Media Input */}
              <MediaUploadOrLink
                label="Audio Stream / Preview Clip (Upload MP3/WAV or Paste Audio URL)"
                type="audio"
                value={editingItem.data.previewAudio}
                onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, previewAudio: val } })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Spotify URL</label>
                  <input
                    type="text"
                    value={editingItem.data.spotifyUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, spotifyUrl: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Apple Music URL</label>
                  <input
                    type="text"
                    value={editingItem.data.appleMusicUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, appleMusicUrl: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Cancel</button>
                <button
                  onClick={handleSaveEditingItem}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md active:scale-95"
                >
                  {editingItem.isNew ? 'Publish Track' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 2: VIDEO (EDIT / ADD) */}
        {editingItem?.type === 'video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md safe-bottom"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-400" />
                  <span>{editingItem.isNew ? 'Add Video to Showcase' : `Edit: ${editingItem.data.title || 'Untitled'}`}</span>
                </h3>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Source Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                <button
                  type="button"
                  onClick={() => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: 'youtube' } })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    editingItem.data.type !== 'upload' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube Embed / Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: 'upload' } })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    editingItem.data.type === 'upload' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Local Video File</span>
                </button>
              </div>

              {/* YouTube Input or Video Upload */}
              {editingItem.data.type !== 'upload' ? (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-slate-400">YouTube URL or Video Link</label>
                    <span className="text-[10px] font-mono text-purple-300">Auto-fetches title, duration, views & thumbnail</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                      value={editingItem.data.youtubeEmbedId || ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const extracted = extractYouTubeId(raw);
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            youtubeEmbedId: raw,
                            thumbnail: extracted ? getYouTubeThumbnail(extracted) : editingItem.data.thumbnail
                          }
                        });
                      }}
                      onBlur={(e) => {
                        if (e.target.value && (e.target.value.includes('http') || e.target.value.includes('youtu'))) {
                          handleAutoFetchVideoInModal(e.target.value);
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                    <button
                      type="button"
                      disabled={isFetchingMeta}
                      onClick={() => handleAutoFetchVideoInModal(editingItem.data.youtubeEmbedId)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isFetchingMeta ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-300" />}
                      <span>Auto-Fetch Details</span>
                    </button>
                  </div>

                  {metaFeedback && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{metaFeedback}</span>
                    </motion.p>
                  )}

                  {extractYouTubeId(editingItem.data.youtubeEmbedId || '') && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Resolved ID: {extractYouTubeId(editingItem.data.youtubeEmbedId)}
                    </span>
                  )}
                </div>
              ) : (
                <MediaUploadOrLink
                  label="Local Video File (MP4, WebM, MOV)"
                  type="video"
                  value={editingItem.data.videoUrl || ''}
                  onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, videoUrl: val, type: 'upload' } })}
                />
              )}

              {/* Metadata Fields (Fully Editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Video Title</label>
                  <input
                    type="text"
                    value={editingItem.data.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
                  <select
                    value={editingItem.data.category || 'Music Video'}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="Music Video">Music Video</option>
                    <option value="Visualizer">Visualizer</option>
                    <option value="Acoustic Studio">Acoustic Studio</option>
                    <option value="Live Performance">Live Performance</option>
                    <option value="BTS Documentary">BTS Documentary</option>
                    <option value="Studio Upload">Studio Upload</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Duration Tag</label>
                  <input
                    type="text"
                    value={editingItem.data.duration || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Views Display</label>
                  <input
                    type="text"
                    placeholder="e.g. 340K views"
                    value={editingItem.data.views || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, views: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Thumbnail Media Input */}
              <MediaUploadOrLink
                label="Poster Thumbnail Image (Upload File or Paste Link)"
                type="image"
                value={editingItem.data.thumbnail || ''}
                onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnail: val } })}
              />

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.data.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Cancel</button>
                <button
                  onClick={handleSaveEditingItem}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md active:scale-95"
                >
                  {editingItem.isNew ? 'Publish Video' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 3: TOUR DATE (EDIT / ADD) */}
        {editingItem?.type === 'tour' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md safe-bottom"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-cyan-400" />
                  <span>{editingItem.isNew ? 'Add Tour Date' : `Edit: ${editingItem.data.city}`}</span>
                </h3>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Date (e.g. MAR 20, 2027)</label>
                  <input
                    type="text"
                    value={editingItem.data.date}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">City & State</label>
                  <input
                    type="text"
                    value={editingItem.data.city}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, city: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Venue Name</label>
                  <input
                    type="text"
                    value={editingItem.data.venue}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, venue: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Ticket Status</label>
                  <select
                    value={editingItem.data.status}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, status: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="On Sale">On Sale</option>
                    <option value="Few Tickets Left">Few Tickets Left</option>
                    <option value="VIP Only">VIP Only</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Ticket Booking URL</label>
                  <input
                    type="text"
                    value={editingItem.data.ticketLink || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, ticketLink: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="vipTourAvailable"
                  checked={editingItem.data.vipAvailable || false}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, vipAvailable: e.target.checked } })}
                  className="rounded accent-cyan-500"
                />
                <label htmlFor="vipTourAvailable" className="text-xs text-slate-300 font-mono cursor-pointer">
                  VIP Meet & Greet Upgrade Package Available
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Cancel</button>
                <button
                  onClick={handleSaveEditingItem}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md active:scale-95"
                >
                  {editingItem.isNew ? 'Add Tour Date' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 4: MERCH (EDIT / ADD) */}
        {editingItem?.type === 'merch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md safe-bottom"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-400" />
                  <span>{editingItem.isNew ? 'Add Merch Item' : `Edit: ${editingItem.data.name}`}</span>
                </h3>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editingItem.data.name}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.data.price}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, price: parseFloat(e.target.value) || 0 } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
                  <select
                    value={editingItem.data.category || 'Apparel'}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Vinyl & Physical">Vinyl & Physical</option>
                    <option value="Limited Drop">Limited Drop</option>
                  </select>
                </div>
              </div>

              {/* Product Photography Media Input */}
              <MediaUploadOrLink
                label="Product Photography (Upload Local File or Paste Link)"
                type="image"
                value={editingItem.data.image}
                onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: val } })}
              />

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Available Sizes (Comma separated)</label>
                <input
                  type="text"
                  placeholder="S, M, L, XL, 2XL"
                  value={Array.isArray(editingItem.data.sizes) ? editingItem.data.sizes.join(', ') : editingItem.data.sizes || ''}
                  onChange={(e) => {
                    const sizesArr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setEditingItem({ ...editingItem, data: { ...editingItem.data, sizes: sizesArr } });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={editingItem.data.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Cancel</button>
                <button
                  onClick={handleSaveEditingItem}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md active:scale-95"
                >
                  {editingItem.isNew ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 5: GALLERY SLIDE (EDIT / ADD) */}
        {editingItem?.type === 'gallery' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md safe-bottom"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  <span>{editingItem.isNew ? 'Add Gallery Slide' : 'Edit Slide'}</span>
                </h3>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <MediaUploadOrLink
                label="Photograph (Upload Local File or Paste Link)"
                type="image"
                value={editingItem.data.url}
                onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, url: val } })}
              />

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Slide Title</label>
                <input
                  type="text"
                  value={editingItem.data.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Location / Subtitle</label>
                <input
                  type="text"
                  value={editingItem.data.subtitle || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, subtitle: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Caption / Story</label>
                <textarea
                  rows={2}
                  value={editingItem.data.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, caption: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Cancel</button>
                <button
                  onClick={handleSaveEditingItem}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md active:scale-95"
                >
                  {editingItem.isNew ? 'Add Slide' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL 6: SOCIAL POST (EDIT / ADD) */}
        {editingItem?.type === 'social' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md safe-bottom"
            onClick={() => setEditingItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <span>{editingItem.isNew ? 'Add Social Post' : 'Edit Post'}</span>
                </h3>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Platform</label>
                  <select
                    value={editingItem.data.platform || 'Instagram'}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, platform: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Handle</label>
                  <input
                    type="text"
                    value={editingItem.data.handle || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, handle: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <MediaUploadOrLink
                label="Post Media Image / Video Thumbnail (Upload File or Paste Link)"
                type="image"
                value={editingItem.data.image}
                onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: val } })}
              />

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Caption / Content</label>
                <textarea
                  rows={3}
                  value={editingItem.data.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Likes Count</label>
                  <input
                    type="text"
                    value={editingItem.data.likes || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, likes: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Comments Count</label>
                  <input
                    type="text"
                    value={editingItem.data.comments || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, comments: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">Cancel</button>
                <button
                  onClick={handleSaveEditingItem}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md active:scale-95"
                >
                  {editingItem.isNew ? 'Publish Post' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* CONFIRM RESET MODAL */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0e0f18] border border-red-500/30 rounded-3xl p-6 shadow-2xl text-left"
            >
              <div className="flex items-center gap-3 text-red-400 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h4 className="font-display text-xl font-bold text-white">Reset All Customizations?</h4>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                This will clear any local content edits and restore the original factory data for UNNOTICED. This action cannot be undone unless you export a JSON backup first.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-xs text-slate-400">Cancel</button>
                <button
                  onClick={() => {
                    resetToDefaults();
                    setShowResetConfirm(false);
                    showToast('Site reset to original defaults');
                  }}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
