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
这是一行较长的文本，用来演示软换行时的行号对齐效果。
Line 4
Line 5"
    :rows="12"
    :style="{ width: '420px' }"
    :line-number-style="{ color: 'var(--semi-color-text-2)' }"
  ></TextArea>
</template>
