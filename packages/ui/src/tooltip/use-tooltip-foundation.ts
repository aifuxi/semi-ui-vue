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
import { mirrorThemeScope } from '../_utils/theme-scope';

interface InitialFocusTarget {
  focus: (options?: FocusOptions) => void;
}

interface TooltipFoundationOptions {
  config: ComputedRef<ConfigContextValue>;
  onAfterClose: () => void;
  onClickOutside: (event: MouseEvent) => void;
  onEscKeydown: (event: KeyboardEvent) => void;
  onVisibleChange: (visible: boolean) => void;
  popupId: string;
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

export function useTooltipFoundation(options: TooltipFoundationOptions) {
  const state = shallowReactive<TooltipState>({
    containerStyle: {},
    displayNone: false,
    id: options.runtimeProps.value.wrapperId ?? options.popupId,
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
  const initialFocusElement = shallowRef<InitialFocusTarget | null>(null);
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
  /** 默认 body Portal 的局部主题订阅，随宿主销毁一并释放。 */
  let stopThemeScope: (() => void) | undefined;

  /** 只为默认容器传递触发源主题，显式容器使用自身的级联。 */
  function syncPortalTheme(): void {
    stopThemeScope?.();
    stopThemeScope = undefined;
    /** 共享 Portal 宿主独立于用户传入的 popup style。 */
    const host = portalTarget.value;
    /** 触发器提供实际 DOM 声明位置及局部主题祖先。 */
    const source = triggerElement.value;
    if (host && source && !popupContainerGetter) stopThemeScope = mirrorThemeScope(source, host);
  }

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

  /** 创建默认或显式容器内的宿主，并为默认宿主关联触发源主题。 */
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
    syncPortalTheme();
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

  /** 释放宿主观察和 DOM，避免 keepDOM 之外留下主题订阅。 */
  function removePortalHost(): void {
    stopThemeScope?.();
    stopThemeScope = undefined;
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
    // click 模式的触发器关闭交给自身 click，其他模式仍按原 mousedown 语义处理。
    registerClickOutsideHandler: (callback) => {
      adapter.unregisterClickOutsideHandler();
      // 每次注册替换旧监听，闭包只引用当前实例的元素与选项。
      clickOutsideHandler = (event) => {
        if (!mounted) return;
        /** 实际按下位置，用于判断是否属于触发器或 Portal。 */
        const target = event.target;
        /** composedPath 保留 Shadow DOM 内的触发器归属。 */
        const path = event.composedPath?.() ?? (target ? [target] : []);
        /** 当前触发器可能由插槽更新，不能缓存旧节点。 */
        const trigger = triggerElement.value;
        /** 当前浮层节点，在默认或显式 Portal 容器内均按包含关系判断。 */
        const popup = portalElement.value;
        /** 原生包含关系与跨 Shadow DOM 的路径共同确定触发器内部操作。 */
        const inTrigger = Boolean(
          (target instanceof Node && trigger?.contains(target)) ||
          (trigger && path.includes(trigger)),
        );
        /** 浮层内部操作不应走外部点击关闭。 */
        const inPopup = Boolean(
          (target instanceof Node && popup?.contains(target)) || (popup && path.includes(popup)),
        );
        if (
          (!inTrigger && !inPopup) ||
          (options.runtimeProps.value.clickTriggerToHide &&
            inTrigger &&
            options.runtimeProps.value.trigger !== 'click')
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
    // 包装 Foundation 的 click 打开行为，让同一次点击只负责打开或关闭之一。
    registerTriggerEvent: (events) => {
      /** 固定 Foundation 产生的原始事件集，其他触发方式原样保留。 */
      const eventSet = events as TooltipState['triggerEventSet'];
      state.triggerEventSet = {
        ...eventSet,
        ...(options.runtimeProps.value.trigger === 'click'
          ? {
              // 同时支持鼠标点击与键盘生成的 click；避免 mousedown 关闭后又被 click 打开。
              onClick: (...args: unknown[]) => {
                if (options.runtimeProps.value.clickTriggerToHide && state.visible) {
                  options.onClickOutside(args[0] as MouseEvent);
                  foundation.hide();
                  return;
                }
                eventSet.onClick?.(...args);
              },
            }
          : {}),
      };
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
      state.id = options.popupId;
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

  /** 触发器换根时将现有弹层重新关联到新的主题祖先。 */
  function setTriggerElement(element: HTMLElement | null): void {
    if (triggerElement.value === element) return;
    triggerElement.value = element;
    syncPortalTheme();
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
    // The pinned React adapter invokes the ref's public focus method. Components
    // such as Input expose it while their root is a non-focusable wrapper.
    const publicTarget = element as ComponentPublicInstance & Partial<InitialFocusTarget>;
    initialFocusElement.value =
      typeof publicTarget.focus === 'function'
        ? (publicTarget as InitialFocusTarget)
        : element.$el instanceof HTMLElement
          ? element.$el
          : null;
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
    // 受控父级通过公开 visible 回传状态。
    () => options.runtimeProps.value.visible,
    // 仅在内部尚未处于相同方向的状态切换时驱动 Foundation。
    (visible, previous) => {
      if (!mounted || visible === previous) return;
      // v-model 回传不应重复执行 hide/show；入场尚未变为 visible 时仍允许外部取消。
      if (visible === state.visible && state.transitionState === (visible ? 'enter' : 'leave'))
        return;
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
    // Like React componentDidUpdate, measure after the trigger slot commits its new DOM.
    { flush: 'post' },
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
