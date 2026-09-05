<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { useTemplateRef } from 'vue';
import type { TagInputExposed } from '@aifuxi/semi-ui-vue/tag-input';
const tagInput = useTemplateRef<TagInputExposed>('tagInput');
</script>

<template>
  <div>
    <TagInput ref="tagInput" :default-value="['Semi', 'Design2Code']" /><Button
      style="margin-top: 10px"
      @click="tagInput?.focus()"
      >focus</Button
    >
  </div>
</template>
