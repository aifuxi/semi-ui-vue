<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import { VideoPlayer } from '@aifuxi/semi-ui-vue/video-player';
import {
  VIDEO_PLAYER_POSTER_DATA_URI,
  createSilentAudioDataUri,
  type ParityDirection,
  type ParityLocale,
  type ParityThemeMode,
} from '@workspace/test-infra';

const mediaFixture = createSilentAudioDataUri(4);

const props = defineProps<{
  direction: ParityDirection;
  locale: ParityLocale;
  theme: ParityThemeMode;
}>();
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    VideoPlayer: {
      rateChange: '切换速率至 ${rate}',
      qualityChange: '切换清晰度至${quality}',
      routeChange: '切换线路至${route}',
      mirror: '镜像',
      cancelMirror: '取消镜像',
      loading: '加载中...',
      stall: '加载失败',
      noResource: '暂无资源',
      videoError: '视频加载错误',
    },
  },
  'en-US': {
    code: 'en-US',
    VideoPlayer: {
      rateChange: 'Switch rate to ${rate}',
      qualityChange: 'Switch quality to ${quality}',
      routeChange: 'Switch route to ${route}',
      mirror: 'Mirror',
      cancelMirror: 'Cancel mirror',
      loading: 'Loading...',
      stall: 'Loading failed',
      noResource: 'No resource',
      videoError: 'Video load error',
    },
  },
};
const popupContainer = typeof document === 'undefined' ? null : document.createElement('div');
if (popupContainer) {
  popupContainer.dataset.testid = 'video-player-popup-vue';
  document.body.appendChild(popupContainer);
}
const getPopupContainer = () => popupContainer ?? document.body;
const markers = [
  { start: 0, title: 'Intro' },
  { start: 1, title: 'Features' },
  { start: 3, title: 'Summary' },
];
const qualityList = [
  { label: '1080p', value: '1080p' },
  { label: '480p', value: '480p' },
];
const routeList = [
  { label: props.locale === 'zh-CN' ? '线路一' : 'Route 1', value: 'line-1' },
  { label: props.locale === 'zh-CN' ? '线路二' : 'Route 2', value: 'line-2' },
];
onBeforeUnmount(() => popupContainer?.remove());
</script>

<template>
  <ConfigProvider
    :direction="props.direction"
    :locale="localeMap[props.locale]"
    :get-popup-container="getPopupContainer"
  >
    <div class="video-player-scenario" data-testid="video-player-vue">
      <section class="video-player-scenario__card video-player-scenario__main">
        <h3>Chapters / full controls</h3>
        <VideoPlayer
          data-parity-target="video-player-main"
          :src="mediaFixture"
          :poster="VIDEO_PLAYER_POSTER_DATA_URI"
          :width="720"
          :height="405"
          :theme="props.theme"
          default-quality="1080p"
          default-route="line-1"
          :markers="markers"
          :seek-time="1"
          :quality-list="qualityList"
          :route-list="routeList"
        />
      </section>
      <section class="video-player-scenario__card video-player-scenario__compact">
        <h3>Compact controls</h3>
        <VideoPlayer
          data-parity-target="video-player-compact"
          :src="mediaFixture"
          :poster="VIDEO_PLAYER_POSTER_DATA_URI"
          :width="480"
          :height="270"
          :theme="props.theme"
          :controls-list="['play', 'time', 'volume', 'playbackRate', 'fullscreen']"
        />
      </section>
    </div>
  </ConfigProvider>
</template>
