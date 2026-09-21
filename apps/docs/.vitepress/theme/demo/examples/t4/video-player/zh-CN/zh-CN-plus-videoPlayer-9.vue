<script setup lang="ts">
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/video-player.css';
const src = '/demos/motion.webm';
const poster = '/demos/poster.svg';
const markers = [
  { start: 0, title: '片头' },
  { start: 0.7, title: '功能介绍' },
  { start: 1.7, title: 'Figma Plugin' },
  { start: 2.7, title: '片尾' },
];
</script>
<template>
  <ConfigProvider :locale="locale">
    <VideoPlayer :markers="markers" :height="630" :src="src" :poster="poster" />
  </ConfigProvider>
</template>
