<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
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
  <ConfigProvider :locale="enUS">
    <Button @click="() => (visible = true)"> Open SideSheet</Button>
    <TextArea v-model="value" placeholder="Please enter something" :style="{ marginTop: '12px' }" />
    <SideSheet
      title="SideSheet"
      :visible="visible"
      :mask="false"
      :disable-scroll="false"
      @cancel="() => (visible = false)"
    >
      <p>Here is what you entered:</p>
      <p>{{ value }}</p>
    </SideSheet>
  </ConfigProvider>
</template>
