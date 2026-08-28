<script setup lang="ts">
import type { CalendarParsedEvents, ParsedCalendarEvent } from '@workspace/foundation-integration';
import { computed, nextTick, onMounted, shallowRef, useTemplateRef, type CSSProperties } from 'vue';

import CalendarDayColumn from './CalendarDayColumn.vue';
import CalendarNodeRenderer from './CalendarNodeRenderer';
import CalendarTimeColumn from './CalendarTimeColumn.vue';
import { useCalendarRuntime } from './calendar-context';

defineOptions({ name: 'CalendarDay' });
const runtime = useCalendarRuntime();
const root = useTemplateRef<HTMLDivElement>('root');
const scroll = useTemplateRef<HTMLDivElement>('scroll');
const allDay = useTemplateRef<HTMLDivElement>('allDay');
const scrollHeight = shallowRef(0);

const parsed = computed(() => runtime.state.parsedEvents as CalendarParsedEvents);
const dayEvents = computed(() =>
  Array.isArray(parsed.value.day) ? parsed.value.day : ([] as ParsedCalendarEvent[]),
);
const allDayEvents = computed(() =>
  Array.isArray(parsed.value.allDay) ? parsed.value.allDay : ([] as ParsedCalendarEvent[]),
);
const rootStyle = computed<CSSProperties>(() => ({
  height:
    typeof runtime.props.value.height === 'number'
      ? `${runtime.props.value.height}px`
      : runtime.props.value.height,
  width:
    typeof runtime.props.value.width === 'number'
      ? `${runtime.props.value.width}px`
      : runtime.props.value.width,
  ...(runtime.props.value.style && typeof runtime.props.value.style === 'object'
    ? (runtime.props.value.style as CSSProperties)
    : {}),
}));

function handleGridClick(event: MouseEvent, value: [Date, number, number, number]): void {
  const date = runtime.formatClickValue(value);
  runtime.click(event, date);
}

onMounted(async () => {
  await nextTick();
  scrollHeight.value = scroll.value?.scrollHeight ?? 0;
  if (root.value) {
    const tag = allDay.value?.querySelector<HTMLElement>('.semi-calendar-all-day-tag span');
    const initialRowHeight = tag ? Number.parseFloat(getComputedStyle(tag).lineHeight) : 0;
    const renderedHeight =
      allDay.value
        ?.querySelector<HTMLElement>('.semi-calendar-all-day-content')
        ?.getBoundingClientRect().height ?? initialRowHeight;
    root.value.scrollTop =
      runtime.props.value.scrollTop + Math.max(0, renderedHeight - initialRowHeight);
  }
});
</script>

<template>
  <div ref="root" :class="['semi-calendar-day', runtime.props.value.className]" :style="rootStyle">
    <div class="semi-calendar-day-sticky-top">
      <CalendarNodeRenderer :content="runtime.slots.header?.() ?? runtime.props.value.header" />
      <div ref="allDay" class="semi-calendar-all-day">
        <ul class="semi-calendar-tag semi-calendar-all-day-tag semi-calendar-day-sticky-left">
          <span>{{ runtime.locale.value.allDay }}</span>
        </ul>
        <div
          role="gridcell"
          :class="[
            'semi-calendar-all-day-content',
            runtime.props.value.markWeekend &&
              runtime.foundation.checkWeekend(runtime.props.value.displayValue) &&
              'semi-calendar-weekend',
          ]"
        >
          <CalendarNodeRenderer
            v-if="runtime.slots.allDayEvents"
            :content="runtime.slots.allDayEvents({ events: runtime.props.value.events })"
          />
          <ul v-else class="semi-calendar-event-items">
            <li
              v-for="(event, index) in allDayEvents"
              :key="event.key || `allDay-${index}`"
              class="semi-calendar-event-item semi-calendar-event-allday"
            >
              <CalendarNodeRenderer :content="runtime.eventContent(event)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="semi-calendar-day-scroll-wrapper">
      <div ref="scroll" class="semi-calendar-day-scroll">
        <CalendarTimeColumn class-name="semi-calendar-day-sticky-left" />
        <CalendarDayColumn
          :date="runtime.props.value.displayValue"
          :events="dayEvents"
          :is-weekend="
            runtime.props.value.markWeekend &&
            runtime.foundation.checkWeekend(runtime.props.value.displayValue)
          "
          :min-event-height="runtime.props.value.minEventHeight"
          :scroll-height="scrollHeight"
          :show-curr-time="runtime.props.value.showCurrTime"
          @click="handleGridClick"
        />
      </div>
    </div>
  </div>
</template>
