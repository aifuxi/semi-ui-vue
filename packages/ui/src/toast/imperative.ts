import { createApp, defineComponent, h, markRaw, type App } from 'vue';

import { semiGlobal } from '../config-provider';

import ToastHost from './ToastHost.vue';
import { ToastStore } from './toast-store';
import type {
  ToastConfig,
  ToastEntry,
  ToastId,
  ToastInput,
  ToastOptions,
  ToastStaticMethods,
  ToastType,
} from './types';
import { useToast } from './use-toast';

interface Runtime {
  app: App;
  host: HTMLDivElement;
  store: ToastStore;
}

interface RuntimeDefaults extends ToastOptions {
  content: string;
  duration: number;
  motion: boolean;
  showClose: boolean;
  stack: boolean;
  textMaxWidth: number;
  theme: 'normal' | 'light';
  zIndex: number;
}

const INITIAL_DEFAULTS: RuntimeDefaults = {
  content: '',
  duration: 3,
  motion: true,
  showClose: true,
  stack: false,
  textMaxWidth: 450,
  theme: 'normal',
  zIndex: 1010,
};
let idSeed = 0;
let wrapperSeed = 0;

function createId(): ToastId {
  idSeed += 1;
  return `toast-${Date.now()}-${idSeed}`;
}

function normalizeInput(input: ToastInput): ToastOptions {
  return typeof input === 'string' ? { content: input } : input;
}

function setOffsets(host: HTMLElement, options: ToastOptions): void {
  for (const property of ['top', 'left', 'bottom', 'right'] as const) {
    if (property in options) {
      const value = options[property];
      host.style[property] =
        value === undefined ? '' : typeof value === 'number' ? `${value}px` : value;
    }
  }
}

export function createToastStatic(initialConfig?: ToastConfig): ToastStaticMethods {
  const defaults: RuntimeDefaults = { ...INITIAL_DEFAULTS };
  let runtime: Runtime | undefined;
  let wrapperId: string | null = null;

  function configure(options: ToastConfig): void {
    for (const property of ['top', 'left', 'bottom', 'right'] as const) {
      if (property in options) {
        const value = options[property];
        if (value === undefined) delete defaults[property];
        else defaults[property] = value;
      }
    }
    if (typeof options.zIndex === 'number') defaults.zIndex = options.zIndex;
    if (typeof options.duration === 'number') defaults.duration = options.duration;
    if (options.theme === 'normal' || options.theme === 'light') defaults.theme = options.theme;
    if (typeof options.getPopupContainer === 'function') {
      defaults.getPopupContainer = options.getPopupContainer;
    }
  }

  if (initialConfig) configure(initialConfig);

  function ensureRuntime(options: ToastEntry): Runtime {
    if (runtime) {
      setOffsets(runtime.host, options);
      return runtime;
    }
    if (typeof document === 'undefined') {
      throw new Error('Toast imperative methods are only available in a browser.');
    }
    const host = document.createElement('div');
    host.className = 'semi-toast-wrapper';
    wrapperSeed += 1;
    wrapperId = `semi-toast-wrapper-${wrapperSeed}`;
    host.id = wrapperId;
    host.style.zIndex = String(options.zIndex);
    setOffsets(host, options);
    const container = options.getPopupContainer ? options.getPopupContainer() : document.body;
    if (!container) throw new Error('Toast getPopupContainer must return an HTMLElement.');
    container.appendChild(host);
    const store = markRaw(new ToastStore(true));
    store.stack = Boolean(options.stack);
    store.add(options);
    const Root = defineComponent({
      name: 'ImperativeToastRoot',
      setup: () => () => h(ToastHost, { store }),
    });
    const app = createApp(Root);
    app.mount(host);
    host.removeAttribute('data-v-app');
    runtime = { app, host, store };
    return runtime;
  }

  function mergeEntry(input: ToastInput, type: ToastType): ToastEntry {
    const options = normalizeInput(input);
    const globalOptions = (semiGlobal.config.overrideDefaultProps?.Toast ?? {}) as ToastOptions;
    const merged: ToastOptions = {
      ...defaults,
      ...globalOptions,
      ...options,
      type,
    };
    return {
      ...merged,
      id: merged.id === undefined ? createId() : String(merged.id),
      motion: merged.motion ?? true,
      phase: 'enter',
      revision: 0,
      type,
    };
  }

  function add(type: ToastType, input: ToastInput): ToastId {
    const entry = mergeEntry(input, type);
    const isFirstEntry = runtime === undefined;
    const current = ensureRuntime(entry);
    current.store.stack = Boolean(entry.stack);
    if (isFirstEntry) return entry.id;
    if (current.store.has(entry.id)) current.store.update(entry.id, entry);
    else current.store.add(entry);
    return entry.id;
  }

  const methods: ToastStaticMethods = {
    close(inputId) {
      const id = String(inputId);
      runtime?.store.remove(id);
      return id;
    },
    config: configure,
    destroyAll() {
      if (!runtime) return;
      runtime.store.destroyAll();
      runtime.store.destroy();
      runtime.app.unmount();
      runtime.host.remove();
      runtime = undefined;
      wrapperId = null;
    },
    error: (input) => add('error', input),
    getWrapperId: () => wrapperId,
    info: (input) => add('info', input),
    success: (input) => add('success', input),
    useToast,
    warning: (input) => add('warning', input),
  };
  return methods;
}

export function resetToastSeedsForTests(): void {
  idSeed = 0;
  wrapperSeed = 0;
}
