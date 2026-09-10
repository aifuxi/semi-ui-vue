<script setup lang="ts">
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
const value = shallowRef('');
</script>
<template>
  <Button @click="() => (visible = true)"> Open SideSheet</Button>
  <TextArea v-model="value" placeholder="Please enter something" :style="{ marginTop: '12px' }" />
  <SideSheet
    title="可操作外部的侧边栏"
    :visible="visible"
    :mask="false"
    :disable-scroll="false"
    @cancel="() => (visible = false)"
  >
    <p>这里是输入的内容：</p>
    <p>{{ value }}</p>
  </SideSheet>
</template>
