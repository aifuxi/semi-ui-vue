<script setup lang="ts">
import { shallowRef } from 'vue';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';

const open = shallowRef(false);
</script>

<template>
  <button aria-controls="details" @click="open = !open">
    {{ open ? 'Hide' : 'Show' }}
  </button>
  <Collapsible id="details" :is-open="open">
    <p>This content follows isOpen.</p>
  </Collapsible>
</template>
