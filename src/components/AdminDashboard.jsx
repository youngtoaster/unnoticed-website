import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, Music, FileText, Ticket, ShoppingBag, Image as ImageIcon,
  ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit3, Save,
  RotateCcw, Download, Upload, Check, AlertTriangle, Eye, Shield, Sparkles, ExternalLink,
  Film, Video, Play, Link as LinkIcon, X, Calendar, Mail, Tag, DollarSign, Globe, Award
} from 'lucide-react';
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import MediaUploadOrLink from './MediaUploadOrLink';
import { extractYouTubeId, getYouTubeThumbnail, isDirectVideo } from '../utils/videoHelper';

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
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-600/20 w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Track</span>
            </button>
          </div>

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
                    youtubeEmbedId: 'dQw4w9WgXcQ',
                    videoUrl: '',
                    thumbnail: artistInfo?.avatar || ''
                  }
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-600/20 w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video to Showcase</span>
            </button>
          </div>

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
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">YouTube URL or Video ID</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or ID"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
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

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
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
