<script setup lang="ts">
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/video-player.css';
import { shallowRef } from 'vue';
const src = shallowRef('/demos/motion.webm?quality=1080p');
const poster = '/demos/poster.svg';
const playList = [
  { src: '/demos/motion.webm?quality=1080p', quality: '1080p' },
  { src: '/demos/motion.webm?quality=480p', quality: '480p' },
];
function updateVideoSource(quality: string) {
  const source = playList.find((item) => item.quality === quality);
  if (source) src.value = source.src;
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <VideoPlayer
      :height="630"
      :src="src"
      :poster="poster"
      default-quality="1080p"
      :quality-list="[
        { label: '1080p', value: '1080p' },
        { label: '480p', value: '480p' },
      ]"
      @quality-change="updateVideoSource"
    />
  </ConfigProvider>
</template>
