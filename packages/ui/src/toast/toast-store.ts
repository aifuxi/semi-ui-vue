import { ToastListFoundation, type ToastListAdapter } from '@workspace/foundation-integration';
import { markRaw, shallowReactive } from 'vue';

import type { ToastEntry, ToastId, ToastOptions } from './types';

interface ToastListState {
  list: ToastEntry[];
  mouseInSide: boolean;
  removedItems: ToastEntry[];
  updatedItems: ToastEntry[];
}

const LEAVE_FALLBACK_MS = 340;

export class ToastStore {
  readonly state = shallowReactive<ToastListState>({
    list: [],
    mouseInSide: false,
    removedItems: [],
    updatedItems: [],
  });

  readonly animated: boolean;
  stack = false;

  private readonly cache = new Map<string, unknown>();
  private innerWrapper: HTMLElement | undefined;
  private readonly removalTimers = new Map<ToastId, ReturnType<typeof setTimeout>>();
  private readonly foundation: ToastListFoundation<
    Record<string, never>,
    ToastListState,
    ToastEntry
  >;

  constructor(animated: boolean) {
    this.animated = animated;
    const adapter: ToastListAdapter<Record<string, never>, ToastListState, ToastEntry> = {
      getContext: () => undefined,
      getContexts: () => undefined,
      getProp: () => undefined,
      getProps: () => ({}),
      getState: (key) => this.state[key as keyof ToastListState],
      getStates: () => this.state,
      setState: (nextState, callback) => {
        Object.assign(this.state, nextState);
        callback?.();
      },
      getCache: (key) => this.cache.get(key),
      getCaches: () => this.cache,
      setCache: (key, value) => this.cache.set(String(key), value),
      stopPropagation: (event) => event.stopPropagation?.(),
      persistEvent: () => undefined,
      updateToast: (list, removedItems, updatedItems) => {
        this.state.list = [...list];
        this.state.removedItems = removedItems.map((entry) => ({ ...entry, phase: 'leave' }));
        this.state.updatedItems = [...updatedItems];
        for (const entry of this.state.removedItems) {
          if (!this.animated || entry.motion === false) this.finishRemove(entry.id);
          else this.scheduleRemovalFallback(entry.id);
        }
      },
      handleMouseInSideChange: (mouseInSide) => {
        this.state.mouseInSide = mouseInSide;
      },
      getInputWrapperRect: () => this.innerWrapper?.getBoundingClientRect(),
    };
    this.foundation = markRaw(new ToastListFoundation(adapter));
  }

  add(entry: ToastEntry): void {
    this.foundation.addToast(entry);
  }

  has(id: ToastId): boolean {
    return this.foundation.hasToast(id);
  }

  update(id: ToastId, options: ToastOptions & Partial<ToastEntry>): void {
    const current = this.state.list.find((entry) => entry.id === id);
    if (!current) return;
    this.foundation.updateToast(id, {
      ...options,
      id,
      phase: current.phase,
      revision: current.revision + 1,
    });
  }

  remove(id: ToastId): void {
    this.foundation.removeToast(id);
  }

  finishEnter(id: ToastId): void {
    this.state.list = this.state.list.map((entry) =>
      entry.id === id ? { ...entry, phase: 'stable' } : entry,
    );
  }

  finishRemove(id: ToastId): void {
    const timer = this.removalTimers.get(id);
    if (timer) clearTimeout(timer);
    this.removalTimers.delete(id);
    this.state.removedItems = this.state.removedItems.filter((entry) => entry.id !== id);
  }

  setMouseInside(mouseInSide: boolean): void {
    this.foundation.handleMouseInSideChange(mouseInSide);
  }

  getInnerWrapperRect(): DOMRect | undefined {
    return this.foundation.getInputWrapperRect();
  }

  setInnerWrapper(element: HTMLElement | undefined): void {
    this.innerWrapper = element;
  }

  destroyAll(): void {
    this.foundation.destroyAll();
  }

  destroy(): void {
    for (const timer of this.removalTimers.values()) clearTimeout(timer);
    this.removalTimers.clear();
    this.state.list = [];
    this.state.removedItems = [];
    this.state.updatedItems = [];
    this.state.mouseInSide = false;
    this.innerWrapper = undefined;
  }

  private scheduleRemovalFallback(id: ToastId): void {
    const current = this.removalTimers.get(id);
    if (current) clearTimeout(current);
    this.removalTimers.set(
      id,
      setTimeout(() => this.finishRemove(id), LEAVE_FALLBACK_MS),
    );
  }
}
