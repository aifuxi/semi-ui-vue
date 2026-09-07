<script setup lang="ts">
import { shallowRef } from 'vue';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';
import '@aifuxi/semi-theme-default/hot-keys.css';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
const visible = shallowRef(false);
const hotKeys = [HotKeys.Keys.Control, HotKeys.Keys.R];
function close() {
  visible.value = false;
}
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <HotKeys :hot-keys="hotKeys" @hot-key="visible = true"
        ><Tag>Press Ctrl+R to Open Modal</Tag></HotKeys
      >
      <Modal title="Dialog" :visible="visible" @ok="close" @cancel="close"
        >This is the Modal opened by hotkey: {{ hotKeys.join('+') }}.</Modal
      >
    </div>
  </ConfigProvider>
</template>
