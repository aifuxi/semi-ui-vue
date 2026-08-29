import { createApp, defineComponent, h, markRaw, type App } from 'vue';

import { semiGlobal } from '../config-provider';

import NotificationHost from './NotificationHost.vue';
import { NotificationStore } from './notification-store';
import type {
  NotificationConfig,
  NotificationEntry,
  NotificationId,
  NotificationOptions,
  NotificationType,
} from './types';

interface Runtime {
  app: App;
  host: HTMLDivElement;
  store: NotificationStore;
}

interface RuntimeDefaults extends NotificationConfig {
  content: string;
  position: 'topRight';
  title: string;
  zIndex: number;
}

const INITIAL_DEFAULTS: RuntimeDefaults = {
  content: '',
  duration: 3,
  position: 'topRight',
  title: '',
  zIndex: 1010,
};
const defaults: RuntimeDefaults = { ...INITIAL_DEFAULTS };
let runtime: Runtime | undefined;
let idSeed = 0;
let wrapperSeed = 0;

function createId(prefix = 'notification'): NotificationId {
  idSeed += 1;
  return `${prefix}-${Date.now()}-${idSeed}`;
}

function ensureRuntime(options: NotificationOptions): Runtime {
  if (runtime) return runtime;
  if (typeof document === 'undefined') {
    throw new Error('Notification imperative methods are only available in a browser.');
  }
  const host = document.createElement('div');
  host.className = 'semi-notification-wrapper';
  wrapperSeed += 1;
  host.id = `semi-notification-wrapper-${wrapperSeed}`;
  host.style.zIndex = String(typeof options.zIndex === 'number' ? options.zIndex : defaults.zIndex);
  (options.getPopupContainer?.() ?? document.body).appendChild(host);
  const store = markRaw(new NotificationStore(true));
  const Root = defineComponent({
    name: 'ImperativeNotificationRoot',
    setup: () => () => h(NotificationHost, { store }),
  });
  const app = createApp(Root);
  app.mount(host);
  host.removeAttribute('data-v-app');
  runtime = { app, host, store };
  return runtime;
}

function mergeOptions(options: NotificationOptions, type: NotificationType): NotificationEntry {
  const globalOptions = semiGlobal.config.overrideDefaultProps?.Notification ?? {};
  const merged = {
    ...defaults,
    ...globalOptions,
    ...options,
    type,
  } as NotificationOptions & NotificationConfig;
  return {
    ...merged,
    id: merged.id ?? createId(),
    phase: 'enter',
    revision: 0,
    type,
  };
}

function add(type: NotificationType, options: NotificationOptions): NotificationId {
  const entry = mergeOptions(options, type);
  const current = ensureRuntime(entry);
  if (current.store.has(entry.id)) current.store.update(entry.id, entry);
  else current.store.add(entry);
  return entry.id;
}

export const imperativeMethods = {
  close(id: NotificationId): NotificationId {
    runtime?.store.remove(id);
    return id;
  },
  error: (options: NotificationOptions) => add('error', options),
  info: (options: NotificationOptions) => add('info', options),
  open: (options: NotificationOptions) => add('default', options),
  success: (options: NotificationOptions) => add('success', options),
  warning: (options: NotificationOptions) => add('warning', options),
};

export function config(options: NotificationConfig): void {
  for (const property of ['top', 'left', 'bottom', 'right'] as const) {
    if (property in options) {
      const value = options[property];
      if (value === undefined) delete defaults[property];
      else defaults[property] = value;
    }
  }
  if (typeof options.zIndex === 'number') defaults.zIndex = options.zIndex;
  if (typeof options.duration === 'number') defaults.duration = options.duration;
  if (typeof options.position === 'string') defaults.position = options.position as 'topRight';
}

export function destroyAll(): void {
  if (!runtime) return;
  runtime.store.destroyAll();
  runtime.store.destroy();
  runtime.app.unmount();
  runtime.host.remove();
  runtime = undefined;
}

export function resetNotificationForTests(): void {
  destroyAll();
  Object.assign(defaults, INITIAL_DEFAULTS);
  idSeed = 0;
  wrapperSeed = 0;
}
