<script setup lang="ts">
import { IconClose } from '@aifuxi/semi-icons-vue';
import type {
  CalendarDateObject,
  MonthlyCalendarEvents,
  ParsedCalendarEvent,
} from '@workspace/foundation-integration';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
  type CSSProperties,
} from 'vue';

import Button from '../button/Button.vue';
import Tooltip from '../tooltip/Tooltip.vue';
import type { TooltipPosition } from '../tooltip';
import CalendarNodeRenderer from './CalendarNodeRenderer';
import { useCalendarRuntime } from './calendar-context';

defineOptions({ name: 'CalendarMonth' });
const runtime = useCalendarRuntime();
const root = useTemplateRef<HTMLDivElement>('root');
const openKey = shallowRef<string>();
const openPosition = shallowRef<TooltipPosition>('leftTopOver');
let resizeObserver: ResizeObserver | undefined;

const monthData = computed(() => runtime.state.monthlyData);
const parsed = computed(() => runtime.state.parsedEvents as MonthlyCalendarEvents);
const weekEntries = computed(() =>
  Object.keys(monthData.value).map((key) => ({
    index: Number(key),
    days: monthData.value[Number(key)] ?? [],
  })),
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
const popupContainerProps = computed(() =>
  runtime.getPopupContainer.value ? { getPopupContainer: runtime.getPopupContainer.value } : {},
);

function calculateItemLimit(): number {
  const row = root.value?.querySelector<HTMLElement>('.semi-calendar-month-weekrow');
  const height = row?.getBoundingClientRect().height ?? 0;
  return Math.max(0, Math.ceil((height - 60) / 24));
}

async function refreshMeasuredMonth(): Promise<void> {
  await nextTick();
  const limit = calculateItemLimit();
  if (limit !== runtime.state.itemLimit) runtime.refreshMonth(limit);
}

function weekEvents(index: number): MonthlyCalendarEvents[number] | undefined {
  return parsed.value[index];
}

function dayEvents(index: number, dayIndex: number): ParsedCalendarEvent[] {
  return weekEvents(index)?.day?.[dayIndex]?.filter(Boolean) ?? [];
}

function shouldCollapse(index: number, day: CalendarDateObject): boolean {
  return dayEvents(index, day.ind).length > runtime.state.itemLimit;
}

function dayClasses(day: CalendarDateObject): Array<string | false> {
  return [
    day.isToday && 'semi-calendar-today',
    runtime.props.value.markWeekend && day.isWeekend && 'semi-calendar-weekend',
    day.isSameMonth && 'semi-calendar-month-same',
  ];
}

function eventStyle(event: ParsedCalendarEvent): CSSProperties {
  return {
    left: `${Math.min(event.leftPos ?? 0, 1) * 100}%`,
    width: `${Math.min(event.width ?? 0, 1) * 100}%`,
    top: `${event.topInd ?? 0}em`,
  };
}

function visibleEvents(index: number): ParsedCalendarEvent[] {
  return (weekEvents(index)?.display ?? []).filter(
    (event) => (event.topInd ?? 0) < runtime.state.itemLimit,
  );
}

function remaining(index: number, day: CalendarDateObject): number {
  return Math.max(0, dayEvents(index, day.ind).length - runtime.state.itemLimit);
}

function formatRemaining(count: number): string {
  return runtime.locale.value.remaining.replace('${remained}', String(count));
}

function openCard(event: MouseEvent, day: CalendarDateObject, count: number): void {
  event.stopPropagation();
  const target = event.currentTarget as HTMLElement;
  const spacing = document.body.clientWidth - target.getBoundingClientRect().right - 110;
  openPosition.value = spacing > 0 ? 'leftTopOver' : 'rightTopOver';
  openKey.value = day.date.toString();
  runtime.moreClick(event, day.date, count);
}

function closeCard(event: MouseEvent): void {
  if (!openKey.value) return;
  openKey.value = undefined;
  runtime.close(event);
}

function clickDay(event: MouseEvent, day: CalendarDateObject): void {
  runtime.click(event, runtime.formatClickValue([day.date]));
}

onMounted(() => {
  void refreshMeasuredMonth();
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(() => void refreshMeasuredMonth());
    resizeObserver.observe(root.value);
  }
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  openKey.value = undefined;
});
watch(
  () => runtime.props.value.height,
  () => void refreshMeasuredMonth(),
);
</script>

