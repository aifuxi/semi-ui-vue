<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <div>
    <TagInput separator="-" placeholder="Use `-` for batch input" @change="console.log"></TagInput>
    <br /><br />
    <TagInput
      :separator="['-', '/', '|', '++']"
      placeholder="Support multiple separators for batch input"
      @change="console.log"
    ></TagInput>
  </div>
</template>
