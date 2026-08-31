<script setup lang="ts">
import {
  VideoProgressFoundation,
  videoPlayerCssClasses,
  type VideoMarkerListItem,
  type VideoProgressAdapter,
} from '@workspace/foundation-integration';
import { computed, markRaw, onBeforeUnmount, shallowReactive, useTemplateRef } from 'vue';

import Tooltip from '../tooltip/Tooltip.vue';
import type { VideoPlayerMarker } from './types';
import { formatVideoTime } from './utils';

interface VideoProgressProps {
  value?: number;
  max?: number;
  showTooltip?: boolean;
  markers?: VideoPlayerMarker[];
  bufferedValue?: number;
}

interface VideoProgressEmits {
  change: [value: number];
}

interface VideoProgressState {
  isDragging: boolean;
  isHandleHovering: boolean;
  movingInfo: { progress: number; offset: number; value: number } | null;
  activeIndex: number;
}

defineOptions({ name: 'VideoProgress' });
const props = withDefaults(defineProps<VideoProgressProps>(), {
  value: 0,
  max: 100,
  showTooltip: true,
  markers: () => [],
  bufferedValue: 0,
});
const emit = defineEmits<VideoProgressEmits>();
const sliderRef = useTemplateRef<HTMLDivElement>('slider');
const prefixCls = videoPlayerCssClasses.PREFIX_PROGRESS;
const cache = new Map<unknown, unknown>();
const state = shallowReactive<VideoProgressState>({
  isDragging: false,
  isHandleHovering: false,
  movingInfo: null,
  activeIndex: -1,
});

const markerList = computed<VideoMarkerListItem[]>(() => {
  if (props.markers.length === 0) {
    return [{ start: 0, end: props.max, left: '0', title: '', width: '100%' }];
  }
  const result: VideoMarkerListItem[] = [];
  props.markers.forEach((marker, index) => {
    const end = index === props.markers.length - 1 ? props.max : props.markers[index + 1]!.start;
    if (marker.start > props.max || end > props.max) return;
    result.push({
      start: marker.start,
      end,
      left: `${(marker.start / props.max) * 100}%`,
      width: `${props.max ? ((end - marker.start) / props.max) * 100 : 100}%`,
      title: marker.title,
    });
  });
  return result;
});

const foundationProps = () => ({
  value: props.value,
  max: props.max,
  bufferedValue: props.bufferedValue,
  onChange: (value: number) => emit('change', value),
});

const adapter: VideoProgressAdapter<ReturnType<typeof foundationProps>, VideoProgressState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
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
  getSliderRef: () => sliderRef.value,
  getMarkersList: () => markerList.value,
  setIsDragging: (value) => {
    state.isDragging = value;
  },
  setIsHandleHovering: (value) => {
    state.isHandleHovering = value;
  },
  setActiveIndex: (value) => {
    state.activeIndex = value;
  },
  setMovingInfo: (value) => {
    state.movingInfo = value;
  },
};
const foundation = markRaw(
  new VideoProgressFoundation<ReturnType<typeof foundationProps>, VideoProgressState>(adapter),
);

const tooltipMarker = computed(() => {
  if (!state.movingInfo) return undefined;
  return markerList.value.find(
    (marker) => state.movingInfo!.value > marker.start && state.movingInfo!.value < marker.end,
  );
});
const handleStyle = computed(() => ({
  left: `calc(${props.max ? ((props.value || 1) / props.max) * 100 : 0}% - 8px)`,
  transform: 'translateY(-50%)',
  opacity: state.isHandleHovering || state.isDragging ? 1 : 0,
  transition: 'opacity 0.3s',
  pointerEvents: 'none' as const,
}));
const tooltipStyle = computed(() => ({ left: state.movingInfo?.offset }));

function handleMouseEnter(event: MouseEvent): void {
  foundation.handleMouseEvent(event, false);
}

function handleMouseMove(event: MouseEvent): void {
  foundation.handleMouseEvent(event, true);
}

onBeforeUnmount(() => {
  foundation.handleDocumentMouseUp();
  cache.clear();
});
</script>

<template>
  <Tooltip
    :condition="props.showTooltip"
    position="top"
    :class="`${prefixCls}-tooltip`"
    :style="tooltipStyle"
  >
    <template #content>
      <template v-if="state.movingInfo">
        <div v-if="tooltipMarker" :class="`${prefixCls}-tooltip-content`">
          {{ tooltipMarker.title }}
        </div>
        <div :class="`${prefixCls}-tooltip-content`">
          {{ formatVideoTime(state.movingInfo.progress * props.max) }}
        </div>
      </template>
    </template>

    <div
      ref="slider"
      role="slider"
      tabindex="0"
      :aria-valuenow="props.value"
      :class="prefixCls"
      @mousedown="foundation.handleMouseDown"
      @mouseup="foundation.handleMouseUp"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
    >
      <div :class="`${prefixCls}-markers`">
        <div
          v-for="(marker, index) in markerList"
          :key="`${marker.start}-${index}`"
          :class="[
            `${prefixCls}-slider`,
            index === state.activeIndex && state.isDragging
              ? `${prefixCls}-slider-active`
              : undefined,
          ]"
          :style="{ left: marker.left, width: marker.width }"
          @mouseenter="foundation.handleSliderMouseEnter(index)"
          @mouseleave="foundation.handleSliderMouseLeave(index)"
        >
          <div :class="`${prefixCls}-slider-list`" />
          <div
            :class="`${prefixCls}-slider-buffered`"
            :style="{ width: foundation.getLoadedWidth(marker) }"
          />
          <div
            :class="`${prefixCls}-slider-played`"
            :style="{ width: foundation.getPlayedWidth(marker) }"
          />
        </div>
      </div>
      <div :class="`${prefixCls}-handle`" :style="handleStyle" />
    </div>
  </Tooltip>
</template>
