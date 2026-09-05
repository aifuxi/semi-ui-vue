<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/time-picker.css';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
const open = shallowRef(false);
function openChange(value: boolean) {
  open.value = value;
  console.log(value);
}
function footer(index: number) {
  console.log(index === 0 ? 'start footer' : 'end footer');
}
</script>
<template>
  <div>
    <TimePicker :open="open" panel-header="Time Select" @open-change="openChange"
      ><template #panelFooter><Button @click="open = false">close</Button></template></TimePicker
    ><br /><br /><TimePicker type="timeRange" :panel-header="['start header', 'end header']"
      ><template #panelFooter="{ index }"
        ><Button @click="footer(index)">{{
          index === 0 ? 'start footer' : 'end footer'
        }}</Button></template
      ></TimePicker
    >
  </div>
</template>
