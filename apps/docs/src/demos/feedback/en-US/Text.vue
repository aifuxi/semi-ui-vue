<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Feedback } from '@aifuxi/semi-ui-vue/feedback';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/feedback.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';

const visible = shallowRef(false);

function close() {
  visible.value = false;
}
</script>

<template>
  <ConfigProvider :locale="enUS">
    <Button @click="visible = !visible">Show feedback: Popup, text</Button>
    <Feedback
      :visible="visible"
      title="What is your suggestion of this product?"
      type="text"
      :text-area-props="{ maxCount: 200 }"
      @ok="close"
      @cancel="close"
    />
  </ConfigProvider>
</template>
