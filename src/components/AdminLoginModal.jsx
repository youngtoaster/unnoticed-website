import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, KeyRound, Lock, X, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { verifyPassword } = useSiteData();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError(false);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setIsVerifying(true);
    setError(false);

    // Cryptographic check with salt & SHA-256
    const ok = await verifyPassword(password);
    setIsVerifying(false);

    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              x: error ? [-8, 8, -6, 6, -3, 3, 0] : 0
            }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#0a0b12] border border-white/[0.15] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {/* Ambient cyber line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Terminal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shadow-lg shadow-purple-600/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase block">
                  RESTRICTED // ROOT ACCESS
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Admin Terminal
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Enter authorized administrative passphrase to manage artist discography, tour dates, merch catalog, and site architecture.
            </p>

            {success ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center flex items-center justify-center gap-2 text-emerald-300 font-mono text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>ACCESS GRANTED // INITIALIZING CMS</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter security key..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    className={`w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/[0.04] border text-white text-sm focus:outline-none transition-colors font-mono tracking-wider ${
                      error
                        ? 'border-red-500/80 bg-red-950/20 focus:border-red-500'
                        : 'border-white/[0.12] focus:border-purple-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-red-400 font-mono"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Invalid credential signature. Access denied.</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Unlock Command Centre</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>SHA-256 ENCRYPTED</span>
              <span>SESSION TIMEOUT 24H</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
