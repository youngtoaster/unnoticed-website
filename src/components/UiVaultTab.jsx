import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, ExternalLink, Copy, Check, Search, Sparkles, Box, Layout, MousePointer,
  Layers, Palette, Type, Code2, Globe, Bookmark, ArrowUpRight, CheckCircle2,
  Terminal, Zap, Shield, Database, Wrench, RefreshCw, Cpu, Clock, ChevronRight,
  Sliders, FileCode, CheckSquare
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';

// ============================================================================
// 1. INSTALLED AI SKILLS & PLUGINS CATALOG (Active In Workspace & Global System)
// ============================================================================
export const INSTALLED_SKILLS_AND_PLUGINS = [
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    author: 'Anthropic Official',
    version: 'v1.0.0 (Global & Workspace)',
    category: 'Design & Styling',
    type: 'AI Design Engine',
    status: 'Active & Installed',
    highlight: '185,000★ • 760,000+ Installs',
    triggerCommand: '/frontend-design',
    color: '#ec4899',
    accentBg: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    badge: 'Anti-AI Slop Design',
    tagline: 'Forces the AI model to commit to a bold aesthetic direction BEFORE writing a single line of code.',
    description: 'Bans generic AI slop at the root (no default Inter-only typography, no repetitive purple gradients, no cookie-cutter landing pages). Delivers production-ready HTML, CSS, React, or Vue across brutalist, editorial, retro-futurist, luxury minimal, or organic design systems with cohesive CSS variable token systems.',
    capabilities: [
      'Commits to a distinctive aesthetic direction before coding (Brutalist, Editorial, Retro-Futurist, Luxury, Minimal, Organic)',
      'Eliminates AI design tropes (no generic purple gradients, no cookie-cutter card grids)',
      'Enforces strict typographic hierarchy and CSS variable token systems',
      'Generates production-ready React, Tailwind, and CSS kinetic animations',
      'Maintains design integrity across all component states and responsive viewports'
    ],
    howToUse: [
      'Trigger in chat using /frontend-design or state your aesthetic direction directly.',
      'Specify your design brief (e.g. "Build an editorial music release countdown with oversized serif numbers").',
      'The agent establishes color tokens, typographic scales, and layout structure first.',
      'The agent delivers clean, production-grade components adhering strictly to the aesthetic.'
    ],
    examplePrompts: [
      {
        title: 'Editorial Music Release Countdown',
        prompt: 'Design an editorial music release countdown with oversized serif numeral counters, stark black-and-white contrast, hairline borders, and subtle vinyl groove textures using Frontend Design principles.'
      },
      {
        title: 'Cyber-Noir Audio Spectrum Visualizer',
        prompt: 'Build a cyber-noir audio spectrum visualizer in React with neon phosphor green accents, CRT scanline overlays, monospace frequency labels, and tactile toggle switches.'
      },
      {
        title: 'Brutalist Merch Showcase Grid',
        prompt: 'Redesign the merchandise grid with heavy utilitarian borders, raw monospace price tags, high-contrast hover states, and zero generic padding.'
      }
    ]
  },
  {
    id: 'unslop',
    name: 'Unslop',
    author: 'Damir Sokolovsky',
    version: 'v1.0.0 (Curated)',
    category: 'Design & Styling',
    type: 'UI Polish Engine',
    status: 'Active & Installed',
    highlight: '9-Pass UI Audit Engine',
    triggerCommand: '/unslop',
    color: '#f59e0b',
    accentBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    badge: '9-Pass UI Audit',
    tagline: 'Turns vibecoded, AI-looking UI into an intentional interface with its own tactile character.',
    description: 'Executes a disciplined 9-pass redline audit on web and mobile screens: Spacing, Color, Icons, Copy, Type, Layout, Details, Visuals, and Motion. Strips out emoji-button badges, continuous pulsing battery drains, and marketing buzzwords to create bespoke production interfaces.',
    capabilities: [
      '9-pass systematic audit (Spacing, Color, Icons, Copy, Type, Layout, Details, Visuals, Motion)',
      'Removes AI clichés: purple gradient text, glowing blobs, "New ✨" badges, uppercase tracked labels',
      'Quiets mobile chrome and cleans up continuous pulsing animations that drain battery',
      'Enforces strict 8pt grid spacing rhythm and optical padding balance',
      'Replaces generic stock imagery with authentic product-driven art direction'
    ],
    howToUse: [
      'Ask the AI to "/unslop" or audit any component, view, or modal (e.g. "Unslop the mobile player drawer").',
      'The agent runs the 9-pass redline checklist against the existing UI code.',
      'Flags and removes vibecoded tropes (glows, pulsing pings, clichéd marketing buzzwords).',
      'Outputs refined, tactile code with tightened spacing, proper contrast, and solid micro-surfaces.'
    ],
    examplePrompts: [
      {
        title: 'Mobile Audio Player Unslop',
        prompt: 'Unslop the mobile audio player sheet: eliminate glowing purple blobs, replace emoji buttons with crisp Lucide icons, tighten the spacing rhythm, and remove continuous ping animations.'
      },
      {
        title: 'Full 9-Pass Redline Review',
        prompt: 'Run a 9-pass redline unslop on the navigation header and hero section: audit spacing, color tokens, typography scale, icon consistency, and copy voice.'
      },
      {
        title: 'Audit Admin Panel for AI Tropes',
        prompt: 'Audit the admin panel UI for vibecoded AI tropes: fix optical padding balance, ensure high-contrast button labels (#08090e on white), and eliminate redundant uppercase badges.'
      }
    ]
  },
  {
    id: 'supabase',
    name: 'Supabase & Postgres Engine',
    author: 'Supabase & Postgres Team',
    version: 'v2.0 (Connected: unnoticed-website)',
    category: 'Database & Backend',
    type: 'Cloud Database & MCP',
    status: 'Connected & Live',
    highlight: 'ftinvmrjijnncwzkvgcn.supabase.co',
    triggerCommand: 'Supabase MCP',
    color: '#10b981',
    accentBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    badge: 'Cloud Postgres & Sync',
    tagline: 'Persistent cloud Postgres database, real-time sync across all devices, and RLS security enforcement.',
    description: 'Provides enterprise-grade database tools directly to the agent: execute SQL queries, inspect table schemas, run declarative migrations, audit Row Level Security (RLS) policies, query ClickHouse log streams, and manage Edge Functions for cross-platform state persistence.',
    capabilities: [
      'Real-time multi-platform sync between web, mobile, and admin panels',
      'Direct SQL execution, schema inspections, and automatic TypeScript type generation',
      'Row Level Security (RLS) policies auditing and verification',
      'Declarative database migrations and schema version control',
      'Postgres query plan analysis (EXPLAIN) and index tuning'
    ],
    howToUse: [
      'Ask the agent to query or mutate your database (e.g. "Sync all admin tracks to Supabase").',
      'The agent uses the Supabase MCP server (execute_sql, list_tables, apply_migration).',
      'Changes are instantly verified with RLS security policies.',
      'Web and mobile clients receive real-time updates via @supabase/supabase-js.'
    ],
    examplePrompts: [
      {
        title: 'Verify RLS Security Policies',
        prompt: 'Audit the Row Level Security (RLS) policies on public.site_data: confirm that public anonymous reads are enabled while mutations require service role or admin credentials.'
      },
      {
        title: 'Add New Cloud Data Table',
        prompt: 'Write and apply a Supabase SQL migration creating a new subscriber_leads table with uuid primary key, verified email constraint, and created_at timestamp.'
      },
      {
        title: 'Inspect Supabase Query Logs',
        prompt: 'Query the Postgres execution logs to check the response time and latency for site_data catalog reads.'
      }
    ]
  },
  {
    id: 'reverse-engineer-anything',
    name: 'Reverse Engineer Anything (REA)',
    author: 'REA Core / Antigravity',
    version: 'v2.4 (80+ Forensics Tools)',
    category: 'Reverse Engineering',
    type: 'Forensic Codebase Analysis',
    status: 'Active & Installed',
    highlight: '80+ Deep Forensics Tools',
    triggerCommand: 'REA MCP',
    color: '#06b6d4',
    accentBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    badge: 'Binary & Bundle Forensics',
    tagline: 'Deep forensic reverse engineering of production JavaScript bundles, sourcemaps, APIs, and compiled binaries.',
    description: 'Equipped with 80+ tools to inspect web bundles, recover lost sourcemaps, trace API call paths, analyze WebAssembly, decompile mobile packages, and capture browser network transactions without guessing.',
    capabilities: [
      'JavaScript bundle chunk analysis and sourcemap reconstruction',
      'API wire protocol inspection and network traffic analysis',
      'WebAssembly interface decompilation and export shape verification',
      'Android APK, iOS Mach-O, and native binary disassembly with Rizin/GDB',
      'Automated evidence bundle generation for architecture reconstruction'
    ],
    howToUse: [
      'Provide a compiled JS bundle, URL, sourcemap, or binary file for inspection.',
      'The agent activates REA MCP tools (analyze_web_bundle, recover_javascript_sources).',
      'Dissects the internal architecture, dependencies, and network call graphs.',
      'Delivers an exact reconstruction ledger with verified source mapping.'
    ],
    examplePrompts: [
      {
        title: 'Analyze Production JS Bundle',
        prompt: 'Analyze the production Vite build bundle chunks to identify large dependencies and recommend tree-shaking optimizations.'
      },
      {
        title: 'Recover Lost Component Sources',
        prompt: 'Use REA sourcemap recovery tools to reconstruct the original TypeScript component hierarchy from a deployed bundle.'
      },
      {
        title: 'Inspect Network API Contracts',
        prompt: 'Inspect the network payloads between the audio player client and streaming CDN to document the audio streaming headers.'
      }
    ]
  },
  {
    id: 'automation',
    name: 'Automation & Crons',
    author: 'Google DeepMind / Antigravity',
    version: 'v1.0 (Built-in Agentic)',
    category: 'Automation & Crons',
    type: 'Autonomous Job Engine',
    status: 'Active & Installed',
    highlight: 'Background Autonomous Jobs',
    triggerCommand: '/automation',
    color: '#8b5cf6',
    accentBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    badge: 'Scheduled Crons',
    tagline: 'Designs and executes automated recurring background agent jobs, crons, and one-shot timers.',
    description: 'Enables long-running autonomous workflows that wake up automatically on a schedule (e.g. every 15 minutes, every Monday at 9 AM, or after specific events). Powers recurring data backups, automated SEO checks, and live site health monitoring.',
    capabilities: [
      'Recurring cron jobs (5-field cron syntax: e.g. "0 9 * * 1" for Monday mornings)',
      'One-shot timers with conditional wakeups on task completion',
      'Zero-polling reactive wakeup architecture (saves CPU and token usage)',
      'Continuous autonomous background monitoring and notification alerts',
      'Scheduled database synchronization audits and catalog backups'
    ],
    howToUse: [
      'Request an automated workflow using /automation or /schedule.',
      'Specify the schedule (cron expression or interval) and actionable prompt.',
      'Antigravity registers the background daemon schedule.',
      'The agent wakes up automatically at the specified trigger, executes the task, and reports results.'
    ],
    examplePrompts: [
      {
        title: 'Daily Database Health Check',
        prompt: '/schedule Cron: "0 8 * * *" - Wake up every morning at 8 AM, verify Supabase database connectivity, check storage bucket health, and alert me if any tracks have broken audio URLs.'
      },
      {
        title: 'Hourly GitHub Release Sync',
        prompt: '/schedule Cron: "0 * * * *" - Wake up every hour to check GitHub commit logs for main, verify Vercel build status, and notify me on failures.'
      },
      {
        title: 'One-Shot Post-Deployment Verifier',
        prompt: 'Set a one-shot 10-minute timer to check the deployed live Vercel endpoint and verify that audio playback loads without CORS issues.'
      }
    ]
  },
  {
    id: 'generative_ui',
    name: 'Generative UI & Visual Canvases',
    author: 'Google DeepMind / Antigravity',
    version: 'v1.0 (Built-in Visuals)',
    category: 'Interactive UI',
    type: 'Interactive Visual Canvas',
    status: 'Active & Installed',
    highlight: 'Interactive Widgets & Canvases',
    triggerCommand: 'Generative UI',
    color: '#0ea5e9',
    accentBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    badge: 'Live Visual Canvases',
    tagline: 'Renders rich interactive HTML/React widgets, audio frequency spectrums, and dynamic visual canvases.',
    description: 'Moves beyond static text by generating interactive widgets inline in the chat or as live artifacts. Perfect for audio EQ visualizers, color theme testing benches, data flow diagrams, and complex parameter tuning.',
    capabilities: [
      'Live interactive HTML5/Canvas widgets with state controls',
      'Real-time audio frequency visualizers and animated waveforms',
      'KaTeX mathematical equations and DSP frequency filter graphs',
      'Dynamic parameter sliders for tuning glow intensity, physics spring tension, and colors',
      'Self-contained standalone visual artifacts with instant feedback'
    ],
    howToUse: [
      'Ask for a visual or interactive representation of data or styling controls.',
      'The agent authors a responsive interactive widget or artifact.',
      'Interact directly with sliders, toggles, and audio buttons in real time.',
      'Export or apply the tuned parameters directly back into your production codebase.'
    ],
    examplePrompts: [
      {
        title: 'Interactive Audio Frequency Spectrum',
        prompt: 'Render an interactive audio frequency visualizer widget with 10 draggable EQ sliders and a live Canvas waveform rendering 60 FPS sine waves.'
      },
      {
        title: 'Hero Neon Glow Physics Playground',
        prompt: 'Build an interactive Generative UI canvas that lets me tweak the neon shockwave vertices, glow blur radius, and border spread with live visual preview.'
      },
      {
        title: 'Data Flow State Machine Diagram',
        prompt: 'Generate an interactive diagram showing the data flow between Admin Dashboard, Local Storage, Supabase Postgres, and GitHub Backup.'
      }
    ]
  },
  {
    id: 'agy-customizations',
    name: 'Antigravity Customization Engine',
    author: 'Google DeepMind / Antigravity',
    version: 'v2.0 (Customizations Architecture)',
    category: 'Customizations',
    type: 'Architecture & Rules System',
    status: 'Active & Installed',
    highlight: 'Plugins, Rules, Hooks, Sidecars',
    triggerCommand: '/plugin',
    color: '#a855f7',
    accentBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    badge: 'System Architecture',
    tagline: 'Author, package, and orchestrate custom plugins, skills, hooks, and MCP servers across your workspace.',
    description: 'The blueprint for extending Antigravity: defines discovery roots, loading priority, rules, agent hooks, subagent definitions, and MCP sidecar architectures. Enables building repeatable agentic workflows tailored to your stack.',
    capabilities: [
      'Create modular plugins containing skills, rules, hooks, and MCP servers',
      'Define custom specialized subagents with tailored system prompts and tools',
      'Configure workspace and global rules with strict enforcement boundaries',
      'Register slash commands and event-driven hooks (pre-commit, post-build)',
      'Package standalone extensions with semantic versioning and discovery manifests'
    ],
    howToUse: [
      'Request a new skill, rule, or plugin using /plugin or description.',
      'The agent structures the plugin.json or SKILL.md manifest with frontmatter.',
      'Installs and registers the customization into global or workspace scope.',
      'Custom tools and rules immediately become available in all future sessions.'
    ],
    examplePrompts: [
      {
        title: 'Create an Audio Mastering Skill',
        prompt: 'Author a new custom skill for audio mastering validation: check audio file bitrates, detect clipping, and verify ID3 tags before upload.'
      },
      {
        title: 'Define Pre-Commit Quality Hook',
        prompt: 'Configure an Antigravity agent rule that automatically runs oxlint and vite build before committing any code changes to Git.'
      },
      {
        title: 'Package a Full Stack Plugin',
        prompt: 'Bundle our Supabase sync logic, unslop mobile rules, and audio player helpers into a reusable plugin package.'
      }
    ]
  }
];

