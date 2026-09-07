<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Feedback } from '@aifuxi/semi-ui-vue/feedback';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/feedback.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';

const visible = shallowRef(false);
const value = shallowRef('');

function close() {
  visible.value = false;
}
</script>

<template>
  <ConfigProvider :locale="enUS">
    <Button @click="visible = !visible">Show Feedback: Popup, custom</Button>
    <Feedback
      :visible="visible"
      title="What is your suggestion?"
      type="custom"
      :ok-button-props="{ disabled: !value }"
      @ok="close"
      @cancel="close"
    >
      <span>This is a custom content</span>
      <TextArea v-model="value" />
    </Feedback>
  </ConfigProvider>
</template>
