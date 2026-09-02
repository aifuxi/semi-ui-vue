<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { AudioPlayer } from '@aifuxi/semi-ui-vue/audio-player';
import { ConfigProvider, type SemiLocale } from '@aifuxi/semi-ui-vue/config-provider';
import {
  AUDIO_PLAYER_COVER_DATA_URI,
  createSilentAudioDataUri,
  type ParityDirection,
  type ParityLocale,
  type ParityThemeMode,
} from '@workspace/test-infra';

const props = defineProps<{
  direction: ParityDirection;
  locale: ParityLocale;
  theme: ParityThemeMode;
}>();
const playlist = [
  {
    title: 'Parity track A',
    cover: AUDIO_PLAYER_COVER_DATA_URI,
    src: createSilentAudioDataUri(4),
  },
  {
    title: 'Parity track B',
    cover: AUDIO_PLAYER_COVER_DATA_URI,
    src: createSilentAudioDataUri(6),
  },
];
const compactAudio = {
  title: 'Compact track',
  cover: AUDIO_PLAYER_COVER_DATA_URI,
  src: createSilentAudioDataUri(4),
};
const localeMap: Record<ParityLocale, SemiLocale> = {
  'zh-CN': {
    code: 'zh-CN',
    AudioPlayer: {
      backward: '后退 ${skipDuration} 秒',
      forward: '前进 ${skipDuration} 秒',
      prev: '上一首',
      next: '下一首',
      loop: '循环播放',
      volume: '音量',
      mediaError: '音频加载失败',
    },
  },
  'en-US': {
    code: 'en-US',
    AudioPlayer: {
      backward: 'Backward ${skipDuration}s',
      forward: 'Forward ${skipDuration}s',
      prev: 'Previous',
      next: 'Next',
      loop: 'Loop',
      volume: 'Volume',
      mediaError: 'Audio load error',
    },
  },
};

const popupContainer = typeof document === 'undefined' ? null : document.createElement('div');
if (popupContainer) {
  popupContainer.dataset.testid = 'audio-player-popup-vue';
  document.body.appendChild(popupContainer);
}
const getPopupContainer = () => popupContainer ?? document.body;

onBeforeUnmount(() => popupContainer?.remove());
</script>

<template>
  <ConfigProvider
    :direction="props.direction"
    :locale="localeMap[props.locale]"
    :get-popup-container="getPopupContainer"
  >
    <div class="audio-player-scenario" data-testid="audio-player-vue">
      <section class="audio-player-scenario__card audio-player-scenario__main">
        <h3>Playlist / toolbar</h3>
        <AudioPlayer
          :audio-url="playlist"
          data-parity-target="audio-player-main"
          :skip-duration="1"
          :theme="props.theme"
        />
      </section>
      <section class="audio-player-scenario__card audio-player-scenario__compact">
        <h3>Compact / no toolbar</h3>
        <AudioPlayer
          :audio-url="compactAudio"
          data-parity-target="audio-player-compact"
          :show-toolbar="false"
          :theme="props.theme"
        />
      </section>
    </div>
  </ConfigProvider>
</template>
