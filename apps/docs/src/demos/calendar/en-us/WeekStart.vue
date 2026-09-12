<script setup lang="ts">
import { shallowRef } from 'vue';
import { Calendar, type WeekStartsOn } from '@aifuxi/semi-ui-vue/calendar';
import { RadioGroup, Radio } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/calendar.css';
import '@aifuxi/semi-theme-default/radio.css';
const weekStart = shallowRef<WeekStartsOn>(0);
</script>
<template>
  <div>
    <RadioGroup
      v-model="weekStart"
      aria-label="StartOfWeek"
      type="button"
      name="demo-radio-group-vertical"
      ><Radio :value="0">Sunday</Radio><Radio :value="1">Mon</Radio><Radio :value="2">Tue</Radio
      ><Radio :value="3">Wed</Radio><Radio :value="4">Thu</Radio><Radio :value="5">Fri</Radio
      ><Radio :value="6">Sat</Radio></RadioGroup
    ><Calendar mode="month" :week-starts-on="weekStart" />
  </div>
</template>
