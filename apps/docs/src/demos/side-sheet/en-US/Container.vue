<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
const container = shallowRef<HTMLElement | null>(null);
function getContainer() {
  return container.value!;
}
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><div
      ref="container"
      :style="{
        height: '320px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid var(--semi-color-border)',
        borderRadius: '2px',
        padding: '24px',
        textAlign: 'center',
        background: 'var(--semi-color-fill-0)',
      }"
      class="sidesheet-container"
    >
      <span> Render in this</span>
      <br />
      <br />
      <Button @click="() => (visible = true)"> Open SideSheet</Button>
      <SideSheet
        title="SideSheet"
        :visible="visible"
        :width="220"
        :get-popup-container="getContainer"
        @cancel="() => (visible = false)"
      >
        <p>This is the content of a basic sidesheet.</p>
        <p>Here is more content...</p>
      </SideSheet>
    </div></ConfigProvider
  >
</template>
