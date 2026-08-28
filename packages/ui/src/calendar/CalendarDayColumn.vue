<script setup lang="ts">
import {
  getCalendarCurrentDate,
  getCalendarPosition,
  roundCalendarPosition,
  type ParsedCalendarEvent,
} from '@workspace/foundation-integration';
import { isSameDay } from 'date-fns';
import { computed, onBeforeUnmount, onMounted, shallowRef, type CSSProperties } from 'vue';

import CalendarNodeRenderer from './CalendarNodeRenderer';
import { useCalendarRuntime } from './calendar-context';

defineOptions({ name: 'CalendarDayColumn' });
const props = withDefaults(
  defineProps<{
    date: Date;
    events?: ParsedCalendarEvent[];
    isWeekend?: boolean;
    minEventHeight?: number;
    scrollHeight?: number;
    showCurrTime?: boolean;
  }>(),
  {
    events: () => [],
    isWeekend: false,
    minEventHeight: Number.MIN_SAFE_INTEGER,
    scrollHeight: 0,
    showCurrTime: true,
  },
);
const emit = defineEmits<{ click: [event: MouseEvent, value: [Date, number, number, number]] }>();
const runtime = useCalendarRuntime();

const currentPosition = shallowRef(0);
const currentVisible = shallowRef(false);
let animationFrame = 0;
let lastUpdate = 0;

const skeletonRows = Array.from({ length: 25 }, (_, hour) => ({
  hour,
  hourLabel: `${String(hour).padStart(2, '0')}:00:00`,
  halfLabel: `${String(hour).padStart(2, '0')}:30:00`,
}));
const currentStyle = computed<CSSProperties>(() => ({
  top: `${currentPosition.value * props.scrollHeight}px`,
}));

function eventStyle(event: ParsedCalendarEvent): CSSProperties {
  const start = event.startPos ?? 0;
  const end = event.endPos ?? 0;
  const top = start * props.scrollHeight;
  const height = Math.max(props.minEventHeight, (end - start) * props.scrollHeight);
  return {
    top: `${top}px`,
    height: `${height}px`,
    left: event.left ?? 0,
  };
}

function tick(timestamp: number): void {
  if (!lastUpdate || timestamp - lastUpdate >= 30_000) {
    currentPosition.value = roundCalendarPosition(getCalendarPosition(getCalendarCurrentDate()));
    lastUpdate = timestamp;
  }
  animationFrame = requestAnimationFrame(tick);
}

onMounted(() => {
  if (!props.showCurrTime || !isSameDay(props.date, getCalendarCurrentDate())) return;
  currentVisible.value = true;
  currentPosition.value = roundCalendarPosition(getCalendarPosition(getCalendarCurrentDate()));
  animationFrame = requestAnimationFrame(tick);
});
onBeforeUnmount(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<template>
  <div class="semi-calendar-grid" role="presentation">
    <div role="gridcell" class="semi-calendar-grid-content">
      <template v-if="props.showCurrTime && currentVisible">
        <div class="semi-calendar-grid-curr-circle" :style="currentStyle" />
        <div class="semi-calendar-grid-curr-line" :style="currentStyle" />
      </template>
      <ul
        role="row"
        :class="['semi-calendar-grid-skeleton', props.isWeekend && 'semi-calendar-weekend']"
      >
        <template v-for="row in skeletonRows" :key="`${row.hour}-daycol`">
          <li
            :data-time="row.hourLabel"
            class="semi-calendar-grid-skeleton-row-line"
            @click="emit('click', $event, [props.date, row.hour, 0, 0])"
          />
          <li
            :data-time="row.halfLabel"
            @click="emit('click', $event, [props.date, row.hour, 30, 0])"
          />
        </template>
      </ul>
      <CalendarNodeRenderer
        v-if="runtime.slots.dateGrid"
        :content="runtime.slots.dateGrid({ date: props.date, dateString: props.date.toString() })"
      />
      <ul class="semi-calendar-event-items">
        <li
          v-for="(event, index) in props.events"
          :key="event.key || `${event.startPos ?? 0}-${index}`"
          class="semi-calendar-event-item semi-calendar-event-day"
          :style="eventStyle(event)"
        >
          <CalendarNodeRenderer :content="runtime.eventContent(event)" />
        </li>
      </ul>
    </div>
  </div>
</template>
