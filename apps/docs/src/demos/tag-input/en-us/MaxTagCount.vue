<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <TagInput
    :max-tag-count="2"
    :show-rest-tags-popover="true"
    :rest-tags-popover-props="{ position: 'top' }"
    :default-value="['Semi', 'Design', 'Design2Code']"
  ></TagInput>
</template>
