<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { initialCount } from './initial.ts';
const count = ref(initialCount);
</script>
<template>
  <Button @click="count++">点击次数: {{ count }}</Button>
</template>
