import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, Music, FileText, Ticket, ShoppingBag, Image as ImageIcon,
  ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit3, Save,
  RotateCcw, Download, Upload, Check, AlertTriangle, Eye, Shield, Sparkles, ExternalLink,
  Film, Video, Play, Link as LinkIcon, X
} from 'lucide-react';
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import { extractYouTubeId, getYouTubeThumbnail, isDirectVideo } from '../utils/videoHelper';

export default function AdminDashboard({ onReturnToSite }) {
  const {
    artistInfo, tracks, biography, videos, tourDates, pastTours,
    merchProducts, galleryImages, socialPosts, epkData,
    updateData, reorderCollection, logoutAdmin, resetToDefaults, exportBackup, importBackup
  } = useSiteData();

  const [activeTab, setActiveTab] = useState('tracks');
  const [toastMessage, setToastMessage] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // { type, data, index }
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
        const list = [...prev[key]];
        list.splice(index, 1);
        return { ...prev, [key]: list };
      });
      showToast('Item removed successfully');
    }
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
    { id: 'videos', label: 'Videos', icon: Youtube, count: videos.length },
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
            Real-time content management, playlist sequencer, lyrics annotator & asset pipeline.
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Audio Tracks & Playlist Sequencer
              </h2>
              <p className="text-xs text-slate-400">
                Manage track order, 30s preview streams, cover artwork, and streaming platform links.
              </p>
            </div>

            <button
              onClick={() => {
                const newTrack = {
                  id: `track-${Date.now()}`,
                  title: 'New Single',
                  featuring: '',
                  type: 'Single',
                  duration: '3:00',
                  releaseYear: '2026',
                  previewAudio: 'https://p.scdn.co/mp3-preview/07e6651dfa67afa6f3b9b820f7c2382ce546399a?cid=3bb56cf560444175950d63e79d4febc8',
                  cover: artistInfo.avatar,
                  spotifyUrl: artistInfo.socials.spotify,
                  appleMusicUrl: artistInfo.socials.appleMusic,
                  deezerUrl: 'https://deezer.com',
                  description: 'Brand new track release by UNNOTICED.',
                  lyrics: [
                    { text: 'Sample lyric line one', annotated: false },
                    { text: 'Sample annotated bar', annotated: true, annotation: { author: 'UNNOTICED', badge: 'Verified Artist', content: 'Behind the music commentary.' } }
                  ]
                };
                updateData((prev) => ({ ...prev, tracks: [newTrack, ...prev.tracks] }));
                showToast('Added new track to library');
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
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
                        title="Move Track Up in Playlist"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === tracks.length - 1}
                        onClick={() => handleMove('tracks', idx, 'down')}
                        className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-purple-600 disabled:opacity-20 text-white flex items-center justify-center transition-colors active:scale-90"
                        title="Move Track Down in Playlist"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Position Number */}
                    <span className="font-mono text-xs font-bold text-slate-500 w-5 text-center">
                      {idx + 1}
                    </span>

                    {/* Cover Art */}
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover border border-white/[0.1] shrink-0"
                    />

                    {/* Track Titles */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm sm:text-base truncate">
                          {track.title}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                          {track.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {track.featuring || 'Solo'} • {track.duration} • {track.releaseYear}
                      </p>
                    </div>
                  </div>

                  {/* Right: Edit & Delete Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => setEditingItem({ type: 'track', data: { ...track }, index: idx })}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white flex items-center gap-1.5 active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit Fields</span>
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
              Select any song to edit verses, underline clickable bars, and author verified artist explanations.
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
                    <p className="text-[10px] text-slate-400">{track.lyrics.length} lyric lines</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Lyrics Editor */}
            <div className="lg:col-span-8">
              {editingItem?.type === 'lyrics' && tracks[editingItem.trackIndex] ? (
                (() => {
                  const currentTrack = tracks[editingItem.trackIndex];
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
                            const updated = [...currentTrack.lyrics, newLyric];
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
                        {currentTrack.lyrics.map((line, lIdx) => (
                          <div key={lIdx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-slate-500">Bar #{lIdx + 1}</span>
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-xs text-purple-300 font-mono cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={line.annotated}
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
                                  value={line.annotation.content}
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
              Update artist name, metrics, tags, location, and the 3 story chapters.
            </p>
          </div>

          <SpotlightCard className="p-6 space-y-4" tilt={false}>
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
                  value={artistInfo.previousName}
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
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Monthly Listeners Metric</label>
                <input
                  type="text"
                  value={artistInfo.stats.monthlyListeners}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, stats: { ...artistInfo.stats, monthlyListeners: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Total Lifetime Streams</label>
                <input
                  type="text"
                  value={artistInfo.stats.totalStreams}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, stats: { ...artistInfo.stats, totalStreams: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Artist Photo URL</label>
                <input
                  type="text"
                  value={artistInfo.avatar}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, avatar: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>
          </SpotlightCard>

          {/* Biography Paragraphs */}
          <SpotlightCard className="p-6 space-y-4" tilt={false}>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="font-display text-lg font-bold text-white">
                Multi-Paragraph Biography Chapters ({biography.length})
              </h3>
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
                    thumbnail: artistInfo?.avatar || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
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

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={vid.description}
                        onChange={(e) => {
                          const updated = [...videos];
                          updated[idx].description = e.target.value;
                          updateData({ videos: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Tour Schedule & Stage Dates
              </h2>
              <p className="text-xs text-slate-400">
                Add tour stops, modify venue names, adjust ticket availability statuses, and reorganize.
              </p>
            </div>

            <button
              onClick={() => {
                const newTour = {
                  id: `tour-${Date.now()}`,
                  date: 'MAR 20, 2027',
                  city: 'City Name, ST',
                  venue: 'Venue Stage',
                  status: 'Tickets Available',
                  ticketLink: 'https://ticketmaster.com',
                  vipAvailable: true
                };
                updateData((prev) => ({ ...prev, tourDates: [newTour, ...prev.tourDates] }));
                showToast('Added tour date');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95"
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
                      <p className="text-[10px] text-slate-400 font-mono">Status: {tour.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setEditingItem({ type: 'tour', data: { ...tour }, index: idx })}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-xs text-white"
                    >
                      Edit
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Merch Atelier & Store Catalog
              </h2>
              <p className="text-xs text-slate-400">
                Update merchandise pricing, product photography, sizing arrays, and reorder.
              </p>
            </div>

            <button
              onClick={() => {
                const newProduct = {
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
                };
                updateData((prev) => ({ ...prev, merchProducts: [newProduct, ...prev.merchProducts] }));
                showToast('Added product');
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95"
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

                  <div className="aspect-square rounded-xl overflow-hidden border border-white/[0.08] mb-3">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  </div>

                  <h4 className="font-bold text-sm text-white">{prod.name}</h4>
                  <p className="font-mono text-xs font-bold text-purple-300 mt-0.5">${prod.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => setEditingItem({ type: 'merch', data: { ...prod }, index: idx })}
                  className="mt-3 w-full py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white"
                >
                  Edit Product
                </button>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 7: GALLERY SLIDES ================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Gallery Slideshow Manager
              </h2>
              <p className="text-xs text-slate-400">
                Reorder slide progression, edit captions, and add high-resolution photos.
              </p>
            </div>

            <button
              onClick={() => {
                const newImg = {
                  url: artistInfo.avatar,
                  title: 'New Exhibition Still',
                  subtitle: 'Studio Archive',
                  caption: 'Behind the scenes visual artifact.'
                };
                updateData((prev) => ({ ...prev, galleryImages: [newImg, ...prev.galleryImages] }));
                showToast('Added photo');
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95"
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

                  <div className="aspect-video rounded-xl overflow-hidden border border-white/[0.08]">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  </div>

                  <input
                    type="text"
                    value={img.title}
                    onChange={(e) => {
                      const updated = [...galleryImages];
                      updated[idx].title = e.target.value;
                      updateData({ galleryImages: updated });
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-bold text-white focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={img.caption}
                    onChange={(e) => {
                      const updated = [...galleryImages];
                      updated[idx].caption = e.target.value;
                      updateData({ galleryImages: updated });
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 8: SOCIAL FEED ================= */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Social Feed Stream
              </h2>
              <p className="text-xs text-slate-400">
                Update Instagram / TikTok mock cards, metrics, and captions.
              </p>
            </div>

            <button
              onClick={() => {
                const newPost = {
                  id: `post-${Date.now()}`,
                  platform: 'Instagram',
                  handle: '@unnoticedmusic',
                  date: 'Just now',
                  content: 'New updates coming soon. Link in bio.',
                  likes: '5,000',
                  comments: '250',
                  image: artistInfo.avatar,
                  soundTrack: 'UNNOTICED • New Release',
                  link: artistInfo.socials.instagram
                };
                updateData((prev) => ({ ...prev, socialPosts: [newPost, ...prev.socialPosts] }));
                showToast('Added social post');
              }}
              className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Social Post</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialPosts.map((post, idx) => (
              <SpotlightCard key={post.id} className="p-4" tilt={false}>
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

                  <textarea
                    rows={3}
                    value={post.content}
                    onChange={(e) => {
                      const updated = [...socialPosts];
                      updated[idx].content = e.target.value;
                      updateData({ socialPosts: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>
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
              Update industry booking emails, critical press quotes, and technical stage rider specs.
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
                  value={epkData.industryContacts.management}
                  onChange={(e) => updateData({ epkData: { ...epkData, industryContacts: { ...epkData.industryContacts, management: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Booking Agency Email</label>
                <input
                  type="email"
                  value={epkData.industryContacts.booking}
                  onChange={(e) => updateData({ epkData: { ...epkData, industryContacts: { ...epkData.industryContacts, booking: e.target.value } } })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-white pt-4 pb-2 border-b border-white/[0.08]">
              Short Press Bio One-Sheet
            </h3>
            <textarea
              rows={4}
              value={epkData.shortBio}
              onChange={(e) => updateData({ epkData: { ...epkData, shortBio: e.target.value } })}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none leading-relaxed"
            />
          </SpotlightCard>
        </div>
      )}

      {/* MODAL: EDIT ITEM (Track, Tour, Merch) */}
      <AnimatePresence>
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
              className="relative w-full max-w-xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <h3 className="font-display text-xl font-bold text-white mb-4">Edit Track: {editingItem.data.title}</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Track Title</label>
                  <input
                    type="text"
                    value={editingItem.data.title}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Featuring Artist (or blank)</label>
                  <input
                    type="text"
                    value={editingItem.data.featuring || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, featuring: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Preview MP3 Audio URL</label>
                  <input
                    type="text"
                    value={editingItem.data.previewAudio}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, previewAudio: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Cover Artwork Image URL</label>
                  <input
                    type="text"
                    value={editingItem.data.cover}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, cover: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Spotify URL</label>
                  <input
                    type="text"
                    value={editingItem.data.spotifyUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, spotifyUrl: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400">Cancel</button>
                <button
                  onClick={() => {
                    const updated = [...tracks];
                    updated[editingItem.index] = editingItem.data;
                    updateData({ tracks: updated });
                    setEditingItem(null);
                    showToast('Saved track changes');
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL: EDIT / ADD VIDEO */}
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
              className="relative w-full max-w-2xl bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-purple-400" />
                    <span>{editingItem.isNew ? 'Add Video to Showcase' : `Edit: ${editingItem.data.title || 'Untitled Video'}`}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Embed from YouTube or upload local MP4 / WebM / MOV video files.
                  </p>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Source Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, type: 'youtube' }
                    });
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    editingItem.data.type !== 'upload'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube Embed / Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, type: 'upload' }
                    });
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    editingItem.data.type === 'upload'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Local Video File</span>
                </button>
              </div>

              {/* YouTube Configuration */}
              {editingItem.data.type !== 'upload' ? (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      YouTube URL or Video ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                      value={editingItem.data.youtubeEmbedId || ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const extracted = extractYouTubeId(raw);
                        const newThumb = extracted ? getYouTubeThumbnail(extracted) : editingItem.data.thumbnail;
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            youtubeEmbedId: raw,
                            thumbnail: (!editingItem.data.thumbnail || editingItem.data.thumbnail.includes('img.youtube.com') || editingItem.data.thumbnail === artistInfo?.avatar) && extracted
                              ? newThumb
                              : editingItem.data.thumbnail
                          }
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  {/* Detected ID indicator */}
                  {(() => {
                    const extracted = extractYouTubeId(editingItem.data.youtubeEmbedId || '');
                    return (
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1.5">
                          {extracted ? (
                            <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px]">
                              <Check className="w-3.5 h-3.5" /> Resolved ID: {extracted}
                            </span>
                          ) : (
                            <span className="text-amber-400/80 text-[11px] font-mono">
                              Paste any YouTube link or video ID
                            </span>
                          )}
                        </div>
                        {extracted && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem({
                                ...editingItem,
                                data: {
                                  ...editingItem.data,
                                  thumbnail: getYouTubeThumbnail(extracted)
                                }
                              });
                              showToast('Fetched YouTube HD thumbnail');
                            }}
                            className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-red-300"
                          >
                            Apply Official HD Thumbnail
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Direct Upload Configuration */
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Select Local Video File (MP4, WebM, QuickTime MOV)
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.15] hover:border-purple-500/50 rounded-2xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <Video className="w-8 h-8 text-purple-400 mb-2" />
                    <span className="text-xs font-semibold text-white">Click to Browse and Upload Video</span>
                    <span className="text-[10px] text-slate-400 mt-1">Plays instantly in the browser video player</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setEditingItem({
                            ...editingItem,
                            data: {
                              ...editingItem.data,
                              type: 'upload',
                              videoUrl: url,
                              title: editingItem.data.title || file.name.replace(/\.[^/.]+$/, ''),
                              category: editingItem.data.category || 'Studio Upload'
                            }
                          });
                          showToast(`Uploaded ${file.name}`);
                        }
                      }}
                    />
                  </label>

                  {editingItem.data.videoUrl && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono text-purple-400">Live Video Preview</span>
                      <video
                        src={editingItem.data.videoUrl}
                        controls
                        className="w-full h-44 rounded-xl bg-black object-contain border border-white/[0.1]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Common Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Video Title</label>
                  <input
                    type="text"
                    placeholder="e.g. UNNOTICED — Andale (Official Music Video)"
                    value={editingItem.data.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Category Badge</label>
                  <select
                    value={editingItem.data.category || 'Music Video'}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Music Video">Music Video</option>
                    <option value="Visualizer">Visualizer</option>
                    <option value="Acoustic Studio">Acoustic Studio</option>
                    <option value="Live Performance">Live Performance</option>
                    <option value="BTS Documentary">BTS Documentary</option>
                    <option value="Teaser">Teaser</option>
                    <option value="Studio Upload">Studio Upload</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Duration (e.g. 2:54)</label>
                  <input
                    type="text"
                    placeholder="3:20"
                    value={editingItem.data.duration || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Views / Metric Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. 214K views or Studio Cut"
                    value={editingItem.data.views || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, views: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Thumbnail Poster Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={editingItem.data.thumbnail || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnail: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                    {editingItem.data.thumbnail && (
                      <div className="w-12 h-9 rounded-lg overflow-hidden border border-white/[0.1] bg-black shrink-0">
                        <img src={editingItem.data.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the visual piece..."
                    value={editingItem.data.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingItem.data.type === 'upload' && !editingItem.data.videoUrl) {
                      alert('Please select a video file to upload.');
                      return;
                    }
                    if (editingItem.isNew) {
                      updateData((prev) => ({
                        ...prev,
                        videos: [editingItem.data, ...(prev.videos || [])]
                      }));
                      showToast('Added video to showcase');
                    } else {
                      const updated = [...videos];
                      updated[editingItem.index] = editingItem.data;
                      updateData({ videos: updated });
                      showToast('Saved video changes');
                    }
                    setEditingItem(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
                >
                  {editingItem.isNew ? 'Publish to Showcase' : 'Save Changes'}
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
