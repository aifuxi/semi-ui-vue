import { SliderFoundation } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  reactive,
  shallowRef,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';

import type { ConfigContextValue } from '../config-provider';
import type { SliderEmits, SliderProps, SliderState, SliderValue } from './types';

interface UseSliderFoundationOptions {
  config: ComputedRef<ConfigContextValue>;
  emit: <Event extends keyof SliderEmits>(event: Event, ...args: SliderEmits[Event]) => void;
  maxHandle: Ref<HTMLSpanElement | null>;
  minHandle: Ref<HTMLSpanElement | null>;
  props: Readonly<SliderProps>;
  slider: Ref<HTMLDivElement | null>;
}

interface SliderFoundationController {
  checkAndUpdateIsInRenderTreeState(): boolean;
  computeHandleVisibleVal(
    visible: boolean | undefined,
    formatter: ((value: unknown) => unknown) | null | undefined,
    range: boolean,
  ): {
    tipVisible: { min: boolean; max: boolean };
    tipChildren: { min: unknown; max: unknown };
  };
  getMinAndMaxPercent(value: SliderValue): { min: number; max: number };
  handleKeyDown(event: KeyboardEvent, handler: 'min' | 'max'): void;
  handleWrapClick(event: MouseEvent): void;
  handleWrapperEnter(): void;
  handleWrapperLeave(): void;
  isMarkActive(mark: number): 'active' | 'unActive' | false;
  onBlur(event: FocusEvent, handler: 'min' | 'max'): void;
  onFocus(event: FocusEvent, handler: 'min' | 'max'): void;
  onHandleDown(event: MouseEvent, handler: 'min' | 'max'): boolean;
  onHandleEnter(position: 'min' | 'max'): void;
  onHandleLeave(): void;
  onHandleTouchStart(event: TouchEvent, handler: 'min' | 'max'): void;
  onHandleUp(event: MouseEvent | TouchEvent | KeyboardEvent): boolean;
}

interface UseSliderFoundationBinding {
  controlled: ComputedRef<boolean>;
  foundation: SliderFoundationController;
  state: SliderState;
}

