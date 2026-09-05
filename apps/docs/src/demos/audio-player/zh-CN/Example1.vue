<script setup lang="ts">
import { AudioPlayer } from '@aifuxi/semi-ui-vue/audio-player';
import '@aifuxi/semi-theme-default/audio-player.css';

const tracks = [
  { src: '/demos/tone.wav', title: '介绍', cover: '/demos/one.svg' },
  { src: '/demos/tone.wav', title: '详情', cover: '/demos/two.svg' },
];
</script>

<template>
  <AudioPlayer :audio-url="tracks" :auto-play="false" />
</template>