// ============================================================================
// 2. CURATED UI INSPIRATION SITES (External Design Engineering Directories)
// ============================================================================
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

// ============================================================================
// 3. IN-STACK ANIMATED COMPONENT LIBRARIES
// ============================================================================
export const IN_STACK_LIBRARIES = [
  { name: 'React Bits', url: 'https://reactbits.dev', role: 'Animated components: Decrypted Text, Shiny Text, Magnet, Spotlight Cards' },
  { name: 'Planes Components', url: 'https://useplanes.com/components', role: 'Spring physics, layout morphing, and kinetic state transitions' },
  { name: 'Aceternity UI', url: 'https://ui.aceternity.com', role: 'Tailwind + Framer Motion components (Lamp glow, 3D tilt, tracing beam)' },
  { name: 'Magic UI', url: 'https://magicui.design', role: '50+ animated building blocks designed for design engineers' },
  { name: '21st.dev', url: 'https://21st.dev', role: 'Open-source component registry for design engineers with instant copy-paste' },
  { name: 'Uiverse', url: 'https://uiverse.io', role: '3,000+ community CSS and Tailwind elements (buttons, toggles, loaders)' }
];

export default function UiVaultTab({ onToast }) {
  // Navigation View: 'skills' | 'sites' | 'libraries'
  const [activeView, setActiveView] = useState('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedPromptId, setCopiedPromptId] = useState(null);

  // Skill Categories
  const skillCategories = useMemo(() => [
    'All',
    'Design & Styling',
    'Database & Backend',
    'Reverse Engineering',
    'Automation & Crons',
    'Interactive UI',
    'Customizations'
  ], []);

  // Site Categories
  const siteCategories = useMemo(() => [
    'All',
    '3D & Motion',
    'Landing & Heroes',
    'Components & CTAs',
    'Product & Design Systems',
    'Typography & Branding'
  ], []);

  // Filtered Skills
  const filteredSkills = useMemo(() => {
    return INSTALLED_SKILLS_AND_PLUGINS.filter((skill) => {
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(q) ||
        skill.triggerCommand.toLowerCase().includes(q) ||
        skill.author.toLowerCase().includes(q) ||
        skill.tagline.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.capabilities.some((c) => c.toLowerCase().includes(q)) ||
        skill.howToUse.some((h) => h.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Filtered Sites
  const filteredSites = useMemo(() => {
    return UI_INSPIRATION_SITES.filter((site) => {
      const matchesCategory = selectedCategory === 'All' || site.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesSearch =
        site.name.toLowerCase().includes(q) ||
        site.url.toLowerCase().includes(q) ||
        site.superpower.toLowerCase().includes(q) ||
        site.description.toLowerCase().includes(q) ||
        site.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Copy site URL
  const copyUrl = (site) => {
    try {
      navigator.clipboard.writeText(site.url);
      setCopiedId(site.id);
      if (onToast) onToast(`Copied ${site.name} URL to clipboard!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      if (onToast) onToast('Could not copy link', 'error');
    }
  };

  // Copy trigger command
  const copyTriggerCommand = (command, name) => {
    try {
      navigator.clipboard.writeText(command);
      setCopiedId(command);
      if (onToast) onToast(`Copied ${name} trigger command: "${command}"`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      if (onToast) onToast('Could not copy command', 'error');
    }
  };

  // Copy prompt template
  const copyPromptTemplate = (prompt, id) => {
    try {
      navigator.clipboard.writeText(prompt);
      setCopiedPromptId(id);
      if (onToast) onToast('Copied ready-to-use prompt to clipboard!');
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch {
      if (onToast) onToast('Could not copy prompt', 'error');
    }
  };

  // Copy all skills reference prompt
  const copyAllSkillsPrompt = () => {
    const promptText = `Reference these ${INSTALLED_SKILLS_AND_PLUGINS.length} installed skills and plugins when building, engineering, and auditing our web applications:\n\n` +
      INSTALLED_SKILLS_AND_PLUGINS.map((s, idx) => {
        return `${idx + 1}. ${s.name} (${s.triggerCommand}) - ${s.badge} by ${s.author}\n` +
          `   • Tagline: ${s.tagline}\n` +
          `   • Capabilities:\n` +
          s.capabilities.map((c) => `     - ${c}`).join('\n') + '\n' +
          `   • How to Use:\n` +
          s.howToUse.map((h) => `     ${h}`).join('\n') + '\n';
      }).join('\n');
    try {
      navigator.clipboard.writeText(promptText);
      if (onToast) onToast(`Copied all ${INSTALLED_SKILLS_AND_PLUGINS.length} installed skills guide to clipboard!`);
    } catch {
      if (onToast) onToast('Could not copy prompt', 'error');
    }
  };

  // Copy all sites prompt
  const copyAllSitesPrompt = () => {
    const promptText = `Reference these ${UI_INSPIRATION_SITES.length} premier UI & Web Design platforms when building high-end components, landing pages, and interactive experiences:\n\n` +
      UI_INSPIRATION_SITES.map((s, idx) => `${idx + 1}. ${s.name} (${s.url})\n   • Superpower: ${s.superpower}\n   • Details: ${s.description}\n`).join('\n');
    try {
      navigator.clipboard.writeText(promptText);
      if (onToast) onToast(`Copied full ${UI_INSPIRATION_SITES.length}-site design prompt to clipboard!`);
    } catch {
      if (onToast) onToast('Could not copy prompt', 'error');
    }
  };

  const handleTabChange = (view) => {
    setActiveView(view);
    setSelectedCategory('All');
    setSearchQuery('');
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Engine & Inspo Vault • {INSTALLED_SKILLS_AND_PLUGINS.length + UI_INSPIRATION_SITES.length} Total Resources</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {INSTALLED_SKILLS_AND_PLUGINS.length} AI Skills Live
              </span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              AI Skills, Design Plugins & Frontend Engineering Vault
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Complete command center for all installed AI design skills, 9-pass unslop engines, cloud databases, and reverse engineering tools — paired with your curated directory of 17 premier design inspiration sites.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {activeView === 'skills' ? (
              <button
                onClick={copyAllSkillsPrompt}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.12] text-xs font-mono font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
                title="Copy all skills guide and prompt cheat sheet"
              >
                <Copy className="w-3.5 h-3.5 text-purple-400" />
                <span>Copy Skills Guide Prompt</span>
              </button>
            ) : (
              <button
                onClick={copyAllSitesPrompt}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.12] text-xs font-mono font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
                title="Copy structured design prompt for Claude, Gemini, or ChatGPT"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy 17-Site Prompt</span>
              </button>
            )}

            <a
              href="https://github.com/youngtoaster/unnoticed-website/blob/main/UI_SITES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl theme-primary-btn font-black text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>UI_SITES.md</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ================= TOP-LEVEL SEGMENTED NAVIGATION ================= */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleTabChange('skills')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
              activeView === 'skills'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/60'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            <Zap className="w-4 h-4 text-purple-300" />
            <span>Installed Skills & Plugins ({INSTALLED_SKILLS_AND_PLUGINS.length})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5" />
          </button>

          <button
            onClick={() => handleTabChange('sites')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
              activeView === 'sites'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/60'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>UI Inspiration Sites ({UI_INSPIRATION_SITES.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('libraries')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
              activeView === 'libraries'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/60'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-300" />
            <span>In-Stack Animated Libraries ({IN_STACK_LIBRARIES.length})</span>
          </button>
        </div>

        {/* ================= SEARCH & CATEGORY CONTROLS ================= */}
        {activeView !== 'libraries' && (
          <>
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeView === 'skills'
                      ? 'Search skills by name, /command, capabilities, or author...'
                      : 'Search sites by name, prompt type, 3D, navbar, hero, or tag...'
                  }
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
                Showing{' '}
                <strong className="text-purple-300 font-bold">
                  {activeView === 'skills' ? filteredSkills.length : filteredSites.length}
                </strong>{' '}
                of {activeView === 'skills' ? INSTALLED_SKILLS_AND_PLUGINS.length : UI_INSPIRATION_SITES.length}{' '}
                {activeView === 'skills' ? 'skills & plugins' : 'design platforms'}
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(activeView === 'skills' ? skillCategories : siteCategories).map((cat) => {
                const isActive = selectedCategory === cat;
                const count = activeView === 'skills'
                  ? (cat === 'All' ? INSTALLED_SKILLS_AND_PLUGINS.length : INSTALLED_SKILLS_AND_PLUGINS.filter((s) => s.category === cat).length)
                  : (cat === 'All' ? UI_INSPIRATION_SITES.length : UI_INSPIRATION_SITES.filter((s) => s.category === cat).length);

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
          </>
        )}
      </SpotlightCard>

      {/* ====================================================================== */}
      {/* VIEW 1: INSTALLED SKILLS & PLUGINS SHOWCASE                           */}
      {/* ====================================================================== */}
      {activeView === 'skills' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredSkills.map((skill, index) => {
                const isCmdCopied = copiedId === skill.triggerCommand;
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    <SpotlightCard
                      className="p-6 sm:p-7 rounded-3xl border border-white/[0.12] bg-[#0a0b14]/90 hover:border-white/[0.22] transition-all flex flex-col justify-between space-y-6 group"
                      spotlightColor="rgba(168, 85, 247, 0.18)"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${skill.accentBg}`}>
                              {skill.badge}
                            </span>
                            <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                              {skill.type}
                            </span>
                            <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {skill.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-baseline gap-3 pt-1">
                            <h3 className="font-display font-black text-xl sm:text-2xl text-white group-hover:text-purple-300 transition-colors">
                              {skill.name}
                            </h3>
                            <span className="text-xs font-mono text-slate-400">
                              by {skill.author} • {skill.version}
                            </span>
                          </div>
                        </div>

                        {/* Trigger Command Badge with Copy Button */}
                        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                          <button
                            onClick={() => copyTriggerCommand(skill.triggerCommand, skill.name)}
                            className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm group/btn"
                            title="Click to copy trigger command"
                          >
                            <Terminal className="w-3.5 h-3.5 text-purple-400 group-hover/btn:rotate-12 transition-transform" />
                            <span>{skill.triggerCommand}</span>
                            {isCmdCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-purple-300 opacity-60 group-hover/btn:opacity-100 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Tagline & Deep Description */}
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-slate-200 leading-snug flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>"{skill.tagline}"</span>
                        </div>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      {/* Two-Column Grid: Capabilities & How-To-Use */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                        {/* Capabilities */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Core Capabilities</span>
                          </h4>
                          <ul className="space-y-2">
                            {skill.capabilities.map((cap, i) => (
                              <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{cap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Step-by-Step How to Use */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-3">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5 text-purple-400" />
                            <span>How to Use in Conversation</span>
                          </h4>
                          <div className="space-y-2">
                            {skill.howToUse.map((step, i) => (
                              <div key={i} className="text-[11px] text-slate-300 flex items-start gap-2.5 leading-relaxed">
                                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span>{step.replace(/^\d+\.\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Ready-to-Use Copyable Prompt Templates */}
                      <div className="pt-2 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <FileCode className="w-3.5 h-3.5 text-amber-400" />
                            <span>One-Click Prompt Templates</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">Click card to copy prompt</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {skill.examplePrompts.map((template, tIdx) => {
                            const pId = `${skill.id}-${tIdx}`;
                            const isPromptCopied = copiedPromptId === pId;
                            return (
                              <div
                                key={tIdx}
                                onClick={() => copyPromptTemplate(template.prompt, pId)}
                                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-400/40 transition-all cursor-pointer group/prompt flex flex-col justify-between space-y-2"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-white group-hover/prompt:text-purple-300 transition-colors">
                                      {template.title}
                                    </span>
                                    {isPromptCopied ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-slate-500 group-hover/prompt:text-purple-300 shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-light leading-snug line-clamp-3">
                                    "{template.prompt}"
                                  </p>
                                </div>
                                <span className="text-[9px] font-mono text-purple-400/80 pt-1 block group-hover/prompt:text-purple-300">
                                  {isPromptCopied ? '✓ Copied to Clipboard!' : 'Click to Copy Prompt →'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredSkills.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-[#0a0b12] border border-white/[0.08] space-y-3">
              <p className="text-sm font-mono text-slate-400">No installed skills or plugins match "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 rounded-xl theme-primary-btn font-black text-xs cursor-pointer"
              >
                Reset Skill Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* VIEW 2: CURATED UI INSPIRATION SITES DIRECTORY                         */}
      {/* ====================================================================== */}
      {activeView === 'sites' && (
        <div className="space-y-8">
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

          {/* In-Stack Libraries Preview at bottom of Sites */}
          <SpotlightCard
            className="p-6 sm:p-7 rounded-3xl border border-white/[0.1] bg-[#0c0d16]/80 space-y-4"
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
              <button
                onClick={() => handleTabChange('libraries')}
                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 cursor-pointer transition-colors"
              >
                View Full Details →
              </button>
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
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
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
      )}

      {/* ====================================================================== */}
      {/* VIEW 3: IN-STACK ANIMATED COMPONENT LIBRARIES DEDICATED VIEW           */}
      {/* ====================================================================== */}
      {activeView === 'libraries' && (
        <SpotlightCard
          className="p-6 sm:p-8 rounded-3xl border border-white/[0.12] bg-[#0c0d16]/90 space-y-6"
          spotlightColor="rgba(6, 182, 212, 0.18)"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Direct Code Registries
                </span>
                <span className="text-xs font-mono text-slate-400">Integrated into Vite & Tailwind</span>
              </div>
              <h3 className="font-display font-black text-2xl text-white">
                In-Stack Animated Component Libraries
              </h3>
              <p className="text-xs text-slate-300 font-light">
                The motion primitives, shaders, and layout registries that power the animations across this artist website.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {IN_STACK_LIBRARIES.map((lib, i) => (
              <a
                key={lib.name}
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-black/40 hover:bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {lib.name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {lib.role}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400">
                    {lib.url.replace(/^https?:\/\//, '')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Registry #{i + 1}</span>
                </div>
              </a>
            ))}
          </div>
        </SpotlightCard>
      )}
    </div>
  );
}
