<script setup lang="ts">
import {
  calcCalendarRowHeight,
  type CalendarDateObject,
  type CalendarParsedEvents,
  type FoundationCalendarEvent,
  type ParsedCalendarEvent,
} from '@workspace/foundation-integration';
import { computed, nextTick, onMounted, shallowRef, useTemplateRef, type CSSProperties } from 'vue';

import CalendarDayColumn from './CalendarDayColumn.vue';
import CalendarNodeRenderer from './CalendarNodeRenderer';
import CalendarTimeColumn from './CalendarTimeColumn.vue';
import { useCalendarRuntime } from './calendar-context';

defineOptions({ name: 'CalendarWeek' });
const props = withDefaults(defineProps<{ rangeMode?: boolean }>(), { rangeMode: false });
const runtime = useCalendarRuntime();
const root = useTemplateRef<HTMLDivElement>('root');
const scroll = useTemplateRef<HTMLDivElement>('scroll');
const allDay = useTemplateRef<HTMLDivElement>('allDay');
const scrollHeight = shallowRef(0);

const data = computed(() => (props.rangeMode ? runtime.state.rangeData : runtime.state.weeklyData));
const parsed = computed(() => runtime.state.parsedEvents as CalendarParsedEvents);
const dayEventMap = computed(() =>
  parsed.value.day instanceof Map ? parsed.value.day : new Map<string, ParsedCalendarEvent[]>(),
);
const allDayEventMap = computed(() =>
  parsed.value.allDay instanceof Map
    ? parsed.value.allDay
    : new Map<string, ParsedCalendarEvent[]>(),
);
const parsedAllDay = computed(() =>
  props.rangeMode
    ? runtime.foundation.parseRangeAllDayEvents(allDayEventMap.value)
    : runtime.foundation.parseWeeklyAllDayEvents(allDayEventMap.value),
);
const allDayStyle = computed<CSSProperties | undefined>(() =>
  runtime.slots.allDayEvents
    ? undefined
    : { height: `${calcCalendarRowHeight(parsedAllDay.value)}em` },
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

function dailyEvents(day: CalendarDateObject): ParsedCalendarEvent[] {
  const events = dayEventMap.value.get(day.date.toString()) ?? [];
  return runtime.foundation.getParseDailyEvents(events as FoundationCalendarEvent[], day.date).day;
}

function allDayEventStyle(event: ParsedCalendarEvent): CSSProperties {
  const left = event.leftPos ?? 0;
  const width = event.width ?? 0;
  return {
    left: `${Math.min(left, 1) * 100}%`,
    width: `${Math.min(width, 1) * 100}%`,
    top: `${event.topInd ?? 0}em`,
  };
}

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
  <div ref="root" :class="['semi-calendar-week', runtime.props.value.className]" :style="rootStyle">
    <div class="semi-calendar-week-sticky-top">
      <CalendarNodeRenderer :content="runtime.slots.header?.() ?? runtime.props.value.header" />
      <div class="semi-calendar-week-header">
        <ul class="semi-calendar-tag semi-calendar-week-tag semi-calendar-week-sticky-left">
          <span>{{ data.month }}</span>
        </ul>
        <div role="gridcell" class="semi-calendar-week-grid">
          <ul class="semi-calendar-week-grid-row">
            <li
              v-for="day in data.week"
              :key="`${day.date.toString()}-weekheader`"
              :class="[
                day.isToday && 'semi-calendar-today',
                runtime.props.value.markWeekend && day.isWeekend && 'semi-calendar-weekend',
              ]"
            >
              <CalendarNodeRenderer
                v-if="runtime.slots.dateDisplay"
                :content="runtime.slots.dateDisplay({ date: day.date })"
              />
              <template v-else>
                <span class="semi-calendar-today-date">{{ day.dayString }}</span>
                <span>{{ day.weekday }}</span>
              </template>
            </li>
          </ul>
        </div>
      </div>
      <div ref="allDay" class="semi-calendar-all-day" :style="allDayStyle">
        <ul class="semi-calendar-tag semi-calendar-all-day-tag semi-calendar-week-sticky-left">
          <span>{{ runtime.locale.value.allDay }}</span>
        </ul>
        <div role="gridcell" class="semi-calendar-content semi-calendar-all-day-content">
          <ul class="semi-calendar-all-day-skeleton">
            <li
              v-for="day in data.week"
              :key="`${day.date.toString()}-weekgrid`"
              :class="[runtime.props.value.markWeekend && day.isWeekend && 'semi-calendar-weekend']"
            />
          </ul>
          <CalendarNodeRenderer
            v-if="runtime.slots.allDayEvents"
            :content="runtime.slots.allDayEvents({ events: runtime.props.value.events })"
          />
          <ul v-else class="semi-calendar-event-items">
            <li
              v-for="(event, index) in parsedAllDay"
              :key="event.key || `allDay-${index}`"
              class="semi-calendar-event-item semi-calendar-event-allday"
              :style="allDayEventStyle(event)"
            >
              <CalendarNodeRenderer :content="runtime.eventContent(event)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="semi-calendar-week-scroll-wrapper">
      <div ref="scroll" class="semi-calendar-week-scroll">
        <CalendarTimeColumn class-name="semi-calendar-week-sticky-left" />
        <CalendarDayColumn
          v-for="day in data.week"
          :key="`${day.date.toString()}-weekday`"
          :date="day.date"
          :events="dailyEvents(day)"
          :is-weekend="runtime.props.value.markWeekend && day.isWeekend"
          :min-event-height="runtime.props.value.minEventHeight"
          :scroll-height="scrollHeight"
          :show-curr-time="runtime.props.value.showCurrTime"
          @click="handleGridClick"
        />
      </div>
    </div>
  </div>
</template>
