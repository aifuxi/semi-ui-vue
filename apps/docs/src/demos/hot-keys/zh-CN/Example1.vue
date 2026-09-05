<script setup lang="ts">
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';

function save(event: KeyboardEvent) {
  console.log('save', event.code);
}
import '@aifuxi/semi-theme-default/hot-keys.css';
</script>

<template>
  <HotKeys
    :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.S]"
    :content="['Ctrl', 'S']"
    prevent-default
    @hot-key="save"
  />
</template>
