<script setup lang="ts">
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import '@aifuxi/semi-theme-default/video-player.css';
</script>

<template>
  <VideoPlayer
    src="/demos/motion.webm"
    poster="/demos/poster.svg"
    :width="800"
    :height="450"
    :markers="[
      { start: 0, title: '片头' },
      { start: 2, title: '功能介绍' },
    ]"
    @play="console.log('play')"
    @pause="console.log('pause')"
  />
</template>
