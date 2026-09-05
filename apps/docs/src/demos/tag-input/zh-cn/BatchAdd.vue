<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <div>
    <TagInput separator="-" placeholder="使用 - 进行批量输入" @change="console.log"></TagInput>
    <br /><br />
    <TagInput
      :separator="['-', '/', '|', '++']"
      placeholder="支持多个分隔符进行批量输入"
      @change="console.log"
    ></TagInput>
  </div>
</template>
