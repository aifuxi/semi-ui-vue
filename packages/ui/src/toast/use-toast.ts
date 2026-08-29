import { defineComponent, h, markRaw, onBeforeUnmount, type Component } from 'vue';

import ToastHost from './ToastHost.vue';
import { ToastStore } from './toast-store';
import type {
  ToastEntry,
  ToastId,
  ToastMethods,
  ToastOptions,
  ToastType,
  ToastUseResult,
} from './types';

let hookId = 0;

function createHookId(): ToastId {
  hookId += 1;
  return `semi_toast_${Date.now()}-${hookId}`;
}

export function useToast(): ToastUseResult {
  const store = markRaw(new ToastStore(false));

  function add(type: ToastType, options: ToastOptions): ToastId {
    const entry: ToastEntry = {
      content: '',
      duration: 3,
      motion: true,
      showClose: true,
      stack: false,
      textMaxWidth: 450,
      theme: 'normal',
      zIndex: 1010,
      ...options,
      id: createHookId(),
      phase: 'stable',
      revision: 0,
      type,
    };
    store.stack = Boolean(entry.stack);
    store.add(entry);
    return entry.id;
  }

  const methods: ToastMethods = {
    close: (inputId) => {
      const id = String(inputId);
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
      name: 'ToastContextHolder',
      setup: () => {
        onBeforeUnmount(() => store.destroy());
        return () => h(ToastHost, { store });
      },
    }) as Component,
  );
  return [methods, ContextHolder] as const;
}
