import { CarouselFoundation, type CarouselAdapter } from '@workspace/foundation-integration';
import {
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  watch,
  type ComputedRef,
  type VNode,
} from 'vue';

import type { CarouselEmits, CarouselProps, CarouselState } from './types';

type RuntimeCarouselProps = Required<
  Pick<
    CarouselProps,
    | 'animation'
    | 'arrowType'
    | 'autoPlay'
    | 'defaultActiveIndex'
    | 'indicatorPosition'
    | 'indicatorSize'
    | 'indicatorType'
    | 'showArrow'
    | 'showIndicator'
    | 'slideDirection'
    | 'speed'
    | 'theme'
    | 'trigger'
  >
> & { activeIndex?: number | undefined };

interface CarouselFoundationController {
  getIsControlledComponent(): boolean;
  getValidIndex(index: number): number;
  goTo(targetIndex: number): void;
  handleAutoPlay(): void;
  next(): void;
  onIndicatorChange(activeIndex: number): void;
  prev(): void;
  setForcePlay(forcePlay: boolean): void;
  stop(): void;
}

interface CarouselFoundationBinding {
  foundation: CarouselFoundationController;
  state: CarouselState;
}

function hasOwn(value: object | null | undefined, key: string): boolean {
  return Boolean(value && Object.prototype.hasOwnProperty.call(value, key));
}

export function useCarouselFoundation(
  props: Readonly<CarouselProps>,
  children: ComputedRef<VNode[]>,
  emit: <Event extends keyof CarouselEmits>(event: Event, ...args: CarouselEmits[Event]) => void,
): CarouselFoundationBinding {
  const instance = getCurrentInstance();
  const hasControlledProp = () =>
    hasOwn(instance?.vnode.props, 'activeIndex') || hasOwn(instance?.vnode.props, 'active-index');
  const state = shallowReactive<CarouselState>({
    activeIndex: props.activeIndex ?? props.defaultActiveIndex ?? 0,
    preIndex: props.activeIndex ?? props.defaultActiveIndex ?? 0,
    isReverse: false,
    isInit: true,
  });
  const cache = new Map<unknown, unknown>();

  const runtimeProps = (): RuntimeCarouselProps => {
    const resolved: RuntimeCarouselProps = {
      animation: props.animation ?? 'slide',
      arrowType: props.arrowType ?? 'always',
      autoPlay: props.autoPlay ?? true,
      defaultActiveIndex: props.defaultActiveIndex ?? 0,
      indicatorPosition: props.indicatorPosition ?? 'center',
      indicatorSize: props.indicatorSize ?? 'small',
      indicatorType: props.indicatorType ?? 'dot',
      showArrow: props.showArrow ?? true,
      showIndicator: props.showIndicator ?? true,
      slideDirection: props.slideDirection ?? 'left',
      speed: props.speed ?? 300,
      theme: props.theme ?? 'light',
      trigger: props.trigger ?? 'click',
    };
    if (hasControlledProp()) resolved.activeIndex = props.activeIndex;
    return resolved;
  };

  const adapter: CarouselAdapter<RuntimeCarouselProps, CarouselState> = {
    getContext: () => undefined,
    getContexts: () => ({}),
    getProp: (key) => runtimeProps()[key],
    getProps: runtimeProps,
    getState: (key) => state[key],
    getStates: () => state,
    setState: (nextState, callback) => {
      Object.assign(state, nextState);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(key, value),
    stopPropagation: (event) => event?.stopPropagation?.(),
    persistEvent: () => undefined,
    notifyChange: (activeIndex, preIndex) => emit('change', activeIndex, preIndex),
    setNewActiveIndex: (activeIndex) => {
      state.activeIndex = activeIndex;
    },
    setPreActiveIndex: (preIndex) => {
      state.preIndex = preIndex;
    },
    setIsReverse: (isReverse) => {
      state.isReverse = isReverse;
    },
    setIsInit: (isInit) => {
      state.isInit = isInit;
    },
    getChildren: () => children.value,
  };
  const foundation = markRaw(new CarouselFoundation<RuntimeCarouselProps, CarouselState>(adapter));

  watch(
    () => props.activeIndex,
    (activeIndex) => {
      if (hasControlledProp() && activeIndex !== undefined && activeIndex !== state.activeIndex) {
        state.activeIndex = activeIndex;
      }
    },
  );

  onMounted(() => {
    if (!foundation.getIsControlledComponent()) foundation.handleAutoPlay();
  });
  onBeforeUnmount(() => foundation.destroy());

  return { foundation, state };
}
