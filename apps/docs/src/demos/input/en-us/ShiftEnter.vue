<script setup lang="ts">
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';
import '@aifuxi/semi-theme-default/hot-keys.css';
import { shallowRef } from 'vue';
const text = shallowRef('');
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) event.preventDefault();
}
</script>

<template>
  <div>
    <p style="display: flex">
      Use<HotKeys
        :hot-keys="['shift', 'enter']"
        style="margin-bottom: 12px; margin-left: 4px; margin-right: 4px"
      />break line
    </p>
    <TextArea v-model="text" @keydown="handleKeyDown" />
  </div>
</template>
