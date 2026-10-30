import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, ExternalLink, Copy, Check, Search, Sparkles, Box, Layout, MousePointer,
  Layers, Palette, Type, Code2, Globe, Bookmark, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';

export const UI_INSPIRATION_SITES = [
  {
    id: 'scrolltide',
    name: 'Scrolltide',
    url: 'https://scrolltide.co',
    category: '3D & Motion',
    superpower: '+600 design prompts with code for 3D websites and scroll',
    description: 'High-velocity 3D scenes, scroll-driven cameras, three.js web prompts, and production-ready code snippets to paste directly into your frontend.',
    tags: ['3D WebGL', 'Scroll Prompts', 'Kinetic Code'],
    color: '#06b6d4',
    accentBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    badge: '3D & Scroll'
  },
  {
    id: 'motionsites',
    name: 'MotionSites',
    url: 'https://motionsites.ai',
    category: '3D & Motion',
    superpower: '800+ free premium website prompts: 1000+ backgrounds, motion sections',
    description: 'Paste structured prompts into Claude, Gemini, or ChatGPT to generate production-ready HTML, Tailwind, and React motion components. Over 1,000+ backgrounds and motion sections.',
    tags: ['AI Prompts', 'Mesh Gradients', 'Motion Blueprints'],
    color: '#a855f7',
    accentBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    badge: 'AI Prompts'
  },
  {
    id: 'supahero',
    name: 'SupaHero',
    url: 'https://supahero.io',
    category: 'Landing & Heroes',
    superpower: 'Hero sections to steal guilt-free',
    description: 'Hand-picked directory of high-impact above-the-fold hero architecture, kinetic headline arrangements, atmospheric lighting, and conversion hooks.',
    tags: ['Hero Sections', 'Kinetic Headers', 'Above-The-Fold'],
    color: '#f59e0b',
    accentBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    badge: 'Hero Sections'
  },
  {
    id: 'navbar-gallery',
    name: 'Navbar Gallery',
    url: 'https://navbar.gallery',
    category: 'Components & CTAs',
    superpower: 'Navigation bars that look top-tier',
    description: 'Hand-picked directory of slick, responsive, floating, and glassmorphic navbar components with fluid mobile drawer interactions.',
    tags: ['Navbars', 'Floating Menus', 'Header UI'],
    color: '#10b981',
    accentBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    badge: 'Navbars'
  },
  {
    id: 'footer-design',
    name: 'Footer Design',
    url: 'https://footer.design',
    category: 'Components & CTAs',
    superpower: 'Footer styles & footers that don\'t embarrass you',
    description: 'Curated archive of elegant footer layouts, multi-column sitemaps, copyright treatments, newsletter capture forms, and closing stages.',
    tags: ['Footers', 'Sitemaps', 'Bottom Stages'],
    color: '#94a3b8',
    accentBg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    badge: 'Footers'
  },
  {
    id: 'cta-gallery',
    name: 'CTA Gallery',
    url: 'https://cta.gallery',
    category: 'Components & CTAs',
    superpower: 'Inspiration for buttons and calls to action',
    description: 'High-converting click triggers, glowing CTA banners, button hover micro-interactions, magnetic pulls, and action-oriented micro-copy.',
    tags: ['Buttons', 'Conversion CTAs', 'Click Triggers'],
    color: '#f43f5e',
    accentBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    badge: 'CTAs & Buttons'
  },
  {
    id: 'collectui',
    name: 'Collect UI',
    url: 'https://collectui.com',
    category: 'Components & CTAs',
    superpower: 'All design resources & daily UI components',
    description: 'Comprehensive daily archive of vetted user interface patterns, checkout flows, modals, navigation elements, inputs, and layout components inspired by real products and top Dribbble concepts.',
    tags: ['Daily UI', 'Component Library', 'All Design Resources'],
    color: '#ec4899',
    accentBg: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    badge: 'All UI Resources'
  },
  {
    id: 'styles-refero',
    name: 'Styles by Refero',
    url: 'https://styles.refero.design',
    category: 'Product & Design Systems',
    superpower: 'Real product styles and design systems',
    description: 'Explore authentic design systems, typography hierarchies, component states, and color palettes from vetted modern digital products.',
    tags: ['Design Systems', 'Real Products', 'Component States'],
    color: '#3b82f6',
    accentBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    badge: 'Design Systems'
  },
  {
    id: 'glass-samasante',
    name: 'Glass by Sam Asante',
    url: 'https://glass.samasante.com',
    category: '3D & Motion',
    superpower: 'Glass components and effects',
    description: 'Hyper-realistic frosted glass, chromatic aberration, specular highlights, border glows, and sophisticated CSS backdrop filters with instant code.',
    tags: ['Glassmorphism', 'Backdrop Blur', 'Specular Shaders'],
    color: '#0ea5e9',
    accentBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    badge: 'Glass Shaders'
  },
  {
    id: '3dicons',
    name: '3dicons',
    url: 'https://3dicons.co',
    category: '3D & Motion',
    superpower: '3D icons for interfaces',
    description: 'Open-source library of beautifully rendered, customizable 3D icons, meshes, and clay renders across multiple camera angles and colorways.',
    tags: ['3D Icons', 'Open Source Assets', 'Clay Renders'],
    color: '#d946ef',
    accentBg: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30',
    badge: '3D Assets'
  },
  {
    id: 'land-book',
    name: 'Land-book',
    url: 'https://land-book.com',
    category: 'Landing & Heroes',
    superpower: 'Landing page inspo done right',
    description: 'Hand-curated gallery of high-converting, aesthetically crafted landing pages, portfolios, blogs, and marketing sites with design breakdowns.',
    tags: ['Landing Pages', 'Conversion UX', 'Portfolios'],
    color: '#8b5cf6',
    accentBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    badge: 'Landing Pages'
  },
  {
    id: 'recent-design',
    name: 'Recent Design',
    url: 'https://recent.design',
    category: 'Product & Design Systems',
    superpower: 'Cool gallery for web design inspo',
    description: 'Daily updated archive of cutting-edge creative agency work, brutalist experiments, editorial layouts, and high-tech product launches.',
    tags: ['Modern UI', 'Agency Work', 'Daily Inspo'],
    color: '#14b8a6',
    accentBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    badge: 'Agency Inspo'
  },
  {
    id: 'inspora',
    name: 'Inspora Design',
    url: 'https://inspora.design',
    category: 'Product & Design Systems',
    superpower: 'New designs & fresh creative direction',
    description: 'Curated gallery of freshly dropped digital experiences, boundary-pushing art direction, next-generation landing layouts, and trendsetting web aesthetics updated continuously.',
    tags: ['New Designs', 'Fresh Inspo', 'Creative Direction'],
    color: '#06b6d4',
    accentBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    badge: 'New Designs'
  },
  {
    id: 'landdding',
    name: 'Landdding',
    url: 'https://landdding.com',
    category: 'Landing & Heroes',
    superpower: 'Landing page design & top notch landings',
    description: 'Carefully selected showcase highlighting grid layouts, conversion anatomy, section transitions, and responsive SaaS landing engineering.',
    tags: ['Top Landings', 'SaaS Anatomy', 'Responsive UI'],
    color: '#6366f1',
    accentBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    badge: 'Top Landings'
  },
  {
    id: 'fontinlogo',
    name: 'FontInLogo',
    url: 'https://fontinlogo.com',
    category: 'Typography & Branding',
    superpower: 'Fonts behind brands',
    description: 'Reverse-lookup engine uncovering the exact typography, weights, and typefaces behind famous brand identities and digital companies.',
    tags: ['Typography', 'Brand Identity', 'Font Finder'],
    color: '#eab308',
    accentBg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    badge: 'Brand Fonts'
  },
  {
    id: 'godly',
    name: 'Godly',
    url: 'https://godly.website',
    category: 'Product & Design Systems',
    superpower: 'Award websites and astronomical digital design',
    description: 'Elite, award-level websites featuring groundbreaking WebGL, 3D Canvas, kinetic shaders, and micro-interactions with live video previews.',
    tags: ['Award Winning', 'WebGL & Canvas', 'Luxury Web'],
    color: '#facc15',
    accentBg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    badge: 'Award Winning'
  },
  {
    id: '60fps',
    name: '60fps Design',
    url: 'https://60fps.design',
    category: '3D & Motion',
    superpower: 'Mobile UI animations and 60 FPS gestures',
    description: 'Interactive video library dissecting smooth 60 FPS mobile transitions, fluid gestures, sheet drawers, and spring dampening physics.',
    tags: ['60 FPS Motion', 'Mobile Gestures', 'Spring Physics'],
    color: '#22d3ee',
    accentBg: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
    badge: '60 FPS Motion'
  }
];

