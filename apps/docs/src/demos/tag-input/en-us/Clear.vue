<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <TagInput
    show-clear
    :default-value="['Semi', 'Design2Code']"
    placeholder="Please enter..."
    @change="console.log"
  ></TagInput>
</template>
