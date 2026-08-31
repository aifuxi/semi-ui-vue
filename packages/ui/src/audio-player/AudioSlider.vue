<script setup lang="ts">
import { computed, shallowReactive, useTemplateRef } from 'vue';

import Tooltip from '../tooltip/Tooltip.vue';
import type { AudioPlayerTheme } from './types';
import { formatAudioTime } from './utils';

interface AudioSliderProps {
  value?: number;
  max?: number;
  vertical?: boolean;
  width?: number | string;
  height?: number | string;
  showTooltip?: boolean;
  disabled?: boolean;
  theme?: AudioPlayerTheme;
}

interface AudioSliderEmits {
  change: [value: number];
}

defineOptions({ name: 'AudioSlider' });
const props = withDefaults(defineProps<AudioSliderProps>(), {
  value: 0,
  max: 100,
  vertical: false,
  width: '100%',
  height: 4,
  showTooltip: true,
  disabled: false,
  theme: 'dark',
});
const emit = defineEmits<AudioSliderEmits>();
const sliderRef = useTemplateRef<HTMLDivElement>('slider');
const state = shallowReactive({
  isDragging: false,
  isHovering: false,
  movingInfo: null as { progress: number; offset: number } | null,
});

const progress = computed(() => {
  if (!Number.isFinite(props.value) || !Number.isFinite(props.max) || props.max <= 0) return 0;
  return Math.min(Math.max(props.value / props.max, 0), 1);
});
const popupStyle = computed(() => ({
  [props.vertical ? 'top' : 'left']: state.movingInfo?.offset,
}));

function handleMouseEvent(event: MouseEvent, shouldSetValue = true): void {
  if (!sliderRef.value || props.disabled) return;
  const rect = sliderRef.value.getBoundingClientRect();
  const offset = props.vertical ? rect.bottom - event.clientY : event.clientX - rect.left;
  const total = props.vertical ? rect.height : rect.width;
  const percentage = total > 0 ? Math.min(Math.max(offset / total, 0), 1) : 0;
  if (shouldSetValue && (state.isDragging || event.type === 'mousedown')) {
    emit('change', percentage * props.max);
  }
  state.movingInfo = {
    progress: percentage,
    offset: props.vertical ? offset - rect.height / 2 : offset - rect.width / 2,
  };
}

function handleMouseEnter(event: MouseEvent): void {
  state.isHovering = true;
  handleMouseEvent(event, false);
}

function handleMouseDown(event: MouseEvent): void {
  state.isDragging = true;
  handleMouseEvent(event, true);
}

function handleMouseUp(): void {
  state.isDragging = false;
}

function handleMouseLeave(): void {
  state.isHovering = false;
  state.isDragging = false;
}
</script>

<template>
  <Tooltip
    :condition="props.showTooltip"
    :position="props.vertical ? 'right' : 'top'"
    :auto-adjust-overflow="true"
    :content="formatAudioTime((state.movingInfo?.progress ?? 0) * props.max)"
    :style="popupStyle"
  >
    <div
      :class="[
        'semi-audio-player-slider-wrapper',
        props.vertical
          ? 'semi-audio-player-slider-wrapper-vertical'
          : 'semi-audio-player-slider-wrapper-horizontal',
      ]"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseEvent($event, true)"
    >
      <div
        ref="slider"
        :class="[
          'semi-audio-player-slider',
          `semi-audio-player-slider-${props.theme}`,
          props.vertical
            ? 'semi-audio-player-slider-vertical'
            : 'semi-audio-player-slider-horizontal',
        ]"
        :style="{
          width: props.vertical ? (state.isHovering ? 8 : 4) : props.width,
          height: props.vertical ? props.height : state.isHovering ? 8 : 4,
        }"
      >
        <div
          :class="[
            'semi-audio-player-slider-progress',
            props.vertical
              ? 'semi-audio-player-slider-progress-vertical'
              : 'semi-audio-player-slider-progress-horizontal',
          ]"
          :style="{
            height: props.vertical ? `${progress * 100}%` : '100%',
            width: props.vertical ? '100%' : `${progress * 100}%`,
          }"
        />
        <div
          class="semi-audio-player-slider-dot"
          :style="{
            left: props.vertical ? '50%' : `calc(${progress * 100}% - 8px)`,
            bottom: props.vertical ? `calc(${progress * 100}% - 8px)` : undefined,
            top: props.vertical ? undefined : '50%',
            transform: props.vertical ? 'translateX(-50%)' : 'translateY(-50%)',
            opacity: state.isHovering ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
          }"
        />
      </div>
    </div>
  </Tooltip>
</template>
