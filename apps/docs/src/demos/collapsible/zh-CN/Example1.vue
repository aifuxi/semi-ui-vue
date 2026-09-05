<script setup lang="ts">
import { shallowRef } from 'vue';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';

const open = shallowRef(false);
</script>

<template>
  <button aria-controls="details" @click="open = !open">
    {{ open ? '收起' : '展开' }}
  </button>
  <Collapsible id="details" :is-open="open">
    <p>这段内容会随 isOpen 展开或收起。</p>
  </Collapsible>
</template>
