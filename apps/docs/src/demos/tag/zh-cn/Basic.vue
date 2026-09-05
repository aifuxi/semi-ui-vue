<script setup lang="ts">
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
function preventClose(_value: unknown, event: MouseEvent | KeyboardEvent): void {
  event.preventDefault();
}
</script>

<template>
  <div>
    <Space>
      <Tag> default tag </Tag>
      <Tag closable> Closable Tag </Tag>
      <Tag closable @close="preventClose">Closable Tag, Prevent Default</Tag>
    </Space>
  </div>
</template>
