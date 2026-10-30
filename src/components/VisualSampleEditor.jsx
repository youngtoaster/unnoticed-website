import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles, Scissors,
  Sliders, Music, Disc3, Zap, Clock, ChevronLeft, ChevronRight, Check
} from 'lucide-react';

/**
 * VisualSampleEditor
 * Interactive DAW-grade waveform visualizer and sample window trimmer.
 * Allows artists to visually scrub, pick, and fine-tune their on-load hook / drop point.
 */
export default function VisualSampleEditor({
  audioUrl,
  sampleStartTime = 12,
  sampleDuration = 28,
  onUpdateTiming,
  onToast
}) {
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(sampleStartTime);
  const [totalDuration, setTotalDuration] = useState(180);
  const [waveformPeaks, setWaveformPeaks] = useState([]);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(null); // 'window' | 'start' | 'end' | null
  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);

  // Generate realistic procedural energy peaks fallback
  const generateFallbackPeaks = useCallback((count = 100) => {
    const peaks = [];
    for (let i = 0; i < count; i++) {
      const pos = i / count;
      let base = 0.25;
      if (pos > 0.12 && pos < 0.25) base = 0.55 + Math.sin(pos * 30) * 0.2; // buildup
      else if (pos >= 0.25 && pos < 0.50) base = 0.85 + Math.sin(pos * 40) * 0.15; // heavy chorus drop
      else if (pos >= 0.50 && pos < 0.65) base = 0.45 + Math.sin(pos * 25) * 0.15; // verse 2
      else if (pos >= 0.65 && pos < 0.85) base = 0.95 + Math.sin(pos * 35) * 0.05; // climax drop
      else if (pos >= 0.85) base = 0.35 * (1 - (pos - 0.85) / 0.15); // outro fade

      const noise = (Math.random() - 0.5) * 0.18;
      peaks.push(Math.max(0.12, Math.min(1.0, base + noise)));
    }
    return peaks;
  }, []);

  // Try decoding real audio waveform with Web Audio API
  useEffect(() => {
    if (!audioUrl) {
      setWaveformPeaks(generateFallbackPeaks(100));
      return;
    }

    let isMounted = true;
    setIsDecoding(true);

    const decodeAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) throw new Error('AudioContext unavailable');
        const audioCtx = new AudioContextClass();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        if (!isMounted) return;
        setTotalDuration(audioBuffer.duration);

        // Extract 100 peak samples across the track
        const channelData = audioBuffer.getChannelData(0);
        const step = Math.floor(channelData.length / 100);
        const peaks = [];
        for (let i = 0; i < 100; i++) {
          let maxVal = 0;
          const start = i * step;
          const end = Math.min(start + step, channelData.length);
          for (let j = start; j < end; j += 10) {
            const val = Math.abs(channelData[j]);
            if (val > maxVal) maxVal = val;
          }
          peaks.push(Math.max(0.1, Math.min(1.0, maxVal * 1.5)));
        }
        setWaveformPeaks(peaks);
        setIsDecoding(false);
      } catch (err) {
        // Fallback for CORS or local format issues
        if (isMounted) {
          setWaveformPeaks(generateFallbackPeaks(100));
          setIsDecoding(false);
        }
      }
    };

    decodeAudio();
    return () => {
      isMounted = false;
    };
  }, [audioUrl, generateFallbackPeaks]);

  // Audio metadata listener
  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  // Time update listener & sample loop enforcement
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    setCurrentTime(current);

    const sampleEnd = sampleStartTime + sampleDuration;
    if (current >= sampleEnd) {
      if (isLooping) {
        audioRef.current.currentTime = sampleStartTime;
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Toggle Audition Playback
  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = sampleStartTime;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
        if (onToast) onToast('Could not play audio track. Check source file.');
      });
    }
  };

  // Set start time with boundary protection
  const setSafeStartTime = (newStart) => {
    const maxStart = Math.max(0, totalDuration - sampleDuration);
    const clamped = Math.max(0, Math.min(maxStart, parseFloat(newStart.toFixed(1))));
    onUpdateTiming({ sampleStartTime: clamped, sampleDuration });
    if (audioRef.current && isPlaying) {
      audioRef.current.currentTime = clamped;
    }
  };

  // Set duration with boundary protection
  const setSafeDuration = (newDur) => {
    const maxDur = Math.max(5, totalDuration - sampleStartTime);
    const clamped = Math.max(5, Math.min(maxDur, Math.min(60, parseFloat(newDur.toFixed(1)))));
    onUpdateTiming({ sampleStartTime, sampleDuration: clamped });
  };

  // Click on waveform to move start time
  const handleWaveformClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = pct * totalDuration;
    setSafeStartTime(targetTime);
  };

  // Format seconds to MM:SS.S
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const tenths = Math.floor((secs % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${tenths}`;
  };

  const sampleEnd = Math.min(totalDuration, sampleStartTime + sampleDuration);
  const startPct = totalDuration > 0 ? (sampleStartTime / totalDuration) * 100 : 0;
  const widthPct = totalDuration > 0 ? (sampleDuration / totalDuration) * 100 : 20;
  const playheadPct = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0b0c16] border border-white/[0.12] shadow-2xl space-y-5 select-none relative overflow-hidden">
      {/* Hidden Audio Engine */}
      <audio
        ref={audioRef}
        src={audioUrl || 'https://p.scdn.co/mp3-preview/b6cdb3115927e7db423d2238223b5a6b4a57008b?cid=3bb56cf560444175950d63e79d4febc8'}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header telemetry row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10 shrink-0">
            <Scissors className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <span>Interactive Waveform Sample Editor</span>
              {isDecoding && (
                <span className="text-[10px] font-mono text-cyan-400 font-normal animate-pulse">
                  (Analyzing audio peaks...)
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              Drag or click the highlighted window below to lock in the exact hook or beat drop.
            </p>
          </div>
        </div>

        {/* Telemetry Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-right">
            <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Drop Point</span>
            <span className="text-xs font-mono font-bold text-cyan-300">{formatTime(sampleStartTime)}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-right">
            <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Sample Duration</span>
            <span className="text-xs font-mono font-bold text-purple-300">{sampleDuration}s</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-right">
            <span className="text-[9.5px] font-mono text-purple-300 uppercase block">End Cut</span>
            <span className="text-xs font-mono font-bold text-white">{formatTime(sampleEnd)}</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN INTERACTIVE WAVEFORM CANVAS STAGE                   */}
      {/* ======================================================== */}
      <div className="space-y-2">
        <div
          ref={containerRef}
          onClick={handleWaveformClick}
          className="relative h-32 sm:h-36 rounded-2xl bg-[#06070c] border border-white/[0.1] overflow-hidden cursor-crosshair group shadow-inner"
        >
          {/* Background grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Center 0dB horizontal datum line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/[0.1] pointer-events-none" />

          {/* 100 Dynamic Waveform Bars */}
          <div className="absolute inset-0 flex items-center justify-between px-2 gap-0.5 sm:gap-1 pointer-events-none">
            {waveformPeaks.map((peak, idx) => {
              const barPct = (idx / 100) * 100;
              const isInside = barPct >= startPct && barPct <= (startPct + widthPct);
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-full transition-all duration-150"
                  style={{
                    height: `${Math.max(10, peak * 86)}%`,
                    backgroundColor: isInside ? '#c084fc' : '#334155',
                    boxShadow: isInside ? '0 0 10px rgba(192, 132, 252, 0.7)' : 'none',
                    opacity: isInside ? 1 : 0.28
                  }}
                />
              );
            })}
          </div>

          {/* HIGHLIGHTED SAMPLE WINDOW BRACKET */}
          <div
            className="absolute top-0 bottom-0 border-y-2 border-purple-400 bg-purple-500/15 pointer-events-none transition-all shadow-[0_0_25px_rgba(168,85,247,0.35)]"
            style={{
              left: `${startPct}%`,
              width: `${widthPct}%`
            }}
          >
            {/* Left Bracket Handle */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 via-purple-400 to-indigo-400 flex items-center justify-center shadow-lg">
              <span className="w-1 h-4 bg-white rounded-full opacity-80" />
            </div>

            {/* Right Bracket Handle */}
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-400 via-cyan-400 to-indigo-400 flex items-center justify-center shadow-lg">
              <span className="w-1 h-4 bg-white rounded-full opacity-80" />
            </div>

            {/* Floating Tag in center of window */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-purple-400/50 text-[9.5px] font-mono font-bold text-purple-200 whitespace-nowrap shadow-md">
              ⚡ Hook Window ({sampleDuration}s)
            </div>
          </div>

          {/* REAL-TIME PLAYHEAD NEEDLE */}
          {isPlaying && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#06b6d4] z-20 pointer-events-none"
              style={{ left: `${playheadPct}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-white absolute -top-1 -left-1 shadow-md" />
            </div>
          )}
        </div>

        {/* Waveform timeline axis markers */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
          <span>0:00</span>
          <span>{formatTime(totalDuration * 0.25)}</span>
          <span>{formatTime(totalDuration * 0.50)}</span>
          <span>{formatTime(totalDuration * 0.75)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* AUDITION CONTROLS & DURATION QUICK PILLS                 */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Play Audition & Loop Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="px-5 py-2.5 rounded-2xl theme-primary-btn font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-xl cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current shrink-0" />
                <span>Pause Audition</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5 shrink-0" />
                <span>Audition Hook Clip</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isLooping
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'
            }`}
            title="Loop audio clip continuously during audition"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span>Loop: {isLooping ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Duration Quick Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Duration:</span>
          {[15, 20, 28, 35, 45].map((dur) => (
            <button
              key={dur}
              type="button"
              onClick={() => {
                setSafeDuration(dur);
                if (onToast) onToast(`Sample clip duration set to ${dur}s`);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${
                sampleDuration === dur
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              {dur}s
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* QUICK JUMP DROP PRESETS & SURGICAL NUDGE TOOLS           */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/[0.08]">
        {/* Quick Jump Drop Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            ⚡ Quick Jump Drop Presets:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Intro (0s)', time: 0 },
              { label: 'Buildup (15s)', time: 15 },
              { label: 'Chorus Drop (30s)', time: 30 },
              { label: 'Hook (45s)', time: 45 },
              { label: 'Drop 2 (60s)', time: 60 },
              { label: 'Climax (75s)', time: 75 }
            ].map((preset) => (
              <button
                key={preset.time}
                type="button"
                onClick={() => {
                  setSafeStartTime(preset.time);
                  if (onToast) onToast(`Sample start jumped to ${preset.label}`);
                }}
                className="px-2 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer truncate text-center"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Surgical Nudge Tool */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            🎯 Surgical Beat Nudge:
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setSafeStartTime(sampleStartTime - 1)}
              className="px-2 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono font-bold text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
            >
              -1.0s
            </button>
            <button
              type="button"
              onClick={() => setSafeStartTime(sampleStartTime - 0.2)}
              className="px-2 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono font-bold text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
            >
              -0.2s
            </button>
            <button
              type="button"
              onClick={() => setSafeStartTime(sampleStartTime + 0.2)}
              className="px-2 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono font-bold text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
            >
              +0.2s
            </button>
            <button
              type="button"
              onClick={() => setSafeStartTime(sampleStartTime + 1)}
              className="px-2 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono font-bold text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
            >
              +1.0s
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-mono text-right">
            Aligns precisely with downbeats and transient transients.
          </p>
        </div>
      </div>
    </div>
  );
}
