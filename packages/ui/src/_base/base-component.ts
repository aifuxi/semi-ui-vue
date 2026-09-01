import { markRaw, nextTick, onBeforeUnmount, onMounted } from 'vue';

import type { BaseProps } from './base';
import type { BaseFoundationAdapter } from './base-foundation';

const { hasOwnProperty } = Object.prototype;

export interface FoundationLifecycle {
  init?: () => void;
  destroy?: () => void;
}

export interface BaseComponentOptions<
  Props extends BaseProps,
  State extends Record<string, unknown>,
  Context extends Record<string, unknown>,
> {
  props: Props;
  state?: State;
  context?: Context;
}

export default class BaseComponent<
  Props extends BaseProps = BaseProps,
  State extends Record<string, unknown> = Record<string, unknown>,
  Context extends Record<string, unknown> = Record<string, unknown>,
> {
  props: Props;
  state: State;
  context: Context;
  cache: Record<PropertyKey, unknown> = {};
  foundation: FoundationLifecycle | null = null;

  constructor({ props, state, context }: BaseComponentOptions<Props, State, Context>) {
    this.props = props;
    this.state = state ?? ({} as State);
    this.context = context ?? ({} as Context);
  }

  mount(): void {
    this.foundation?.init?.();
  }

  unmount(): void {
    this.foundation?.destroy?.();
    this.cache = {};
  }

  updateProps(props: Props): void {
    this.props = props;
  }

  updateContext(context: Context): void {
    this.context = context;
  }

  get adapter(): BaseFoundationAdapter<Props, State> {
    return {
      getContext: (key) => this.context[key],
      getContexts: () => this.context,
      getProp: (key) => this.props[key as keyof Props],
      getProps: () => this.props,
      getState: (key) => this.state[key],
      getStates: () => this.state,
      setState: (states, callback) => {
        Object.assign(this.state, states);
        callback?.();
      },
      getCache: (key) => this.cache[key],
      getCaches: () => this.cache,
      setCache: (key, value) => {
        if (key !== undefined && key !== null && key !== '') this.cache[key as PropertyKey] = value;
        return value;
      },
      stopPropagation: (event) => {
        if (!event || typeof event !== 'object') return;
        const wrappedEvent = event as {
          nativeEvent?: { stopImmediatePropagation?: () => void };
          stopPropagation?: () => void;
        };
        wrappedEvent.stopPropagation?.();
        wrappedEvent.nativeEvent?.stopImmediatePropagation?.();
      },
      persistEvent: () => undefined,
    };
  }

  isControlled(key: PropertyKey): boolean {
    return hasOwnProperty.call(this.props, key);
  }

  log(text: string, ...rest: unknown[]): void {
    if (import.meta.env.DEV) console.log(text, ...rest);
  }

  getDataAttr(
    props: Record<string, unknown> = this.props as Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.fromEntries(Object.entries(props).filter(([key]) => key.startsWith('data-')));
  }

  async setStateAsync(state: Partial<State>): Promise<void> {
    Object.assign(this.state, state);
    await nextTick();
  }
}

export function useBaseComponent<
  Props extends BaseProps,
  State extends Record<string, unknown> = Record<string, unknown>,
  Context extends Record<string, unknown> = Record<string, unknown>,
>(options: BaseComponentOptions<Props, State, Context>): BaseComponent<Props, State, Context> {
  const controller = markRaw(new BaseComponent(options));
  onMounted(() => controller.mount());
  onBeforeUnmount(() => controller.unmount());
  return controller;
}
