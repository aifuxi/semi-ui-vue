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
  <Button @click="visible = !visible">展示反馈: Modal, emoji</Button>
  <Feedback
    :visible="visible"
    title="Why did you choose this rating?"
    mode="modal"
    @value-change="(value) => console.log('emoji value', value)"
    @ok="close"
    @cancel="close"
  />
</template>
