<script setup lang="ts">
import { ref } from 'vue';
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/video-player.css';
const seekTime = ref(5);
const src = '/demos/motion.webm';
const poster = '/demos/poster.svg';
</script>
<template>
  <ConfigProvider :locale="locale">
    <div>
      <span style="margin-bottom: 10px">Please select the fast forward and rewind time</span
      ><Select
        v-model="seekTime"
        style="width: 100px; margin-left: 10px"
        :option-list="[
          { label: '5s', value: 5 },
          { label: '10s', value: 10 },
          { label: '15s', value: 15 },
        ]"
        placeholder="Please select the fast forward and rewind time"
      /><VideoPlayer
        :seek-time="seekTime"
        style="margin-top: 10px"
        :height="630"
        :src="src"
        :poster="poster"
      />
    </div>
  </ConfigProvider>
</template>
