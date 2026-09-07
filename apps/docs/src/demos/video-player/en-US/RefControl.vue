<script setup lang="ts">
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/video-player.css';
import { useTemplateRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
const src = '/demos/motion.webm';
const poster = '/demos/poster.svg';
const first = useTemplateRef('first');
const second = useTemplateRef('second');
async function playAll() {
  await Promise.all([first.value?.element?.play(), second.value?.element?.play()]);
}
function pauseAll() {
  first.value?.element?.pause();
  second.value?.element?.pause();
}
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <div style="margin-bottom: 12px">
        <Button style="margin-right: 8px" @click="playAll">Play All</Button
        ><Button @click="pauseAll">Pause All</Button>
      </div>
      <div style="display: flex; gap: 12px">
        <VideoPlayer
          ref="first"
          :height="315"
          width="50%"
          :src="src"
          :poster="poster"
        /><VideoPlayer ref="second" :height="315" width="50%" :src="src" :poster="poster" />
      </div>
    </div>
  </ConfigProvider>
</template>