function isInRenderTree(element: HTMLElement | null): boolean {
  if (!element) return false;
  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

function cloneSorted(value: SliderValue): SliderValue {
  return Array.isArray(value) ? [...value].sort((left, right) => left - right) : value;
}

export function useSliderFoundation(
  options: UseSliderFoundationOptions,
): UseSliderFoundationBinding {
  const { config, emit, maxHandle, minHandle, props, slider } = options;
  const instance = getCurrentInstance();
  function hasRawProp(name: string): boolean {
    const rawProps = instance?.vnode.props;
    const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    return Boolean(
      rawProps &&
      (Object.prototype.hasOwnProperty.call(rawProps, name) ||
        Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
    );
  }
  const modelControlled = computed(() => hasRawProp('modelValue'));
  const valueControlled = computed(() => hasRawProp('value'));
  const controlled = computed(() => modelControlled.value || valueControlled.value);
  const incomingValue = computed<SliderValue | undefined>(() =>
    modelControlled.value ? props.modelValue : valueControlled.value ? props.value : undefined,
  );
  const initialValue = incomingValue.value ?? props.defaultValue ?? (props.range ? [0, 0] : 0);
  const state = reactive<SliderState>({
    currentValue: initialValue,
    min: props.min ?? 0,
    max: props.max ?? 100,
    focusPos: '',
    onChange: undefined,
    disabled: props.disabled ?? false,
    chooseMovePos: '',
    isDrag: false,
    clickValue: 0,
    showBoundary: false,
    isInRenderTree: true,
    firstDotFocusVisible: false,
    secondDotFocusVisible: false,
  });
  const dragging = shallowRef<boolean[]>([false, false]);
  const cache = new Map<string, unknown>();
  const eventClearers = new Set<() => void>();
  const handleClearers = new Set<() => void>();

  const runtimeProps = computed<SliderProps>(() => {
    const result = { ...props } as SliderProps;
    if (controlled.value) result.value = incomingValue.value;
    else delete result.value;
    return result;
  });
  function addEventListener(
    target: HTMLElement | Window,
    name: string,
    callback: EventListenerOrEventListenerObject,
  ): () => void {
    target.addEventListener(name, callback);
    const clear = () => {
      target.removeEventListener(name, callback);
      eventClearers.delete(clear);
      handleClearers.delete(clear);
    };
    eventClearers.add(clear);
    return clear;
  }

  function clearHandleListeners(): void {
    for (const clear of [...handleClearers]) clear();
    handleClearers.clear();
  }

  const adapter = {
    getContext: (key: string) => (key === 'direction' ? config.value.direction : undefined),
    getContexts: () => ({ direction: config.value.direction }),
    getProp: (key: string) => runtimeProps.value[key as keyof SliderProps],
    getProps: () => runtimeProps.value,
    getState: (key: string) => state[key as keyof SliderState],
    getStates: () => state,
    setState: (nextState: Partial<SliderState>, callback?: () => void) => {
      Object.assign(state, nextState);
      callback?.();
    },
    getCache: (key: string) => cache.get(key),
    getCaches: () => cache,
    setCache: (key: unknown, value: unknown) => cache.set(String(key), value),
    stopPropagation: (event: { stopPropagation?: () => void }) => event.stopPropagation?.(),
    persistEvent: () => undefined,
    getSliderLengths: () => {
      const element = slider.value;
      if (!element) return { sliderX: 0, sliderY: 0, sliderWidth: 0, sliderHeight: 0 };
      const rect = element.getBoundingClientRect();
      const parentRect = element.offsetParent?.getBoundingClientRect();
      return {
        sliderX: parentRect ? rect.left - parentRect.left : element.offsetLeft,
        sliderY: parentRect ? rect.top - parentRect.top : element.offsetTop,
        sliderWidth: rect.width,
        sliderHeight: rect.height,
      };
    },
    getParentRect: () => slider.value?.offsetParent?.getBoundingClientRect(),
    getScrollParentVal: (): { scrollTop: number; scrollLeft: number } => {
      const scrollParent: HTMLElement = foundation.getScrollParent(slider.value);
      return { scrollTop: scrollParent.scrollTop, scrollLeft: scrollParent.scrollLeft };
    },
    isEventFromHandle: (event: Event) =>
      [minHandle.value, maxHandle.value].some(
        (handle) => handle && event.target instanceof Node && handle.contains(event.target),
      ),
    getOverallVars: () => ({ dragging: dragging.value }),
    updateDisabled: (disabled: boolean) => {
      state.disabled = disabled;
    },
    transNewPropsToState: (nextState: Partial<SliderState>, callback?: () => void) => {
      Object.assign(state, nextState);
      callback?.();
    },
    notifyChange: (value: SliderValue) => {
      const output = cloneSorted(value);
      emit('change', output);
      emit('update:modelValue', output);
      emit('update:value', output);
    },
    setDragging: (value: boolean[]) => {
      dragging.value = value;
    },
    updateCurrentValue: (value: SliderValue) => {
      state.currentValue = value;
    },
    setOverallVars: (key: string, value: unknown) => {
      if (key === 'dragging' && Array.isArray(value)) dragging.value = value as boolean[];
    },
    getMinHandleEl: () => minHandle.value,
    getMaxHandleEl: () => maxHandle.value,
    onHandleDown: () => {
      if (typeof document === 'undefined' || typeof window === 'undefined') return;
      clearHandleListeners();
      handleClearers.add(
        addEventListener(
          document.body,
          'mousemove',
          foundation.onHandleMove as unknown as EventListener,
        ),
      );
      handleClearers.add(
        addEventListener(window, 'mouseup', foundation.onHandleUp as unknown as EventListener),
      );
      handleClearers.add(
        addEventListener(
          document.body,
          'touchmove',
          foundation.onHandleTouchMove as unknown as EventListener,
        ),
      );
    },
    onHandleMove: (
      _mousePosition: number,
      _isMin: boolean,
      callback?: () => void,
      clickTrack = false,
      outputValue?: SliderValue,
    ): boolean | void => {
      if (!foundation.checkAndUpdateIsInRenderTreeState()) return;
      const finalOutput = outputValue ?? foundation.outPutValue(state.currentValue);
      const currentOutput = foundation.outPutValue(state.currentValue);
      if (JSON.stringify(currentOutput) === JSON.stringify(finalOutput)) return;
      if (!clickTrack && foundation.valueFormatIsCorrect(runtimeProps.value.value)) return false;
      state.currentValue = finalOutput;
      callback?.();
    },
    setEventDefault: (event: Event) => {
      event.stopPropagation();
      event.preventDefault();
    },
    setStateVal: <Key extends keyof SliderState>(key: Key, value: SliderState[Key]) => {
      state[key] = value;
    },
    checkAndUpdateIsInRenderTreeState: () => {
      const next = isInRenderTree(slider.value);
      state.isInRenderTree = next;
      return next;
    },
    onHandleEnter: (position: SliderState['focusPos']) => {
      state.focusPos = position;
    },
    onHandleLeave: () => {
      state.focusPos = '';
    },
    onHandleUpBefore: (event: Event) => {
      if (event instanceof MouseEvent) emit('mouseUp', event);
      event.stopPropagation();
      event.preventDefault();
      clearHandleListeners();
    },
    onHandleUpAfter: () => {
      emit('afterChange', foundation.outPutValue(state.currentValue));
    },
    unSubscribeEventListener: () => {
      for (const clear of [...eventClearers]) clear();
      eventClearers.clear();
      handleClearers.clear();
    },
  };

  const foundation = markRaw(new SliderFoundation<SliderProps, SliderState>(adapter));

  watch(
    () => props.disabled,
    (disabled) => foundation.handleDisabledChange(Boolean(disabled)),
  );
  watch(incomingValue, (nextValue, previousValue) => {
    if (nextValue === undefined || JSON.stringify(nextValue) === JSON.stringify(previousValue))
      return;
    foundation.handleValueChange(state.currentValue, nextValue);
    emit('afterChange', nextValue);
  });

  onMounted(() => foundation.init());
  onBeforeUnmount(() => foundation.destroy());

  return { controlled, foundation, state };
}
