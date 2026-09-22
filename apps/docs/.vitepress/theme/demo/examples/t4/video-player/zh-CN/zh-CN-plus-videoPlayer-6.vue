<script setup lang="ts">
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/video-player.css';
const src = '/demos/motion.webm';
const poster = '/demos/poster.svg';
</script>
<template>
  <ConfigProvider :locale="locale">
    <VideoPlayer
      :playback-rate-list="[
        { label: '0.5x', value: 0.5 },
        { label: '1.0x', value: 1 },
        { label: '1.5x', value: 1.5 },
        { label: '2.0x', value: 2 },
      ]"
      :height="630"
      :src="src"
      :poster="poster"
    />
  </ConfigProvider>
</template>
