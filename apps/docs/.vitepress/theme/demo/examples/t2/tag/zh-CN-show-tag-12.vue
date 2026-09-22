<script setup lang="ts">
import { shallowRef } from 'vue';
import { TagGroup } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import type { TagData } from '@aifuxi/semi-ui-vue/tag';
const tagList = shallowRef<TagData[]>([
  { tagKey: '1', color: 'light-blue', content: '抖音', closable: true },
  { tagKey: '3', color: 'cyan', content: '剪映', closable: true },
  { tagKey: '2', color: 'violet', content: '醒图', closable: true },
  { tagKey: '4', color: 'teal', content: '轻颜相机', closable: true },
  { tagKey: '5', color: 'white', content: '飞书', closable: true },
]);
function closeTag(
  _value: unknown,
  _event: MouseEvent | KeyboardEvent,
  tagKey: string | number | undefined,
): void {
  const next = [...tagList.value];
  const index = next.findIndex((tag) => tag.tagKey === tagKey);
  next.splice(index, 1);
  tagList.value = next;
}
const divStyle = {
  backgroundColor: 'var(--semi-color-fill-0)',
  height: '35px',
  width: '300px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 10px',
  marginBottom: '30px',
};
const groupStyle = { display: 'flex', alignItems: 'center', width: '350px' };
</script>

<template>
  <div :style="divStyle">
    <TagGroup
      :max-tag-count="3"
      show-popover
      :style="groupStyle"
      :tag-list="tagList"
      size="large"
      @tag-close="closeTag"
    />
  </div>
</template>
