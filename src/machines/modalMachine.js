/**
 * Modal & Overlay Coordination Finite State Machine
 * 
 * Guarantees:
 * - UX: Strictly mutually exclusive modals; prevents ghost overlays, stacked backdrops, or z-index collisions.
 * - DX: Single modal manager replaces separate `editingItem`, `deleteConfirmModal`, `bulkLyricsModalTrackIndex` states.
 * - AX: Exposes exact active dialog (`state.value`) and typed open/close actions.
 */

import { createMachine } from './createMachine.js';

export const modalMachine = createMachine({
  id: 'modal',
  initial: 'closed',
  context: {
    editingItem: null, // { type, isNew, data, index }
    deleteTarget: null, // { title, type, onConfirm, description }
    bulkLyricsTarget: null, // { trackIndex, trackTitle }
    activeTab: 'tracks'
  },
  states: {
    closed: {
      on: {
        OPEN_EDIT: {
          target: 'edit_item',
          action: (ctx, payload) => ({
            editingItem: payload.item || null,
            deleteTarget: null,
            bulkLyricsTarget: null
          })
        },
        OPEN_DELETE_CONFIRM: {
          target: 'confirm_delete',
          action: (ctx, payload) => ({
            deleteTarget: payload.target || null,
            editingItem: null,
            bulkLyricsTarget: null
          })
        },
        OPEN_BULK_LYRICS: {
          target: 'bulk_lyrics',
          action: (ctx, payload) => ({
            bulkLyricsTarget: payload.target || null,
            editingItem: null,
            deleteTarget: null
          })
        }
      }
    },

    edit_item: {
      on: {
        CLOSE: {
          target: 'closed',
          action: () => ({ editingItem: null })
        },
        UPDATE_EDIT_DATA: {
          target: 'edit_item',
          action: (ctx, payload) => ({
            editingItem: ctx.editingItem ? {
              ...ctx.editingItem,
              data: typeof payload.data === 'function' ? payload.data(ctx.editingItem.data) : { ...ctx.editingItem.data, ...payload.data }
            } : null
          })
        },
        OPEN_DELETE_CONFIRM: {
          target: 'confirm_delete',
          action: (ctx, payload) => ({
            deleteTarget: payload.target || null,
            editingItem: null
          })
        }
      }
    },

    confirm_delete: {
      on: {
        CLOSE: {
          target: 'closed',
          action: () => ({ deleteTarget: null })
        },
        CONFIRM: {
          target: 'closed',
          action: () => ({ deleteTarget: null })
        }
      }
    },

    bulk_lyrics: {
      on: {
        CLOSE: {
          target: 'closed',
          action: () => ({ bulkLyricsTarget: null })
        }
      }
    }
  }
});
