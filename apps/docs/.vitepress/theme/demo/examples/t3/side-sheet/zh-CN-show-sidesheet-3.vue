<script setup lang="ts">
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
function change() {
  visible.value = !visible.value;
}
import type { SideSheetPlacement } from '@aifuxi/semi-ui-vue/side-sheet';
import type { RadioChangeEvent } from '@aifuxi/semi-ui-vue/radio';
const placement = shallowRef<SideSheetPlacement>('right');
function changePlacement(event: RadioChangeEvent) {
  placement.value = event.target.value as SideSheetPlacement;
}
</script>
<template>
  <RadioGroup :value="placement" @change="changePlacement">
    <Radio :value="'right'">right</Radio>
    <Radio :value="'left'">left</Radio>
    <Radio :value="'top'">top</Radio>
    <Radio :value="'bottom'">bottom</Radio>
  </RadioGroup>
  <br />
  <br />
  <Button @click="change">Open SideSheet</Button>
  <SideSheet title="滑动侧边栏" :visible="visible" :placement="placement" @cancel="change">
    <p>This is the content of a basic sidesheet.</p>
    <p>Here is more content...</p>
  </SideSheet>
</template>
