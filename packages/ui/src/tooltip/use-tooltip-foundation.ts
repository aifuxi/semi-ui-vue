import {
  TooltipFoundation,
  type TooltipAdapter,
  type TooltipPopupContainerRect,
} from '@workspace/foundation-integration';
import {
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  watch,
  type ComponentPublicInstance,
  type ComputedRef,
} from 'vue';

import type { ConfigContextValue } from '../config-provider';

import type { TooltipPosition, TooltipRuntimeProps, TooltipState } from './types';

interface TooltipFoundationOptions {
  config: ComputedRef<ConfigContextValue>;
  onAfterClose: () => void;
  onClickOutside: (event: MouseEvent) => void;
  onEscKeydown: (event: KeyboardEvent) => void;
  onVisibleChange: (visible: boolean) => void;
  runtimeProps: ComputedRef<TooltipRuntimeProps>;
}

interface EventBus {
  emit(name: string): void;
  off(name: string, handler?: () => void): void;
  on(name: string, handler: () => void): void;
}

function createEventBus(): EventBus {
  const listeners = new Map<string, Set<() => void>>();
  return {
    emit(name) {
      for (const listener of [...(listeners.get(name) ?? [])]) listener();
    },
    off(name, handler) {
      if (!handler) {
        listeners.delete(name);
        return;
      }
      listeners.get(name)?.delete(handler);
    },
    on(name, handler) {
      const handlers = listeners.get(name) ?? new Set<() => void>();
      handlers.add(handler);
      listeners.set(name, handlers);
    },
  };
}

function rectToObject(rect: DOMRect): TooltipPopupContainerRect {
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
  };
}

function getFocusableElements(node: HTMLElement | null): HTMLElement[] {
  if (!node) return [];
  const selectors = [
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
  ];
  return Array.from(node.querySelectorAll<HTMLElement>(selectors.join(',')));
}

function randomPopupId(): string {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: 7 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length)),
  ).join('');
}

