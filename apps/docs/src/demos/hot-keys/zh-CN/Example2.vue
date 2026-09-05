<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';

const panel = useTemplateRef<HTMLElement>('panel');
import '@aifuxi/semi-theme-default/hot-keys.css';
</script>

<template>
  <section ref="panel" tabindex="0">
    <HotKeys
      :hot-keys="[HotKeys.Keys.Enter]"
      :get-listener-target="() => panel"
      @hot-key="() => console.log('panel enter')"
    />
  </section>
</template>
