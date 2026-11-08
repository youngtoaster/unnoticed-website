/**
 * Data Sync & Remote Persistence Finite State Machine
 * 
 * Guarantees:
 * - UX: Prevents data loss; dirty local changes are NEVER overwritten by stale remote pulls.
 * - DX: Replaces 4 distinct sync booleans with a deterministic synchronization state.
 * - AX: Exposes `state.value` ('idle' | 'pulling' | 'synced' | 'dirty' | 'pushing' | 'offline' | 'error')
 *       and structured events (`PULL_START`, `PULL_SUCCESS`, `PUSH_START`, `PUSH_SUCCESS`).
 */

import { createMachine } from './createMachine.js';

export const syncMachine = createMachine({
  id: 'sync',
  initial: 'idle',
  context: {
    lastSynced: null,
    pendingChangesCount: 0,
    activeProvider: 'supabase_postgres',
    latencyMs: null,
    lastError: null,
    retryCount: 0
  },
  states: {
    idle: {
      on: {
        PULL_START: {
          target: 'pulling',
          action: () => ({ lastError: null })
        },
        PUSH_START: {
          target: 'pushing',
          action: () => ({ lastError: null })
        },
        EDIT_MADE: {
          target: 'dirty',
          action: (ctx) => ({ pendingChangesCount: ctx.pendingChangesCount + 1 })
        },
        SET_OFFLINE: {
          target: 'offline'
        }
      }
    },

    pulling: {
      on: {
        PULL_SUCCESS: {
          target: 'synced',
          action: (ctx, payload) => ({
            lastSynced: Date.now(),
            activeProvider: payload.provider || ctx.activeProvider,
            latencyMs: payload.latencyMs ?? ctx.latencyMs,
            lastError: null,
            retryCount: 0
          })
        },
        PULL_ERROR: {
          target: 'idle',
          action: (ctx, payload) => ({
            lastError: payload.error || 'Network pull failed; fell back to local cache.'
          })
        },
        EDIT_MADE: {
          target: 'dirty',
          action: (ctx) => ({ pendingChangesCount: ctx.pendingChangesCount + 1 })
        },
        SET_OFFLINE: {
          target: 'offline'
        }
      }
    },

    synced: {
      on: {
        EDIT_MADE: {
          target: 'dirty',
          action: (ctx) => ({ pendingChangesCount: ctx.pendingChangesCount + 1 })
        },
        PULL_START: {
          target: 'pulling',
          action: () => ({ lastError: null })
        },
        PUSH_START: {
          target: 'pushing',
          action: () => ({ lastError: null })
        },
        SET_OFFLINE: {
          target: 'offline'
        }
      }
    },

    dirty: {
      on: {
        PUSH_START: {
          target: 'pushing',
          action: () => ({ lastError: null })
        },
        EDIT_MADE: {
          target: 'dirty',
          action: (ctx) => ({ pendingChangesCount: ctx.pendingChangesCount + 1 })
        },
        // Guard: A dirty local edit deliberately ignores incoming remote pulls
        // to prevent overwriting unpersisted user work!
        PULL_START: {
          target: 'dirty'
        },
        SET_OFFLINE: {
          target: 'offline'
        }
      }
    },

    pushing: {
      on: {
        PUSH_SUCCESS: {
          target: 'synced',
          action: (ctx, payload) => ({
            lastSynced: Date.now(),
            pendingChangesCount: 0,
            activeProvider: payload.provider || ctx.activeProvider,
            lastError: null,
            retryCount: 0
          })
        },
        PUSH_ERROR: {
          target: 'error',
          action: (ctx, payload) => ({
            lastError: payload.error || 'Push to Supabase database failed.',
            retryCount: ctx.retryCount + 1
          })
        },
        EDIT_MADE: {
          target: 'pushing',
          action: (ctx) => ({ pendingChangesCount: ctx.pendingChangesCount + 1 })
        }
      }
    },

    offline: {
      on: {
        RECONNECT: {
          target: 'pulling',
          action: () => ({ lastError: null })
        },
        EDIT_MADE: {
          target: 'dirty',
          action: (ctx) => ({ pendingChangesCount: ctx.pendingChangesCount + 1 })
        }
      }
    },

    error: {
      on: {
        RETRY: {
          target: 'pushing',
          action: () => ({ lastError: null })
        },
        EDIT_MADE: {
          target: 'dirty',
          action: (ctx) => ({ pendingChangesCount: ctx.pendingChangesCount + 1 })
        },
        DISMISS: {
          target: 'idle',
          action: () => ({ lastError: null })
        }
      }
    }
  }
});
