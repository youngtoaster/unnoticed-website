import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import SpotlightCard from './SpotlightCard';

export default function MailingListSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);

    // Simulate marketing service API dispatch (e.g. Mailchimp, ConvertKit, Klaviyo)
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#38bdf8', '#c084fc', '#ffffff']
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    }, 600);
  };

  return (
    <section id="newsletter" className="relative py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <SpotlightCard
        className="p-6 sm:p-10 relative overflow-hidden text-center"
        spotlightColor="rgba(168, 85, 247, 0.22)"
      >
        <div className="relative z-10 max-w-xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> THE UNSEEN SYNDICATE
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            JOIN THE INNER CIRCLE
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Get exclusive access to unreleased midnight studio leaks, pre-sale concert ticket codes, secret pop-up listening parties, and private merch drops.
          </p>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-2xl bg-purple-950/40 border border-purple-500/40 shadow-xl max-w-md mx-auto"
              >
                <CheckCircle2 className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <h4 className="font-display text-xl font-bold text-white mb-1">
                  You Are Now On The List
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We sent a confirmation token to <strong className="text-purple-300">{email}</strong>. Check your inbox for your first unreleased acoustic preview.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="mt-4 text-xs font-mono text-purple-400 hover:text-purple-300 underline"
                >
                  Register another email
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <div className="relative w-full">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-full bg-white/[0.05] border border-white/[0.12] text-white text-sm focus:outline-none focus:border-purple-400 placeholder:text-slate-500 transition-colors shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/40 transition-all hover:scale-105 shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Join Syndicate</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>

          {/* Privacy Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
            <Lock className="w-3 h-3 text-purple-400" />
            <span>Zero spam. Encrypted transmission. Unsubscribe anytime with 1 click.</span>
          </div>

        </div>
      </SpotlightCard>

    </section>
  );
}
