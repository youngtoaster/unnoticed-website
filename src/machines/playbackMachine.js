/**
 * Playback & Audio Engine Finite State Machine
 * 
 * Guarantees:
 * - UX: Audio transitions cleanly without competing instances or uncaught play() rejection errors.
 * - DX: Provides deterministic state ('idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error').
 * - AX: Exposes `send('PLAY')`, `send('PAUSE')`, `send('SELECT_TRACK', { track, index })`, preventing undefined crashes.
 */

import { createMachine } from './createMachine.js';

export const SAFE_TRACK_PLACEHOLDER = Object.freeze({
  id: 'placeholder',
  title: 'No Track Selected',
  artist: 'UNNOTICED',
  duration: '0:00',
  year: '2026',
  cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  audioUrl: '',
  spotifyUrl: '',
  lyrics: []
});

export const playbackMachine = createMachine({
  id: 'playback',
  initial: 'idle',
  context: {
    currentTrack: null,
    trackIndex: 0,
    currentTime: 0,
    duration: 30,
    volume: 0.85,
    isMuted: false,
    autoplayRequested: false,
    error: null
  },
  states: {
    idle: {
      on: {
        SELECT_TRACK: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: payload.autoplay !== false,
            error: null
          })
        },
        LOAD: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: !!payload.autoplay,
            error: null
          })
        },
        SET_VOLUME: {
          target: 'idle',
          action: (ctx, payload) => ({ volume: payload.volume ?? ctx.volume })
        },
        SET_MUTED: {
          target: 'idle',
          action: (ctx, payload) => ({ isMuted: payload.isMuted ?? !ctx.isMuted })
        }
      }
    },

    loading: {
      on: {
        LOADED: [
          {
            target: 'playing',
            guard: (ctx) => ctx.autoplayRequested,
            action: (ctx, payload) => ({
              duration: payload.duration || ctx.duration,
              error: null
            })
          },
          {
            target: 'ready',
            action: (ctx, payload) => ({
              duration: payload.duration || ctx.duration,
              error: null
            })
          }
        ],
        PLAY: {
          target: 'playing',
          action: (ctx) => ({ autoplayRequested: true })
        },
        ERROR: {
          target: 'error',
          action: (ctx, payload) => ({
            error: payload.error || 'Playback stream could not be loaded.'
          })
        },
        STOP: {
          target: 'idle',
          action: () => ({ currentTime: 0, error: null })
        },
        SELECT_TRACK: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: payload.autoplay !== false,
            error: null
          })
        }
      }
    },

    ready: {
      on: {
        PLAY: {
          target: 'playing',
          action: () => ({ error: null })
        },
        SEEK: {
          target: 'ready',
          action: (ctx, payload) => ({
            currentTime: typeof payload.time === 'number' ? payload.time : ctx.currentTime
          })
        },
        STOP: {
          target: 'idle',
          action: () => ({ currentTime: 0 })
        },
        SELECT_TRACK: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: payload.autoplay !== false,
            error: null
          })
        }
      }
    },

    playing: {
      on: {
        PAUSE: {
          target: 'paused'
        },
        TIME_UPDATE: {
          target: 'playing',
          action: (ctx, payload) => ({
            currentTime: typeof payload.currentTime === 'number' ? payload.currentTime : ctx.currentTime,
            duration: typeof payload.duration === 'number' ? payload.duration : ctx.duration
          })
        },
        SEEK: {
          target: 'playing',
          action: (ctx, payload) => ({
            currentTime: typeof payload.time === 'number' ? payload.time : ctx.currentTime
          })
        },
        ENDED: {
          target: 'ended',
          action: () => ({ currentTime: 0 })
        },
        ERROR: {
          target: 'error',
          action: (ctx, payload) => ({
            error: payload.error || 'Playback failed during stream decode.'
          })
        },
        STOP: {
          target: 'idle',
          action: () => ({ currentTime: 0 })
        },
        SELECT_TRACK: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: payload.autoplay !== false,
            error: null
          })
        }
      }
    },

    paused: {
      on: {
        PLAY: {
          target: 'playing',
          action: () => ({ error: null })
        },
        SEEK: {
          target: 'paused',
          action: (ctx, payload) => ({
            currentTime: typeof payload.time === 'number' ? payload.time : ctx.currentTime
          })
        },
        STOP: {
          target: 'idle',
          action: () => ({ currentTime: 0 })
        },
        SELECT_TRACK: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: payload.autoplay !== false,
            error: null
          })
        }
      }
    },

    ended: {
      on: {
        PLAY: {
          target: 'playing',
          action: () => ({ currentTime: 0 })
        },
        SELECT_TRACK: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: payload.autoplay !== false,
            error: null
          })
        },
        STOP: {
          target: 'idle',
          action: () => ({ currentTime: 0 })
        }
      }
    },

    error: {
      on: {
        RETRY: {
          target: 'loading',
          action: () => ({ error: null })
        },
        SELECT_TRACK: {
          target: 'loading',
          action: (ctx, payload) => ({
            currentTrack: payload.track || ctx.currentTrack,
            trackIndex: typeof payload.index === 'number' ? payload.index : ctx.trackIndex,
            currentTime: 0,
            autoplayRequested: payload.autoplay !== false,
            error: null
          })
        },
        STOP: {
          target: 'idle',
          action: () => ({ error: null, currentTime: 0 })
        }
      }
    }
  }
});
