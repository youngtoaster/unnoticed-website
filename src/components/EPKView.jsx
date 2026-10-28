import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Mail, ArrowLeft, CheckCircle2, Shield, Radio, Sparkles, Send, ExternalLink, Sliders, Music, Phone } from 'lucide-react';
import { EPK_DATA, ARTIST_INFO } from '../data/artistData';
import SpotlightCard from './SpotlightCard';

export default function EPKView({ onBackToMain }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    inquiryType: 'Booking & Festival Date',
    budget: '$5,000 - $15,000',
    message: ''
  });

  const handleDownload = (assetName) => {
    setDownloadSuccess(assetName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-32 px-4 sm:px-6 max-w-7xl mx-auto text-left">
      
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-10 w-[600px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-12 border-b border-white/[0.08] gap-4">
        <button
          onClick={onBackToMain}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 border border-white/[0.1] transition-all self-start cursor-pointer hover:border-purple-400"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Experience</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            OFFICIAL ELECTRONIC PRESS KIT (EPK)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Version 2026.2
          </span>
        </div>
      </div>

      {/* Asset Download Toast */}
      <AnimatePresence>
        {downloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-cyan-600 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Download package prepared: "{downloadSuccess}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* EPK Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
        <div className="lg:col-span-8">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">
            Industry Profile & Press Archive
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mb-4">
            UNNOTICED
          </h1>
          <p className="text-lg text-purple-300 font-tech font-semibold mb-6">
            Formerly Ty Sciullo • Alternative Hip-Hop / Nocturnal Rap • McKees Rocks, PA
          </p>
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl font-light">
            {EPK_DATA.shortBio}
          </p>
        </div>

        {/* Quick Stats Bento */}
        <div className="lg:col-span-4">
          <SpotlightCard className="p-6" spotlightColor="rgba(6, 182, 212, 0.2)">
            <h4 className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-4">
              Key Metrics & Streaming Reach
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2">
                <span className="text-xs text-slate-400">Monthly Listeners</span>
                <span className="font-display font-bold text-lg text-white">{ARTIST_INFO.stats.monthlyListeners}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2">
                <span className="text-xs text-slate-400">Total Catalog Streams</span>
                <span className="font-display font-bold text-lg text-white">{ARTIST_INFO.stats.totalStreams}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2">
                <span className="text-xs text-slate-400">Primary Audience</span>
                <span className="font-mono text-xs text-cyan-300">18–34 Age Cohort</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Key Live Markets</span>
                <span className="font-mono text-xs text-slate-200">Pittsburgh, NYC, Chicago</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* SECTION 1: DOWNLOADABLE HIGH-RES MEDIA ASSETS */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" /> Downloadable High-Res Media Assets
          </h3>
          <span className="text-xs font-mono text-slate-400">Press & Promoters Kit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {EPK_DATA.downloadableAssets.map((asset, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(6, 182, 212, 0.16)"
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold">
                    ZIP
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{asset.size}</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{asset.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{asset.desc}</p>
              </div>

              <button
                onClick={() => handleDownload(asset.name)}
                className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* SECTION 2: PRESS COVERAGE & PULL QUOTES */}
      <div className="mb-16">
        <h3 className="font-display text-2xl font-bold text-white mb-6">
          Critical Acclaim & Press Quotes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EPK_DATA.pressQuotes.map((item, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(168, 85, 247, 0.16)"
              className="p-6 flex flex-col justify-between"
            >
              <div className="mb-4">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block mb-2">
                  {item.outlet} • {item.year}
                </span>
                <p className="text-sm text-slate-200 italic font-serif leading-relaxed">
                  "{item.quote}"
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <span>Verified Coverage</span> ● <span>Editorial Review</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* SECTION 3: TECHNICAL RIDER & STAGE PLOT */}
      <div className="mb-16">
        <SpotlightCard className="p-8" spotlightColor="rgba(6, 182, 212, 0.15)">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" /> Technical Rider & Stage Specifications
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Audio engineering requirements for concert halls, festival stages, and club venues.
              </p>
            </div>
            <button
              onClick={() => handleDownload('Stage_Plot_Rider.pdf')}
              className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF Rider</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="font-mono text-cyan-400 font-bold block mb-1">Inputs & Vocal Setup</span>
              <p className="leading-relaxed">{EPK_DATA.techRider.inputCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="font-mono text-cyan-400 font-bold block mb-1">In-Ear Monitoring</span>
              <p className="leading-relaxed">{EPK_DATA.techRider.monitoring}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="font-mono text-cyan-400 font-bold block mb-1">Lighting Design Direction</span>
              <p className="leading-relaxed">{EPK_DATA.techRider.lighting}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="font-mono text-cyan-400 font-bold block mb-1">Stage Geometry</span>
              <p className="leading-relaxed">{EPK_DATA.techRider.stagePlot}</p>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* SECTION 4: INDUSTRY CONTACTS & DIRECT INQUIRY FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Contact Directory (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <SpotlightCard className="p-6 md:p-8" spotlightColor="rgba(168, 85, 247, 0.18)">
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              Industry Representation
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              For live bookings, festival lineups, synchronization licensing, and editorial interviews.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-purple-400 block">General Management</span>
                <a href={`mailto:${EPK_DATA.industryContacts.management}`} className="font-semibold text-white hover:text-purple-300">
                  {EPK_DATA.industryContacts.management}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-cyan-400 block">Live Booking Agency</span>
                <a href={`mailto:${EPK_DATA.industryContacts.booking}`} className="font-semibold text-white hover:text-cyan-300">
                  {EPK_DATA.industryContacts.booking}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-pink-400 block">Press & Media Relations</span>
                <a href={`mailto:${EPK_DATA.industryContacts.pressInquiries}`} className="font-semibold text-white hover:text-pink-300">
                  {EPK_DATA.industryContacts.pressInquiries}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-amber-400 block">Sync & Film/TV Licensing</span>
                <a href={`mailto:${EPK_DATA.industryContacts.syncLicensing}`} className="font-semibold text-white hover:text-amber-300">
                  {EPK_DATA.industryContacts.syncLicensing}
                </a>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right: Direct Industry Inquiry Form (7 Cols) */}
        <div className="lg:col-span-7">
          <SpotlightCard className="p-6 md:p-8" spotlightColor="rgba(6, 182, 212, 0.2)">
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Direct Booking & Media Inquiry
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Inquiries are routed directly to management and evaluated within 24-48 business hours.
            </p>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <h4 className="font-display text-2xl font-bold text-white mb-2">
                  Inquiry Dispatched Successfully
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-4">
                  Thank you, <strong className="text-cyan-300">{formData.name}</strong>. Your message regarding <strong className="text-white">{formData.inquiryType}</strong> has been assigned an internal routing ID. Management will contact you at <strong className="text-cyan-300">{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      name: '',
                      organization: '',
                      email: '',
                      inquiryType: 'Booking & Festival Date',
                      budget: '$5,000 - $15,000',
                      message: ''
                    });
                  }}
                  className="px-6 py-2 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Organization / Agency / Festival
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rolling Loud / Bowery Presents"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@agency.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0c0d15] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option>Booking & Festival Date</option>
                      <option>Club / Regional Tour Date</option>
                      <option>Press & Editorial Interview</option>
                      <option>Sync Licensing (Film / TV / Game)</option>
                      <option>Brand Collaboration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Estimated Budget Range (USD)
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0d15] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option>Under $5,000</option>
                    <option>$5,000 - $15,000</option>
                    <option>$15,000 - $35,000</option>
                    <option>$35,000+</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    Inquiry Details & Date Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide event date, venue capacity, co-headliners, or publication details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Official Industry Inquiry</span>
                </button>
              </form>
            )}
          </SpotlightCard>
        </div>

      </div>

    </div>
  );
}
