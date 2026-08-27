<script setup lang="ts">
import { RatingFoundation } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  reactive,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
  type VNodeChild,
} from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import Tooltip from '../tooltip/Tooltip.vue';
import RatingItem from './RatingItem.vue';
import type { RatingEmits, RatingExposed, RatingProps, RatingSlots, RatingState } from './types';

defineOptions({ name: 'Rating', inheritAttrs: false });
const props = withDefaults(defineProps<RatingProps>(), {
  allowClear: true,
  allowHalf: false,
  autoFocus: false,
  count: 5,
  defaultValue: 0,
  disabled: false,
  prefixCls: 'semi-rating',
  size: 'default',
  tabIndex: -1,
});
const emit = defineEmits<RatingEmits>();
defineSlots<RatingSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const root = useTemplateRef<HTMLUListElement>('root');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', getPopupContainer: undefined } as ConfigContextValue),
);

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
const incomingValue = computed(() =>
  modelControlled.value ? props.modelValue : valueControlled.value ? props.value : undefined,
);
const initialValue = incomingValue.value === undefined ? props.defaultValue : incomingValue.value;
const state = reactive<RatingState>({
  value: initialValue,
  hoverValue: undefined,
  focused: false,
  clearedValue: null,
  emptyStarFocusVisible: false,
});
const cache = new Map<string, unknown>();

interface RatingItemInstance extends ComponentPublicInstance {
  getDomNode(): HTMLLIElement | null;
  starFocus(): void;
}
const itemInstances = new Map<number, RatingItemInstance>();
const setItemRef = (index: number) => (value: Element | ComponentPublicInstance | null) => {
  if (value && '$el' in value) itemInstances.set(index, value as RatingItemInstance);
  else itemInstances.delete(index);
};

const characterNode = computed<VNodeChild | undefined>(() => {
  const slotContent = slots.character?.();
  if (slotContent?.length) return slotContent;
  return props.character || undefined;
});
const ariaDescribedby = computed(
  () => props.ariaDescribedby ?? (attrs['aria-describedby'] as string | undefined),
);
const ariaLabelledby = computed(
  () => props.ariaLabelledby ?? (attrs['aria-labelledby'] as string | undefined),
);
const ariaLabelPrefix = computed(() => {
  const explicitLabel = props.ariaLabel ?? (attrs['aria-label'] as string | undefined);
  if (explicitLabel) return explicitLabel;
  return typeof props.character === 'string' ? props.character : 'star';
});
const ariaLabel = computed(
  () =>
    `Rating: ${state.value} of ${props.count} ${ariaLabelPrefix.value}${state.value === 1 ? '' : 's'},`,
);
const displayValue = computed(() =>
  state.hoverValue === undefined ? state.value : state.hoverValue,
);
const rootClasses = computed(() => [
  attrs.class,
  props.className,
  props.prefixCls,
  props.disabled ? `${props.prefixCls}-disabled` : undefined,
  state.emptyStarFocusVisible ? `${props.prefixCls}-focus` : undefined,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

function runtimeProps(): RatingProps {
  return props as unknown as RatingProps;
}

const adapter = {
  getContext: (key: string) => (key === 'direction' ? config.value.direction : undefined),
  getContexts: () => ({ direction: config.value.direction }),
  getProp: (key: string) => runtimeProps()[key as keyof RatingProps],
  getProps: runtimeProps,
  getState: (key: string) => state[key as keyof RatingState],
  getStates: () => state,
  setState: (nextState: Partial<RatingState>, callback?: () => void) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key: string) => cache.get(key),
  getCaches: () => cache,
  setCache: (key: unknown, value: unknown) => cache.set(String(key), value),
  stopPropagation: (event: { stopPropagation?: () => void }) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  focus: () => {
    if (props.disabled) return;
    const index = Math.ceil(state.value) - 1;
    itemInstances.get(index < 0 ? props.count : index)?.starFocus();
  },
  getStarDOM: (index: number) => itemInstances.get(index)?.getDomNode() ?? root.value!,
  notifyHoverChange: (hoverValue: number | undefined, clearedValue: number | null) => {
    state.hoverValue = hoverValue;
    state.clearedValue = clearedValue;
    emit('hoverChange', hoverValue);
  },
  updateValue: (value: number) => {
    if (!controlled.value) state.value = value;
    emit('change', value);
    emit('update:modelValue', value);
    emit('update:value', value);
  },
  clearValue: (clearedValue: number | null) => {
    state.clearedValue = clearedValue;
  },
  notifyFocus: (event: FocusEvent) => {
    state.focused = true;
    emit('focus', event);
  },
  notifyBlur: (event: FocusEvent) => {
    state.focused = false;
    emit('blur', event);
  },
  notifyKeyDown: (event: KeyboardEvent) => {
    state.focused = false;
    emit('keyDown', event);
  },
  setEmptyStarFocusVisible: (focusVisible: boolean) => {
    state.emptyStarFocusVisible = focusVisible;
  },
};
const foundation = markRaw(new RatingFoundation(adapter));

function handleItemFocus(index: number, event: FocusEvent): void {
  if (!props.disabled && index === props.count) foundation.handleStarFocusVisible(event);
}

function handleItemBlur(index: number, event: FocusEvent): void {
  if (!props.disabled && index === props.count) foundation.handleStarBlur(event);
}

function focusValue(value: number): void {
  const index = Math.ceil(value) - 1;
  const item = itemInstances.get(index < 0 ? props.count : index)?.getDomNode();
  const selector =
    index < 0
      ? `.${props.prefixCls}-star-second`
      : props.allowHalf && (value * 10) % 10 === 5
        ? `.${props.prefixCls}-star-first`
        : `.${props.prefixCls}-star-second`;
  item?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: props.preventScroll });
}

