<script setup lang="ts">
import {
  AudioPlayerFoundation,
  audioPlayerCssClasses,
  type AudioPlayerAdapter,
} from '@workspace/foundation-integration';
import {
  IconAlertCircle,
  IconBackward,
  IconFastForward,
  IconPause,
  IconPlay,
  IconRefresh,
  IconRestart,
  IconVolume2,
  IconVolumnSilent,
} from '@aifuxi/semi-icons-vue';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue';

import Button from '../button/Button.vue';
import {
  configContextKey,
  DEFAULT_CONFIG_LOCALE,
  semiGlobal,
  type ConfigContextValue,
} from '../config-provider';
import Dropdown from '../dropdown/Dropdown.vue';
import DropdownItem from '../dropdown/DropdownItem.vue';
import DropdownMenu from '../dropdown/DropdownMenu.vue';
import Image from '../image/Image.vue';
import Popover from '../popover/Popover.vue';
import Tooltip from '../tooltip/Tooltip.vue';
import AudioSlider from './AudioSlider.vue';
import type {
  AudioInfo,
  AudioPlayerLocale,
  AudioPlayerProps,
  AudioPlayerState,
  AudioRate,
  AudioUrl,
} from './types';
import { formatAudioTime } from './utils';

defineOptions({ name: 'AudioPlayer', inheritAttrs: false });
const props = defineProps<AudioPlayerProps>();
const attrs = useAttrs();
const instance = getCurrentInstance();
const audioRef = useTemplateRef<HTMLAudioElement>('audio');
const injectedConfig = inject(configContextKey, undefined);
const prefixCls = audioPlayerCssClasses.PREFIX;
const cache = new Map<unknown, unknown>();

const state = shallowReactive<AudioPlayerState>({
  isPlaying: false,
  currentIndex: 0,
  totalTime: 0,
  currentTime: 0,
  currentRate: { label: '1.0x', value: 1 },
  volume: 100,
  error: false,
});

const rateOptions: readonly AudioRate[] = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1.0x', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2.0x', value: 2 },
];

function hasExplicitProp(key: keyof AudioPlayerProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
}

