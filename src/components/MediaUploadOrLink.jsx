import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Music, Video, File, X, Check, Volume2 } from 'lucide-react';

/**
 * MediaUploadOrLink
 * Universal component allowing admins to either paste an external URL or upload a local file
 * Supports automatic data URL generation (for localStorage persistence) with live previews.
 */
export default function MediaUploadOrLink({
  label,
  title,
  value,
  currentValue,
  onChange,
  onSelect,
  type = 'image', // 'image' | 'audio' | 'video' | 'file'
  placeholder,
  helperText,
  accept,
  className = ''
}) {
  const actualValue = value !== undefined ? value : (currentValue ?? '');
  const actualOnChange = onChange || onSelect || (() => {});
  const actualLabel = label || title || '';

  const [mode, setMode] = useState(() => (actualValue && (actualValue.startsWith('blob:') || actualValue.startsWith('data:')) ? 'upload' : 'link'));
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const fileInputRef = useRef(null);

  // Set default accepts based on type
  const acceptTypes = accept || (
    type === 'image' ? 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml' :
    type === 'audio' ? 'audio/mpeg,audio/wav,audio/ogg,audio/mp3,audio/aac,audio/m4a' :
    type === 'video' ? 'video/mp4,video/webm,video/quicktime,video/ogg' :
    '*/*'
  );

  const defaultPlaceholder = placeholder || (
    type === 'image' ? 'https://images.unsplash.com/... or https://...' :
    type === 'audio' ? 'https://p.scdn.co/mp3-preview/... or https://domain.com/audio.mp3' :
    type === 'video' ? 'https://youtube.com/... or https://domain.com/video.mp4' :
    'https://...'
  );

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    // For images: automatically compress and resize to max 1400px so it fits smoothly into storage and persists
    if (type === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1400;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          actualOnChange(compressedDataUrl);
        };
        img.onerror = () => {
          actualOnChange(event.target?.result);
        };
        img.src = event.target?.result;
      };
      reader.readAsDataURL(file);
      return;
    }

    // For audio / video / files:
    if (file.size <= 6 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          actualOnChange(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Large file fallback
      const objectUrl = URL.createObjectURL(file);
      actualOnChange(objectUrl);
    }
  };

  const handleClear = () => {
    actualOnChange('');
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Source Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono text-slate-300 font-semibold block">
          {actualLabel}
        </label>
        <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'link'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Link URL</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'upload'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Input Field / Dropzone */}
      {mode === 'link' ? (
        <div className="relative">
          <input
            type="text"
            placeholder={defaultPlaceholder}
            value={actualValue || ''}
            onChange={(e) => actualOnChange(e.target.value)}
            className="w-full px-3.5 py-2 pr-9 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
          />
          {actualValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer"
              title="Clear link"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes}
            onChange={handleFileChosen}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-white/[0.15] hover:border-purple-400/60 rounded-xl p-4 text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04] group"
          >
            <div className="flex items-center justify-center gap-2 text-purple-400 group-hover:scale-105 transition-transform mb-1">
              {type === 'image' && <ImageIcon className="w-5 h-5" />}
              {type === 'audio' && <Music className="w-5 h-5" />}
              {type === 'video' && <Video className="w-5 h-5" />}
              {type === 'file' && <File className="w-5 h-5" />}
              <span className="text-xs font-bold text-white">
                {fileName ? fileName : `Choose local ${type} file`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {fileSize ? `File size: ${fileSize} • Click to replace` : 'Click to browse files on your device'}
            </p>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-[10px] text-slate-400 font-mono">{helperText}</p>
      )}

      {/* Live Preview Container */}
      {actualValue && (
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {type === 'image' && (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/[0.1] bg-black shrink-0">
                <img
                  src={actualValue}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {type === 'audio' && (
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
            )}

            {type === 'video' && (
              <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
            )}

            {type === 'file' && (
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <File className="w-4 h-4" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3 h-3" /> Source Attached
              </span>
              <p className="text-[11px] text-slate-300 truncate font-mono">
                {fileName || actualValue}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
            title="Remove source"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Audio Live Playback Player */}
      {type === 'audio' && actualValue && (
        <div className="pt-1">
          <audio controls src={actualValue} className="w-full h-8 rounded-lg accent-purple-600 bg-white/[0.04]" />
        </div>
      )}

      {/* Video Live Playback Player */}
      {type === 'video' && actualValue && (
        <div className="pt-1 aspect-video rounded-xl overflow-hidden bg-black border border-white/[0.1]">
          <video controls src={actualValue} className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  );
}
