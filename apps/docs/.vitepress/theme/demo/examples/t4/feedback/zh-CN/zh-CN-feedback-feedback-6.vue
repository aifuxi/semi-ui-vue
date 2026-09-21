<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Feedback } from '@aifuxi/semi-ui-vue/feedback';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/feedback.css';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';

const visible = shallowRef(false);
const value = shallowRef('');

function close() {
  visible.value = false;
}
</script>

<template>
  <Button @click="visible = !visible">展示反馈: Popup, custom</Button>
  <Feedback
    :visible="visible"
    title="您对本产品的建议是？"
    type="custom"
    :ok-button-props="{ disabled: !value }"
    @ok="close"
    @cancel="close"
  >
    <span>这是一段自定义的内容</span>
    <TextArea @change="value = $event" />
  </Feedback>
</template>
