<script setup lang="ts">
import { ref } from 'vue';
import { TextArea } from '@aifuxi/semi-ui-vue/input';

const value = ref('First line\nSecond line');
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <TextArea
    v-model="value"
    :autosize="{ minRows: 2, maxRows: 6 }"
    show-counter
    show-line-number
    :max-count="200"
    @resize="({ height, width }: { height: number; width: number }) => console.log(height, width)"
  />
</template>
