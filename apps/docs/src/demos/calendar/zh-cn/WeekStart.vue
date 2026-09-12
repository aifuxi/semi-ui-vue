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
      aria-label="周起始日"
      type="button"
      name="demo-radio-group-vertical"
      ><Radio :value="0">周日</Radio><Radio :value="1">周一</Radio><Radio :value="2">周二</Radio
      ><Radio :value="3">周三</Radio><Radio :value="4">周四</Radio><Radio :value="5">周五</Radio
      ><Radio :value="6">周六</Radio></RadioGroup
    ><Calendar style="margin-top: 20px" mode="month" :week-starts-on="weekStart" />
  </div>
</template>
