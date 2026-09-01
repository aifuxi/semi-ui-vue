import cloneDeepWith from 'lodash/cloneDeepWith.js';
import set from 'lodash/set.js';
import { isVNode, type VNode } from 'vue';

import semiGlobal from './semi-global';

export { default as semiGlobal } from './semi-global';

export interface WrappedEvent {
  nativeEvent?: { stopImmediatePropagation?: () => void };
  stopPropagation?: () => void;
}

export function stopPropagation(event: WrappedEvent | undefined, noImmediate = false): void {
  event?.stopPropagation?.();
  if (!noImmediate) event?.nativeEvent?.stopImmediatePropagation?.();
}

export function cloneDeep<Value>(value: Value): Value;
export function cloneDeep<Value, Result>(
  value: Value,
  customizer: (value: unknown) => Result | undefined,
): Value | Result;
export function cloneDeep(value: unknown, customizer?: (value: unknown) => unknown): unknown {
  return cloneDeepWith(value, (candidate: unknown) => {
    if (customizer) return customizer(candidate);
    if (
      typeof candidate === 'function' ||
      isVNode(candidate) ||
      Object.prototype.toString.call(candidate) === '[object Error]'
    ) {
      return candidate;
    }
    if (Array.isArray(candidate) && candidate.length === 0) {
      const keys = Object.keys(candidate);
      if (keys.length === 0) return undefined;
      const restored: unknown[] = [];
      for (const key of keys) set(restored, key, candidate[key as keyof typeof candidate]);
      if (import.meta.env.DEV) {
        console.warn(
          '[Semi] An out-of-bounds array was detected; values were restored from enumerable keys.',
        );
      }
      return restored;
    }
    return undefined;
  });
}

export interface RegisterMediaQueryOption {
  match?: (event: MediaQueryList | MediaQueryListEvent) => void;
  unmatch?: (event: MediaQueryList | MediaQueryListEvent) => void;
  callInInit?: boolean;
}

export function registerMediaQuery(
  media: string,
  { match, unmatch, callInInit = true }: RegisterMediaQueryOption,
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }
  const mediaQueryList = window.matchMedia(media);
  const handleChange = (event: MediaQueryList | MediaQueryListEvent): void => {
    if (event.matches) match?.(event);
    else unmatch?.(event);
  };
  if (callInInit) handleChange(mediaQueryList);
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }
  mediaQueryList.addListener(handleChange);
  return () => mediaQueryList.removeListener(handleChange);
}

export function isSemiIcon(icon: unknown): icon is VNode {
  if (!isVNode(icon)) return false;
  const type = icon.type;
  return (
    (typeof type === 'function' || (typeof type === 'object' && type !== null)) &&
    'elementType' in type &&
    type.elementType === 'Icon'
  );
}

export function getActiveElement(): HTMLElement | null {
  return typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null);
}

export function isNodeContainsFocus(node: HTMLElement): boolean {
  const activeElement = getActiveElement();
  return activeElement !== null && (activeElement === node || node.contains(activeElement));
}

const focusableSelectors = [
  "input:not([disabled]):not([tabindex='-1'])",
  "textarea:not([disabled]):not([tabindex='-1'])",
  "button:not([disabled]):not([tabindex='-1'])",
  "a[href]:not([tabindex='-1'])",
  "select:not([disabled]):not([tabindex='-1'])",
  "area[href]:not([tabindex='-1'])",
  "iframe:not([tabindex='-1'])",
  "object:not([tabindex='-1'])",
  "*[tabindex]:not([tabindex='-1'])",
  "*[contenteditable]:not([tabindex='-1'])",
].join(',');

export function getFocusableElements(node: HTMLElement): HTMLElement[] {
  if (typeof HTMLElement === 'undefined' || !(node instanceof HTMLElement)) return [];
  return Array.from(node.querySelectorAll<HTMLElement>(focusableSelectors));
}

export async function runAfterTicks(
  callback: (...args: never[]) => unknown,
  numberOfTicks: number,
): Promise<void> {
  if (numberOfTicks <= 0) {
    await callback();
    return;
  }
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      void runAfterTicks(callback, numberOfTicks - 1).then(resolve);
    }, 0);
  });
}

export function getScrollbarWidth(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

export function getDefaultPropsFromGlobalConfig<Defaults extends Record<string, unknown>>(
  componentName: string,
  semiDefaultProps: Defaults,
): Defaults;
export function getDefaultPropsFromGlobalConfig(
  componentName: string,
  semiDefaultProps?: Record<string, unknown>,
): Record<string, unknown>;
export function getDefaultPropsFromGlobalConfig(
  componentName: string,
  semiDefaultProps: Record<string, unknown> = {},
): Record<string, unknown> {
  const getOverrides = (): Record<string, unknown> =>
    semiGlobal.config.overrideDefaultProps?.[componentName] ?? {};
  return new Proxy(
    { ...semiDefaultProps },
    {
      get(target, key, receiver) {
        const overrides = getOverrides();
        return key in overrides ? Reflect.get(overrides, key) : Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver);
      },
      ownKeys(target) {
        return Array.from(
          new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(getOverrides())]),
        );
      },
      getOwnPropertyDescriptor(target, key) {
        const overrides = getOverrides();
        return key in overrides
          ? Reflect.getOwnPropertyDescriptor(overrides, key)
          : Reflect.getOwnPropertyDescriptor(target, key);
      },
    },
  );
}
