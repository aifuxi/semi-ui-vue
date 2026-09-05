<script setup lang="ts">
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <TextArea
    show-line-number
    :line-number-start="1"
    default-value="Line 1
Line 2
This is a long line to demonstrate soft wrap alignment with line numbers.
Line 4
Line 5"
    :rows="12"
    :style="{ width: '420px' }"
    :line-number-style="{ color: 'var(--semi-color-text-2)' }"
  ></TextArea>
</template>
