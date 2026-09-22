<script setup lang="ts">
import { AudioPlayer } from '@aifuxi/semi-ui-vue/audio-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/audio-player.css';
const audioUrl = '/demos/tone.wav?track=2';
const audioUrlArr = ['/demos/tone.wav', '/demos/tone.wav?track=2'];
const audioUrlObj = { src: '/demos/tone.wav', title: '音频标题', cover: '/demos/one.svg' };
const audioUrlArrObj = [
  { src: '/demos/tone.wav', title: '音频标题1', cover: '/demos/one.svg' },
  { src: '/demos/tone.wav?track=2', title: '音频标题2', cover: '/demos/two.svg' },
];
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="width: 100%; overflow-x: auto">
      <div
        v-for="(source, index) in [audioUrl, audioUrlObj, audioUrlArr, audioUrlArrObj]"
        :key="index"
        style="margin-top: 10px; min-width: 1000px"
      >
        <AudioPlayer :auto-play="false" :audio-url="source" />
      </div></div
  ></ConfigProvider>
</template>
