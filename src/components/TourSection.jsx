import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Ticket, ExternalLink, Sparkles, CheckCircle2, History, Bell, Navigation } from 'lucide-react';
import { TOUR_DATES, PAST_TOUR_HIGHLIGHTS } from '../data/artistData';
import SpotlightCard from './SpotlightCard';

export default function TourSection() {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [rsvpCity, setRsvpCity] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpCity || !rsvpEmail) return;
    setRsvpSubmitted(true);
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSubmitted(false);
      setRsvpCity('');
      setRsvpEmail('');
    }, 2200);
  };

  return (
    <section id="tour" className="relative py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Background ambient lighting */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
            <Ticket className="w-3.5 h-3.5" /> LIVE EXPERIENCES
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            TOUR DATES & STAGE SCHEDULE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Catch UNNOTICED live in intimate venues and iconic stages across North America.
          </p>
        </div>

        {/* Schedule Mode Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming Shows ({TOUR_DATES.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tour Archive
            </button>
          </div>

          <button
            onClick={() => setShowRsvpModal(true)}
            className="px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Request City</span>
          </button>
        </div>
      </div>

      {/* UPCOMING SHOWS SCHEDULE LIST */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {TOUR_DATES.map((show) => {
            const isHometown = show.city.includes('Pittsburgh');

            return (
              <SpotlightCard
                key={show.id}
                spotlightColor="rgba(6, 182, 212, 0.18)"
                tilt={false}
                className={`p-5 sm:p-6 transition-all ${
                  isHometown ? 'border-cyan-500/40 bg-cyan-950/15' : 'hover:border-white/[0.2]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Date Badge + City & Venue */}
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                    
                    {/* Big Date Capsule */}
                    <div className="flex flex-col items-center justify-center w-20 sm:w-24 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] shrink-0 text-center">
                      <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        {show.date.split(' ')[0]}
                      </span>
                      <span className="font-display text-2xl font-black text-white">
                        {show.date.split(' ')[1].replace(',', '')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {show.date.split(' ')[2]}
                      </span>
                    </div>

                    {/* Venue & Location */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                          {show.city}
                        </h3>
                        {isHometown && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            HOMETOWN CAPSTONE
                          </span>
                        )}
                        {show.vipAvailable && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> VIP Soundcheck Available
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-300 flex items-center gap-1.5 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {show.venue}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status Pill & Ticket Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                    
                    {/* Status Badge */}
                    <span
                      className={`text-xs font-mono px-3 py-1 rounded-full border ${
                        show.status === 'Selling Fast'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : show.status === 'Low Tickets'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      ● {show.status}
                    </span>

                    {/* Get Tickets Button */}
                    <a
                      href={show.ticketLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
                    >
                      <span>Get Tickets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {/* PAST TOUR ARCHIVE */}
      {activeTab === 'past' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAST_TOUR_HIGHLIGHTS.map((archive, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(168, 85, 247, 0.15)"
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-cyan-400 font-bold">{archive.year}</span>
                  <History className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-display text-xl font-bold text-white mb-2">
                  {archive.event}
                </h4>
                <p className="text-xs text-slate-300 mb-4">
                  <strong>Cities:</strong> {archive.cities}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-xs font-mono text-purple-300">
                {archive.attendance}
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Songkick / Bandsintown Integration Card */}
      <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-white text-sm">
              Songkick & Bandsintown Tour Sync Active
            </h5>
            <p className="text-xs text-slate-400">
              Live updates directly synchronized with venue box offices and promoter allocations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRsvpModal(true)}
          className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white transition-colors shrink-0"
        >
          Notify When Near Me
        </button>
      </div>

      {/* RSVP / Request Show Modal */}
      <AnimatePresence>
        {showRsvpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowRsvpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0e0f18] border border-white/[0.15] rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
            >
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Request a Tour Date in Your City
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Tell us where you want UNNOTICED to perform next. When we route the upcoming leg, you'll get first access to pre-sale codes.
              </p>

              {rsvpSubmitted ? (
                <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                  <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white text-base">City Vote Registered!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    We added your location to the tour routing heatmap.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      City & State / Country
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Austin, TX or Toronto, Canada"
                      value={rsvpCity}
                      onChange={(e) => setRsvpCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRsvpModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/30 transition-colors"
                    >
                      Submit City Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
