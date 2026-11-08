/**
 * Smart Track Metadata Fetcher & Ingestion Finite State Machine
 * 
 * Guarantees:
 * - UX: Fast visual feedback while fetching metadata from Spotify, SoundCloud, YouTube, or Apple Music.
 * - DX: Eliminates `isFetchingMeta`, `isQuickFetching`, `refreshingTrackIdx`, and `isRefreshingAll`.
 * - AX: Exposes exact phase ('idle' | 'validating' | 'fetching' | 'success' | 'error' | 'batch_running' | 'batch_complete')
 *       and result payload context.
 */

import { createMachine } from './createMachine.js';

export const metadataMachine = createMachine({
  id: 'metadata',
  initial: 'idle',
  context: {
    url: '',
    detectedProvider: null,
    result: null,
    error: null,
    batchProgress: {
      total: 0,
      current: 0,
      updatedCount: 0,
      currentTrackTitle: ''
    }
  },
  states: {
    idle: {
      on: {
        START_FETCH: {
          target: 'validating',
          action: (ctx, payload) => ({
            url: payload.url || '',
            detectedProvider: null,
            result: null,
            error: null
          })
        },
        START_BATCH: {
          target: 'batch_running',
          action: (ctx, payload) => ({
            batchProgress: {
              total: payload.total || 0,
              current: 0,
              updatedCount: 0,
              currentTrackTitle: ''
            },
            error: null
          })
        }
      }
    },

    validating: {
      on: {
        VALIDATED: {
          target: 'fetching',
          action: (ctx, payload) => ({
            detectedProvider: payload.provider || 'unknown'
          })
        },
        INVALID_URL: {
          target: 'error',
          action: (ctx, payload) => ({
            error: payload.error || 'Please provide a valid Spotify, SoundCloud, or YouTube link.'
          })
        },
        CANCEL: {
          target: 'idle',
          action: () => ({ url: '', error: null })
        }
      }
    },

    fetching: {
      on: {
        FETCH_SUCCESS: {
          target: 'success',
          action: (ctx, payload) => ({
            result: payload.data || null,
            error: null
          })
        },
        FETCH_ERROR: {
          target: 'error',
          action: (ctx, payload) => ({
            error: payload.error || 'Failed to auto-pull metadata from link.',
            result: null
          })
        },
        CANCEL: {
          target: 'idle',
          action: () => ({ url: '', error: null })
        }
      }
    },

    success: {
      on: {
        RESET: {
          target: 'idle',
          action: () => ({ url: '', result: null, error: null })
        },
        START_FETCH: {
          target: 'validating',
          action: (ctx, payload) => ({
            url: payload.url || '',
            detectedProvider: null,
            result: null,
            error: null
          })
        }
      }
    },

    error: {
      on: {
        RESET: {
          target: 'idle',
          action: () => ({ url: '', error: null })
        },
        RETRY: {
          target: 'fetching',
          action: () => ({ error: null })
        },
        START_FETCH: {
          target: 'validating',
          action: (ctx, payload) => ({
            url: payload.url || '',
            detectedProvider: null,
            result: null,
            error: null
          })
        }
      }
    },

    batch_running: {
      on: {
        BATCH_STEP: {
          target: 'batch_running',
          action: (ctx, payload) => ({
            batchProgress: {
              ...ctx.batchProgress,
              current: payload.current ?? ctx.batchProgress.current,
              updatedCount: payload.updated ? ctx.batchProgress.updatedCount + 1 : ctx.batchProgress.updatedCount,
              currentTrackTitle: payload.title || ctx.batchProgress.currentTrackTitle
            }
          })
        },
        BATCH_COMPLETE: {
          target: 'batch_complete',
          action: (ctx, payload) => ({
            batchProgress: {
              ...ctx.batchProgress,
              current: ctx.batchProgress.total,
              updatedCount: payload.updatedCount ?? ctx.batchProgress.updatedCount
            }
          })
        },
        CANCEL_BATCH: {
          target: 'idle',
          action: () => ({ error: null })
        }
      }
    },

    batch_complete: {
      on: {
        RESET: {
          target: 'idle',
          action: () => ({ error: null })
        },
        START_FETCH: {
          target: 'validating',
          action: (ctx, payload) => ({
            url: payload.url || '',
            detectedProvider: null,
            result: null,
            error: null
          })
        }
      }
    }
  }
});