export function useTooltipFoundation(options: TooltipFoundationOptions) {
  const state = shallowReactive<TooltipState>({
    containerStyle: {},
    displayNone: false,
    id: options.runtimeProps.value.wrapperId,
    isInsert: false,
    isPositionUpdated: false,
    placement: options.runtimeProps.value.position,
    portalEventSet: {},
    transitionState: '',
    triggerEventSet: {},
    visible: false,
  });
  const portalTarget = shallowRef<HTMLElement | null>(null);
  const portalElement = shallowRef<HTMLDivElement | null>(null);
  const triggerElement = shallowRef<HTMLElement | null>(null);
  const initialFocusElement = shallowRef<HTMLElement | null>(null);
  const cache = new Map<string, unknown>();
  const bus = createEventBus();

  let mounted = false;
  let isAnimating = false;
  let popupContainer: HTMLElement | null = null;
  let popupContainerGetter: (() => HTMLElement) | undefined;
  let containerPosition: string | undefined;
  let clickOutsideHandler: ((event: MouseEvent) => void) | undefined;
  let resizeHandler: (() => void) | undefined;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollHandler: ((event: Event) => void) | undefined;
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;
  let popupResizeObserver: ResizeObserver | undefined;
  let popupResizeTimer: ReturnType<typeof setTimeout> | undefined;
  let popupSafetyTimer: ReturnType<typeof setTimeout> | undefined;
  let containerPositionFrame: number | undefined;

  function getFoundationProps(): TooltipRuntimeProps {
    return options.runtimeProps.value;
  }

  function updatePortalHost(): void {
    const host = portalTarget.value;
    if (!host) return;
    host.className = [
      'semi-portal',
      options.config.value.direction === 'rtl' ? 'semi-portal-rtl' : undefined,
    ]
      .filter(Boolean)
      .join(' ');
    host.style.zIndex = String(options.runtimeProps.value.zIndex);
  }

  function ensurePortalHost(): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    if (portalTarget.value?.isConnected) {
      updatePortalHost();
      return portalTarget.value;
    }
    popupContainer ??= popupContainerGetter?.() ?? document.body;
    const host = document.createElement('div');
    portalTarget.value = host;
    updatePortalHost();
    popupContainer.appendChild(host);
    return host;
  }

  function disconnectPopupResizeObserver(): void {
    if (popupResizeTimer) clearTimeout(popupResizeTimer);
    if (popupSafetyTimer) clearTimeout(popupSafetyTimer);
    popupResizeObserver?.disconnect();
    popupResizeObserver = undefined;
    popupResizeTimer = undefined;
    popupSafetyTimer = undefined;
  }

  function removePortalHost(): void {
    disconnectPopupResizeObserver();
    const host = portalTarget.value;
    if (host?.parentNode) host.parentNode.removeChild(host);
    portalTarget.value = null;
    portalElement.value = null;
  }

  function emitPortalInsertedWhenReady(): void {
    const emit = () => {
      if (state.transitionState === 'enter') bus.emit('portalInserted');
    };
    const element = portalElement.value;
    if (!element) {
      popupSafetyTimer = setTimeout(emit, 0);
      return;
    }
    if (typeof ResizeObserver !== 'undefined') {
      let emitted = false;
      let lastWidth = element.offsetWidth;
      let lastHeight = element.offsetHeight;
      const emitOnce = () => {
        if (emitted) return;
        emitted = true;
        emit();
      };
      popupResizeObserver = new ResizeObserver(() => {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        if (width <= 0 || height <= 0) return;
        const sizeChanged = width !== lastWidth || height !== lastHeight;
        lastWidth = width;
        lastHeight = height;
        if (!emitted) {
          emitOnce();
        } else if (sizeChanged && state.transitionState === 'enter') {
          if (popupResizeTimer) clearTimeout(popupResizeTimer);
          popupResizeTimer = setTimeout(() => {
            if (state.transitionState === 'enter') foundation.calcPosition();
          }, 0);
        }
      });
      popupResizeObserver.observe(element);
      if (lastWidth > 0 && lastHeight > 0) emitOnce();
      popupSafetyTimer = setTimeout(emitOnce, 50);
      return;
    }
    popupSafetyTimer = setTimeout(
      emit,
      element.offsetWidth > 0 && element.offsetHeight > 0 ? 0 : 0,
    );
  }

  const adapter: TooltipAdapter<TooltipRuntimeProps, TooltipState> = {
    canMotion: () => options.runtimeProps.value.motion,
    containerIsBody: () => popupContainer === document.body,
    containerIsRelative: () =>
      Boolean(popupContainer && window.getComputedStyle(popupContainer).position === 'relative'),
    containerIsRelativeOrAbsolute: () =>
      containerPosition === 'relative' || containerPosition === 'absolute',
    getActiveElement: () => document.activeElement,
    getAnimatingState: () => isAnimating,
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    getContainer: () => portalElement.value,
    getContainerPosition: () => containerPosition,
    getContext: () => undefined,
    getContexts: () => undefined,
    getDocumentElementBounding: () => document.documentElement.getBoundingClientRect(),
    getEventName: () => ({
      blur: 'onBlur',
      click: 'onClick',
      contextMenu: 'onContextmenu',
      focus: 'onFocus',
      keydown: 'onKeydown',
      mouseEnter: 'onMouseenter',
      mouseLeave: 'onMouseleave',
      mouseOut: 'onMouseout',
      mouseOver: 'onMouseover',
    }),
    getFocusableElements,
    getPopupContainerRect: () => {
      const container = popupContainer;
      if (!container) return null;
      return {
        ...rectToObject(container.getBoundingClientRect()),
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
      };
    },
    getProp: (key) => getFoundationProps()[key as keyof TooltipRuntimeProps],
    getProps: getFoundationProps,
    getState: (key) => state[key as keyof TooltipState],
    getStates: () => state,
    getTriggerBounding: () => triggerElement.value?.getBoundingClientRect(),
    getTriggerDOM: () => triggerElement.value,
    getTriggerNode: () => triggerElement.value,
    getWrapperBounding: () => portalElement.value?.getBoundingClientRect(),
    insertPortal: (_content, style) => {
      ensurePortalHost();
      disconnectPopupResizeObserver();
      state.isInsert = true;
      state.transitionState = 'enter';
      state.containerStyle = {
        ...state.containerStyle,
        ...(style as Record<string, string | number>),
      };
      state.isPositionUpdated = false;
      void nextTick(emitPortalInsertedWhenReady);
    },
    notifyEscKeydown: options.onEscKeydown,
    notifyVisibleChange: options.onVisibleChange,
    off: bus.off,
    on: bus.on,
    persistEvent: () => undefined,
    registerClickOutsideHandler: (callback) => {
      adapter.unregisterClickOutsideHandler();
      clickOutsideHandler = (event) => {
        if (!mounted) return;
        const target = event.target;
        const path = event.composedPath?.() ?? (target ? [target] : []);
        const trigger = triggerElement.value;
        const popup = portalElement.value;
        const inTrigger = Boolean(
          (target instanceof Node && trigger?.contains(target)) ||
          (trigger && path.includes(trigger)),
        );
        const inPopup = Boolean(
          (target instanceof Node && popup?.contains(target)) || (popup && path.includes(popup)),
        );
        if (
          (!inTrigger && !inPopup) ||
          (options.runtimeProps.value.clickTriggerToHide && inTrigger)
        ) {
          options.onClickOutside(event);
          callback();
        }
      };
      window.addEventListener('mousedown', clickOutsideHandler);
    },
    registerPortalEvent: (events) => {
      state.portalEventSet = events as TooltipState['portalEventSet'];
    },
    registerResizeHandler: (callback) => {
      adapter.unregisterResizeHandler();
      resizeHandler = () => {
        if (resizeTimer) return;
        resizeTimer = setTimeout(() => {
          resizeTimer = undefined;
          if (mounted) callback();
        }, 10);
      };
      window.addEventListener('resize', resizeHandler);
    },
    registerScrollHandler: (callback) => {
      adapter.unregisterScrollHandler();
      scrollHandler = (event) => {
        if (scrollTimer) return;
        scrollTimer = setTimeout(() => {
          scrollTimer = undefined;
          if (!mounted || !(event.target instanceof Node)) return;
          const trigger = triggerElement.value;
          if (trigger && event.target.contains(trigger)) {
            const scrollTarget =
              event.target instanceof HTMLElement ? event.target : document.documentElement;
            callback({
              x: scrollTarget.scrollLeft,
              y: scrollTarget.scrollTop,
            });
          }
        }, 10);
      };
      window.addEventListener('scroll', scrollHandler, true);
    },
    registerTriggerEvent: (events) => {
      state.triggerEventSet = events as TooltipState['triggerEventSet'];
    },
    removePortal: () => {
      state.isInsert = false;
      state.isPositionUpdated = false;
      void nextTick(removePortalHost);
    },
    setCache: (key, value) => cache.set(String(key), value),
    setDisplayNone: (displayNone, callback) => {
      state.displayNone = displayNone;
      if (callback) void nextTick(callback);
    },
    setId: () => {
      state.id = randomPopupId();
    },
    setInitialFocus: () => {
      const preventScroll = options.runtimeProps.value.preventScroll;
      initialFocusElement.value?.focus(preventScroll === undefined ? undefined : { preventScroll });
    },
    setPosition: ({ position, ...style }) => {
      state.containerStyle = {
        ...state.containerStyle,
        ...(style as Record<string, string | number>),
      };
      state.placement = position as TooltipPosition;
      state.isPositionUpdated = true;
      void nextTick(() => bus.emit('positionUpdated'));
    },
    setState: (nextState, callback) => {
      Object.assign(state, nextState);
      if (callback) void nextTick(callback);
    },
    stopPropagation: (event) => event?.stopPropagation?.(),
    togglePortalVisible: (visible, callback) => {
      state.transitionState = visible ? 'enter' : 'leave';
      state.visible = visible;
      void nextTick(callback);
    },
    unregisterClickOutsideHandler: () => {
      if (clickOutsideHandler) window.removeEventListener('mousedown', clickOutsideHandler);
      clickOutsideHandler = undefined;
    },
    unregisterResizeHandler: () => {
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeHandler = undefined;
      resizeTimer = undefined;
    },
    unregisterScrollHandler: () => {
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler, true);
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollHandler = undefined;
      scrollTimer = undefined;
    },
    updateContainerPosition: () => {
      const bodyPosition = document.body.getAttribute('data-position');
      if (bodyPosition) {
        containerPosition = bodyPosition;
        return;
      }
      containerPositionFrame = requestAnimationFrame(() => {
        if (!popupContainer) return;
        containerPosition = window.getComputedStyle(popupContainer).position;
        document.body.setAttribute('data-position', containerPosition);
      });
    },
    updatePlacementAttr: (placement) => {
      state.placement = placement as TooltipPosition;
    },
  };
  const foundation = markRaw(new TooltipFoundation<TooltipRuntimeProps, TooltipState>(adapter));

  function setTriggerElement(element: HTMLElement | null): void {
    triggerElement.value = element;
  }

  function setPortalElement(element: HTMLDivElement | null): void {
    portalElement.value = element;
  }

  function setInitialFocusElement(element: Element | ComponentPublicInstance | null): void {
    if (element instanceof HTMLElement) {
      initialFocusElement.value = element;
      return;
    }
    if (!element || element instanceof Element) {
      initialFocusElement.value = null;
      return;
    }
    initialFocusElement.value = element.$el instanceof HTMLElement ? element.$el : null;
  }

  function animationStart(): void {
    isAnimating = true;
  }

  function animationEnd(transitionState: 'enter' | 'leave'): void {
    isAnimating = false;
    if (transitionState !== 'leave') return;
    disconnectPopupResizeObserver();
    if (options.runtimeProps.value.keepDOM) {
      foundation.setDisplayNone(true);
    } else {
      adapter.removePortal();
    }
    foundation.unBindEvent();
    options.onAfterClose();
  }

  function hide(): void {
    foundation.hide();
  }

  function handleContainerKeydown(event: KeyboardEvent): void {
    foundation.handleContainerKeydown(event);
  }

  function rePosition(): Record<string, unknown> {
    return foundation.calcPosition();
  }

  function focusTrigger(): void {
    foundation.focusTrigger();
  }

  watch(
    () => options.runtimeProps.value.visible,
    (visible, previous) => {
      if (!mounted || visible === previous) return;
      if (
        options.runtimeProps.value.trigger === 'hover' ||
        options.runtimeProps.value.trigger === 'focus'
      ) {
        if (visible) foundation.delayShow();
        else foundation.delayHide();
      } else {
        if (visible) foundation.show();
        else foundation.hide();
      }
    },
  );
  watch(
    () => options.runtimeProps.value.rePosKey,
    (value, previous) => {
      if (mounted && value !== previous) foundation.calcPosition();
    },
  );
  watch(
    () => [options.config.value.direction, options.runtimeProps.value.zIndex] as const,
    updatePortalHost,
  );

  onMounted(() => {
    mounted = true;
    popupContainerGetter =
      options.runtimeProps.value.getPopupContainer ?? options.config.value.getPopupContainer;
    foundation.init();
    setTimeout(() => {
      if (triggerElement.value?.matches?.(':hover')) {
        state.triggerEventSet.onMouseenter?.();
      }
    }, 0);
  });

  onBeforeUnmount(() => {
    mounted = false;
    foundation.destroy();
    if (containerPositionFrame !== undefined) cancelAnimationFrame(containerPositionFrame);
    adapter.unregisterClickOutsideHandler();
    adapter.unregisterResizeHandler();
    adapter.unregisterScrollHandler();
    removePortalHost();
  });

  return {
    animationEnd,
    animationStart,
    focusTrigger,
    handleContainerKeydown,
    hide,
    portalTarget,
    rePosition,
    setInitialFocusElement,
    setPortalElement,
    setTriggerElement,
    state,
  };
}
