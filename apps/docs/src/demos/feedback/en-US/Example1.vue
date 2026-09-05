<script setup lang="ts">
import { ref } from 'vue';
import { Feedback } from '@aifuxi/semi-ui-vue/feedback';
import '@aifuxi/semi-theme-default/feedback.css';

const visible = ref(true);
</script>

<template>
  <Feedback
    v-model:visible="visible"
    title="How was your experience?"
    type="emoji"
    @value-change="(value) => console.log(value)"
    @cancel="
      () => {
        visible = false;
      }
    "
    @ok="
      () => {
        visible = false;
      }
    "
  />
</template>