<template>
  <div
    ref="root"
    role="grid"
    :class="['semi-calendar-month', runtime.props.value.className]"
    :style="rootStyle"
  >
    <div role="presentation" class="semi-calendar-month-sticky-top">
      <CalendarNodeRenderer :content="runtime.slots.header?.() ?? runtime.props.value.header" />
      <div class="semi-calendar-month-header" role="presentation">
        <div role="presentation" class="semi-calendar-month-grid">
          <ul role="row" class="semi-calendar-month-grid-row">
            <li
              v-for="day in monthData[0] ?? []"
              :key="`${day.weekday}-monthheader`"
              role="columnheader"
              :aria-label="day.weekday"
              :class="[runtime.props.value.markWeekend && day.isWeekend && 'semi-calendar-weekend']"
            >
              <span>{{ day.weekday }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div role="presentation" class="semi-calendar-month-grid-wrapper">
      <div role="presentation" class="semi-calendar-month-week">
        <ul role="presentation" class="semi-calendar-month-grid-col">
          <div
            v-for="week in weekEntries"
            :key="`${week.index}-weekrow`"
            role="presentation"
            class="semi-calendar-month-weekrow"
          >
            <ul role="row" class="semi-calendar-month-skeleton">
              <template v-for="day in week.days" :key="`${day.date.toString()}-weeksk`">
                <Tooltip
                  v-if="shouldCollapse(week.index, day)"
                  v-bind="popupContainerProps"
                  :visible="openKey === day.date.toString()"
                  :position="openPosition"
                  prefix-cls="semi-popover"
                  trigger="custom"
                  role="dialog"
                  :show-arrow="false"
                  :spacing="4"
                  :z-index="1030"
                  :close-on-esc="true"
                  :guard-focus="true"
                  :return-focus-on-close="true"
                  :disable-focus-listener="true"
                >
                  <template #content>
                    <div class="semi-popover">
                      <div class="semi-popover-content">
                        <div class="semi-calendar-month-event-card">
                          <div class="semi-calendar-month-event-card-content">
                            <div class="semi-calendar-month-event-card-header">
                              <div class="semi-calendar-month-event-card-header-info">
                                <div class="semi-calendar-month-event-card-header-info-weekday">
                                  {{ day.weekday }}
                                </div>
                                <div class="semi-calendar-month-event-card-header-info-date">
                                  {{ day.dayString }}
                                </div>
                              </div>
                              <Button
                                class="semi-calendar-month-event-card-close"
                                type="tertiary"
                                theme="borderless"
                                size="small"
                                :aria-label="runtime.locale.value.close"
                                @click="closeCard"
                              >
                                <template #icon><IconClose /></template>
                              </Button>
                            </div>
                            <div class="semi-calendar-month-event-card-body">
                              <ul class="semi-calendar-month-event-card-list">
                                <li
                                  v-for="(event, eventIndex) in dayEvents(week.index, day.ind)"
                                  :key="event.key || `${eventIndex}-card-event`"
                                >
                                  <CalendarNodeRenderer :content="runtime.eventContent(event)" />
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <li
                    role="gridcell"
                    :aria-label="day.date.toLocaleDateString()"
                    :aria-current="day.isToday ? 'date' : undefined"
                    :class="dayClasses(day)"
                    @click="clickDay($event, day)"
                  >
                    <CalendarNodeRenderer
                      v-if="runtime.slots.dateDisplay"
                      :content="runtime.slots.dateDisplay({ date: day.date })"
                    />
                    <span v-else class="semi-calendar-month-date">
                      <template v-if="day.dayString === '1'">
                        {{ day.month
                        }}<span class="semi-calendar-today-date">&nbsp;{{ day.dayString }}</span
                        >{{ runtime.locale.value.datestring }}
                      </template>
                      <span v-else class="semi-calendar-today-date">{{ day.dayString }}</span>
                    </span>
                    <div
                      class="semi-calendar-month-event-card-wrapper"
                      style="bottom: 0"
                      @click="openCard($event, day, remaining(week.index, day))"
                    >
                      {{ formatRemaining(remaining(week.index, day)) }}
                    </div>
                    <CalendarNodeRenderer
                      v-if="runtime.slots.dateGrid"
                      :content="
                        runtime.slots.dateGrid({ date: day.date, dateString: day.date.toString() })
                      "
                    />
                  </li>
                </Tooltip>
                <li
                  v-else
                  role="gridcell"
                  :aria-label="day.date.toLocaleDateString()"
                  :aria-current="day.isToday ? 'date' : undefined"
                  :class="dayClasses(day)"
                  @click="clickDay($event, day)"
                >
                  <CalendarNodeRenderer
                    v-if="runtime.slots.dateDisplay"
                    :content="runtime.slots.dateDisplay({ date: day.date })"
                  />
                  <span v-else class="semi-calendar-month-date">
                    <template v-if="day.dayString === '1'">
                      {{ day.month
                      }}<span class="semi-calendar-today-date">&nbsp;{{ day.dayString }}</span
                      >{{ runtime.locale.value.datestring }}
                    </template>
                    <span v-else class="semi-calendar-today-date">{{ day.dayString }}</span>
                  </span>
                  <CalendarNodeRenderer
                    v-if="runtime.slots.dateGrid"
                    :content="
                      runtime.slots.dateGrid({ date: day.date, dateString: day.date.toString() })
                    "
                  />
                </li>
              </template>
            </ul>
            <ul class="semi-calendar-event-items">
              <li
                v-for="(event, eventIndex) in visibleEvents(week.index)"
                :key="event.key || `${eventIndex}-monthevent`"
                class="semi-calendar-event-item semi-calendar-event-month"
                :style="eventStyle(event)"
              >
                <CalendarNodeRenderer :content="runtime.eventContent(event)" />
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
