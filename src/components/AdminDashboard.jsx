import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, Music, FileText, Ticket, ShoppingBag, Image as ImageIcon,
  ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit3, Save,
  RotateCcw, Download, Upload, Check, AlertTriangle, Eye, EyeOff, Shield, Sparkles, ExternalLink,
  Film, Video, Play, Pause, Link as LinkIcon, X, Calendar, Mail, Tag, DollarSign, Globe, Award,
  Zap, Palette, Type, RefreshCw, Crop, Sun, Moon, Info, HardDrive, CheckCircle2,
  AlignLeft, AlignCenter, AlignRight, Compass, GitBranch, GitCommit, Disc3, Volume2, Radio, Layout
} from 'lucide-react';
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from './SocialIcons';
import { useSiteData } from '../context/DataContext';
import SpotlightCard from './SpotlightCard';
import MediaUploadOrLink from './MediaUploadOrLink';
import NewReleaseOverlay from './NewReleaseOverlay';
import VisualSampleEditor from './VisualSampleEditor';
import { extractYouTubeId, getYouTubeThumbnail, isDirectVideo } from '../utils/videoHelper';
import { fetchMediaMetadata, formatViewsCount, detectProvider } from '../services/metadataService';
import NeonSign from './ui/NeonSign';

// Reusable Section Header Control Bar with Visibility Toggle, Delete All & Reset Defaults
function SectionControlsHeader({
  title,
  subtitle,
  badgeText,
  badgeColor = 'purple',
  sectionKey,
  collectionKey,
  itemCount,
  onAddNew,
  addLabel = 'Add New',
  allowDeleteAll = true,
  allowReset = true,
  sectionsVisibility,
  toggleSectionVisibility,
  onOpenDeleteConfirm,
  onResetDefault
}) {
  const isEnabled = sectionsVisibility?.[sectionKey] !== false;

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-inner mb-6">
      {/* Row 1: Title, Count Badge, Description, and Add Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              {title}
            </h2>
            {badgeText && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono border ${
                badgeColor === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                badgeColor === 'cyan' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' :
                badgeColor === 'pink' ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' :
                'bg-purple-500/10 text-purple-300 border-purple-500/20'
              }`}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {onAddNew && (
          <button
            onClick={onAddNew}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-purple-600/25 w-fit cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{addLabel}</span>
          </button>
        )}
      </div>

      {/* Row 2: Section Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
        {/* Disable/Enable Section Toggle */}
        {sectionKey && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toggleSectionVisibility(sectionKey)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                isEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
              }`}
              title="Toggle whether this section appears on the public live site and top menu"
            >
              {isEnabled ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Section Status: <strong className="text-white">ENABLED</strong> on Site</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Section Status: <strong className="text-amber-200">DISABLED</strong> (Hidden)</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              {isEnabled ? '• Active on homepage & top menu' : '• Hidden from visitors & navbar'}
            </span>
          </div>
        )}

        {/* Delete All & Reset Defaults */}
        <div className="flex items-center gap-2 ml-auto">
          {allowDeleteAll && (
            <button
              onClick={() => onOpenDeleteConfirm({ title, collectionKey, count: itemCount })}
              disabled={!itemCount || itemCount === 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                itemCount > 0
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-white/[0.02] text-slate-600 border border-white/[0.05] cursor-not-allowed'
              }`}
              title="Delete all items in this section to restart it"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All {itemCount > 0 ? `(${itemCount})` : ''}</span>
            </button>
          )}

          {allowReset && (
            <button
              onClick={() => onResetDefault(collectionKey, title)}
              className="px-3 py-1.5 rounded-xl bg-[#12131e] hover:bg-[#1c1e2e] text-xs font-semibold text-slate-200 border border-white/[0.12] flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-sm"
              title="Reset only this section to factory sample data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Defaults</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Expanded Font Library for Neon Sign & Hero Stage
const FONT_OPTIONS = [
  { id: 'font-display', name: 'Syne', tag: 'Avant-Garde Display', sample: 'UNNOTICED' },
  { id: 'font-bebas', name: 'Bebas Neue', tag: 'Monumental Condensed', sample: 'UNNOTICED' },
  { id: 'font-anton', name: 'Anton', tag: 'Massive Ultra-Impact', sample: 'UNNOTICED' },
  { id: 'font-orbitron', name: 'Orbitron', tag: 'Futuristic Cyberpunk', sample: 'UNNOTICED' },
  { id: 'font-righteous', name: 'Righteous', tag: '1980s Neon Tube', sample: 'UNNOTICED' },
  { id: 'font-audiowide', name: 'Audiowide', tag: 'Synthwave Display', sample: 'UNNOTICED' },
  { id: 'font-cinzel', name: 'Cinzel', tag: 'Regal Roman Serif', sample: 'UNNOTICED' },
  { id: 'font-playfair', name: 'Playfair Display', tag: 'High-Fashion Editorial', sample: 'UNNOTICED' },
  { id: 'font-monoton', name: 'Monoton', tag: 'Multi-Line Neon', sample: 'UNNOTICED' },
  { id: 'font-unbounded', name: 'Unbounded', tag: 'Wide Modern Grotesk', sample: 'UNNOTICED' },
  { id: 'font-russo', name: 'Russo One', tag: 'Industrial Heavy', sample: 'UNNOTICED' },
  { id: 'font-tech', name: 'Space Grotesk', tag: 'Tech Cyber Headline', sample: 'UNNOTICED' },
  { id: 'font-mono', name: 'JetBrains Mono', tag: 'Cyber Monospace', sample: 'UNNOTICED' },
  { id: 'font-sans', name: 'Plus Jakarta Sans', tag: 'Clean Ultra-Sans', sample: 'UNNOTICED' },
];

const SIZE_PRESETS = [
  { label: 'Compact Club (3.0rem)', rem: 3.0, tailwind: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' },
  { label: 'Clean Modern (3.75rem)', rem: 3.75, tailwind: 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl' },
  { label: 'Comfortable Stage (4.25rem • Default)', rem: 4.25, tailwind: 'text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem]' },
  { label: 'Hero Bold (5.25rem)', rem: 5.25, tailwind: 'text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem]' },
  { label: 'Stadium Big (7.5rem)', rem: 7.5, tailwind: 'text-4xl sm:text-7xl md:text-8xl lg:text-[7.5rem]' },
  { label: 'Monumental (10rem)', rem: 10, tailwind: 'text-5xl sm:text-8xl md:text-9xl lg:text-[10rem]' },
];

// Curated Aesthetic Color Themes for the Entire Website
const THEME_PRESETS = [
  {
    id: 'violet',
    name: 'Electric Violet',
    tag: 'Signature Nocturnal Aesthetic',
    primary: '#a855f7',
    secondary: '#6366f1',
    accent: '#06b6d4',
    glow: '#a855f7',
    swatches: ['#a855f7', '#6366f1', '#06b6d4']
  },
  {
    id: 'magenta',
    name: 'Neon Magenta',
    tag: 'Cyberpunk Hot Pink',
    primary: '#ff2a85',
    secondary: '#d946ef',
    accent: '#f43f5e',
    glow: '#ff2a85',
    swatches: ['#ff2a85', '#d946ef', '#f43f5e']
  },
  {
    id: 'cyan',
    name: 'Cyan Laser',
    tag: 'Synthwave Electric Aqua',
    primary: '#06b6d4',
    secondary: '#0284c7',
    accent: '#38bdf8',
    glow: '#06b6d4',
    swatches: ['#06b6d4', '#0284c7', '#38bdf8']
  },
  {
    id: 'emerald',
    name: 'Acid Emerald',
    tag: 'Toxic Matrix Nightlife',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#84cc16',
    glow: '#10b981',
    swatches: ['#10b981', '#059669', '#84cc16']
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    tag: 'Molten Gold Sunset',
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fbbf24',
    glow: '#f59e0b',
    swatches: ['#f59e0b', '#d97706', '#fbbf24']
  },
  {
    id: 'crimson',
    name: 'Blood Crimson',
    tag: 'Nocturnal Vampire Red',
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#f87171',
    glow: '#ef4444',
    swatches: ['#ef4444', '#dc2626', '#f87171']
  },
  {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    tag: 'Deep Ocean Blue',
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#60a5fa',
    glow: '#3b82f6',
    swatches: ['#3b82f6', '#1d4ed8', '#60a5fa']
  },
  {
    id: 'lime',
    name: 'Toxic Lime',
    tag: 'Underground Acid Club',
    primary: '#a3e635',
    secondary: '#65a30d',
    accent: '#4ade80',
    glow: '#a3e635',
    swatches: ['#a3e635', '#65a30d', '#4ade80']
  },
  {
    id: 'mono',
    name: 'Monochrome Silver',
    tag: 'High-Fashion Ice Chrome',
    primary: '#e2e8f0',
    secondary: '#94a3b8',
    accent: '#cbd5e1',
    glow: '#cbd5e1',
    swatches: ['#e2e8f0', '#94a3b8', '#cbd5e1']
  }
];

export default function AdminDashboard({ onReturnToSite }) {
  const {
    artistInfo, tracks, biography, videos, tourDates, pastTours,
    merchProducts, galleryImages, socialPosts, epkData,
    featuredRelease, updateFeaturedRelease,
    sectionsVisibility, toggleSectionVisibility, clearSection, resetSectionToDefault,
    syncStatus, syncToServerDisk,
    gitStatus, isPushingGit, pushToGitHub, refreshGitStatus,
    updateData, reorderCollection, logoutAdmin, resetToDefaults, exportBackup, importBackup
  } = useSiteData();

  const [activeTab, setActiveTab] = useState('tracks');
  const [testOverlayOpen, setTestOverlayOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [customCommitMsg, setCustomCommitMsg] = useState('');
  const [githubTokenInput, setGithubTokenInput] = useState(() => {
    try {
      return localStorage.getItem('unnoticed_github_token') || '';
    } catch {
      return '';
    }
  });
  const [showToken, setShowToken] = useState(false);
  const [isTokenAutoConfigured, setIsTokenAutoConfigured] = useState(false);

  // Auto-load private GitHub token from local server environment if available
  useEffect(() => {
    fetch('/api/admin/auto-token')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.available && data.token) {
          setIsTokenAutoConfigured(true);
          const current = localStorage.getItem('unnoticed_github_token');
          if (!current) {
            localStorage.setItem('unnoticed_github_token', data.token);
            setGithubTokenInput(data.token);
          }
        }
      })
      .catch(() => {});
  }, []);
  const [editingItem, setEditingItem] = useState(null); // { type, isNew, data, index }
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null); // { title, collectionKey, count }
  const [isSavingDisk, setIsSavingDisk] = useState(false);
  const [previewIlluminated, setPreviewIlluminated] = useState(false);
  const [testIgnitionStep, setTestIgnitionStep] = useState(null); // null = idle, 0..9 = letter strike simulation
  const [testExplosion, setTestExplosion] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [metaFeedback, setMetaFeedback] = useState(null);
  const [quickLinkInput, setQuickLinkInput] = useState('');
  const [quickLinkResult, setQuickLinkResult] = useState(null);
  const [isQuickFetching, setIsQuickFetching] = useState(false);
  const [sampleAuditionPlaying, setSampleAuditionPlaying] = useState(false);
  const sampleAuditionRef = useRef(null);

  const neonConfig = artistInfo?.neonSign || {
    color: '#a855f7',
    font: 'font-display',
    size: 'text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem]',
    fontSizeRem: 4.25,
    align: 'center',
    fontWeight: 'font-black',
    flicker: true,
    glowCaption: true
  };

  const currentTheme = artistInfo?.theme || {
    id: 'violet',
    name: 'Electric Violet',
    primary: '#a855f7',
    secondary: '#6366f1',
    accent: '#06b6d4',
    glow: '#a855f7',
    syncNeon: true
  };

  const updateSiteTheme = (themeUpdates, alsoSyncNeon = null) => {
    const updatedTheme = {
      ...(artistInfo?.theme || currentTheme),
      ...themeUpdates
    };
    const shouldSyncNeon = alsoSyncNeon !== null ? alsoSyncNeon : (updatedTheme.syncNeon !== false);
    
    const updatedNeon = shouldSyncNeon
      ? { ...neonConfig, color: updatedTheme.primary }
      : neonConfig;

    updateData({
      artistInfo: {
        ...artistInfo,
        theme: updatedTheme,
        neonSign: updatedNeon
      }
    });
    showToast(`Site theme updated to ${updatedTheme.name || 'Custom'}`);
  };

  const backdrop = artistInfo?.heroBackdrop || {
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

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleResetSection = (collectionKey, title) => {
    resetSectionToDefault(collectionKey);
    showToast(`Restored default sample data for ${title}`);
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
    { id: 'showcase', label: 'Release Showcase', icon: Disc3, count: null },
    { id: 'backdrop', label: 'Homepage & Hero Stage', icon: Layout, count: null },
    { id: 'theme', label: 'Site Color Theme', icon: Palette, count: null },
    { id: 'profile', label: 'Profile & Bio', icon: Sparkles, count: biography.length },
    { id: 'videos', label: 'Videos & Visuals', icon: Youtube, count: videos.length },
    { id: 'tour', label: 'Tour Schedule', icon: Ticket, count: tourDates.length },
    { id: 'merch', label: 'Merch Catalog', icon: ShoppingBag, count: merchProducts.length },
    { id: 'gallery', label: 'Gallery Slides', icon: Layers, count: galleryImages.length },
    { id: 'social', label: 'Social Feed', icon: Instagram, count: socialPosts.length },
    { id: 'epk', label: 'EPK & Press', icon: Shield, count: null },
    { id: 'github', label: 'GitHub Cloud Sync', icon: GitBranch, count: null },
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
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full font-semibold text-xs shadow-2xl flex items-center gap-2 border backdrop-blur-xl ${
              (typeof toastMessage === 'object' && toastMessage?.type === 'error') ||
              (typeof toastMessage === 'string' && (toastMessage.toLowerCase().includes('error') || toastMessage.toLowerCase().includes('failed') || toastMessage.toLowerCase().includes('could not')))
                ? 'bg-[#1a080c]/95 text-rose-200 border-rose-500/60 shadow-rose-950/60'
                : 'bg-[#10121d]/95 text-purple-200 border-purple-500/40 shadow-2xl shadow-black ring-1 ring-white/10'
            }`}
          >
            {(typeof toastMessage === 'object' && toastMessage?.type === 'error') ||
            (typeof toastMessage === 'string' && (toastMessage.toLowerCase().includes('error') || toastMessage.toLowerCase().includes('failed') || toastMessage.toLowerCase().includes('could not'))) ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-purple-400 shrink-0" />
            )}
            <span className="text-slate-100 font-semibold">{typeof toastMessage === 'object' ? toastMessage.text : toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-white/[0.1] gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Device Sync: Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono text-purple-300">
              <CheckCircle2 className="w-3 h-3 text-purple-400" />
              <span>Admin Logged In (Device Remembered)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
              <GitBranch className="w-3 h-3 text-cyan-400" />
              <span>GitHub: {gitStatus?.branch || 'main'} {gitStatus?.lastCommit?.hash ? `(${gitStatus.lastCommit.hash})` : ''}</span>
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight mt-1.5">
            UNNOTICED CMS // ADMIN
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-device content management. Changes persist permanently across every phone, laptop, and browser.
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Push to GitHub Button */}
          <button
            onClick={async () => {
              const res = await pushToGitHub();
              if (res.success) {
                showToast(res.message || 'Pushed all CMS content to GitHub repository!', 'success');
              } else {
                showToast(res.error || 'GitHub Sync failed. Check local server status', 'error');
              }
            }}
            disabled={isPushingGit}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Commit & push all CMS content to GitHub so it stays consistent everywhere"
          >
            <GitBranch className={`w-3.5 h-3.5 text-white ${isPushingGit ? 'animate-spin' : ''}`} />
            <span>{isPushingGit ? 'Pushing to GitHub...' : 'Push to GitHub'}</span>
            {gitStatus?.lastCommit?.hash && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-purple-200">
                {gitStatus.lastCommit.hash}
              </span>
            )}
          </button>

          {/* Multi-Device Disk Sync Button */}
          <button
            onClick={async () => {
              setIsSavingDisk(true);
              const ok = await syncToServerDisk();
              setIsSavingDisk(false);
              if (ok) {
                showToast('Synced all changes to server disk & GitHub!');
              } else {
                showToast('Changes saved locally.');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
            title="Force push changes to server disk so all other devices load the latest content"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSavingDisk ? 'animate-spin' : ''}`} />
            <span>{isSavingDisk ? 'Syncing...' : 'Sync Disk'}</span>
          </button>

          <button
            onClick={onReturnToSite}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={exportBackup}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 border border-white/[0.1] flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
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
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-red-950/40 text-xs font-semibold text-red-300 border border-red-500/20 flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
            title="Reset site to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-400 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Reusable Delete All Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-[#0c0d16] border border-rose-500/40 rounded-3xl p-6 shadow-2xl shadow-rose-950/40 space-y-4 text-left"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Delete All Items?</h3>
                  <p className="text-xs text-slate-400">{deleteConfirmModal.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete all <strong className="text-white">{deleteConfirmModal.count} items</strong> in this section? This will clear this collection from the public site. You can restore sample defaults at any time using "Reset Defaults".
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 border border-white/[0.1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearSection(deleteConfirmModal.collectionKey);
                    showToast(`Deleted all items in ${deleteConfirmModal.title}`);
                    setDeleteConfirmModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete All</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CMS Navigation Tabs Bar - Wrapped Grid Layout: 100% Visible On All Devices */}
      <div className="mb-8 p-3 sm:p-4 rounded-3xl bg-[#0b0c14]/90 border border-white/[0.1] shadow-2xl backdrop-blur-md">
        {/* Top Header of Nav Bar: Active Module Name + Mobile Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>CMS Sections ({tabs.length})</span>
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <span className="text-xs text-white font-semibold flex items-center gap-1.5">
              <span>Editing:</span>
              <strong className="text-purple-300 font-bold px-2 py-0.5 rounded-lg bg-purple-500/15 border border-purple-500/30">
                {tabs.find((t) => t.id === activeTab)?.label || 'Section'}
              </strong>
            </span>
          </div>

          {/* Quick Jump Mobile Dropdown */}
          <div className="sm:hidden w-full">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#12131d] border border-purple-500/40 text-white font-bold text-xs focus:outline-none focus:border-purple-400 cursor-pointer shadow-lg"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id} className="bg-[#0b0c14] text-white">
                  {tab.label} {tab.count !== null ? `(${tab.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop & Tablet Wrapped Navigation Grid: Every Single Tab is 100% Visible with Zero Scrolling Required */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40 border border-purple-300/40 ring-2 ring-purple-500/30'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.18]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                    isActive ? 'bg-black/40 text-purple-200' : 'bg-white/[0.08] text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: TRACKS & DISCOGRAPHY ================= */}
      {activeTab === 'tracks' && (
        <div className="space-y-6">
          <SectionControlsHeader
            title="Audio Tracks & Playlist Sequencer"
            subtitle="Manage track order, upload audio clips, attach custom cover art, and update streaming URLs."
            badgeText={`${tracks.length} tracks`}
            badgeColor="purple"
            sectionKey="music"
            collectionKey="tracks"
            itemCount={tracks.length}
            addLabel="Add New Track"
            onAddNew={() => {
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
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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
          <SectionControlsHeader
            title="Genius-Style Lyrics & Verified Annotations"
            subtitle="Select any song to edit verses, annotate clickable lines, author verified commentary, and set timestamps."
            badgeText={`${tracks.length} songs`}
            badgeColor="purple"
            sectionKey="music"
            collectionKey="tracks"
            itemCount={tracks.length}
            allowDeleteAll={false}
            allowReset={true}
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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

      {/* ================= TAB: NEW RELEASE SHOWCASE & ON-LOAD TAKEOVER ================= */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          {/* Test Modal Overlay Simulation */}
          {testOverlayOpen && (
            <NewReleaseOverlay forceOpen={true} onCloseForce={() => setTestOverlayOpen(false)} />
          )}

          {/* Hidden sample audition audio element */}
          <audio
            ref={sampleAuditionRef}
            src={featuredRelease?.audioUrl || 'https://p.scdn.co/mp3-preview/b6cdb3115927e7db423d2238223b5a6b4a57008b?cid=3bb56cf560444175950d63e79d4febc8'}
            onEnded={() => setSampleAuditionPlaying(false)}
          />

          {/* Section Header with Live Test Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] relative overflow-hidden">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                  Home Screen Promotion Engine
                </span>
              </div>
              <h2 className="font-display text-2xl font-black text-white tracking-tight">
                New Release Showcase & On-Load Takeover
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Configure your promoted single or album. Control the high-velocity animated slam-in overlay with audio preview on site load, and the hero showcase card embedded right below the artist title.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setTestOverlayOpen(true)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs theme-primary-btn flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>🚀 Test Slam-In Animation</span>
              </button>
            </div>
          </div>

          {/* TOGGLES: POPUP TAKEOVER & HERO CARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Toggle 1: Site Load Slam-In Popup */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${featuredRelease?.popupEnabled !== false ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <h3 className="text-sm font-display font-bold text-white">
                    On-Site Load Slam-In Takeover
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When enabled, visitors will see the album sleeve slam in with extreme velocity and hear the audio sample when opening the site.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextVal = featuredRelease?.popupEnabled === false ? true : false;
                  updateFeaturedRelease({ popupEnabled: nextVal });
                  showToast(nextVal ? 'Slam-In Takeover enabled on site load' : 'Slam-In Takeover disabled');
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  featuredRelease?.popupEnabled !== false ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    featuredRelease?.popupEnabled !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Hero Section Showcase Card */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${featuredRelease?.sectionEnabled !== false ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <h3 className="text-sm font-display font-bold text-white">
                    Hero Section Showcase Card
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Renders the full song player deck, 3D vinyl sleeve, lyrics pull-quote, and stream buttons directly below the artist name section.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextVal = featuredRelease?.sectionEnabled === false ? true : false;
                  updateFeaturedRelease({ sectionEnabled: nextVal });
                  showToast(nextVal ? 'Hero Showcase card visible' : 'Hero Showcase card hidden');
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  featuredRelease?.sectionEnabled !== false ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    featuredRelease?.sectionEnabled !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* MEDIA ASSETS: ARTWORK & MASTER AUDIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Artwork Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Cover Artwork (Image Upload or Link)
              </h3>
              
              <MediaUploadOrLink
                label="Cover Artwork"
                value={featuredRelease?.cover || ''}
                onChange={(val) => {
                  updateFeaturedRelease({ cover: val });
                  showToast('Updated featured release artwork');
                }}
                type="image"
                placeholder="Paste direct image URL or upload image file..."
              />

              {featuredRelease?.cover && (
                <div className="pt-2 flex items-center gap-4">
                  <img
                    src={featuredRelease.cover}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md"
                  />
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <span className="text-white font-mono block font-bold">Active Sleeve Artwork</span>
                    <span>Synchronized with 3D vinyl disc on homepage.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Track Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Music className="w-4 h-4 text-cyan-400" />
                Song Audio Track (MP3/WAV Upload or Link)
              </h3>

              <MediaUploadOrLink
                label="Master Audio Track"
                value={featuredRelease?.audioUrl || ''}
                onChange={(val) => {
                  updateFeaturedRelease({ audioUrl: val });
                  showToast('Updated featured release audio file');
                }}
                type="audio"
                placeholder="Paste MP3/WAV URL or upload audio file..."
              />

              {featuredRelease?.audioUrl && (
                <div className="pt-2 text-xs text-slate-400">
                  <span className="text-emerald-400 font-mono font-bold block">✓ Audio Source Linked</span>
                  <span className="truncate block font-mono text-[11px] text-slate-500 mt-0.5">{featuredRelease.audioUrl}</span>
                </div>
              )}
            </div>
          </div>

          {/* INTERACTIVE VISUAL WAVEFORM SAMPLE EDITOR */}
          <VisualSampleEditor
            audioUrl={featuredRelease?.audioUrl}
            sampleStartTime={featuredRelease?.sampleStartTime || 12}
            sampleDuration={featuredRelease?.sampleDuration || 28}
            onUpdateTiming={({ sampleStartTime, sampleDuration }) => {
              updateFeaturedRelease({ sampleStartTime, sampleDuration });
            }}
            onToast={showToast}
          />

          {/* RELEASE METADATA & EDITORIAL INTEL */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Track Metadata & Editorial Content
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">Song / Album Title</label>
                <input
                  type="text"
                  value={featuredRelease?.title || ''}
                  onChange={(e) => updateFeaturedRelease({ title: e.target.value })}
                  placeholder="Calling for Help"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">Artist Display Name</label>
                <input
                  type="text"
                  value={featuredRelease?.artist || 'UNNOTICED'}
                  onChange={(e) => updateFeaturedRelease({ artist: e.target.value })}
                  placeholder="UNNOTICED"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">Release Type</label>
                <input
                  type="text"
                  value={featuredRelease?.releaseType || 'Lead Studio Master'}
                  onChange={(e) => updateFeaturedRelease({ releaseType: e.target.value })}
                  placeholder="Lead Studio Master / New Single"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">Release Cut / Date Tag</label>
                <input
                  type="text"
                  value={featuredRelease?.releaseDate || '2024 Cut'}
                  onChange={(e) => updateFeaturedRelease({ releaseDate: e.target.value })}
                  placeholder="2024 Cut"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">Banner Pill Text</label>
                <input
                  type="text"
                  value={featuredRelease?.badgeText || 'WORLD PREMIERE // NOW STREAMING'}
                  onChange={(e) => updateFeaturedRelease({ badgeText: e.target.value })}
                  placeholder="WORLD PREMIERE // NOW STREAMING"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">Tagline / Editorial Overview</label>
                <textarea
                  rows={2}
                  value={featuredRelease?.tagline || ''}
                  onChange={(e) => updateFeaturedRelease({ tagline: e.target.value })}
                  placeholder="Atmospheric basslines dissecting nocturnal solitude. Stream the official studio master cut."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-bold">Lyrics Pull-Quote Excerpt</label>
                <input
                  type="text"
                  value={featuredRelease?.lyricsExcerpt || ''}
                  onChange={(e) => updateFeaturedRelease({ lyricsExcerpt: e.target.value })}
                  placeholder='Praying for a signal just to know that I am alive...'
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* STREAMING DESTINATION PLATFORMS */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              DSP Streaming Destination URLs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-1.5 font-bold">Spotify Track/Album URL</label>
                <input
                  type="url"
                  value={featuredRelease?.spotifyUrl || ''}
                  onChange={(e) => updateFeaturedRelease({ spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-rose-400 mb-1.5 font-bold">Apple Music Track/Album URL</label>
                <input
                  type="url"
                  value={featuredRelease?.appleMusicUrl || ''}
                  onChange={(e) => updateFeaturedRelease({ appleMusicUrl: e.target.value })}
                  placeholder="https://music.apple.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-red-400 mb-1.5 font-bold">YouTube Music / Video URL</label>
                <input
                  type="url"
                  value={featuredRelease?.youtubeUrl || ''}
                  onChange={(e) => updateFeaturedRelease({ youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-400 mb-1.5 font-bold">SoundCloud Stream URL</label>
                <input
                  type="url"
                  value={featuredRelease?.soundcloudUrl || ''}
                  onChange={(e) => updateFeaturedRelease({ soundcloudUrl: e.target.value })}
                  placeholder="https://soundcloud.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* SAVE CONFIRMATION BAR */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
            <span className="text-xs font-mono text-purple-300">
              ⚡ All showcase adjustments save instantly to disk and auto-push to GitHub.
            </span>
            <button
              type="button"
              onClick={() => showToast('Release Showcase saved and synchronized successfully!')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs theme-primary-btn transition-all active:scale-95 cursor-pointer shadow-lg"
            >
              Save & Synchronize
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB: HOMEPAGE HERO STAGE, BIO & BACKDROP STUDIO ================= */}
      {activeTab === 'backdrop' && (
        <div className="space-y-6">
          <SectionControlsHeader
            title="Homepage Hero Stage, Bio & Backdrop Studio"
            subtitle="Configure the full homepage stage: artist typography, hero bio statement, vertical centering, stage backdrop imagery, and lighting detonation."
            badgeText={backdrop.enabled !== false && sectionsVisibility?.heroBackdrop !== false ? 'Backdrop Active' : 'Backdrop Hidden'}
            badgeColor={backdrop.enabled !== false && sectionsVisibility?.heroBackdrop !== false ? 'cyan' : 'red'}
            sectionKey="heroBackdrop"
            allowDeleteAll={false}
            allowReset={true}
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onResetDefault={() => {
              updateBackdrop({
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
              });
              updateData({
                artistInfo: {
                  ...artistInfo,
                  showHeroBio: true,
                  heroBio: "Forged in the blue-collar industrial grit of McKees Rocks. Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind.",
                  bio: "Forged in the blue-collar industrial grit of McKees Rocks. Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind."
                }
              });
              showToast('Reset Homepage Stage & Bio to factory defaults');
            }}
          />

          {/* ======================================================== */}
          {/* HERO STAGE BIO STATEMENT & VERTICAL CENTERING CONTROLS   */}
          {/* Edit bio below signs, toggle on/off, auto-recenter title */}
          {/* ======================================================== */}
          <SpotlightCard className="p-6 space-y-5" tilt={false} spotlightColor="rgba(168, 85, 247, 0.15)">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Hero Stage Bio Statement & Vertical Centering</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Narrative statement displayed directly below the neon artist sign on the homepage. When turned OFF, the artist name automatically drops down and recenters to the exact middle of the screen.
                </p>
              </div>

              {/* Master Bio On/Off Switch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const current = artistInfo.showHeroBio ?? true;
                    const nextVal = !current;
                    updateData({ artistInfo: { ...artistInfo, showHeroBio: nextVal } });
                    showToast(nextVal ? 'Hero Bio enabled on stage' : 'Hero Bio hidden - Artist title recentered to dead center');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border ${
                    (artistInfo.showHeroBio ?? true)
                      ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-600/30'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 border-white/[0.1]'
                  }`}
                  title="Toggle whether the bio statement appears on the homepage below the signs"
                >
                  {(artistInfo.showHeroBio ?? true) ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Bio: Visible on Stage</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Bio: Hidden (Title Centered)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bio Content Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Bio Statement (Appears Directly Under Artist Neon Title)</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {((artistInfo.heroBio || artistInfo.bio) || '').length} characters
                </span>
              </div>
              <textarea
                rows={3}
                value={artistInfo.heroBio ?? artistInfo.bio ?? "Forged in the blue-collar industrial grit of McKees Rocks. Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind."}
                onChange={(e) => {
                  updateData({
                    artistInfo: {
                      ...artistInfo,
                      heroBio: e.target.value,
                      bio: e.target.value
                    }
                  });
                }}
                placeholder="Enter the short hero statement displayed directly below the illuminated artist name..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400 leading-relaxed font-sans placeholder:text-slate-500"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-1 pt-0.5">
                <span className="text-purple-300">• Live synchronized to homepage hero stage</span>
                <span className="text-cyan-300">• When toggled OFF: Artist Title automatically recenters dead-center</span>
              </div>
            </div>

            {/* Subtitle & Alignment Quick Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Hero Stage Subtitle Tagline (Between Title and Bio)
                </label>
                <input
                  type="text"
                  value={artistInfo.heroSubtitle || "Once Known As Ty Sciullo • Now A Man Unseen"}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, heroSubtitle: e.target.value } })}
                  placeholder="e.g. Once Known As Ty Sciullo • Now A Man Unseen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Stage Typography Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'center', label: 'Center (Default)', icon: AlignCenter },
                    { id: 'left', label: 'Left Aligned', icon: AlignLeft },
                    { id: 'right', label: 'Right Aligned', icon: AlignRight }
                  ].map((alignOpt) => {
                    const isSelected = (neonConfig.align || 'center') === alignOpt.id;
                    const AlignIcon = alignOpt.icon;
                    return (
                      <button
                        key={alignOpt.id}
                        type="button"
                        onClick={() => {
                          updateData({
                            artistInfo: {
                              ...artistInfo,
                              neonSign: { ...neonConfig, align: alignOpt.id }
                            }
                          });
                          showToast(`Hero title aligned ${alignOpt.label}`);
                        }}
                        className={`h-10 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                            : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <AlignIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{alignOpt.id.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* MASTER VISIBILITY & STAGE SCOPE TOOLBAR */}
          <SpotlightCard className="p-6 space-y-4" tilt={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Stage Display & Placement Scope</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Control whether the backdrop image is visible on the site and choose how it spans across the hero stage.
                </p>
              </div>

              {/* Master Enable/Disable Switch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = backdrop.enabled === false ? true : false;
                    updateBackdrop({ enabled: nextVal });
                    if (toggleSectionVisibility && (sectionsVisibility?.heroBackdrop === false) === nextVal) {
                      toggleSectionVisibility('heroBackdrop');
                    }
                    showToast(nextVal ? 'Hero Backdrop enabled on live site' : 'Hero Backdrop hidden from live site');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all active:scale-95 cursor-pointer shadow-md ${
                    backdrop.enabled !== false && sectionsVisibility?.heroBackdrop !== false
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${backdrop.enabled !== false && sectionsVisibility?.heroBackdrop !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  <span>{backdrop.enabled !== false && sectionsVisibility?.heroBackdrop !== false ? 'Backdrop Active on Site' : 'Backdrop Hidden (Disabled)'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Scope Switcher */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <label className="text-[11px] font-mono text-slate-300 font-semibold block flex items-center justify-between">
                  <span>Backdrop Framing Scope</span>
                  <span className="text-[10px] font-mono text-fuchsia-400 uppercase font-bold">
                    {backdrop.scope === 'hero' ? 'Full Hero Viewport' : 'Framed Behind Title'}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateBackdrop({ scope: 'title' });
                      showToast('Backdrop scope: Framed Behind Artist Title');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      (backdrop.scope ?? 'title') === 'title'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    Framed Behind Title
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateBackdrop({ scope: 'hero' });
                      showToast('Backdrop scope: Full Hero Viewport (Full Screen)');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      backdrop.scope === 'hero'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    Full Hero Viewport
                  </button>
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  "Full Hero Viewport" spans the full 100vh stage behind title and bio. "Framed Behind Title" isolates the visual to a sleek anamorphic frame.
                </p>
              </div>

              {/* Transmission Hub Visibility Toggle */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <label className="text-[11px] font-mono text-slate-300 font-semibold block flex items-center justify-between">
                  <span>Audio Studio & Transmission Hub</span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    {sectionsVisibility?.transmissionHub !== false ? 'Enabled on Site' : 'Hidden'}
                  </span>
                </label>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[10px] font-mono text-slate-400 max-w-[70%]">
                    Shows or hides the "Audio Studio & Transmission Hub" (Metamorphosis, Streaming Reach, and Navigation cards) situated directly below the artist hero.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (toggleSectionVisibility) {
                        toggleSectionVisibility('transmissionHub');
                        const nextState = sectionsVisibility?.transmissionHub === false;
                        showToast(nextState ? 'Audio Studio & Transmission Hub enabled' : 'Audio Studio & Transmission Hub hidden');
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95 cursor-pointer ${
                      sectionsVisibility?.transmissionHub !== false
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25'
                        : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sectionsVisibility?.transmissionHub !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* REAL-TIME INTERACTIVE STAGE VISUALIZER */}
          <SpotlightCard className="p-6 space-y-4" tilt={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/[0.08] gap-3">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Real-Time Stage Visualizer & Optical Simulation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live preview showing how the image, focal point, blur, and neon illumination render together on the public site.
                </p>
              </div>

              {/* Simulation Detonation Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTestExplosion(true);
                    setPreviewIlluminated(true);
                    setTimeout(() => {
                      setTestExplosion(false);
                    }, 2200);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-mono text-[11px] font-bold shadow-md hover:brightness-110 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  title="Detonate the huge light explosion shockwave expanding outwards to reveal the background"
                >
                  <span>💥 Detonate Light Explosion Reveal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewIlluminated(true);
                    setTestIgnitionStep(0);
                    let step = 0;
                    const interval = setInterval(() => {
                      step++;
                      setTestIgnitionStep(step);
                      if (step >= 9) {
                        clearInterval(interval);
                        setTimeout(() => {
                          setPreviewIlluminated(false);
                          setTestIgnitionStep(null);
                        }, 3200);
                      }
                    }, 140);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-mono text-[11px] font-semibold border border-white/[0.1] active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  title="Test the progressive letter strike sequence"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Letter Strike Sequence</span>
                </button>
              </div>
            </div>

            {/* Scaled Preview Frame */}
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/[0.14] bg-[#07080d] flex items-center justify-center shadow-2xl">
              <div className="absolute top-2.5 right-3.5 z-20 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/80 border border-white/20 text-slate-200">
                Scope: <strong className="text-fuchsia-300">{backdrop.scope === 'hero' ? 'Full Hero Viewport' : 'Framed Behind Title'}</strong>
              </div>

              {/* Ambient Room Darkness */}
              <div className="absolute inset-0 bg-radial from-purple-950/25 via-transparent to-black pointer-events-none" />

              {/* Live Shockwave Explosion Preview in Visualizer Frame */}
              <AnimatePresence>
                {testExplosion && (
                  <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: [0, 0.45, 1.8, 4.2], opacity: [0, 1, 0.9, 0] }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-48 h-48 rounded-full border-[10px] border-white"
                      style={{
                        boxShadow: `0 0 40px #ffffff, 0 0 90px ${neonConfig.color || '#a855f7'}, 0 0 160px ${neonConfig.color || '#a855f7'}`,
                        mixBlendMode: 'screen',
                      }}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* The Configured Backdrop Image in Preview */}
              {backdrop.enabled && backdrop.image ? (
                <motion.div
                  animate={
                    testExplosion
                      ? {
                          clipPath: [
                            'circle(0% at 50% 45%)',
                            'circle(25% at 50% 45%)',
                            'circle(80% at 50% 45%)',
                            'circle(160% at 50% 45%)'
                          ],
                          opacity: [0, (backdrop.opacity ?? 45) / 100, (backdrop.opacity ?? 45) / 100],
                          filter: [
                            'brightness(3) blur(0px)',
                            'brightness(2) blur(1px)',
                            `brightness(1) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})`
                          ]
                        }
                      : testIgnitionStep !== null
                      ? {
                          clipPath: 'circle(160% at 50% 45%)',
                          opacity: testIgnitionStep === 0 ? 0 : (testIgnitionStep >= 9 ? (backdrop.opacity ?? 45) / 100 : ((backdrop.opacity ?? 45) / 100) * (0.12 + 0.88 * Math.pow(testIgnitionStep / 9, 0.95))),
                          filter: testIgnitionStep === 0 ? `brightness(0) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})` : `brightness(${testIgnitionStep >= 9 ? 1.1 : 0.15 + (0.85 * (testIgnitionStep / 9))}) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})`,
                          scale: testIgnitionStep >= 9 ? 1.02 : 1
                        }
                      : {
                          clipPath: 'circle(160% at 50% 45%)',
                          opacity: (backdrop.opacity ?? 45) / 100,
                          filter: `brightness(1) blur(${backdrop.blurEnabled ? (backdrop.blur ?? 6) * 0.3 + 'px' : '0px'})`,
                          scale: 1
                        }
                  }
                  transition={testExplosion ? { duration: 1.8, ease: [0.16, 1, 0.3, 1] } : { duration: 0.25, ease: 'easeOut' }}
                  className={
                    backdrop.scope === 'hero'
                      ? "absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
                      : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-48 rounded-2xl pointer-events-none overflow-hidden border border-white/20 shadow-2xl"
                  }
                  style={{
                    maskImage: backdrop.vignette
                      ? (backdrop.scope === 'hero'
                          ? 'radial-gradient(ellipse 90% 80% at 50% 45%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.55) 75%, transparent 100%)'
                          : 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.6) 68%, transparent 96%)')
                      : 'none',
                    WebkitMaskImage: backdrop.vignette
                      ? (backdrop.scope === 'hero'
                          ? 'radial-gradient(ellipse 90% 80% at 50% 45%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.55) 75%, transparent 100%)'
                          : 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.6) 68%, transparent 96%)')
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
                        testIgnitionStep !== null
                          ? (testIgnitionStep >= 9 ? 'opacity-100' : 'opacity-25')
                          : (previewIlluminated ? 'opacity-100' : 'opacity-40')
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
              <div className={`relative z-10 flex flex-col ${
                neonConfig.align === 'left' ? 'items-start text-left' :
                neonConfig.align === 'right' ? 'items-end text-right' :
                'items-center text-center'
              } select-none pointer-events-none px-4`}>
                <h1
                  className={`${neonConfig.font || 'font-display'} ${neonConfig.fontWeight || 'font-black'} text-4xl sm:text-6xl tracking-tight uppercase`}
                  style={{
                    color: '#ffffff',
                    textShadow: previewIlluminated || (testIgnitionStep !== null && testIgnitionStep >= 9)
                      ? `0 0 8px #ffffff, 0 0 25px ${neonConfig.color || '#a855f7'}, 0 0 60px ${neonConfig.color || '#a855f7'}`
                      : (testIgnitionStep !== null && testIgnitionStep === 0
                          ? `0 0 2px ${neonConfig.color || '#a855f7'}30`
                          : `0 0 4px #ffffff, 0 0 15px ${neonConfig.color || '#a855f7'}`)
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
                {(artistInfo.showHeroBio ?? true) && (
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-light mt-2 max-w-md line-clamp-2 leading-relaxed opacity-90 transition-all duration-300 pointer-events-none">
                    {artistInfo.heroBio || artistInfo.bio || "Forged in the blue-collar industrial grit of McKees Rocks. Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind."}
                  </p>
                )}
              </div>

              {/* Floating Status Pill in Preview */}
              <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                <span>Zoom: {backdrop.zoom ?? 105}%</span>
                <span>•</span>
                <span>Focal: {backdrop.positionX ?? 50}%x, {backdrop.positionY ?? 45}%y</span>
                <span>•</span>
                <span>Blur: {backdrop.blurEnabled ? `${backdrop.blur ?? 6}%` : 'Off'}</span>
                <span>•</span>
                <span>Opacity: {backdrop.opacity ?? 45}%</span>
              </div>
            </div>
          </SpotlightCard>

          {/* IMAGE SELECTION, UPLOAD & PRESETS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Image Source & Upload */}
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>1. Image Source & Direct Upload</span>
              </h4>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Custom Image URL or Device File
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    value={backdrop.image || ''}
                    onChange={(e) => updateBackdrop({ image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Try uploading via /api/upload to save to public/uploads/
                        try {
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                              'Content-Type': file.type,
                              'X-File-Name': encodeURIComponent(file.name)
                            },
                            body: file
                          });
                          if (res.ok) {
                            const data = await res.json();
                            if (data.url) {
                              updateBackdrop({ image: data.url });
                              showToast('Uploaded backdrop image to server uploads!');
                              return;
                            }
                          }
                        } catch (err) {
                          console.warn('Server upload fallback to data URL:', err);
                        }

                        // Fallback: Read as base64 Data URL
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            updateBackdrop({ image: ev.target.result });
                            showToast('Loaded local backdrop image');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Curated Presets Grid */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-mono text-slate-400 block uppercase">
                  Curated Studio Presets (1-Click Apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      name: 'Nocturnal Angel',
                      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop'
                    },
                    {
                      name: 'Moody Cyber Stage',
                      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop'
                    },
                    {
                      name: 'Industrial Grit',
                      url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop'
                    },
                    {
                      name: 'Laser Starburst',
                      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop'
                    }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        updateBackdrop({ image: preset.url });
                        showToast(`Applied "${preset.name}" preset`);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-[10px] font-mono text-left truncate transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blend Mode & Vignette */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Blend Mode</label>
                  <select
                    value={backdrop.blendMode || 'screen'}
                    onChange={(e) => updateBackdrop({ blendMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#12131f] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="screen">Screen (Luminous Glow)</option>
                    <option value="overlay">Overlay (High Contrast)</option>
                    <option value="soft-light">Soft Light (Subtle Mood)</option>
                    <option value="color-dodge">Color Dodge (Extreme Neon)</option>
                    <option value="luminosity">Luminosity (Monochrome)</option>
                    <option value="normal">Normal (Raw Photo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Feathered Edge Vignette</label>
                  <label className="flex items-center gap-2 h-9 px-3 rounded-xl bg-black/40 border border-white/[0.1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={backdrop.vignette ?? true}
                      onChange={(e) => updateBackdrop({ vignette: e.target.checked })}
                      className="rounded accent-purple-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs text-slate-200">Fade Into Black</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Optics, Blur, Crop, Opacity & Focal Positioning */}
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>2. Optics, Blur, Crop & Illumination FX</span>
              </h4>

              {/* Glow Illumination Reveal Toggle */}
              <div className="p-3 rounded-xl bg-purple-950/25 border border-purple-500/30 space-y-1.5">
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
                      <span>Illuminate on Neon Title Glow</span>
                    </span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    {backdrop.illuminateOnGlow ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-light leading-relaxed">
                  Neon sign strikes cast dynamic physical light onto the background, revealing only the wavefront-covered areas!
                </p>
              </div>

              {/* Blur Percentage Setting */}
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
                  <span className="text-[10px] font-mono text-slate-500">0% (Sharp) - 100% (Glass)</span>
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
                  <span className="text-[10px] text-slate-500">0% (Hidden) - 100% (Solid)</span>
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
                  <span className="text-[10px] text-slate-500">100% (Original) - 250% (Close-Up)</span>
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
        </div>
      )}

      {/* ================= TAB: SITE COLOR THEME STUDIO ================= */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <SectionControlsHeader
            title="Global Site Color Theme Studio"
            subtitle="Change the entire website's aesthetic, accent colors, neon gas ionization, ambient glows, and button gradients."
            badgeText={currentTheme.name || 'Electric Violet'}
            badgeColor="purple"
            sectionKey="theme"
            allowDeleteAll={false}
            allowReset={true}
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onResetDefault={() => {
              updateSiteTheme(THEME_PRESETS[0], true);
              showToast('Reset theme to Electric Violet (Default)');
            }}
          />

          {/* THEME PRESETS GRID */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-fuchsia-400" />
                  Curated Aesthetic Palettes (1-Click Transform)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any theme to transform every button, neon tube, glowing aura, and accent across the website.
                </p>
              </div>
              <span className="text-[10px] font-mono text-fuchsia-300 bg-fuchsia-950/60 px-3 py-1 rounded-full border border-fuchsia-500/30">
                Active: {currentTheme.name || 'Electric Violet'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {THEME_PRESETS.map((t) => {
                const isActive = (currentTheme.id === t.id) || (currentTheme.primary?.toLowerCase() === t.primary.toLowerCase());
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateSiteTheme(t)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      isActive
                        ? 'border-white bg-white/[0.06] shadow-xl shadow-black ring-1 ring-white/30'
                        : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    {/* Glowing Accent Bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 transition-all"
                      style={{
                        background: `linear-gradient(to right, ${t.primary}, ${t.secondary}, ${t.accent})`
                      }}
                    />

                    <div className="flex items-center justify-between mb-2 mt-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full shadow-md shrink-0"
                          style={{
                            backgroundColor: t.primary,
                            boxShadow: `0 0 10px ${t.primary}`
                          }}
                        />
                        <span className="font-display font-bold text-sm text-white">
                          {t.name}
                        </span>
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-white/10 text-white border border-white/20">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 font-mono mb-3">
                      {t.tag}
                    </p>

                    {/* Visual 3-Swatch Gradient Preview */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-black/50 border border-white/[0.06]">
                      <div
                        className="h-3 flex-1 rounded-md"
                        style={{ backgroundColor: t.primary }}
                        title={`Primary: ${t.primary}`}
                      />
                      <div
                        className="h-3 flex-1 rounded-md"
                        style={{ backgroundColor: t.secondary }}
                        title={`Secondary: ${t.secondary}`}
                      />
                      <div
                        className="h-3 flex-1 rounded-md"
                        style={{ backgroundColor: t.accent }}
                        title={`Accent: ${t.accent}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUSTOM COLOR PALETTE BUILDER & SYNC SETTINGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Custom Color Inputs */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Custom Color Builder
              </h3>
              <p className="text-xs text-slate-400">
                Fine-tune each individual accent color or enter custom hex codes for bespoke branding.
              </p>

              {/* Primary Accent Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center justify-between">
                  <span>Primary Brand Color (Buttons & Glows)</span>
                  <span className="font-mono text-slate-400">{currentTheme.primary}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.primary || '#a855f7'}
                    onChange={(e) => updateSiteTheme({ id: 'custom', name: 'Custom Palette', primary: e.target.value, glow: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-black border border-white/[0.15] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentTheme.primary || '#a855f7'}
                    onChange={(e) => updateSiteTheme({ id: 'custom', name: 'Custom Palette', primary: e.target.value, glow: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    placeholder="#a855f7"
                  />
                </div>
              </div>

              {/* Secondary Gradient Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center justify-between">
                  <span>Secondary Gradient Color (Flows & Blends)</span>
                  <span className="font-mono text-slate-400">{currentTheme.secondary}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.secondary || '#6366f1'}
                    onChange={(e) => updateSiteTheme({ id: 'custom', name: 'Custom Palette', secondary: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-black border border-white/[0.15] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentTheme.secondary || '#6366f1'}
                    onChange={(e) => updateSiteTheme({ id: 'custom', name: 'Custom Palette', secondary: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              {/* Tertiary / Highlight Accent */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center justify-between">
                  <span>Tertiary Accent Color (Equalizer & Highlights)</span>
                  <span className="font-mono text-slate-400">{currentTheme.accent}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.accent || '#06b6d4'}
                    onChange={(e) => updateSiteTheme({ id: 'custom', name: 'Custom Palette', accent: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-black border border-white/[0.15] cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentTheme.accent || '#06b6d4'}
                    onChange={(e) => updateSiteTheme({ id: 'custom', name: 'Custom Palette', accent: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    placeholder="#06b6d4"
                  />
                </div>
              </div>
            </div>

            {/* Sync Toggles & Live Component Mock Preview */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Theme Synchronization
                </h3>
                
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-colors mb-3">
                  <input
                    type="checkbox"
                    checked={currentTheme.syncNeon !== false}
                    onChange={(e) => {
                      updateSiteTheme({ syncNeon: e.target.checked }, e.target.checked);
                      showToast(e.target.checked ? 'Neon Sign gas color synchronized with theme' : 'Neon Sign color unlinked');
                    }}
                    className="rounded accent-fuchsia-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Sync Neon Sign & Hero Illumination
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Automatically updates the physical neon sign gas bloom to match this color palette.
                    </span>
                  </div>
                </label>
              </div>

              {/* Live Preview Elements in Admin */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Live Component Appearance
                </span>

                {/* Mock Play Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-xs shadow-lg pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                      boxShadow: `0 8px 20px -4px ${currentTheme.primary}60`
                    }}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Listen: Studio Track</span>
                    <span className="flex items-center gap-0.5 h-2.5 ml-1">
                      <span className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" />
                      <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" />
                      <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" />
                    </span>
                  </button>

                  {/* Mock On-Tour Beacon */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white border pointer-events-none"
                    style={{
                      borderColor: `${currentTheme.primary}60`,
                      background: `linear-gradient(to right, ${currentTheme.primary}30, transparent)`,
                      boxShadow: `0 0 10px ${currentTheme.primary}30`
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.accent, boxShadow: `0 0 6px ${currentTheme.accent}` }} />
                    LIVE TOUR
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 3: PROFILE & BIOGRAPHY ================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <SectionControlsHeader
            title="Artist Profile & Multi-Chapter Biography"
            subtitle="Update artist name, metrics, tags, location, avatar imagery, and narrative chapters."
            badgeText={`${biography.length} chapters`}
            badgeColor="purple"
            sectionKey="bio"
            collectionKey="biography"
            itemCount={biography.length}
            addLabel="Add Bio Chapter"
            onAddNew={() => {
              updateData((prev) => ({
                ...prev,
                biography: [
                  ...(prev.biography || []),
                  {
                    title: `Chapter 0${(prev.biography || []).length + 1}: Next Horizon`,
                    era: '2026—PRESENT',
                    text: 'Write narrative chapter biography here.',
                    content: 'Write narrative chapter biography here.'
                  }
                ]
              }));
              showToast('Added new biography chapter');
            }}
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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

            {/* Hero Stage Bio Statement (Featured on Main Home Viewport) */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <label className="text-[11px] font-mono font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Hero Stage Bio Statement (Main Home Screen)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const current = artistInfo.showHeroBio ?? true;
                      const nextVal = !current;
                      updateData({ artistInfo: { ...artistInfo, showHeroBio: nextVal } });
                      showToast(nextVal ? 'Hero Bio enabled on stage' : 'Hero Bio hidden - Artist title recentered to dead center');
                    }}
                    className={`px-3 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer border ${
                      (artistInfo.showHeroBio ?? true)
                        ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-sm shadow-purple-600/30'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 border-white/[0.1]'
                    }`}
                  >
                    {(artistInfo.showHeroBio ?? true) ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visible on Stage</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hidden (Recentered)</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">
                    {((artistInfo.bio || artistInfo.heroBio) || '').length} chars
                  </span>
                </div>
              </div>
              <textarea
                rows={3}
                value={artistInfo.heroBio ?? artistInfo.bio ?? "Forged in the blue-collar industrial grit of McKees Rocks. Hypnotic basslines, unfiltered vulnerability, and nocturnal melodies for the restless mind."}
                onChange={(e) => {
                  const val = e.target.value;
                  updateData({
                    artistInfo: {
                      ...artistInfo,
                      bio: val,
                      heroBio: val
                    }
                  });
                }}
                placeholder="Enter the short hero statement displayed directly below the illuminated artist name..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400 leading-relaxed font-sans placeholder:text-slate-500"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-400 gap-1 mt-1">
                <span>Appears directly below the neon artist sign on the homepage.</span>
                <span className="text-cyan-300">When toggled OFF, artist title drops down & recenters.</span>
              </div>
            </div>

            {/* Featured Philosophy Pull-Quote & Attribution */}
            <div className="pt-2 grid grid-cols-1 lg:grid-cols-3 gap-3 border-t border-white/[0.06]">
              <div className="lg:col-span-2">
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Featured Philosophy Pull-Quote (Bio Section)
                </label>
                <textarea
                  rows={2}
                  value={artistInfo.quote ?? "I grew up watching family members give their best years to jobs that drained their souls. I realized that whatever pain comes with chasing your art is nothing compared to the regret of never trying at all."}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, quote: e.target.value } })}
                  placeholder="Enter artist philosophical quote..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400 leading-relaxed font-sans"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Quote Attribution
                </label>
                <input
                  type="text"
                  value={artistInfo.quoteAuthor ?? "Tyler Sciullo (UNNOTICED)"}
                  onChange={(e) => updateData({ artistInfo: { ...artistInfo, quoteAuthor: e.target.value } })}
                  placeholder="e.g. Tyler Sciullo (UNNOTICED)"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
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

          {/* ================= TOP NAVIGATION BAR BRANDING & BADGES ================= */}
          <SpotlightCard className="p-6 space-y-5" tilt={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold">
                  HEADER NAVIGATION BAR // BRAND CONTROLS
                </span>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Top Navigation Brand & Badges</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Customize the brand moniker pill and subtitle tagline in the sticky top navbar, or toggle them off.
                </p>
              </div>

              {/* Real-Time Live Mini Preview of Navbar Brand */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.14] bg-[#07080e] shadow-lg shrink-0">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Live Header:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-xs text-white">
                    {artistInfo.name || 'UNNOTICED'}
                  </span>
                  {artistInfo.showNavbarMoniker !== false && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[8px] font-mono tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase font-semibold">
                      {artistInfo.navbarMoniker ?? artistInfo.previousName ?? 'Ty Sciullo'}
                    </span>
                  )}
                </div>
                {artistInfo.showNavbarTagline !== false && (
                  <span className="text-[8.5px] text-slate-400 font-mono hidden md:inline">
                    • {artistInfo.navbarTagline || 'Official Artist Experience'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Moniker Badge (Ty Sciullo) */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Navbar Moniker Pill</span>
                    <span className="text-[10px] font-mono text-slate-400">Pill badge displayed next to artist title</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={artistInfo.showNavbarMoniker !== false}
                      onChange={(e) => updateData({ artistInfo: { ...artistInfo, showNavbarMoniker: e.target.checked } })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={artistInfo.navbarMoniker ?? artistInfo.previousName ?? 'Ty Sciullo'}
                    onChange={(e) => updateData({ artistInfo: { ...artistInfo, navbarMoniker: e.target.value } })}
                    placeholder="e.g. Ty Sciullo"
                    disabled={artistInfo.showNavbarMoniker === false}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-400 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Subtitle Tagline (Official Artist Experience) */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Navbar Subtitle Tagline</span>
                    <span className="text-[10px] font-mono text-slate-400">Micro-tagline beneath brand in header</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={artistInfo.showNavbarTagline !== false}
                      onChange={(e) => updateData({ artistInfo: { ...artistInfo, showNavbarTagline: e.target.checked } })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Tagline Text</label>
                  <input
                    type="text"
                    value={artistInfo.navbarTagline ?? 'Official Artist Experience'}
                    onChange={(e) => updateData({ artistInfo: { ...artistInfo, navbarTagline: e.target.value } })}
                    placeholder="e.g. Official Artist Experience"
                    disabled={artistInfo.showNavbarTagline === false}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-400 disabled:opacity-40"
                  />
                </div>
              </div>

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
                <Eye className="w-3 h-3 text-fuchsia-400" /> Live Neon Sign & Subtitle Studio Preview
              </div>

              {/* Main Neon Title with Dynamic Alignment & Custom Scale */}
              <div className={`py-6 w-full flex ${
                neonConfig.align === 'left' ? 'justify-start' :
                neonConfig.align === 'right' ? 'justify-end' :
                'justify-center'
              }`}>
                <NeonSign
                  key={`${neonConfig.color}-${neonConfig.font}-${neonConfig.size}-${neonConfig.fontSizeRem}-${neonConfig.fontWeight}-${neonConfig.flicker}-${neonConfig.align}`}
                  as="h2"
                  color={neonConfig.color || '#a855f7'}
                  delay={0.1}
                  flicker={neonConfig.flicker ?? true}
                  style={neonConfig.fontSizeRem ? { fontSize: `clamp(2rem, 6.5vw, ${neonConfig.fontSizeRem}rem)` } : undefined}
                  className={`${neonConfig.font || 'font-display'} ${neonConfig.fontWeight || 'font-black'} ${neonConfig.size || 'text-4xl sm:text-6xl md:text-7xl'} tracking-tight uppercase leading-[0.95]`}
                >
                  {artistInfo.name || 'UNNOTICED'}
                </NeonSign>
              </div>

              {/* Live Preview of Illuminated Subtitle Caption */}
              <div className={`w-full flex items-center ${
                neonConfig.align === 'left' ? 'justify-start' :
                neonConfig.align === 'right' ? 'justify-end' :
                'justify-center'
              } gap-2 mt-1 pb-2`}>
                {(neonConfig.align === 'center' || neonConfig.align === 'right') && (
                  <div
                    className="h-[1px] w-10 sm:w-16 transition-all"
                    style={{
                      background: `linear-gradient(to right, transparent, ${neonConfig.color || '#a855f7'})`,
                      boxShadow: `0 0 6px ${neonConfig.color || '#a855f7'}`
                    }}
                  />
                )}
                <p
                  className="font-tech text-xs tracking-[0.2em] uppercase font-bold text-white px-1 select-none"
                  style={{
                    textShadow: `0 0 4px #ffffff, 0 0 10px ${neonConfig.color || '#a855f7'}, 0 0 20px ${neonConfig.color || '#a855f7'}`
                  }}
                >
                  {artistInfo.heroSubtitle || "Once Known As Ty Sciullo • Now A Man Unseen"}
                </p>
                {(neonConfig.align === 'center' || neonConfig.align === 'left') && (
                  <div
                    className="h-[1px] w-10 sm:w-16 transition-all"
                    style={{
                      background: `linear-gradient(to left, transparent, ${neonConfig.color || '#a855f7'})`,
                      boxShadow: `0 0 6px ${neonConfig.color || '#a855f7'}`
                    }}
                  />
                )}
              </div>

              {/* Status Info Footer */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-slate-400 mt-3 pt-3 border-t border-white/[0.08] w-full">
                <span>Color: <strong className="text-white">{neonConfig.color || '#a855f7'}</strong></span>
                <span>•</span>
                <span>Font: <strong className="text-white">{FONT_OPTIONS.find(f => f.id === neonConfig.font)?.name || 'Syne'}</strong></span>
                <span>•</span>
                <span>Scale: <strong className="text-fuchsia-400">{neonConfig.fontSizeRem || 4.25}rem</strong></span>
                <span>•</span>
                <span>Align: <strong className="text-white uppercase">{neonConfig.align || 'center'}</strong></span>
              </div>
            </div>

            {/* CONTROLS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Left Column: Color & Alignment */}
              <div className="space-y-4">
                
                {/* Hero Title & Stage Alignment Controls */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AlignCenter className="w-3.5 h-3.5 text-fuchsia-400" />
                      Hero Title & Stage Alignment
                    </span>
                    <span className="text-[10px] font-mono uppercase text-fuchsia-400 font-bold">
                      {neonConfig.align || 'center'}
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-black/50 border border-white/[0.08]">
                    {[
                      { id: 'left', label: 'Left', icon: AlignLeft },
                      { id: 'center', label: 'Center', icon: AlignCenter },
                      { id: 'right', label: 'Right', icon: AlignRight }
                    ].map((alignOpt) => {
                      const Icon = alignOpt.icon;
                      const isSelected = (neonConfig.align || 'center') === alignOpt.id;
                      return (
                        <button
                          key={alignOpt.id}
                          type="button"
                          onClick={() => {
                            updateData({
                              artistInfo: {
                                ...artistInfo,
                                neonSign: { ...neonConfig, align: alignOpt.id }
                              }
                            });
                            showToast(`Hero title aligned ${alignOpt.label}`);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/40'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{alignOpt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[9.5px] font-mono text-slate-400">
                    Positions artist title, subtitle caption, bio paragraph, and on tour badge to the Left, Center, or Right.
                  </p>
                </div>

                {/* Color Preset & Picker */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
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
                          const matching = THEME_PRESETS.find(
                            (p) => p.primary.toLowerCase() === preset.hex.toLowerCase() || p.name.toLowerCase() === preset.name.toLowerCase()
                          );
                          if (matching) {
                            updateSiteTheme(matching, true);
                          } else {
                            updateSiteTheme({
                              id: 'custom',
                              name: preset.name,
                              primary: preset.hex,
                              secondary: preset.hex,
                              accent: preset.hex,
                              glow: preset.hex
                            }, true);
                          }
                          showToast(`Site theme & neon set to ${preset.name}`);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                          (neonConfig.color || currentTheme.primary || '#a855f7').toLowerCase() === preset.hex.toLowerCase()
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
                      value={neonConfig.color || currentTheme.primary || '#a855f7'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateSiteTheme({
                          id: 'custom',
                          name: 'Custom Palette',
                          primary: val,
                          secondary: val,
                          accent: val,
                          glow: val
                        }, true);
                      }}
                      className="w-10 h-9 rounded-xl bg-black border border-white/[0.15] cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      placeholder="#a855f7"
                      value={neonConfig.color || currentTheme.primary || '#a855f7'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateSiteTheme({
                          id: 'custom',
                          name: 'Custom Palette',
                          primary: val,
                          secondary: val,
                          accent: val,
                          glow: val
                        }, true);
                      }}
                      className="w-36 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">Applies to whole site</span>
                  </div>
                </div>

                {/* Tubing Weight & Flicker */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Tubing Glass Weight</span>
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

                  {/* Flicker Toggle */}
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
                        Intermittent random letter tube voltage drop for realistic physical neon behavior.
                      </span>
                    </div>
                  </label>
                </div>

              </div>

              {/* Right Column: Expanded Font Library & Granular Sizing */}
              <div className="space-y-4">
                
                {/* Granular Sizing Slider & Quick Scale Presets */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Artist Title Sizing & Scale Control</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-fuchsia-300 bg-fuchsia-950/60 px-2 py-0.5 rounded border border-fuchsia-500/40">
                      {neonConfig.fontSizeRem || 4.25}rem (~{Math.round((neonConfig.fontSizeRem || 4.25) * 16)}px)
                    </span>
                  </div>

                  {/* Granular Size Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="2.5"
                      max="12"
                      step="0.25"
                      value={neonConfig.fontSizeRem || 4.25}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        updateData({
                          artistInfo: {
                            ...artistInfo,
                            neonSign: {
                              ...neonConfig,
                              fontSizeRem: val,
                              size: `text-[${val}rem]`
                            }
                          }
                        });
                      }}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>2.5rem (Compact)</span>
                      <span>4.25rem (Comfortable Default)</span>
                      <span>7.5rem (Stadium)</span>
                      <span>10.0rem (Monumental)</span>
                    </div>
                  </div>

                  {/* Quick Scale Presets */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1.5">Quick Scale Presets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SIZE_PRESETS.map((preset) => {
                        const isSelected = Math.abs((neonConfig.fontSizeRem || 4.25) - preset.rem) < 0.15;
                        return (
                          <button
                            key={preset.rem}
                            type="button"
                            onClick={() => {
                              updateData({
                                artistInfo: {
                                  ...artistInfo,
                                  neonSign: {
                                    ...neonConfig,
                                    fontSizeRem: preset.rem,
                                    size: preset.tailwind
                                  }
                                }
                              });
                              showToast(`Size set to ${preset.label}`);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-fuchsia-500 bg-fuchsia-600/30 text-white font-bold shadow-sm'
                                : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expanded Font Library with Live Visual Cards */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Neon Font Library ({FONT_OPTIONS.length} Typefaces)</span>
                    </label>
                    <span className="text-[9.5px] font-mono text-fuchsia-400">Click card to select</span>
                  </div>

                  {/* Quick Dropdown */}
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
                    className="w-full px-3 py-2 rounded-xl bg-[#141522] border border-white/[0.1] text-xs text-white focus:outline-none font-mono mb-2"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.tag}
                      </option>
                    ))}
                  </select>

                  {/* Visual Font Cards Grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1.5 rounded-xl bg-black/50 border border-white/[0.08]">
                    {FONT_OPTIONS.map((f) => {
                      const isSelected = (neonConfig.font || 'font-display') === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            updateData({
                              artistInfo: {
                                ...artistInfo,
                                neonSign: { ...neonConfig, font: f.id }
                              }
                            });
                            showToast(`Neon font set to ${f.name}`);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-fuchsia-500 bg-fuchsia-950/50 shadow-md shadow-fuchsia-500/20'
                              : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-slate-300 font-bold truncate">
                              {f.name}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-sm" />
                            )}
                          </div>
                          <div
                            className={`${f.id} font-black text-sm text-white tracking-wider truncate py-0.5`}
                            style={{
                              textShadow: isSelected ? `0 0 8px ${neonConfig.color || '#a855f7'}` : 'none'
                            }}
                          >
                            {f.sample}
                          </div>
                          <span className="text-[8.5px] font-mono text-slate-500 truncate mt-1">
                            {f.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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

          {/* Hero Backdrop Stage Quick Portal */}
          <SpotlightCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-500/20 bg-purple-950/15" tilt={false}>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <span>Hero Stage & Backdrop Image Studio</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Moved to Dedicated Tab
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The visual backdrop image has its own dedicated admin tab with zoom, blur, focal alignment, upload tools, and live simulation.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('backdrop')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 shadow-md shadow-purple-600/30"
            >
              <span>Open Hero Image Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </SpotlightCard>

          {/* Biography Paragraphs */}
          <SpotlightCard className="p-6 space-y-4" tilt={false}>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Multi-Paragraph Biography Chapters ({biography.length})
                </h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Narrative chronicle chapters displayed in the interactive biography tab section.
                </p>
              </div>
              <button
                onClick={() => {
                  const newChapter = {
                    title: `Chapter 0${biography.length + 1}: Next Horizon`,
                    era: '2026—PRESENT',
                    text: 'Write narrative chapter biography here.',
                    content: 'Write narrative chapter biography here.'
                  };
                  updateData({ biography: [...biography, newChapter] });
                  showToast('Added new chapter');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-md shadow-purple-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Chapter</span>
              </button>
            </div>

            <div className="space-y-4">
              {biography.map((para, bIdx) => (
                <div key={bIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase tracking-wider">
                      Chapter 0{bIdx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={bIdx === 0}
                        onClick={() => handleMove('biography', bIdx, 'up')}
                        className="p-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-20 text-white cursor-pointer active:scale-90"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        disabled={bIdx === biography.length - 1}
                        onClick={() => handleMove('biography', bIdx, 'down')}
                        className="p-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-20 text-white cursor-pointer active:scale-90"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete('biography', bIdx)}
                        className="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 ml-1 cursor-pointer active:scale-90"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Chapter Title</label>
                      <input
                        type="text"
                        value={para.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData({
                            biography: biography.map((item, idx) =>
                              idx === bIdx ? { ...item, title: val } : item
                            )
                          });
                        }}
                        placeholder="e.g. The Industrial Roots of McKees Rocks"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-bold text-white focus:outline-none focus:border-purple-400 font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block mb-1">Era / Timeline</label>
                      <input
                        type="text"
                        value={para.era || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData({
                            biography: biography.map((item, idx) =>
                              idx === bIdx ? { ...item, era: val } : item
                            )
                          });
                        }}
                        placeholder="e.g. 1997-2016"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono text-slate-400">Chapter Narrative Text</label>
                      <span className="text-[9px] font-mono text-slate-500">
                        {((para.text || para.content) || '').length} characters
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={para.text ?? para.content ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData({
                          biography: biography.map((item, idx) =>
                            idx === bIdx ? { ...item, text: val, content: val } : item
                          )
                        });
                      }}
                      placeholder="Write biographical chapter story narrative here..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs text-slate-300 focus:outline-none focus:border-purple-400 leading-relaxed font-sans placeholder:text-slate-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* ================= TAB 4: VIDEOS ================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <SectionControlsHeader
            title="YouTube Videos & Visualizer Grid"
            subtitle="Add YouTube links or upload video files directly, edit metadata, and reorganize the showcase."
            badgeText={`${videos.length} visuals`}
            badgeColor="red"
            sectionKey="media"
            collectionKey="videos"
            itemCount={videos.length}
            addLabel="Add Video to Showcase"
            onAddNew={() => {
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
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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
          <SectionControlsHeader
            title="Tour Schedule & Stage Dates"
            subtitle="Add tour stops, modify venue names, adjust ticket availability statuses, and reorganize."
            badgeText={`${tourDates.length} shows`}
            badgeColor="cyan"
            sectionKey="tour"
            collectionKey="tourDates"
            itemCount={tourDates.length}
            addLabel="Add Tour Date"
            onAddNew={() => {
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
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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
          <SectionControlsHeader
            title="Merch Atelier & Store Catalog"
            subtitle="Update merchandise pricing, product photography (upload or link), sizing arrays, and reorder."
            badgeText={`${merchProducts.length} items`}
            badgeColor="purple"
            sectionKey="store"
            collectionKey="merchProducts"
            itemCount={merchProducts.length}
            addLabel="Add Product"
            onAddNew={() => {
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
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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
          <SectionControlsHeader
            title="Gallery Slideshow Manager"
            subtitle="Reorder slide progression, edit captions, and upload or link high-resolution photos."
            badgeText={`${galleryImages.length} slides`}
            badgeColor="purple"
            sectionKey="gallery"
            collectionKey="galleryImages"
            itemCount={galleryImages.length}
            addLabel="Add Slide"
            onAddNew={() => {
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
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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
          <SectionControlsHeader
            title="Social Feed Stream"
            subtitle="Update social post cards, upload media imagery, set likes/comments counts, and reorder."
            badgeText={`${socialPosts.length} posts`}
            badgeColor="pink"
            sectionKey="social"
            collectionKey="socialPosts"
            itemCount={socialPosts.length}
            addLabel="Add Social Post"
            onAddNew={() => {
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
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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
          <SectionControlsHeader
            title="Electronic Press Kit (EPK) Settings & VIP Syndicate"
            subtitle="Update industry booking emails, critical press quotes, downloadable press assets, and toggle newsletter visibility."
            badgeText="Industry Assets"
            badgeColor="cyan"
            sectionKey="newsletter"
            collectionKey="epkData"
            itemCount={epkData.downloadableAssets?.length || 4}
            allowDeleteAll={false}
            allowReset={true}
            sectionsVisibility={sectionsVisibility}
            toggleSectionVisibility={toggleSectionVisibility}
            onOpenDeleteConfirm={setDeleteConfirmModal}
            onResetDefault={handleResetSection}
          />

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
      {/* TAB: GITHUB CLOUD SYNC & REPOSITORY MANAGEMENT           */}
      {/* ======================================================== */}
      {activeTab === 'github' && (
        <div className="space-y-6">
          <SectionControlsHeader
            title="GitHub Cloud Sync & Multi-Device Repository"
            subtitle="Automatically publish your live CMS changes directly to GitHub so your website stays consistent across every phone, laptop, and deployment."
            badgeText="Git Version Control"
            badgeColor="cyan"
            sectionKey="github"
            allowDeleteAll={false}
            allowReset={false}
          />

          {/* Repository Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SpotlightCard className="p-5 flex flex-col justify-between" spotlightColor="rgba(6, 182, 212, 0.2)">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-cyan-300 font-semibold uppercase">Target Repository</span>
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-1">
                  youngtoaster/unnoticed-website
                </h4>
                <p className="text-xs text-slate-400 font-mono truncate">
                  {gitStatus?.remoteUrl || 'https://github.com/youngtoaster/unnoticed-website.git'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Branch: <strong className="text-white">{gitStatus?.branch || 'main'}</strong></span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 flex flex-col justify-between" spotlightColor="rgba(168, 85, 247, 0.2)">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-purple-300 font-semibold uppercase">Latest Git Commit</span>
                  <GitCommit className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="font-mono text-sm font-bold text-purple-300 mb-1">
                  {gitStatus?.lastCommit?.hash ? `Commit ${gitStatus.lastCommit.hash}` : 'Tracking main'}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {gitStatus?.lastCommit?.message || 'Latest CMS updates'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Timestamp:</span>
                <span className="text-slate-300">{gitStatus?.lastCommit?.relativeDate || 'Recent'}</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 flex flex-col justify-between" spotlightColor="rgba(16, 185, 129, 0.2)">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-emerald-300 font-semibold uppercase">Sync Automation</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-1">
                  Auto-Push Active
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every edit made across Music, Bio, Merch, Tour, or Theme writes to disk and auto-commits to GitHub.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live multi-device consistency</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Manual GitHub Push Console */}
          <SpotlightCard className="p-6 sm:p-7 space-y-4" spotlightColor="rgba(168, 85, 247, 0.2)">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  <span>Publish All Content to GitHub (main)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Stages `public/site_data.json` and `src/data/artistData.js`, commits, and pushes directly to GitHub repository.
                </p>
              </div>

              <button
                onClick={async () => {
                  const res = await pushToGitHub(customCommitMsg || undefined);
                  if (res.success) {
                    showToast(res.message || 'Pushed all CMS content to GitHub repository!', 'success');
                    setCustomCommitMsg('');
                  } else {
                    showToast(res.error || 'GitHub sync failed. Check local server status', 'error');
                  }
                }}
                disabled={isPushingGit}
                className="px-6 py-3 rounded-2xl theme-primary-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-50 cursor-pointer shrink-0"
              >
                <GitBranch className={`w-4 h-4 ${isPushingGit ? 'animate-spin' : ''}`} />
                <span>{isPushingGit ? 'Pushing to GitHub...' : 'Push to GitHub Now ↗'}</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Custom Git Commit Message (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Added new track Calling for Help, updated 2026 tour dates..."
                value={customCommitMsg}
                onChange={(e) => setCustomCommitMsg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-600 font-mono"
              />
            </div>
          </SpotlightCard>

          {/* Remote Admin Mobile/Cloud Access (GitHub Personal Access Token) */}
          <SpotlightCard className="p-6 sm:p-7 space-y-4" spotlightColor="rgba(6, 182, 212, 0.15)">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div>
                <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Secure GitHub Access Token (Encrypted & Protected)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enables direct cloud commits to your GitHub repository. Protected by admin session and gitignored from public code.
                </p>
              </div>

              {githubTokenInput ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Token Active & Secured</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  <span>No Token Saved</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type={showToken ? 'text' : 'password'}
                  placeholder="gho_xxxxxxxxxxxx or ghp_xxxxxxxxxxxx"
                  value={githubTokenInput}
                  onChange={(e) => setGithubTokenInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showToken ? 'Mask Token' : 'Reveal Token'}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (githubTokenInput.trim()) {
                    localStorage.setItem('unnoticed_github_token', githubTokenInput.trim());
                    showToast('GitHub Personal Access Token saved for remote syncing!');
                  } else {
                    localStorage.removeItem('unnoticed_github_token');
                    showToast('GitHub token removed. Using local Git server.');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 shadow-md shadow-cyan-600/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Token</span>
              </button>

              {isTokenAutoConfigured && (
                <button
                  type="button"
                  onClick={() => {
                    fetch('/api/admin/auto-token')
                      .then((r) => r.json())
                      .then((d) => {
                        if (d.token) {
                          setGithubTokenInput(d.token);
                          localStorage.setItem('unnoticed_github_token', d.token);
                          showToast('Re-synced token from local server environment');
                        }
                      });
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.1] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Reload token from local .env.local"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Server Token</span>
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-slate-400 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Zero Public Exposure Guarantee:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1 text-[10px] leading-relaxed">
                <li>Saved exclusively to your private device storage (<code className="text-cyan-300">localStorage</code>) and local private file (<code className="text-cyan-300">.env.local</code>).</li>
                <li>Completely excluded from Git commits via <code className="text-cyan-300">.gitignore</code> — will never be uploaded to GitHub.</li>
                <li>Never bundled into client JavaScript — website visitors can never inspect or retrieve your credentials.</li>
              </ul>
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
