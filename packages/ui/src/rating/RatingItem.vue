<script setup lang="ts">
import { RatingItemFoundation } from '@workspace/foundation-integration';
import { IconStar } from '@workspace/icons';
import {
  computed,
  markRaw,
  onBeforeUnmount,
  onMounted,
  reactive,
  useTemplateRef,
  type VNodeChild,
} from 'vue';

import RatingNodeRenderer from './RatingNodeRenderer';
import type { RatingItemState, RatingSize } from './types';

interface RatingItemProps {
  allowHalf: boolean;
  describedby?: string | undefined;
  labelPrefix: string;
  character?: VNodeChild;
  count: number;
  disabled: boolean;
  focused: boolean;
  index: number;
  prefixCls: string;
  preventScroll?: boolean | undefined;
  size: RatingSize;
  value: number;
}

interface RatingItemExposed {
  getDomNode(): HTMLLIElement | null;
  starFocus(): void;
}

const props = defineProps<RatingItemProps>();
const emit = defineEmits<{
  blur: [event: FocusEvent];
  click: [event: MouseEvent | KeyboardEvent, index: number];
  focus: [event: FocusEvent];
  hover: [event: MouseEvent, index: number];
}>();

const root = useTemplateRef<HTMLLIElement>('root');
const firstStar = useTemplateRef<HTMLDivElement>('firstStar');
const secondStar = useTemplateRef<HTMLDivElement>('secondStar');
const state = reactive<RatingItemState>({ firstStarFocus: false, secondStarFocus: false });
const cache = new Map<string, unknown>();

const starValue = computed(() => props.index + 1);
const difference = computed(() => starValue.value - props.value);
const isHalf = computed(() => props.allowHalf && difference.value < 1 && difference.value > 0);
const firstWidth = computed(() => `${(1 - difference.value) * 100}%`);
const isFull = computed(() => starValue.value <= props.value);
const isEmpty = computed(() => props.index === props.count);
const isCustomSize = computed(() => typeof props.size === 'number');
const sizeStyle = computed(() =>
  isCustomSize.value
    ? { width: `${props.size}px`, height: `${props.size}px`, fontSize: `${props.size}px` }
    : undefined,
);
const itemClasses = computed(() => [
  props.prefixCls,
  isHalf.value ? `${props.prefixCls}-half` : undefined,
  isFull.value ? `${props.prefixCls}-full` : undefined,
  !isCustomSize.value ? `${props.prefixCls}-${props.size}` : undefined,
]);
const wrapperClasses = computed(() => [
  `${props.prefixCls}-wrapper`,
  props.disabled ? `${props.prefixCls}-disabled` : undefined,
  (state.firstStarFocus || state.secondStarFocus) && props.value !== 0
    ? `${props.prefixCls.replace(/-star$/, '')}-focus`
    : undefined,
]);
const setSize = computed(() => (props.allowHalf ? props.count * 2 + 1 : props.count + 1));
const secondTabIndex = computed(() =>
  !props.disabled && (props.value === props.index + 1 || (isEmpty.value && props.value === 0))
    ? 0
    : -1,
);

const adapter = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key: string) => props[key as keyof RatingItemProps],
  getProps: () => props,
  getState: (key: string) => state[key as keyof RatingItemState],
  getStates: () => state,
  setState: (nextState: Partial<RatingItemState>, callback?: () => void) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key: string) => cache.get(key),
  getCaches: () => cache,
  setCache: (key: unknown, value: unknown) => cache.set(String(key), value),
  stopPropagation: (event: { stopPropagation?: () => void }) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  setFirstStarFocus: (value: boolean) => {
    state.firstStarFocus = value;
  },
  setSecondStarFocus: (value: boolean) => {
    state.secondStarFocus = value;
  },
};
const foundation = markRaw(new RatingItemFoundation(adapter));

function handleFocus(event: FocusEvent, star: 'first' | 'second'): void {
  emit('focus', event);
  foundation.handleFocusVisible(event, star);
}

function handleBlur(event: FocusEvent, star: 'first' | 'second'): void {
  emit('blur', event);
  foundation.handleBlur(event, star);
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.keyCode === 13) emit('click', event, props.index);
}

function starFocus(): void {
  const element = props.value - props.index === 0.5 ? firstStar.value : secondStar.value;
  element?.focus({ preventScroll: props.preventScroll });
}

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());

defineExpose<RatingItemExposed>({
  getDomNode: () => root.value,
  starFocus,
});
</script>

<template>
  <li ref="root" :class="itemClasses" :style="sizeStyle">
    <div
      :class="wrapperClasses"
      @click="!props.disabled && emit('click', $event, props.index)"
      @keydown="!props.disabled && handleKeyDown($event)"
      @mousemove="!props.disabled && emit('hover', $event, props.index)"
    >
      <div
        v-if="props.allowHalf && !isEmpty"
        ref="firstStar"
        role="radio"
        :aria-checked="props.value === props.index + 0.5"
        :aria-posinset="2 * props.index + 1"
        :aria-setsize="setSize"
        :aria-disabled="props.disabled"
        :aria-label="`${props.index + 0.5} ${props.labelPrefix}s`"
        :aria-labelledby="props.describedby"
        :aria-describedby="props.describedby"
        :class="[`${props.prefixCls}-first`, `${props.prefixCls.replace(/-star$/, '')}-no-focus`]"
        :style="{ width: firstWidth }"
        :tabindex="!props.disabled && props.value === props.index + 0.5 ? 0 : -1"
        @focus="handleFocus($event, 'first')"
        @blur="handleBlur($event, 'first')"
      >
        <RatingNodeRenderer v-if="props.character !== undefined" :content="props.character" />
        <IconStar
          v-else
          :size="isCustomSize ? 'inherit' : props.size === 'small' ? 'default' : 'extra-large'"
          style="display: block"
        />
      </div>
      <div
        ref="secondStar"
        role="radio"
        :aria-checked="isEmpty ? props.value === 0 : props.value === props.index + 1"
        :aria-posinset="props.allowHalf ? 2 * (props.index + 1) : props.index + 1"
        :aria-setsize="setSize"
        :aria-disabled="props.disabled"
        :aria-label="`${isEmpty ? 0 : props.index + 1} ${props.labelPrefix}${props.index === 0 ? '' : 's'}`"
        :aria-labelledby="props.describedby"
        :aria-describedby="props.describedby"
        :class="[`${props.prefixCls}-second`, `${props.prefixCls.replace(/-star$/, '')}-no-focus`]"
        :tabindex="secondTabIndex"
        x-semi-prop="character"
        @focus="handleFocus($event, 'second')"
        @blur="handleBlur($event, 'second')"
      >
        <RatingNodeRenderer v-if="props.character !== undefined" :content="props.character" />
        <IconStar
          v-else
          :size="isCustomSize ? 'inherit' : props.size === 'small' ? 'default' : 'extra-large'"
          style="display: block"
        />
      </div>
    </div>
  </li>
</template>
