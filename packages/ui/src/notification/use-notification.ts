import { defineComponent, h, markRaw, onBeforeUnmount, type Component } from 'vue';

import NotificationHost from './NotificationHost.vue';
import { NotificationStore } from './notification-store';
import type {
  NotificationEntry,
  NotificationId,
  NotificationMethods,
  NotificationOptions,
  NotificationType,
  NotificationUseResult,
} from './types';

let hookId = 0;

function createHookId(): NotificationId {
  hookId += 1;
  return `semi_notice_${Date.now()}-${hookId}`;
}

export function useNotification(): NotificationUseResult {
  const store = markRaw(new NotificationStore(false));

  function add(type: NotificationType, options: NotificationOptions): NotificationId {
    const entry: NotificationEntry = {
      content: '',
      duration: 3,
      position: 'topRight',
      title: '',
      zIndex: 1010,
      ...options,
      id: createHookId(),
      phase: 'stable',
      revision: 0,
      type,
    };
    store.add(entry);
    return entry.id;
  }

  const methods: NotificationMethods = {
    close: (id) => {
      store.remove(id);
      return id;
    },
    error: (options) => add('error', options),
    info: (options) => add('info', options),
    open: (options) => add('default', options),
    success: (options) => add('success', options),
    warning: (options) => add('warning', options),
  };
  const ContextHolder = markRaw(
    defineComponent({
      name: 'NotificationContextHolder',
      setup: () => {
        onBeforeUnmount(() => store.destroy());
        return () => h(NotificationHost, { store });
      },
    }) as Component,
  );
  return [methods, ContextHolder] as const;
}
