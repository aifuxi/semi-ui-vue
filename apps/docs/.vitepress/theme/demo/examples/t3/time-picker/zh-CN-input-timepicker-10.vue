<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
</script>
<template>
  <div>
    <div>
      <TimePicker type="timeRange" :default-value="['10:23:15', '12:38:32']"></TimePicker
      ><br /><br />
      <TimePicker
        type="timeRange"
        use12-hours
        format="a h:mm"
        :default-value="['上午 08:11', '下午 11:21']"
      ></TimePicker>
    </div>
  </div>
</template>
