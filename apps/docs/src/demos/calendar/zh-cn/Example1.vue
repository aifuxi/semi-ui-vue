<script setup lang="ts">
import { Calendar, type CalendarEvent } from '@aifuxi/semi-ui-vue/calendar';

const displayValue = new Date(2023, 3, 10, 8, 32);
const events: CalendarEvent[] = [
  {
    key: 'meeting',
    start: new Date(2023, 3, 10, 9),
    end: new Date(2023, 3, 10, 10),
    content: '评审会',
  },
  { key: 'release', allDay: true, start: new Date(2023, 3, 11), content: '发布日' },
];
import '@aifuxi/semi-theme-default/calendar.css';
</script>

<template>
  <Calendar mode="week" :display-value="displayValue" :events="events" :height="480" />
</template>
