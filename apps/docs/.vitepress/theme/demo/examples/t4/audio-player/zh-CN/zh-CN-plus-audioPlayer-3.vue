<script setup lang="ts">
import { AudioPlayer } from '@aifuxi/semi-ui-vue/audio-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/audio-player.css';
const audioUrl = { src: '/demos/tone.wav', title: '音频标题' };
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="width: 100%">
      <AudioPlayer :auto-play="false" :audio-url="audioUrl" :show-toolbar="false" /></div
  ></ConfigProvider>
</template>
