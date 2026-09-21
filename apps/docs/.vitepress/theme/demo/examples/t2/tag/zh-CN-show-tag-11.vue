<script setup lang="ts">
import { TagGroup } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import type { TagData } from '@aifuxi/semi-ui-vue/tag';
const tagList: TagData[] = [
  { color: 'light-blue', content: '抖音' },
  { color: 'cyan', content: '火山' },
  { color: 'violet', content: '剪映' },
  { color: 'white', content: '醒图' },
];
const avatarList: TagData[] = ['Douyin', 'Hotsoon', 'Capcut', 'Xingtu'].map((content) => ({
  color: 'white',
  content,
  avatarSrc: '/demos/photo.svg',
}));
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
  <div>
    <div :style="divStyle">
      <TagGroup :max-tag-count="3" :style="groupStyle" :tag-list="tagList" size="large" />
    </div>
    <div :style="divStyle">
      <TagGroup
        :max-tag-count="2"
        :style="groupStyle"
        :tag-list="avatarList"
        size="large"
        avatar-shape="circle"
        show-popover
      />
    </div>
  </div>
</template>
