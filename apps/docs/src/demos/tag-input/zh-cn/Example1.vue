<script setup lang="ts">
import { ref } from 'vue';
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';

const tags = ref(['Semi', 'Vue']);
</script>

<template>
  <TagInput v-model="tags" placeholder="输入后按回车" />
</template>
