<script setup lang="ts">
import { computed } from 'vue';

import CalendarNodeRenderer from './CalendarNodeRenderer';
import { useCalendarRuntime } from './calendar-context';

defineOptions({ name: 'CalendarTimeColumn' });
const props = defineProps<{ className?: string }>();
const runtime = useCalendarRuntime();

function replaceTime(template: string, time: number): string {
  return template.replace('${time}', String(time));
}

const timeLabels = computed(() =>
  Array.from({ length: 24 }, (_, time) => {
    if (time === 0) return '';
    const custom = runtime.slots.timeDisplay?.({ time });
    if (custom !== undefined) return custom;
    if (time < 12) return replaceTime(runtime.locale.value.AM, time);
    return replaceTime(runtime.locale.value.PM, time === 12 ? 12 : time - 12);
  }),
);
</script>

<template>
  <div :class="[props.className, 'semi-calendar-time']">
    <ul class="semi-calendar-time-items">
      <li v-for="(label, time) in timeLabels" :key="`time-${time}`" class="semi-calendar-time-item">
        <span><CalendarNodeRenderer :content="label" /></span>
      </li>
    </ul>
  </div>
</template>
