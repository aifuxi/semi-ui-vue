<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <TagInput
    draggable
    :allow-duplicates="false"
    :default-value="['Semi', 'Design', 'Design2Code']"
    placeholder="please enter..."
    @change="console.log"
  ></TagInput>
</template>
