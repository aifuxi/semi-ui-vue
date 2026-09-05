<script setup lang="ts">
import { shallowRef } from 'vue';
import { SplitTagGroup, Tag, TagGroup } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';

const visible = shallowRef(true);
const tags = [
  { tagKey: 'vue', content: 'Vue', color: 'blue' as const, closable: true },
  { tagKey: 'semi', content: 'Semi', color: 'cyan' as const },
  { tagKey: 'design', content: 'Design', color: 'teal' as const },
];
</script>

<template>
  <Tag v-model:visible="visible" color="blue" closable>可关闭标签</Tag>
  <TagGroup :tag-list="tags" :max-tag-count="2" show-popover />
  <SplitTagGroup aria-label="组合标签">
    <Tag color="blue" type="solid">一</Tag>
    <Tag color="cyan" type="solid">二</Tag>
  </SplitTagGroup>
</template>
