import { computed, onBeforeUnmount, shallowRef, watch, type ComputedRef } from 'vue';

import { DEFAULT_BREAKPOINT_SCREENS } from './constants';
import { CONFIG_BREAKPOINTS } from './types';
import type {
  Breakpoint,
  BreakpointScreens,
  OnBreakpoint,
  OnBreakpointChangeCallback,
  OnBreakpointScreensCallback,
  ResponsiveMap,
} from './types';

interface ChangeSubscription {
  breakpoints?: readonly Breakpoint[];
  callback: OnBreakpointChangeCallback;
}

export function useResponsiveObserve(
  enabled: ComputedRef<boolean>,
  responsiveMap: ComputedRef<ResponsiveMap>,
): { screens: ComputedRef<Readonly<BreakpointScreens>>; onBreakpoint: OnBreakpoint } {
  const screensState = shallowRef<Readonly<BreakpointScreens>>({ ...DEFAULT_BREAKPOINT_SCREENS });
  const screenListeners = new Set<OnBreakpointScreensCallback>();
  const changeListeners = new Set<ChangeSubscription>();
  let unregisters: Array<() => void> = [];
  let registered = false;
  let warned = false;

  const hasSubscribers = (): boolean => screenListeners.size > 0 || changeListeners.size > 0;

  const unregister = (): void => {
    for (const unregisterMediaQuery of unregisters) unregisterMediaQuery();
    unregisters = [];
    registered = false;
  };

  const notify = (screen: Breakpoint, matches: boolean): void => {
    for (const listener of screenListeners) listener(screensState.value);
    for (const subscription of changeListeners) {
      if (!subscription.breakpoints || subscription.breakpoints.includes(screen)) {
        subscription.callback(screen, matches);
      }
    }
  };

  const register = (): void => {
    if (registered) return;

    const initialScreens: BreakpointScreens = { ...DEFAULT_BREAKPOINT_SCREENS };
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      for (const screen of CONFIG_BREAKPOINTS) {
        initialScreens[screen] = window.matchMedia(responsiveMap.value[screen]).matches;
      }
    }
    screensState.value = initialScreens;

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      unregisters = CONFIG_BREAKPOINTS.map((screen) => {
        const mediaQueryList = window.matchMedia(responsiveMap.value[screen]);
        const handleChange = (event: MediaQueryListEvent): void => {
          if (screensState.value[screen] === event.matches) return;
          screensState.value = { ...screensState.value, [screen]: event.matches };
          notify(screen, event.matches);
        };
        if (typeof mediaQueryList.addEventListener === 'function') {
          mediaQueryList.addEventListener('change', handleChange);
          return () => mediaQueryList.removeEventListener('change', handleChange);
        }
        mediaQueryList.addListener(handleChange);
        return () => mediaQueryList.removeListener(handleChange);
      });
    }
    registered = true;
  };

  const ensureRegistered = (): void => {
    if (!enabled.value) {
      if (!warned && import.meta.env.DEV) {
        warned = true;
        console.warn(
          '[Semi] ConfigProvider responsive observing is disabled by default. Set responsiveObserve to enable breakpoint subscriptions.',
        );
      }
      return;
    }
    if (hasSubscribers()) register();
  };

  const maybeUnregister = (): void => {
    if (enabled.value && !hasSubscribers()) unregister();
  };

  const onBreakpoint = ((
    arg1: OnBreakpointScreensCallback | readonly Breakpoint[],
    arg2?: OnBreakpointChangeCallback,
  ): (() => void) => {
    if (typeof arg1 === 'function') {
      screenListeners.add(arg1);
      ensureRegistered();
      arg1(screensState.value);
      return () => {
        screenListeners.delete(arg1);
        maybeUnregister();
      };
    }

    const subscription: ChangeSubscription = { breakpoints: arg1, callback: arg2! };
    changeListeners.add(subscription);
    ensureRegistered();
    if (typeof arg2 === 'function') {
      for (const screen of arg1) arg2(screen, screensState.value[screen]);
    }
    return () => {
      changeListeners.delete(subscription);
      maybeUnregister();
    };
  }) as OnBreakpoint;

  watch(enabled, (nextEnabled, previousEnabled) => {
    if (previousEnabled && !nextEnabled) unregister();
    if (!previousEnabled && nextEnabled) ensureRegistered();
  });

  watch(responsiveMap, () => {
    if (!registered) return;
    unregister();
    register();
  });

  onBeforeUnmount(() => {
    unregister();
    screenListeners.clear();
    changeListeners.clear();
  });

  return { screens: computed(() => screensState.value), onBreakpoint };
}
