<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
import { shallowRef } from 'vue';
import type { TimePickerChangeValue } from '@aifuxi/semi-ui-vue/time-picker';
const value = shallowRef<TimePickerChangeValue>();
function change(time: TimePickerChangeValue) {
  console.log(time);
  value.value = time;
}
</script>
<template>
  <TimePicker :value="value" @update:model-value="change" />
</template>
