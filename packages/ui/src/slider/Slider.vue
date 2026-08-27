<script setup lang="ts">
import {
  computed,
  inject,
  shallowRef,
  useAttrs,
  useTemplateRef,
  type ComponentPublicInstance,
  type CSSProperties,
  type VNodeChild,
} from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import Tooltip from '../tooltip/Tooltip.vue';
import SliderFragment from './SliderFragment';
import type { SliderEmits, SliderHandleDot, SliderProps, SliderValue } from './types';
import { useSliderFoundation } from './use-slider-foundation';

defineOptions({ name: 'Slider', inheritAttrs: false });
const props = withDefaults(defineProps<SliderProps>(), {
  disabled: false,
  included: true,
  max: 100,
  min: 0,
  range: false,
  showArrow: true,
  showBoundary: false,
  showMarkLabel: true,
  step: 1,
  tipFormatter: () => (value: string | number | boolean | null) => value,
  tooltipVisible: undefined,
  tooltipOnMark: false,
  vertical: false,
  verticalReverse: false,
});
const emit = defineEmits<SliderEmits>();
const attrs = useAttrs();
const slider = useTemplateRef<HTMLDivElement>('slider');
const minHandle = shallowRef<HTMLSpanElement | null>(null);
const maxHandle = shallowRef<HTMLSpanElement | null>(null);
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', getPopupContainer: undefined } as ConfigContextValue),
);

const { foundation, state } = useSliderFoundation({
  config,
  emit,
  maxHandle,
  minHandle,
  props: props as SliderProps,
  slider,
});

