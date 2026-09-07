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
  <Button @click="visible = !visible">展示反馈: Popup, text</Button>
  <Feedback
    :visible="visible"
    title="您对本产品的建议是？"
    type="text"
    :text-area-props="{ maxCount: 200 }"
    @ok="close"
    @cancel="close"
  />
</template>
