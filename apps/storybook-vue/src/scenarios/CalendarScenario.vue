<script setup lang="ts">
import { h, shallowRef, type CSSProperties } from 'vue';
import { enUS, zhCN } from 'date-fns/locale';
import { Calendar, type CalendarEvent, type CalendarMode } from '@aifuxi/semi-ui-vue/calendar';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import type { ParityDirection, ParityLocale } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection; locale: ParityLocale }>();
const mode = shallowRef<CalendarMode>('week');
const status = shallowRef('等待操作');
const displayValue = new Date(2023, 3, 10, 8, 32, 0);
const eventStyle: CSSProperties = {
  boxSizing: 'border-box',
  border: '1px solid var(--semi-color-primary)',
  borderRadius: '3px',
  background: 'var(--semi-color-primary-light-default)',
  height: '100%',
  overflow: 'hidden',
  padding: '2px 4px',
};
const events: CalendarEvent[] = [
  {
    key: 'review',
    start: new Date(2023, 3, 10, 9),
    end: new Date(2023, 3, 10, 10, 30),
    content: h('div', { style: eventStyle }, '09:00 Review'),
  },
  {
    key: 'sync',
    start: new Date(2023, 3, 10, 13),
    end: new Date(2023, 3, 10, 14),
    content: h('div', { style: eventStyle }, '13:00 Sync'),
  },
  {
    key: 'release',
    allDay: true,
    start: new Date(2023, 3, 10),
    content: h('div', { style: eventStyle }, 'Release day'),
  },
  {
    key: 'milestone',
    allDay: true,
    start: new Date(2023, 3, 10),
    content: h('div', { style: eventStyle }, 'Milestone'),
  },
];
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    dateFnsLocale: zhCN,
    Calendar: {
      allDay: '全天',
      AM: '上午${time}时',
      PM: '下午${time}时',
      datestring: '日',
      remaining: '还有${remained}项',
      close: '关闭事件列表',
    },
  },
  'en-US': {
    code: 'en-US',
    dateFnsLocale: enUS,
    Calendar: {
      allDay: 'All Day',
      AM: '${time} AM',
      PM: '${time} PM',
      datestring: '',
      remaining: '${remained} more',
      close: 'Close event list',
    },
  },
};
const modes: CalendarMode[] = ['day', 'week', 'month', 'range'];

function handleClick(_event: MouseEvent, date: Date): void {
  status.value = `日期：${date.toISOString()}`;
}

function handleMoreClick(_event: MouseEvent, date: Date, remaining: number): void {
  status.value = `更多：${date.getDate()}/${remaining}`;
}
</script>

<template>
  <ConfigProvider :direction="props.direction" :locale="localeMap[props.locale]">
    <div class="calendar-scenario" data-testid="calendar-vue">
      <div class="calendar-scenario__toolbar" role="group" aria-label="Calendar mode">
        <button
          v-for="item in modes"
          :key="item"
          type="button"
          :data-mode="item"
          :aria-pressed="mode === item"
          @click="mode = item"
        >
          {{ item }}
        </button>
      </div>
      <Calendar
        data-parity-target="calendar-root"
        :mode="mode"
        :display-value="displayValue"
        :range="[displayValue, new Date(2023, 3, 14)]"
        :events="events"
        :height="340"
        width="100%"
        mark-weekend
        :min-event-height="28"
        :scroll-top="300"
        :show-curr-time="false"
        @click="handleClick"
        @more-click="handleMoreClick"
        @close="status = '卡片已关闭'"
      />
      <output class="calendar-scenario__status" aria-live="polite">{{ status }}</output>
    </div>
  </ConfigProvider>
</template>