export const IN_STACK_LIBRARIES = [
  { name: 'React Bits', url: 'https://reactbits.dev', role: 'Animated components: Decrypted Text, Shiny Text, Magnet, Spotlight Cards' },
  { name: 'Planes Components', url: 'https://useplanes.com/components', role: 'Spring physics, layout morphing, and kinetic state transitions' },
  { name: 'Aceternity UI', url: 'https://ui.aceternity.com', role: 'Tailwind + Framer Motion components (Lamp glow, 3D tilt, tracing beam)' },
  { name: 'Magic UI', url: 'https://magicui.design', role: '50+ animated building blocks designed for design engineers' },
  { name: '21st.dev', url: 'https://21st.dev', role: 'Open-source component registry for design engineers with instant copy-paste' },
  { name: 'Uiverse', url: 'https://uiverse.io', role: '3,000+ community CSS and Tailwind elements (buttons, toggles, loaders)' }
];

export default function UiVaultTab({ onToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = useMemo(() => {
    return ['All', '3D & Motion', 'Landing & Heroes', 'Components & CTAs', 'Product & Design Systems', 'Typography & Branding'];
  }, []);

  const filteredSites = useMemo(() => {
    return UI_INSPIRATION_SITES.filter((site) => {
      const matchesCategory = selectedCategory === 'All' || site.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        site.name.toLowerCase().includes(q) ||
        site.url.toLowerCase().includes(q) ||
        site.superpower.toLowerCase().includes(q) ||
        site.description.toLowerCase().includes(q) ||
        site.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const copyUrl = (site) => {
    try {
      navigator.clipboard.writeText(site.url);
      setCopiedId(site.id);
      if (onToast) onToast(`Copied ${site.name} URL to clipboard!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      if (onToast) onToast(`Could not copy link`, 'error');
    }
  };

  const copyAllPrompt = () => {
    const promptText = `Reference these ${UI_INSPIRATION_SITES.length} premier UI & Web Design platforms when building high-end components, landing pages, and interactive experiences:\n\n` +
      UI_INSPIRATION_SITES.map((s, idx) => `${idx + 1}. ${s.name} (${s.url})\n   • Superpower: ${s.superpower}\n   • Details: ${s.description}\n`).join('\n');
    try {
      navigator.clipboard.writeText(promptText);
      if (onToast) onToast(`Copied full ${UI_INSPIRATION_SITES.length}-site design prompt to clipboard!`);
    } catch {
      if (onToast) onToast('Could not copy prompt', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER HERO BANNER ================= */}
      <SpotlightCard
        className="p-6 sm:p-8 rounded-3xl border border-white/[0.12] bg-[#0c0d16]/90 relative overflow-hidden"
        spotlightColor="rgba(168, 85, 247, 0.22)"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>UI & Inspo Vault • {UI_INSPIRATION_SITES.length} Curated Platforms</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Live Design Engineering Directory
              </span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Design Resources for Next-Level Web & Mobile Interfaces
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Every curated inspiration site, 3D prompt library, glassmorphism shader, navbar collection, and hero archive you provided — organized into an instant-access design studio.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={copyAllPrompt}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.12] text-xs font-mono font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
              title="Copy structured design prompt for Claude, Gemini, or ChatGPT"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Copy Full AI Prompt</span>
            </button>

            <a
              href="https://github.com/youngtoaster/unnoticed-website/blob/main/UI_SITES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl theme-primary-btn font-black text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View UI_SITES.md</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ================= CONTROLS: SEARCH & CATEGORIES ================= */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, prompt type, 3D, navbar, hero, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400/60 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Counter */}
          <div className="text-xs font-mono text-slate-400 shrink-0">
            Showing <strong className="text-purple-300 font-bold">{filteredSites.length}</strong> of {UI_INSPIRATION_SITES.length} platforms
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = cat === 'All' ? UI_INSPIRATION_SITES.length : UI_INSPIRATION_SITES.filter(s => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-400/50 shadow-sm shadow-purple-600/20 font-bold'
                    : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-purple-400/20 text-purple-200' : 'bg-white/[0.06] text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </SpotlightCard>

      {/* ================= SITES GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <AnimatePresence>
          {filteredSites.map((site, index) => {
            const isCopied = copiedId === site.id;
            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <SpotlightCard
                  className="p-5 sm:p-6 rounded-2xl border border-white/[0.1] bg-[#0a0b12]/90 hover:border-white/[0.22] transition-all flex flex-col justify-between h-full group"
                  spotlightColor="rgba(168, 85, 247, 0.16)"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Badge & Category */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.8 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${site.accentBg}`}>
                        {site.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Site Title & URL */}
                    <div>
                      <h3 className="font-display font-black text-lg text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                        <span>{site.name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </h3>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all"
                      >
                        {site.url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>

                    {/* Superpower Headline */}
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-semibold text-slate-200 leading-snug">
                      "{site.superpower}"
                    </div>

                    {/* Detailed Description */}
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed line-clamp-3">
                      {site.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {site.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-2">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl theme-primary-btn font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md text-center"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => copyUrl(site)}
                      className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center shrink-0 ${
                        isCopied
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border-white/[0.08]'
                      }`}
                      title="Copy URL to clipboard"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSites.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#0a0b12] border border-white/[0.08] space-y-3">
          <p className="text-sm font-mono text-slate-400">No design platforms match "{searchQuery}"</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-xl theme-primary-btn font-black text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ================= COMPANION COMPONENT LIBRARIES ================= */}
      <SpotlightCard
        className="p-6 sm:p-7 rounded-3xl border border-white/[0.1] bg-[#0c0d16]/80 mt-8 space-y-4"
        spotlightColor="rgba(6, 182, 212, 0.16)"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>In-Stack Animated Component Libraries</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              The frontend frameworks and component registries integrated directly into this repository
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            6 Core Libraries
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {IN_STACK_LIBRARIES.map((lib) => (
            <a
              key={lib.name}
              href={lib.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                    {lib.name}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-400 font-light line-clamp-2">
                  {lib.role}
                </p>
              </div>
              <span className="text-[9px] font-mono text-cyan-400/80 pt-2 block">
                {lib.url.replace(/^https?:\/\//, '')}
              </span>
            </a>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