function handleKeyDown(event: KeyboardEvent): void {
  const step = props.allowHalf ? 0.5 : 1;
  const reverse = config.value.direction === 'rtl';
  let temporaryValue: number | undefined;
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    temporaryValue = state.value + (reverse ? -step : step);
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    temporaryValue = state.value + (reverse ? step : -step);
  }
  if (temporaryValue === undefined) return;
  const nextValue =
    temporaryValue > props.count ? 0 : temporaryValue < 0 ? props.count : temporaryValue;
  adapter.notifyKeyDown(event);
  adapter.updateValue(nextValue);
  focusValue(nextValue);
  event.preventDefault();
  adapter.notifyHoverChange(undefined, null);
}

function focus(): void {
  if (!props.disabled) root.value?.focus({ preventScroll: props.preventScroll });
}

function blur(): void {
  if (!props.disabled) root.value?.blur();
}

watch(incomingValue, (value) => {
  if (controlled.value && value !== undefined) state.value = value;
});

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());

defineExpose<RatingExposed>({ focus, blur });
</script>

<template>
  <ul
    v-bind="dataAttrs"
    :id="props.id"
    ref="root"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-describedby="ariaDescribedby"
    :class="rootClasses"
    :style="props.style"
    :tabindex="props.disabled ? -1 : props.tabIndex"
    @mouseleave="!props.disabled && foundation.handleMouseLeave()"
    @focusin="!props.disabled && foundation.handleFocus($event)"
    @focusout="!props.disabled && foundation.handleBlur($event)"
    @keydown="!props.disabled && handleKeyDown($event)"
  >
    <template v-for="index in props.count + 1" :key="index - 1">
      <Tooltip
        v-if="props.tooltips"
        :visible="state.hoverValue !== undefined && state.hoverValue - 1 === index - 1"
        trigger="custom"
        :content="props.tooltips[index - 1] ?? ''"
      >
        <span :class="`${props.prefixCls}-star-outer`">
          <RatingItem
            :ref="setItemRef(index - 1)"
            :allow-half="props.allowHalf"
            :describedby="ariaDescribedby"
            :label-prefix="ariaLabelPrefix"
            :character="characterNode"
            :count="props.count"
            :disabled="props.disabled"
            :focused="state.focused"
            :index="index - 1"
            :prefix-cls="`${props.prefixCls}-star`"
            :prevent-scroll="props.preventScroll"
            :size="index - 1 === props.count ? 0 : props.size"
            :value="displayValue"
            @click="(event, itemIndex) => foundation.handleClick(event, itemIndex)"
            @hover="(event, itemIndex) => foundation.handleHover(event, itemIndex)"
            @focus="(event) => handleItemFocus(index - 1, event)"
            @blur="(event) => handleItemBlur(index - 1, event)"
          />
        </span>
      </Tooltip>
      <RatingItem
        v-else
        :ref="setItemRef(index - 1)"
        :allow-half="props.allowHalf"
        :describedby="ariaDescribedby"
        :label-prefix="ariaLabelPrefix"
        :character="characterNode"
        :count="props.count"
        :disabled="props.disabled"
        :focused="state.focused"
        :index="index - 1"
        :prefix-cls="`${props.prefixCls}-star`"
        :prevent-scroll="props.preventScroll"
        :size="index - 1 === props.count ? 0 : props.size"
        :value="displayValue"
        @click="(event, itemIndex) => foundation.handleClick(event, itemIndex)"
        @hover="(event, itemIndex) => foundation.handleHover(event, itemIndex)"
        @focus="(event) => handleItemFocus(index - 1, event)"
        @blur="(event) => handleItemBlur(index - 1, event)"
      />
    </template>
  </ul>
</template>
