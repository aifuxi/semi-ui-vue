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
import type { SideSheetSize } from '@aifuxi/semi-ui-vue/side-sheet';
import type { RadioChangeEvent } from '@aifuxi/semi-ui-vue/radio';
const size = shallowRef<SideSheetSize>('small');
function changeSize(event: RadioChangeEvent) {
  size.value = event.target.value as SideSheetSize;
}
</script>
<template>
  <RadioGroup :value="size" @change="changeSize">
    <Radio :value="'small'">small</Radio>
    <Radio :value="'medium'">medium</Radio>
    <Radio :value="'large'">large</Radio>
  </RadioGroup>
  <br />
  <br />
  <Button @click="change">Open SideSheet</Button>
  <SideSheet title="滑动侧边栏" :visible="visible" :size="size" @cancel="change">
    <p>This is the content of a basic sidesheet.</p>
    <p>Here is more content...</p>
  </SideSheet>
</template>