function resolveProp<Key extends keyof AudioPlayerProps>(
  key: Key,
  fallback: NonNullable<AudioPlayerProps[Key]>,
): NonNullable<AudioPlayerProps[Key]> {
  if (hasExplicitProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<AudioPlayerProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.AudioPlayer?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<AudioPlayerProps[Key]>;
}

const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: DEFAULT_CONFIG_LOCALE } as ConfigContextValue),
);
const locale = computed<AudioPlayerLocale>(() => {
  const fallback: AudioPlayerLocale = {
    backward: '后退 ${skipDuration} 秒',
    forward: '前进 ${skipDuration} 秒',
    prev: '上一首',
    next: '下一首',
    loop: '循环播放',
    volume: '音量',
    mediaError: '音频加载失败',
  };
  return {
    ...fallback,
    ...((config.value.locale.AudioPlayer as Partial<AudioPlayerLocale> | undefined) ?? {}),
  };
});
const runtimeAutoPlay = computed(() => resolveProp('autoPlay', false));
const runtimeShowToolbar = computed(() => resolveProp('showToolbar', true));
const runtimeSkipDuration = computed(() => resolveProp('skipDuration', 10));
const runtimeTheme = computed(() => resolveProp('theme', 'dark'));
const isPlaylist = computed(() => Array.isArray(props.audioUrl));
const audioInfo = computed(() => getAudioInfo(props.audioUrl));
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))),
);
const rootClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${runtimeTheme.value}`,
  props.class,
  props.className,
  attrs.class,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const iconClass = `${prefixCls}-control-button-icon`;
const transparentButtonStyle = { background: 'transparent' } as const;
const circleButtonStyle = { borderRadius: '50%' } as const;
const playButtonStyle = { marginLeft: '1px' } as const;
const refreshIconStyle = { transform: 'rotateY(180deg)' } as const;
const element = computed(() => audioRef.value);

function getAudioInfo(audioUrl: AudioUrl): {
  src: string;
  audioTitle?: string;
  audioCover?: string;
} {
  let value: string | AudioInfo | undefined;
  if (Array.isArray(audioUrl)) value = audioUrl[state.currentIndex];
  else value = audioUrl;
  if (typeof value === 'string') return { src: value };
  if (!value) return { src: '' };
  return {
    src: value.src,
    ...(value.title === undefined ? {} : { audioTitle: value.title }),
    ...(value.cover === undefined ? {} : { audioCover: value.cover }),
  };
}

interface RuntimeFoundationProps {
  audioUrl: AudioUrl;
  autoPlay: boolean;
  skipDuration: number;
}

function foundationProps(): RuntimeFoundationProps {
  return {
    audioUrl: props.audioUrl,
    autoPlay: runtimeAutoPlay.value,
    skipDuration: runtimeSkipDuration.value,
  };
}

function requireAudio(): HTMLAudioElement {
  if (!audioRef.value) throw new Error('AudioPlayer audio element is not available');
  return audioRef.value;
}

function loadedMetadataListener(): void {
  foundation.initAudioState();
  state.error = false;
}

function errorListener(): void {
  foundation.errorHandler();
}

function endedListener(): void {
  foundation.endHandler();
}

function initMediaListeners(): void {
  const audio = audioRef.value;
  if (!audio) return;
  audio.addEventListener('loadedmetadata', loadedMetadataListener);
  audio.addEventListener('error', errorListener);
  audio.addEventListener('ended', endedListener);
}

function destroyMediaListeners(): void {
  const audio = audioRef.value;
  if (!audio) return;
  audio.removeEventListener('loadedmetadata', loadedMetadataListener);
  audio.removeEventListener('error', errorListener);
  audio.removeEventListener('ended', endedListener);
}

function playAudio(audio: HTMLAudioElement): void {
  const result = audio.play();
  if (result && typeof result.catch === 'function') void result.catch(() => undefined);
}

const adapter: AudioPlayerAdapter<RuntimeFoundationProps, AudioPlayerState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  init: initMediaListeners,
  destroy: destroyMediaListeners,
  getAudioRef: requireAudio,
  resetAudioState: () => {
    state.isPlaying = true;
    state.currentTime = 0;
    state.currentRate = { label: '1.0x', value: 1 };
    void nextTick(() => {
      const audio = audioRef.value;
      if (!audio) return;
      audio.currentTime = 0;
      audio.playbackRate = 1;
      playAudio(audio);
    });
  },
  handleStatusClick: () => {
    const audio = audioRef.value;
    if (!audio) return;
    if (state.isPlaying) audio.pause();
    else playAudio(audio);
    state.isPlaying = !state.isPlaying;
  },
  handleTimeUpdate: () => {
    if (audioRef.value) state.currentTime = audioRef.value.currentTime;
  },
  handleTrackChange: (direction) => {
    const audioUrl = props.audioUrl;
    if (!audioRef.value) return;
    if (Array.isArray(audioUrl) && audioUrl.length > 0) {
      state.currentIndex =
        direction === 'next'
          ? (state.currentIndex + 1) % audioUrl.length
          : (state.currentIndex - 1 + audioUrl.length) % audioUrl.length;
      state.error = false;
    }
    foundation.resetAudioState();
  },
  handleTimeChange: (value) => {
    if (!audioRef.value) return;
    audioRef.value.currentTime = value;
    state.currentTime = value;
  },
  handleSpeedChange: (value) => {
    if (!audioRef.value) return;
    audioRef.value.playbackRate = value.value;
    state.currentRate = value;
  },
  handleSeek: (direction) => {
    const audio = audioRef.value;
    if (!audio) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    audio.currentTime = Math.min(
      Math.max(audio.currentTime + direction * runtimeSkipDuration.value, 0),
      duration,
    );
  },
  handleRefresh: () => {
    const audio = audioRef.value;
    if (!audio) return;
    if (state.error) audio.load();
    else {
      audio.currentTime = 0;
      state.currentTime = 0;
    }
  },
  handleVolumeChange: (value) => {
    const audio = audioRef.value;
    if (!audio) return;
    const volume = Math.floor(value);
    audio.volume = volume / 100;
    state.volume = volume;
  },
};
const foundation = markRaw(
  new AudioPlayerFoundation<RuntimeFoundationProps, AudioPlayerState>(adapter),
);

function handleVolumeSilent(): void {
  const audio = audioRef.value;
  if (!audio) return;
  audio.volume = state.volume === 0 ? 0.5 : 0;
  state.volume = state.volume === 0 ? 50 : 0;
}

function changeTrack(direction: 'next' | 'prev'): void {
  foundation.handleTrackChange(direction);
}

function changeRate(rate: AudioRate): void {
  foundation.handleSpeedChange(rate);
}

function togglePlaying(): void {
  foundation.handleStatusClick();
}

function updateCurrentTime(): void {
  foundation.handleTimeUpdate();
}

function changeCurrentTime(value: number): void {
  foundation.handleTimeChange(value);
}

function changeVolume(value: number): void {
  foundation.handleVolumeChange(value);
}

function refreshAudio(): void {
  foundation.handleRefresh();
}

watch(
  () => props.audioUrl,
  (audioUrl) => {
    if (Array.isArray(audioUrl) && state.currentIndex >= audioUrl.length) state.currentIndex = 0;
    if (!Array.isArray(audioUrl)) state.currentIndex = 0;
    state.currentTime = 0;
    state.totalTime = 0;
    state.currentRate = { label: '1.0x', value: 1 };
    state.isPlaying = false;
    state.error = false;
  },
);

onMounted(() => foundation.init());
onBeforeUnmount(() => {
  foundation.destroy();
  cache.clear();
});

defineExpose({ element });
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClasses" :style="rootStyle">
    <audio
      ref="audio"
      :src="audioInfo.src"
      :autoplay="runtimeAutoPlay"
      :class="prefixCls"
      @timeupdate="updateCurrentTime"
    >
      <track kind="captions" :src="audioInfo.src" />
    </audio>

    <div :class="`${prefixCls}-control`">
      <Tooltip
        v-if="isPlaylist"
        :content="locale.prev"
        :auto-adjust-overflow="true"
        :show-arrow="false"
      >
        <span>
          <Button
            :style="[circleButtonStyle, transparentButtonStyle]"
            size="large"
            @click="changeTrack('prev')"
          >
            <template #icon><IconRestart size="large" :class="iconClass" /></template>
          </Button>
        </span>
      </Tooltip>

      <Button
        :style="circleButtonStyle"
        size="large"
        :disabled="state.error"
        :class="[
          `${prefixCls}-control-button-play`,
          state.error ? `${prefixCls}-control-button-play-disabled` : undefined,
        ]"
        @click="togglePlaying"
      >
        <template #icon>
          <IconPause v-if="state.isPlaying" size="large" />
          <IconPlay v-else size="large" :style="playButtonStyle" />
        </template>
      </Button>

      <Tooltip
        v-if="isPlaylist"
        :content="locale.next"
        :auto-adjust-overflow="true"
        :show-arrow="false"
      >
        <span>
          <Button
            :style="[circleButtonStyle, transparentButtonStyle]"
            size="large"
            @click="changeTrack('next')"
          >
            <template #icon>
              <IconRestart size="large" :rotate="180" :class="iconClass" />
            </template>
          </Button>
        </span>
      </Tooltip>
    </div>

    <div :class="`${prefixCls}-info-container`">
      <Image v-if="audioInfo.audioCover" :src="audioInfo.audioCover" :width="50" :height="50" />
      <div :class="`${prefixCls}-info`">
        <div v-if="audioInfo.audioTitle" :class="`${prefixCls}-info-title`">
          {{ audioInfo.audioTitle }}
          <div v-if="state.error" :class="`${prefixCls}-error`">
            <IconAlertCircle size="large" />{{ locale.mediaError }}
          </div>
        </div>
        <div v-if="!state.error" :class="`${prefixCls}-info-time`">
          <span style="width: 38px">{{ formatAudioTime(state.currentTime) }}</span>
          <div :class="`${prefixCls}-slider-container`">
            <AudioSlider
              :value="state.currentTime"
              :max="state.totalTime"
              :theme="runtimeTheme"
              @change="changeCurrentTime"
            />
          </div>
          <span style="width: 38px">{{ formatAudioTime(state.totalTime) }}</span>
        </div>
      </div>
    </div>

    <div v-if="runtimeShowToolbar && !state.error" :class="`${prefixCls}-control`">
      <Popover :auto-adjust-overflow="true">
        <template #content>
          <div :class="`${prefixCls}-control-volume`">
            <div :class="`${prefixCls}-control-volume-title`">{{ state.volume }}%</div>
            <AudioSlider
              :value="state.volume"
              :max="100"
              vertical
              :height="120"
              :theme="runtimeTheme"
              :show-tooltip="false"
              @change="changeVolume"
            />
          </div>
        </template>
        <span>
          <Tooltip :content="locale.volume" :auto-adjust-overflow="true" :show-arrow="false">
            <Button :style="transparentButtonStyle" @click="handleVolumeSilent">
              <template #icon>
                <IconVolume2 v-if="state.volume !== 0" :class="iconClass" />
                <IconVolumnSilent v-else :class="iconClass" />
              </template>
            </Button>
          </Tooltip>
        </span>
      </Popover>

      <Tooltip
        :content="locale.backward.replace('${skipDuration}', String(runtimeSkipDuration))"
        :auto-adjust-overflow="true"
        :show-arrow="false"
      >
        <span>
          <Button :style="transparentButtonStyle" @click="foundation.handleSeek(-1)">
            <template #icon><IconBackward :class="iconClass" /></template>
          </Button>
        </span>
      </Tooltip>

      <Tooltip
        :content="locale.forward.replace('${skipDuration}', String(runtimeSkipDuration))"
        :auto-adjust-overflow="true"
        :show-arrow="false"
      >
        <span>
          <Button :style="transparentButtonStyle" @click="foundation.handleSeek(1)">
            <template #icon><IconFastForward :class="iconClass" /></template>
          </Button>
        </span>
      </Tooltip>

      <Dropdown :class="`${prefixCls}-control-speed-menu`">
        <template #content>
          <DropdownMenu>
            <DropdownItem
              v-for="option in rateOptions"
              :key="option.value"
              :class="`${prefixCls}-control-speed-menu-item`"
              :active="option.value === state.currentRate.value"
              @click="changeRate(option)"
            >
              {{ option.label }}
            </DropdownItem>
          </DropdownMenu>
        </template>
        <div :class="`${prefixCls}-control-speed`">
          <span>{{ state.currentRate.label }}</span>
        </div>
      </Dropdown>

      <Button :style="transparentButtonStyle" @click="refreshAudio">
        <template #icon>
          <IconRefresh :style="refreshIconStyle" :class="iconClass" />
        </template>
      </Button>
    </div>

    <div v-else-if="runtimeShowToolbar" :class="`${prefixCls}-control`">
      <Button :style="transparentButtonStyle" @click="refreshAudio">
        <template #icon>
          <IconRefresh :style="refreshIconStyle" :class="iconClass" />
        </template>
      </Button>
    </div>
  </div>
</template>
