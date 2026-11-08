/**
 * Unnoticed State Machine Micro-Core
 * 
 * Lightweight, zero-dependency, deterministic Finite State Machine (FSM) runtime
 * engineered for high-performance React 19 applications.
 * 
 * Elevates:
 * - UX: Prevents invalid / impossible states (e.g. playing without track, concurrent conflicting modals, race conditions).
 * - DX: Replaces boolean soup with explicit state transitions, typed events, and guarded state handlers.
 * - AX: Exposes deterministic state queries (matches, can, send) and global Agent Introspection via `window.__UNNOTICED_MACHINES__`.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// Global Agent/DevTools Inspector Registry
if (typeof window !== 'undefined') {
  if (!window.__UNNOTICED_MACHINES__) {
    window.__UNNOTICED_MACHINES__ = {};
  }
}

/**
 * Creates an immutable Finite State Machine definition
 */
export function createMachine({ id, initial, context = {}, states = {}, onTransition }) {
  if (!id) throw new Error('[Machine] Every machine requires a unique `id`.');
  if (!initial || !states[initial]) {
    throw new Error(`[Machine ${id}] Initial state "${initial}" must be defined in states.`);
  }

  return {
    id,
    initial,
    initialContext: Object.freeze({ ...context }),
    states,
    onTransition,

    /**
     * Pure transition calculation
     */
    transition(currentState, event, currentContext) {
      const eventType = typeof event === 'string' ? event : event?.type;
      const eventPayload = typeof event === 'object' ? (event.payload ?? event) : {};

      const stateDef = states[currentState];
      if (!stateDef) {
        console.warn(`[Machine ${id}] Unknown state: "${currentState}"`);
        return {
          value: currentState,
          context: currentContext,
          changed: false,
          error: `Unknown state: ${currentState}`
        };
      }

      const transitionConfig = stateDef.on?.[eventType];
      if (!transitionConfig) {
        // Event not handled in current state - ignored deterministically
        return {
          value: currentState,
          context: currentContext,
          changed: false
        };
      }

      // Transition can be a string (target state), an object, or an array of conditional targets
      const candidateList = Array.isArray(transitionConfig)
        ? transitionConfig
        : [transitionConfig];

      let target = null;
      let action = null;
      let guardPassed = false;

      for (const candidate of candidateList) {
        if (typeof candidate === 'string') {
          target = candidate;
          guardPassed = true;
          break;
        } else if (typeof candidate === 'object') {
          const guard = candidate.guard || candidate.cond;
          const allowed = !guard || guard(currentContext, eventPayload);
          if (allowed) {
            target = candidate.target;
            action = candidate.action;
            guardPassed = true;
            break;
          }
        }
      }

      if (!guardPassed || !target) {
        return {
          value: currentState,
          context: currentContext,
          changed: false
        };
      }

      if (!states[target]) {
        console.warn(`[Machine ${id}] Target state "${target}" does not exist.`);
        return {
          value: currentState,
          context: currentContext,
          changed: false,
          error: `Target state does not exist: ${target}`
        };
      }

      // Compute new context
      let nextContext = currentContext;
      if (typeof action === 'function') {
        const update = action(currentContext, eventPayload);
        if (update && typeof update === 'object') {
          nextContext = { ...currentContext, ...update };
        }
      } else if (eventPayload && typeof eventPayload === 'object' && eventPayload._contextUpdate) {
        nextContext = { ...currentContext, ...eventPayload._contextUpdate };
      }

      return {
        value: target,
        context: nextContext,
        changed: target !== currentState || nextContext !== currentContext,
        action
      };
    }
  };
}

/**
 * React Hook for consuming an FSM with full reactive re-renders
 */
export function useMachine(machine, initialOverrides = {}) {
  const [currentValue, setCurrentValue] = useState(
    initialOverrides.initial || machine.initial
  );
  const [context, setContext] = useState(() => ({
    ...machine.initialContext,
    ...(initialOverrides.context || {})
  }));
  const [history, setHistory] = useState([currentValue]);

  const stateRef = useRef({ value: currentValue, context });
  stateRef.current = { value: currentValue, context };

  const send = useCallback((event, payload = {}) => {
    const eventObj = typeof event === 'string' ? { type: event, payload } : event;
    const currentState = stateRef.current.value;
    const currentCtx = stateRef.current.context;

    const result = machine.transition(currentState, eventObj, currentCtx);

    if (result.changed) {
      // Execute exit action if present
      const fromDef = machine.states[currentState];
      if (typeof fromDef?.exit === 'function') {
        try {
          fromDef.exit(currentCtx, eventObj.payload);
        } catch (e) {
          console.error(`[Machine ${machine.id}] Error in exit action for "${currentState}":`, e);
        }
      }

      // Execute entry action if present
      const toDef = machine.states[result.value];
      if (typeof toDef?.entry === 'function') {
        try {
          toDef.entry(result.context, eventObj.payload);
        } catch (e) {
          console.error(`[Machine ${machine.id}] Error in entry action for "${result.value}":`, e);
        }
      }

      setCurrentValue(result.value);
      setContext(result.context);
      setHistory((prev) => [result.value, ...prev.slice(0, 9)]);

      if (typeof machine.onTransition === 'function') {
        machine.onTransition({
          machineId: machine.id,
          from: currentState,
          to: result.value,
          event: eventObj,
          context: result.context
        });
      }

      // Update DevTools/Agent Registry
      if (typeof window !== 'undefined' && window.__UNNOTICED_MACHINES__) {
        window.__UNNOTICED_MACHINES__[machine.id] = {
          value: result.value,
          context: result.context,
          lastEvent: eventObj,
          updatedAt: Date.now()
        };
      }
    }

    return result;
  }, [machine]);

  const matches = useCallback((expectedState) => {
    return currentValue === expectedState;
  }, [currentValue]);

  const can = useCallback((eventType, payload = {}) => {
    const currentState = stateRef.current.value;
    const currentCtx = stateRef.current.context;
    const result = machine.transition(currentState, { type: eventType, payload }, currentCtx);
    return result.changed;
  }, [machine]);

  const updateContext = useCallback((updater) => {
    setContext((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      stateRef.current.context = next;
      if (typeof window !== 'undefined' && window.__UNNOTICED_MACHINES__) {
        if (window.__UNNOTICED_MACHINES__[machine.id]) {
          window.__UNNOTICED_MACHINES__[machine.id].context = next;
        }
      }
      return next;
    });
  }, [machine.id]);

  // Register in DevTools/Agent Registry on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__UNNOTICED_MACHINES__) {
      window.__UNNOTICED_MACHINES__[machine.id] = {
        value: currentValue,
        context,
        send,
        can,
        matches,
        machine
      };
    }
    return () => {
      if (typeof window !== 'undefined' && window.__UNNOTICED_MACHINES__) {
        delete window.__UNNOTICED_MACHINES__[machine.id];
      }
    };
  }, [machine, currentValue, context, send, can, matches]);

  const state = {
    value: currentValue,
    context,
    history,
    matches,
    can,
    send,
    updateContext,
    is: (st) => currentValue === st,
    get isIdle() { return currentValue === 'idle'; },
    get isLoading() { return currentValue === 'loading' || currentValue === 'syncing' || currentValue === 'fetching'; },
    get isPlaying() { return currentValue === 'playing'; },
    get isPaused() { return currentValue === 'paused'; },
    get isError() { return currentValue === 'error'; },
    get isSuccess() { return currentValue === 'success' || currentValue === 'synced'; }
  };

  return [state, send, updateContext];
}
