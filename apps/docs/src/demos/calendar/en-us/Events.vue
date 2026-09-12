<script setup lang="ts">
import { shallowRef, computed, h, type CSSProperties } from 'vue';
import { Calendar, type CalendarMode, type CalendarEvent } from '@aifuxi/semi-ui-vue/calendar';
import { RadioGroup, Radio } from '@aifuxi/semi-ui-vue/radio';
import { DatePicker, type DatePickerValue } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/calendar.css';
import '@aifuxi/semi-theme-default/radio.css';
import '@aifuxi/semi-theme-default/date-picker.css';
const mode = shallowRef<CalendarMode>('week');
const displayValue = shallowRef(new Date(2019, 6, 23, 8, 32, 0));
const events = computed<CalendarEvent[]>(() => {
  const dailyEventStyle: CSSProperties = {
    borderRadius: '3px',
    boxSizing: 'border-box',
    border: 'var(--semi-color-primary) 1px solid',
    padding: '10px',
    backgroundColor: 'var(--semi-color-primary-light-default)',
    height: '100%',
    overflow: 'hidden',
  };
  const allDayStyle: CSSProperties = {
    borderRadius: '3px',
    boxSizing: 'border-box',
    border: 'var(--semi-color-bg-1) 1px solid',
    padding: '2px 4px',
    backgroundColor: 'var(--semi-color-primary-light-active)',
    height: '100%',
    overflow: 'hidden',
  };
  const dailyStyle = mode.value === 'month' ? allDayStyle : dailyEventStyle;
  return [
    {
      key: '0',
      start: new Date(2019, 5, 25, 14, 45, 0),
      end: new Date(2019, 6, 26, 6, 18, 0),
      content: h('div', { style: dailyStyle }, 'June 25th 14:45 ~ July 26th 6:18'),
    },
    {
      key: '1',
      start: new Date(2019, 6, 18, 10, 0, 0),
      end: new Date(2019, 6, 30, 8, 0, 0),
      content: h('div', { style: allDayStyle }, 'July 18th 10:00 ~ July 30th 8:00'),
    },
    {
      key: '2',
      start: new Date(2019, 6, 19, 20, 0, 0),
      end: new Date(2019, 6, 23, 14, 0, 0),
      content: h('div', { style: allDayStyle }, 'July 19th 20:00 ~ July 23rd 14:00'),
    },
    {
      key: '3',
      start: new Date(2019, 6, 21, 6, 0, 0),
      end: new Date(2019, 6, 25, 6, 0, 0),
      content: h('div', { style: allDayStyle }, 'July 21st 6:00 ~ July 25th 6:00'),
    },
    {
      key: '4',
      allDay: true,
      start: new Date(2019, 6, 22, 8, 0, 0),
      content: h('div', { style: allDayStyle }, 'July 22 full day'),
    },
    {
      key: '5',
      start: new Date(2019, 6, 22, 9, 0, 0),
      end: new Date(2019, 6, 23, 23, 0, 0),
      content: h('div', { style: allDayStyle }, 'July 22nd 9:00 ~ July 23rd 23:00'),
    },
    {
      key: '6',
      start: new Date(2019, 6, 23, 8, 32, 0),
      end: new Date(2019, 6, 23, 8, 42, 0),
      content: h('div', { style: dailyStyle }, 'July 23 8:32'),
    },
    {
      key: '7',
      start: new Date(2019, 6, 23, 14, 30, 0),
      end: new Date(2019, 6, 23, 20, 0, 0),
      content: h('div', { style: dailyStyle }, 'July 23 14:30-20:00'),
    },
    {
      key: '8',
      start: new Date(2019, 6, 25, 8, 0, 0),
      end: new Date(2019, 6, 27, 6, 0, 0),
      content: h('div', { style: allDayStyle }, 'July 25th 8:00 ~ July 27th 6:00'),
    },
    {
      key: '9',
      start: new Date(2019, 6, 26, 10, 0, 0),
      end: new Date(2019, 6, 27, 16, 0, 0),
      content: h('div', { style: allDayStyle }, 'July 26th 10:00 ~ July 27th 16:00'),
    },
  ];
});
function changeDate(value: DatePickerValue) {
  if (value instanceof Date) displayValue.value = value;
}
</script>
<template>
  <RadioGroup v-model="mode" type="button"
    ><Radio value="day">Day view</Radio><Radio value="week">Week view</Radio
    ><Radio value="month">Month view</Radio><Radio value="range">Multi-day view</Radio></RadioGroup
  ><br /><br /><DatePicker :value="displayValue" @change="changeDate" /><br /><br /><Calendar
    :height="400"
    :mode="mode"
    :display-value="displayValue"
    :events="events"
    :min-event-height="40"
    :range="mode === 'range' ? [new Date(2019, 6, 23), new Date(2019, 6, 26)] : []"
  />
</template>
