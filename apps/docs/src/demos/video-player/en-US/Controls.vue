<script setup lang="ts">
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/video-player.css';
const src = '/demos/motion.webm';
const poster = '/demos/poster.svg';
</script>
<template>
  <ConfigProvider :locale="locale">
    <VideoPlayer
      :controls-list="['play', 'time', 'volume', 'playbackRate', 'fullscreen']"
      :height="630"
      :src="src"
      :poster="poster"
    />
  </ConfigProvider>
</template>
