/**
 * Media Upload & Asset Ingestion Finite State Machine
 * 
 * Guarantees:
 * - UX: Deterministic upload progress, instant cancellation, clean error boundaries.
 * - DX: Replaces 4 distinct upload booleans (`uploading`, `uploadError`, `progress`, `success`).
 * - AX: Exposes deterministic upload lifecycle and CDN URL resolution.
 */

import { createMachine } from './createMachine.js';

export const uploadMachine = createMachine({
  id: 'upload',
  initial: 'idle',
  context: {
    fileName: '',
    fileSize: 0,
    progress: 0,
    cdnUrl: '',
    error: null
  },
  states: {
    idle: {
      on: {
        START_UPLOAD: {
          target: 'validating',
          action: (ctx, payload) => ({
            fileName: payload.file?.name || 'asset',
            fileSize: payload.file?.size || 0,
            progress: 0,
            cdnUrl: '',
            error: null
          })
        }
      }
    },

    validating: {
      on: {
        VALID_FILE: {
          target: 'uploading'
        },
        INVALID_FILE: {
          target: 'error',
          action: (ctx, payload) => ({
            error: payload.error || 'File validation failed (unsupported format or size limit exceeded).'
          })
        },
        CANCEL: {
          target: 'idle',
          action: () => ({ error: null, progress: 0 })
        }
      }
    },

    uploading: {
      on: {
        PROGRESS: {
          target: 'uploading',
          action: (ctx, payload) => ({
            progress: typeof payload.progress === 'number' ? payload.progress : ctx.progress
          })
        },
        UPLOAD_SUCCESS: {
          target: 'success',
          action: (ctx, payload) => ({
            cdnUrl: payload.url || '',
            progress: 100,
            error: null
          })
        },
        UPLOAD_ERROR: {
          target: 'error',
          action: (ctx, payload) => ({
            error: payload.error || 'Upload failed. Check network or cloud storage credentials.'
          })
        },
        CANCEL: {
          target: 'idle',
          action: () => ({ error: null, progress: 0 })
        }
      }
    },

    success: {
      on: {
        RESET: {
          target: 'idle',
          action: () => ({ fileName: '', fileSize: 0, progress: 0, cdnUrl: '', error: null })
        },
        START_UPLOAD: {
          target: 'validating',
          action: (ctx, payload) => ({
            fileName: payload.file?.name || 'asset',
            fileSize: payload.file?.size || 0,
            progress: 0,
            cdnUrl: '',
            error: null
          })
        }
      }
    },

    error: {
      on: {
        RESET: {
          target: 'idle',
          action: () => ({ error: null, progress: 0 })
        },
        RETRY: {
          target: 'uploading',
          action: () => ({ progress: 0, error: null })
        },
        START_UPLOAD: {
          target: 'validating',
          action: (ctx, payload) => ({
            fileName: payload.file?.name || 'asset',
            fileSize: payload.file?.size || 0,
            progress: 0,
            cdnUrl: '',
            error: null
          })
        }
      }
    }
  }
});