const isRTL = computed(() => config.value.direction === 'rtl' && !props.vertical);
const rootComponent = computed(() => (props.vertical ? SliderFragment : 'div'));
const stylePosition = computed<'top' | 'right' | 'left'>(() =>
  props.vertical ? 'top' : isRTL.value ? 'right' : 'left',
);
const percentages = computed(() => foundation.getMinAndMaxPercent(state.currentValue));
const handleTooltip = computed(() =>
  foundation.computeHandleVisibleVal(
    props.tooltipVisible && state.isInRenderTree,
    props.tipFormatter as ((value: unknown) => unknown) | null | undefined,
    props.range,
  ),
);
const fixedValue = computed<SliderValue>(() =>
  Array.isArray(state.currentValue)
    ? [...state.currentValue].sort((left, right) => left - right)
    : state.currentValue,
);
const wrapperAriaLabel = computed(() => {
  if (!props.range || !Array.isArray(fixedValue.value)) return undefined;
  return `Range: ${formatAriaValue(fixedValue.value[0]!, 0)} to ${formatAriaValue(fixedValue.value[1]!, 1)}`;
});
const rootClasses = computed(() => (props.vertical ? undefined : 'semi-slider'));
const wrapperClasses = computed(() => [
  'semi-slider-wrapper',
  props.disabled ? 'semi-slider-disabled' : undefined,
  props.vertical ? 'semi-slider-vertical-wrapper' : undefined,
  props.vertical && props.verticalReverse ? 'semi-slider-reverse' : undefined,
  attrs.class,
  props.className,
]);
const boundaryClasses = computed(() => [
  'semi-slider-boundary',
  props.showBoundary && state.showBoundary ? 'semi-slider-boundary-show' : undefined,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const markEntries = computed(() =>
  Object.entries(props.marks ?? {})
    .map(([value, label]) => ({ value: Number(value), label }))
    .filter(({ value }) => foundation.isMarkActive(value) !== false),
);
const trackStyle = computed<CSSProperties>(() => {
  if (!props.included) return {};
  const min = percentages.value.min;
  const max = percentages.value.max;
  if (props.vertical) {
    return {
      height: `${(props.range ? Math.abs(max - min) : min) * 100}%`,
      top: props.range ? `${Math.min(min, max) * 100}%` : '0',
    };
  }
  return {
    width: `${(props.range ? Math.abs(max - min) : min) * 100}%`,
    [isRTL.value ? 'right' : 'left']: props.range ? `${Math.min(min, max) * 100}%` : '0',
  };
});
const handleEntries = computed(() => {
  const values = Array.isArray(state.currentValue) ? state.currentValue : [state.currentValue];
  return values.map((value, index) => {
    const position = index === 0 ? 'min' : 'max';
    const percent = index === 0 ? percentages.value.min : percentages.value.max;
    const dot = Array.isArray(props.handleDot)
      ? props.handleDot[index]
      : index === 0
        ? props.handleDot
        : undefined;
    return {
      dot,
      index,
      percent,
      position,
      tooltipContent:
        position === 'min'
          ? handleTooltip.value.tipChildren.min
          : handleTooltip.value.tipChildren.max,
      tooltipVisible:
        state.isInRenderTree &&
        ((position === 'min'
          ? handleTooltip.value.tipVisible.min
          : handleTooltip.value.tipVisible.max) ||
          (position === 'min' ? state.firstDotFocusVisible : state.secondDotFocusVisible)),
      value,
    } as const;
  });
});

function formatAriaValue(value: number, index?: number): string | number {
  return props.getAriaValueText ? props.getAriaValueText(value, index) : value;
}

function ariaLabel(): string | undefined {
  return (
    props.ariaLabel ??
    (attrs['aria-label'] as string | undefined) ??
    (props.disabled ? 'Disabled Slider' : undefined)
  );
}

function ariaLabelledby(): string | undefined {
  return props.ariaLabelledby ?? (attrs['aria-labelledby'] as string | undefined);
}

function ariaValueText(value: number, index: number): string | undefined {
  if (props.getAriaValueText) return props.getAriaValueText(value, index);
  return props.ariaValueText ?? (attrs['aria-valuetext'] as string | undefined);
}

function handleStyle(entry: (typeof handleEntries.value)[number]): CSSProperties {
  return {
    [stylePosition.value]: `${entry.percent * 100}%`,
    zIndex: state.chooseMovePos === entry.position && (!props.range || state.isDrag) ? 2 : 1,
  };
}

function dotStyle(dot: SliderHandleDot | undefined): CSSProperties | undefined {
  if (!dot) return undefined;
  return {
    ...(dot.size ? { width: dot.size, height: dot.size } : {}),
    ...(dot.color ? { backgroundColor: dot.color } : {}),
  };
}

function markStyle(value: number, dot = false): CSSProperties {
  const percent = ((value - props.min) / (props.max - props.min)) * 100;
  return { [stylePosition.value]: dot ? `calc(${percent}% - 2px)` : `${percent}%` };
}

function handleMouseDown(event: MouseEvent, position: 'min' | 'max'): void {
  foundation.onHandleDown(event, position);
}

function handleTouchStart(event: TouchEvent, position: 'min' | 'max'): void {
  foundation.onHandleTouchStart(event, position);
}

function setHandleRef(position: 'min' | 'max') {
  return (element: Element | ComponentPublicInstance | null) => {
    const handle = element instanceof HTMLSpanElement ? element : null;
    if (position === 'min') minHandle.value = handle;
    else maxHandle.value = handle;
  };
}
</script>

<template>
  <component :is="rootComponent" :class="rootClasses">
    <div
      v-bind="dataAttrs"
      ref="slider"
      :aria-label="wrapperAriaLabel"
      :class="wrapperClasses"
      :style="[attrs.style, props.style]"
      @mouseenter="foundation.handleWrapperEnter()"
      @mouseleave="foundation.handleWrapperLeave()"
    >
      <div class="semi-slider-rail" :style="props.railStyle" @click="foundation.handleWrapClick" />
      <div class="semi-slider-track" :style="trackStyle" @click="foundation.handleWrapClick" />

      <div v-if="markEntries.length" class="semi-slider-dots">
        <template v-for="mark in markEntries" :key="`dot-${mark.value}`">
          <Tooltip v-if="props.tooltipOnMark" :content="mark.label">
            <span
              :class="[
                'semi-slider-dot',
                foundation.isMarkActive(mark.value) === 'active'
                  ? 'semi-slider-dot-active'
                  : undefined,
              ]"
              :style="markStyle(mark.value, true)"
              @click="foundation.handleWrapClick"
            />
          </Tooltip>
          <span
            v-else
            :class="[
              'semi-slider-dot',
              foundation.isMarkActive(mark.value) === 'active'
                ? 'semi-slider-dot-active'
                : undefined,
            ]"
            :style="markStyle(mark.value, true)"
            @click="foundation.handleWrapClick"
          />
        </template>
      </div>

      <div>
        <Tooltip
          v-for="entry in handleEntries"
          :key="entry.position"
          :content="entry.tooltipContent as VNodeChild"
          class="semi-slider-handle-tooltip"
          position="top"
          :re-pos-key="entry.percent"
          :show-arrow="props.range ? undefined : props.showArrow"
          trigger="custom"
          :visible="entry.tooltipVisible"
        >
          <span
            :ref="setHandleRef(entry.position)"
            :aria-disabled="props.disabled"
            :aria-label="ariaLabel()"
            :aria-labelledby="ariaLabelledby()"
            :aria-orientation="props.vertical ? 'vertical' : undefined"
            :aria-valuemax="
              props.range && entry.position === 'min' && Array.isArray(state.currentValue)
                ? state.currentValue[1]
                : state.max
            "
            :aria-valuemin="
              props.range && entry.position === 'max' && Array.isArray(state.currentValue)
                ? state.currentValue[0]
                : state.min
            "
            :aria-valuenow="entry.value"
            :aria-valuetext="ariaValueText(entry.value, entry.index)"
            :class="[
              'semi-slider-handle',
              state.chooseMovePos === entry.position && state.isDrag
                ? 'semi-slider-handle-clicked'
                : undefined,
            ]"
            role="slider"
            :style="handleStyle(entry)"
            :tabindex="props.disabled ? -1 : 0"
            @blur="foundation.onBlur($event, entry.position)"
            @focus="foundation.onFocus($event, entry.position)"
            @keydown="!props.disabled && foundation.handleKeyDown($event, entry.position)"
            @keyup="!props.disabled && foundation.onHandleUp($event)"
            @mousedown="handleMouseDown($event, entry.position)"
            @mouseenter="foundation.onHandleEnter(entry.position)"
            @mouseleave="foundation.onHandleLeave()"
            @mouseover="foundation.checkAndUpdateIsInRenderTreeState()"
            @touchend="foundation.onHandleUp($event)"
            @touchstart="handleTouchStart($event, entry.position)"
          >
            <div v-if="entry.dot" class="semi-slider-handle-dot" :style="dotStyle(entry.dot)" />
          </span>
        </Tooltip>
      </div>

      <div
        v-if="props.showMarkLabel && markEntries.length"
        :class="
          props.vertical && props.verticalReverse
            ? 'semi-slider-marks-reverse'
            : 'semi-slider-marks'
        "
      >
        <span
          v-for="mark in markEntries"
          :key="`mark-${mark.value}`"
          :class="
            props.vertical && props.verticalReverse
              ? 'semi-slider-mark-reverse'
              : 'semi-slider-mark'
          "
          :style="markStyle(mark.value)"
          @click="foundation.handleWrapClick"
        >
          {{ mark.label }}
        </span>
      </div>

      <div :class="boundaryClasses">
        <span class="semi-slider-boundary-min">{{ state.min }}</span>
        <span class="semi-slider-boundary-max">{{ state.max }}</span>
      </div>
    </div>
  </component>
</template>
