<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/time-picker.css';
import '@aifuxi/semi-theme-default/tag.css';
import { IconTimePicker } from '@aifuxi/semi-icons-lab-vue';
import { shallowRef } from 'vue';
import type { TimePickerChangeValue } from '@aifuxi/semi-ui-vue/time-picker';
const time = shallowRef<TimePickerChangeValue>(new Date(2024, 7, 15, 10, 24, 30));
</script>
<template>
  <TimePicker v-model="time" format="HH:mm:ss"
    ><template #trigger="{ placeholder, inputValue }"
      ><Tag
        color="cyan"
        size="large"
        shape="circle"
        style="padding: 12px; padding-right: 16px; font-size: 14px"
        type="light"
        ><template #prefixIcon><IconTimePicker /></template
        >{{ time ? inputValue : placeholder }}</Tag
      ></template
    ></TimePicker
  >
</template>
