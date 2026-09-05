<script setup lang="ts">
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
const displayValue = new Date(2019, 6, 23, 8, 32, 0);
const importantDates = [2, 8, 19, 23].map((day) => new Date(2019, 6, day).toString());
</script>
<template>
  <Calendar :height="700" mode="month" :display-value="displayValue" :show-curr-time="false"
    ><template #dateGrid="{ dateString }"
      ><div
        v-if="importantDates.includes(dateString)"
        style="
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: var(--semi-color-danger-light-default);
        " /></template
  ></Calendar>
</template>
