<script setup lang="ts">
import { AudioPlayer } from '@aifuxi/semi-ui-vue/audio-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/audio-player.css';
const audioUrl = [
  { src: '/demos/tone.wav', title: 'Audio Title 1', cover: '/demos/one.svg' },
  { src: '/demos/tone.wav?track=2', title: 'Audio Title 2', cover: '/demos/two.svg' },
];
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="width: 100%">
      <AudioPlayer :audio-url="audioUrl" theme="light" /></div
  ></ConfigProvider>
</template>
