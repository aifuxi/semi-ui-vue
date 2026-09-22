<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import { Space } from '@aifuxi/semi-ui-vue/space';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/space.css';
import '@aifuxi/semi-theme-default/button.css';
import { useTemplateRef } from 'vue';
import type { DatePickerExposed } from '@aifuxi/semi-ui-vue/date-picker';
const picker = useTemplateRef<DatePickerExposed>('picker');
function outside() {
  console.log('click outside');
}
</script>
<template>
  <Space vertical align="start"
    ><Space
      ><Button @click="picker?.open()">open</Button><Button @click="picker?.close()">close</Button
      ><Button @click="picker?.focus()">focus</Button
      ><Button @click="picker?.blur()">blur</Button></Space
    >
    <div>
      <DatePicker
        ref="picker"
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateTime"
        @click-outside="outside"
      /></div
  ></Space>
</template>
