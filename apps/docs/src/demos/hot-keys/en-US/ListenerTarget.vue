<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';
import '@aifuxi/semi-theme-default/hot-keys.css';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
import { Input, type InputExposed } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
const visible = shallowRef(false);
const hotKeys = ['Control', 'q'];
const input = useTemplateRef<InputExposed>('input');
function close() {
  visible.value = false;
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <Input ref="input" placeholder="test for target" />
      <HotKeys
        :hot-keys="hotKeys"
        :get-listener-target="() => input?.input"
        @hot-key="visible = true"
      />
      <Modal title="Dialog" :visible="visible" @ok="close" @cancel="close"
        >This is the Modal opened by hotkey: {{ hotKeys.join('+') }}.</Modal
      >
    </div>
  </ConfigProvider>
</template>
