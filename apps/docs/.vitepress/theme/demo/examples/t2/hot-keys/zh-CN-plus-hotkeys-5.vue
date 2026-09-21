<script setup lang="ts">
import { shallowRef } from 'vue';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';
import '@aifuxi/semi-theme-default/hot-keys.css';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
const visible = shallowRef(false);
const hotKeys = [HotKeys.Keys.Meta, HotKeys.Keys.S];
function close() {
  visible.value = false;
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <HotKeys :hot-keys="hotKeys" prevent-default @hot-key="visible = true" /><br /><HotKeys
        :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.S]"
        prevent-default
        @hot-key="visible = true"
      />
      <Modal title="Dialog" :visible="visible" @ok="close" @cancel="close"
        >This is the Modal opened by hotkey: Meta/Control + S.</Modal
      >
    </div>
  </ConfigProvider>
</template>
