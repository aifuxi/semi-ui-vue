import {
  NotificationListFoundation,
  type NotificationListAdapter,
} from '@workspace/foundation-integration';
import { markRaw, shallowReactive } from 'vue';

import type { NotificationEntry, NotificationId, NotificationOptions } from './types';

interface NotificationListState {
  notices: NotificationEntry[];
  removedItems: NotificationEntry[];
  updatedItems: NotificationEntry[];
}

const LEAVE_FALLBACK_MS = 340;

export class NotificationStore {
  readonly state = shallowReactive<NotificationListState>({
    notices: [],
    removedItems: [],
    updatedItems: [],
  });

  private readonly cache = new Map<string, unknown>();
  private readonly removalTimers = new Map<NotificationId, ReturnType<typeof setTimeout>>();
  private readonly foundation: NotificationListFoundation<
    Record<string, never>,
    NotificationListState,
    NotificationEntry
  >;

  constructor(private readonly animated: boolean) {
    const adapter: NotificationListAdapter<
      Record<string, never>,
      NotificationListState,
      NotificationEntry
    > = {
      getContext: () => undefined,
      getContexts: () => undefined,
      getProp: () => undefined,
      getProps: () => ({}),
      getState: (key) => this.state[key as keyof NotificationListState],
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
      getNotices: () => this.state.notices,
      updateNotices: (notices, removedItems = [], updatedItems = []) => {
        this.state.notices = notices.map((entry) => ({
          ...entry,
          phase: this.animated ? entry.phase : 'stable',
        }));
        this.state.removedItems = removedItems.map((entry) => ({ ...entry, phase: 'leave' }));
        this.state.updatedItems = updatedItems;
        for (const entry of this.state.removedItems) {
          if (!this.animated) {
            this.finishRemove(entry.id);
          } else {
            this.scheduleRemovalFallback(entry.id);
          }
        }
      },
    };
    this.foundation = markRaw(new NotificationListFoundation(adapter));
  }

  add(entry: NotificationEntry): void {
    this.foundation.addNotice(entry);
  }

  has(id: NotificationId): boolean {
    return this.foundation.has(id);
  }

  update(id: NotificationId, options: NotificationOptions): void {
    const current = this.state.notices.find((entry) => entry.id === id);
    if (!current) return;
    this.foundation.update(id, {
      ...options,
      id,
      phase: current.phase,
      revision: current.revision + 1,
    });
  }

  remove(id: NotificationId): void {
    this.foundation.removeNotice(id);
  }

  finishEnter(id: NotificationId): void {
    this.state.notices = this.state.notices.map((entry) =>
      entry.id === id ? { ...entry, phase: 'stable' } : entry,
    );
  }

  finishRemove(id: NotificationId): void {
    const timer = this.removalTimers.get(id);
    if (timer) clearTimeout(timer);
    this.removalTimers.delete(id);
    this.state.removedItems = this.state.removedItems.filter((entry) => entry.id !== id);
  }

  destroyAll(): void {
    this.foundation.destroyAll();
  }

  destroy(): void {
    for (const timer of this.removalTimers.values()) clearTimeout(timer);
    this.removalTimers.clear();
    this.state.notices = [];
    this.state.removedItems = [];
    this.state.updatedItems = [];
  }

  private scheduleRemovalFallback(id: NotificationId): void {
    const current = this.removalTimers.get(id);
    if (current) clearTimeout(current);
    this.removalTimers.set(
      id,
      setTimeout(() => this.finishRemove(id), LEAVE_FALLBACK_MS),
    );
  }
}
