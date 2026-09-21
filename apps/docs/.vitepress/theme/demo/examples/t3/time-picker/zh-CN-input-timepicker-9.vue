<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
</script>
<template>
  <div>
    <div>
      <TimePicker use12-hours></TimePicker><br /><br />
      <TimePicker use12-hours format="a h:mm"></TimePicker>
    </div>
  </div>
</template>
