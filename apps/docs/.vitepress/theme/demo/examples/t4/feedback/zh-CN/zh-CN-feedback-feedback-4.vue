<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Feedback } from '@aifuxi/semi-ui-vue/feedback';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/feedback.css';

const visible = shallowRef(false);

function close() {
  visible.value = false;
}
</script>

<template>
  <Button @click="visible = !visible">展示反馈: Popup, radio</Button>
  <Feedback
    :visible="visible"
    title="您的身份是"
    type="radio"
    :radio-group-props="{ options: ['访客', '开发者', '维护者'] }"
    @ok="close"
    @cancel="close"
  />
</template>
