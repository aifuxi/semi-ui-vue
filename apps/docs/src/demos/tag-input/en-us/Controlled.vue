<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
import { shallowRef } from 'vue';
const value = shallowRef(['semi']);
</script>

<template>
  <TagInput v-model="value" />
</template>
