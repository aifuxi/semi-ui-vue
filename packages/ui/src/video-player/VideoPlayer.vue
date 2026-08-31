<script setup lang="ts">
import {
  VideoPlayerFoundation,
  videoPlayerCssClasses,
  videoPlayerDefaultPlaybackRate,
  videoPlayerNumbers,
  videoPlayerStrings,
  type VideoPlayerAdapter,
} from '@workspace/foundation-integration';
import {
  IconFlipHorizontal,
  IconMaximize,
  IconMiniPlayer,
  IconMinimize,
  IconMute,
  IconPause,
  IconPlay,
  IconPlayCircle,
  IconRestart,
  IconVolume1,
  IconVolume2,
} from '@aifuxi/semi-icons-vue';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue';

import AudioSlider from '../audio-player/AudioSlider.vue';
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
import Popover from '../popover/Popover.vue';
import ErrorSvg from './ErrorSvg.vue';
import type {
  VideoPlayerControl,
  VideoPlayerEmits,
  VideoPlayerLocale,
  VideoPlayerOption,
  VideoPlayerProps,
  VideoPlayerState,
} from './types';
import { formatVideoTime } from './utils';
import VideoProgress from './VideoProgress.vue';

defineOptions({ name: 'VideoPlayer', inheritAttrs: false });
const props = defineProps<VideoPlayerProps>();
const emit = defineEmits<VideoPlayerEmits>();
const attrs = useAttrs();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const videoRef = useTemplateRef<HTMLVideoElement>('video');
const wrapperRef = useTemplateRef<HTMLDivElement>('wrapper');
const cache = new Map<unknown, unknown>();
const prefixCls = videoPlayerCssClasses.PREFIX;
const controlsPrefix = videoPlayerCssClasses.PREFIX_CONTROLS;

const defaultControls: VideoPlayerControl[] = [
  videoPlayerStrings.PLAY,
  videoPlayerStrings.NEXT,
  videoPlayerStrings.TIME,
  videoPlayerStrings.VOLUME,
  videoPlayerStrings.PLAYBACK_RATE,
  videoPlayerStrings.QUALITY,
  videoPlayerStrings.ROUTE,
  videoPlayerStrings.MIRROR,
  videoPlayerStrings.FULLSCREEN,
  videoPlayerStrings.PICTURE_IN_PICTURE,
];

function hasExplicitProp(key: keyof VideoPlayerProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
}

function resolveProp<Key extends keyof VideoPlayerProps>(
  key: Key,
  fallback: NonNullable<VideoPlayerProps[Key]>,
): NonNullable<VideoPlayerProps[Key]> {
  if (hasExplicitProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<VideoPlayerProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.VideoPlayer?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<VideoPlayerProps[Key]>;
}

const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: DEFAULT_CONFIG_LOCALE } as ConfigContextValue),
);
const locale = computed<VideoPlayerLocale>(() => ({
  rateChange: '切换速率至 ${rate}',
  qualityChange: '切换清晰度至${quality}',
  routeChange: '切换线路至${route}',
  mirror: '镜像',
  cancelMirror: '取消镜像',
  loading: '加载中...',
  stall: '加载失败',
  noResource: '暂无资源',
  videoError: '视频加载错误',
  ...((config.value.locale.VideoPlayer as Partial<VideoPlayerLocale> | undefined) ?? {}),
}));
const runtimeAutoPlay = computed(() => resolveProp('autoPlay', false));
const runtimeClickToPlay = computed(() => resolveProp('clickToPlay', true));
const runtimeControlsList = computed(() => resolveProp('controlsList', defaultControls));
const runtimeDefaultPlaybackRate = computed(() =>
  resolveProp('defaultPlaybackRate', videoPlayerNumbers.DEFAULT_PLAYBACK_RATE),
);
const runtimeLoop = computed(() => resolveProp('loop', false));
const runtimeMuted = computed(() => resolveProp('muted', false));
const runtimePlaybackRateList = computed(() =>
  resolveProp(
    'playbackRateList',
    videoPlayerDefaultPlaybackRate as Array<VideoPlayerOption<number>>,
  ),
);
const runtimeSeekTime = computed(() =>
  resolveProp('seekTime', videoPlayerNumbers.DEFAULT_SEEK_TIME),
);
const runtimeTheme = computed(() => resolveProp('theme', 'dark'));
const runtimeVolume = computed(() => resolveProp('volume', videoPlayerNumbers.DEFAULT_VOLUME));

const state = shallowReactive<VideoPlayerState>({
  bufferedValue: 0,
  currentQuality: props.defaultQuality || '',
  currentRoute: props.defaultRoute || '',
  currentTime: 0,
  isError: false,
  isFullscreen: false,
  isMirror: false,
  isPlaying: false,
  muted: runtimeMuted.value,
  notificationContent: '',
  playbackRate: runtimeDefaultPlaybackRate.value || 1,
  playbackRateList: [...runtimePlaybackRateList.value],
  showControls: true,
  showNotification: false,
  src: props.src || '',
  totalTime: 0,
  volume: runtimeMuted.value ? 0 : runtimeVolume.value,
});

const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))),
);
const rootClasses = computed(() => [
  prefixCls,
  props.class,
  props.className,
  attrs.class,
  state.isMirror ? `${prefixCls}-mirror` : undefined,
]);
function dimension(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}
const rootStyle = computed(() => [
  { width: dimension(props.width), height: dimension(props.height) },
  props.style,
  attrs.style,
]);
const resourceNotFound = computed(() => props.src === null || props.src === undefined);
const posterHidden = computed(() => state.currentTime > 0 && state.currentTime < state.totalTime);
const element = computed(() => videoRef.value);

interface RuntimeFoundationProps {
  controlsList: readonly string[];
  muted: boolean;
  seekTime: number;
  volume: number;
}

function foundationProps(): RuntimeFoundationProps {
  return {
    controlsList: runtimeControlsList.value,
    muted: runtimeMuted.value,
    seekTime: runtimeSeekTime.value,
    volume: runtimeVolume.value,
  };
}

const adapter: VideoPlayerAdapter<RuntimeFoundationProps, VideoPlayerState> = {
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
  getVideo: () => videoRef.value,
  getVideoWrapper: () => wrapperRef.value,
  notifyPause: () => emit('pause'),
  notifyPlay: () => emit('play'),
  notifyQualityChange: (quality) => emit('qualityChange', quality),
  notifyRateChange: (rate) => emit('rateChange', rate),
  notifyRouteChange: (route) => emit('routeChange', route),
  notifyVolumeChange: (volume) => emit('volumeChange', volume),
  setBufferedValue: (value) => {
    state.bufferedValue = value;
  },
  setCurrentTime: (value) => {
    state.currentTime = value;
  },
  setIsError: (value) => {
    state.isError = value;
  },
  setIsMirror: (value) => {
    state.isMirror = value;
  },
  setIsPlaying: (value) => {
    state.isPlaying = value;
  },
  setMuted: (value) => {
    state.muted = value;
  },
  setNotificationContent: (value) => {
    state.notificationContent = value;
  },
  setPlaybackRate: (value) => {
    state.playbackRate = value;
  },
  setQuality: (value) => {
    state.currentQuality = value;
  },
  setRoute: (value) => {
    state.currentRoute = value;
  },
  setShowControls: (value) => {
    state.showControls = value;
  },
  setShowNotification: (value) => {
    state.showNotification = value;
  },
  setTotalTime: (value) => {
    state.totalTime = value;
  },
  setVolume: (value) => {
    state.volume = value;
  },
};
const foundation = markRaw(
  new VideoPlayerFoundation<RuntimeFoundationProps, VideoPlayerState>(adapter),
);

let controlsTimer: ReturnType<typeof setTimeout> | undefined;
let notificationTimer: ReturnType<typeof setTimeout> | undefined;
let restoreLoadedListener: (() => void) | undefined;
let scrollPosition: { x: number; y: number } | undefined;
let lastFullscreenMouseMove = 0;

function clearControlsTimer(): void {
  if (controlsTimer !== undefined) clearTimeout(controlsTimer);
  controlsTimer = undefined;
}

function clearNotificationTimer(): void {
  if (notificationTimer !== undefined) clearTimeout(notificationTimer);
  notificationTimer = undefined;
}

function showTemporaryNotification(content: string): void {
  clearNotificationTimer();
  state.notificationContent = content;
  state.showNotification = true;
  notificationTimer = setTimeout(() => {
    state.showNotification = false;
    notificationTimer = undefined;
  }, 1000);
}

function playVideo(): void {
  const result = videoRef.value?.play();
  if (result && typeof result.catch === 'function') void result.catch(() => undefined);
}

function handleVideoClick(): void {
  if (runtimeClickToPlay.value) foundation.handlePlayOrPause();
}

function handleTimeUpdate(): void {
  foundation.handleTimeUpdate();
}

function handleDurationChange(): void {
  foundation.handleDurationChange();
}

function handleVideoPlay(): void {
  foundation.handleVideoPlay();
}

function handleVideoPause(): void {
  foundation.handleVideoPause();
}

function handleError(): void {
  foundation.handleError();
}

function handleCanPlay(): void {
  foundation.handleCanPlay();
}

function handleProgress(): void {
  foundation.handleProgress();
}

function handleEnded(): void {
  foundation.handleEnded();
}

function handleTimeChange(value: number): void {
  foundation.handleTimeChange(value);
}

function handleVolumeChange(value: number): void {
  foundation.handleVolumeChange(value);
  emit('volumeChange', state.volume);
}

function handleVolumeSilent(): void {
  foundation.handleVolumeSilent();
  emit('volumeChange', state.muted ? 0 : state.volume);
}

function handleRateChange(option: VideoPlayerOption<number>): void {
  const video = videoRef.value;
  if (!video) return;
  video.playbackRate = option.value;
  state.playbackRate = option.value;
  emit('rateChange', option.value);
  showTemporaryNotification(locale.value.rateChange.replace('${rate}', option.label));
}

function restorePlayPosition(): void {
  const video = videoRef.value;
  if (!video) return;
  const wasPlaying = !video.paused;
  const currentTime = video.currentTime;
  if (restoreLoadedListener) video.removeEventListener('loadeddata', restoreLoadedListener);
  restoreLoadedListener = () => {
    video.currentTime = currentTime;
    if (wasPlaying) playVideo();
    if (restoreLoadedListener) video.removeEventListener('loadeddata', restoreLoadedListener);
    restoreLoadedListener = undefined;
  };
  video.addEventListener('loadeddata', restoreLoadedListener);
}

function handleQualityChange(option: VideoPlayerOption<string>): void {
  state.currentQuality = option.value;
  emit('qualityChange', option.value);
  showTemporaryNotification(locale.value.qualityChange.replace('${quality}', option.label));
  restorePlayPosition();
}

function handleRouteChange(option: VideoPlayerOption<string>): void {
  state.currentRoute = option.value;
  emit('routeChange', option.value);
  showTemporaryNotification(locale.value.routeChange.replace('${route}', option.label));
  restorePlayPosition();
}

function handleMirror(): void {
  state.isMirror = !state.isMirror;
  showTemporaryNotification(state.isMirror ? locale.value.mirror : locale.value.cancelMirror);
}

function checkFullscreen(): boolean {
  if (typeof document === 'undefined' || !wrapperRef.value) return false;
  const documentWithPrefixes = document as Document & {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  };
  const wrapperWithPrefix = wrapperRef.value as HTMLDivElement & {
    webkitDisplayingFullscreen?: boolean;
  };
  return Boolean(
    document.fullscreenElement === wrapperRef.value ||
    documentWithPrefixes.webkitFullscreenElement === wrapperRef.value ||
    documentWithPrefixes.mozFullScreenElement === wrapperRef.value ||
    documentWithPrefixes.msFullscreenElement === wrapperRef.value ||
    wrapperWithPrefix.webkitDisplayingFullscreen,
  );
}

function handleFullscreen(): void {
  const wrapper = wrapperRef.value;
  if (!wrapper) return;
  if (checkFullscreen()) {
    void document.exitFullscreen?.();
    return;
  }
  scrollPosition = { x: window.scrollX, y: window.scrollY };
  void wrapper.requestFullscreen?.();
}

function handlePictureInPicture(): void {
  const video = videoRef.value as
    | (HTMLVideoElement & {
        requestPictureInPicture?: () => Promise<unknown>;
      })
    | null;
  if (video?.requestPictureInPicture) void video.requestPictureInPicture();
}

function handleFullscreenMouseMove(): void {
  const now = Date.now();
  if (now - lastFullscreenMouseMove < 200) return;
  lastFullscreenMouseMove = now;
  state.showControls = true;
  clearControlsTimer();
  controlsTimer = setTimeout(() => {
    state.showControls = false;
    controlsTimer = undefined;
  }, 3000);
}

function handleFullscreenChange(): void {
  state.isFullscreen = checkFullscreen();
  if (state.isFullscreen) {
    document.addEventListener('mousemove', handleFullscreenMouseMove);
    return;
  }
  document.removeEventListener('mousemove', handleFullscreenMouseMove);
  if (scrollPosition) {
    const position = scrollPosition;
    scrollPosition = undefined;
    setTimeout(() => window.scrollTo(position.x, position.y), 0);
  }
}

function handleBodyKeyDown(event: KeyboardEvent): void {
  const wrapper = wrapperRef.value;
  if (wrapper && !wrapper.contains(document.activeElement)) return;
  if (event.key === ' ') foundation.handlePlayOrPause();
  else if (event.key === 'ArrowLeft')
    foundation.handleTimeChange(state.currentTime - runtimeSeekTime.value);
  else if (event.key === 'ArrowRight')
    foundation.handleTimeChange(state.currentTime + runtimeSeekTime.value);
}

function handleLeavePictureInPicture(): void {
  foundation.handleLeavePictureInPicture();
}

function handleMouseEnterWrapper(): void {
  state.showControls = true;
}

function handleMouseLeaveWrapper(): void {
  if (state.isPlaying) state.showControls = false;
}

function handleWaiting(): void {
  foundation.handleWaiting(locale.value);
}

function handleStalled(): void {
  foundation.handleStalled(locale.value);
}

function initializeVideo(): void {
  const video = videoRef.value;
  if (!video) return;
  if (Number.isFinite(video.duration)) state.totalTime = video.duration;
  const volume = Math.floor(runtimeMuted.value ? 0 : runtimeVolume.value);
  video.volume = volume / 100;
  state.volume = volume;
  state.muted = volume === 0;
  video.playbackRate = runtimeDefaultPlaybackRate.value;
  state.playbackRate = runtimeDefaultPlaybackRate.value;
  document.addEventListener('keydown', handleBodyKeyDown);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  video.addEventListener('leavepictureinpicture', handleLeavePictureInPicture);
}

function destroyVideo(): void {
  clearControlsTimer();
  clearNotificationTimer();
  document.removeEventListener('keydown', handleBodyKeyDown);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('mousemove', handleFullscreenMouseMove);
  const video = videoRef.value;
  if (video) {
    video.removeEventListener('leavepictureinpicture', handleLeavePictureInPicture);
    if (restoreLoadedListener) video.removeEventListener('loadeddata', restoreLoadedListener);
  }
  restoreLoadedListener = undefined;
}

watch(
  () => props.src,
  (src) => {
    if (src !== null && src !== undefined && src !== state.src) state.src = src;
  },
);

onMounted(initializeVideo);
onBeforeUnmount(() => {
  destroyVideo();
  cache.clear();
});

defineExpose({ element });
</script>

<template>
  <div
    ref="wrapper"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="rootStyle"
    @mouseenter="handleMouseEnterWrapper"
    @mouseleave="handleMouseLeaveWrapper"
  >
    <div :class="[`${prefixCls}-wrapper`, `${prefixCls}-wrapper-${runtimeTheme}`]">
      <video
        ref="video"
        :autoplay="runtimeAutoPlay"
        :loop="runtimeLoop"
        :controls="false"
        :crossorigin="props.crossOrigin"
        :src="state.src"
        @timeupdate="handleTimeUpdate"
        @durationchange="handleDurationChange"
        @play="handleVideoPlay"
        @pause="handleVideoPause"
        @click="handleVideoClick"
        @error="handleError"
        @canplay="handleCanPlay"
        @waiting="handleWaiting"
        @stalled="handleStalled"
        @progress="handleProgress"
        @ended="handleEnded"
      >
        <track kind="captions" :src="props.captionsSrc" />
      </video>
      <div v-if="resourceNotFound" :class="`${prefixCls}-resource-not-found`">
        {{ locale.noResource }}
      </div>
    </div>

    <img
      v-if="!state.isPlaying && props.poster"
      :class="[`${prefixCls}-poster`, posterHidden ? `${prefixCls}-poster-hide` : undefined]"
      :src="props.poster"
      alt="poster"
    />
    <div v-if="!state.isPlaying && !state.isError" :class="`${prefixCls}-pause`">
      <IconPlayCircle />
    </div>
    <div v-if="state.isError" :class="[`${prefixCls}-error`, `${prefixCls}-error-${runtimeTheme}`]">
      <div :class="`${prefixCls}-error-svg`"><ErrorSvg /></div>
      {{ locale.videoError }}
    </div>
    <div
      v-if="state.showNotification && state.notificationContent"
      :class="`${prefixCls}-notification`"
    >
      {{ state.notificationContent }}
    </div>

    <div :class="[controlsPrefix, !state.showControls ? `${controlsPrefix}-hide` : undefined]">
      <VideoProgress
        :key="state.totalTime"
        :value="state.currentTime"
        :max="state.totalTime"
        :markers="props.markers ?? []"
        :buffered-value="state.bufferedValue"
        @change="handleTimeChange"
      />
      <div :class="`${controlsPrefix}-menu`">
        <div :class="`${controlsPrefix}-menu-left`">
          <Button
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.PLAY)"
            theme="borderless"
            :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-menu-button`]"
            @click="state.isPlaying ? foundation.handlePause() : foundation.handlePlay()"
          >
            <template #icon><IconPause v-if="state.isPlaying" /><IconPlay v-else /></template>
          </Button>
          <Button
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.NEXT)"
            theme="borderless"
            :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-menu-button`]"
            @click="state.isPlaying ? foundation.handlePause() : foundation.handlePlay()"
          >
            <template #icon><IconRestart :rotate="180" /></template>
          </Button>
          <div
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.TIME)"
            :class="`${controlsPrefix}-time`"
          >
            {{ formatVideoTime(state.currentTime) }} / {{ formatVideoTime(state.totalTime) }}
          </div>
          <Popover
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.VOLUME)"
            :auto-adjust-overflow="true"
            position="top"
            :class="`${controlsPrefix}-popover`"
          >
            <template #content>
              <div :class="`${controlsPrefix}-volume`">
                <div :class="`${controlsPrefix}-volume-title`">
                  {{ state.muted ? 0 : state.volume }}%
                </div>
                <AudioSlider
                  :value="state.muted ? 0 : state.volume"
                  :max="100"
                  vertical
                  :height="120"
                  :theme="runtimeTheme"
                  :show-tooltip="false"
                  @change="handleVolumeChange"
                />
              </div>
            </template>
            <Button
              theme="borderless"
              :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-menu-button`]"
              @click="handleVolumeSilent"
            >
              <template #icon>
                <IconMute v-if="state.muted" />
                <IconVolume1 v-else-if="state.volume < 50" />
                <IconVolume2 v-else />
              </template>
            </Button>
          </Popover>
          <Dropdown
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.PLAYBACK_RATE)"
            position="top"
            :class="`${controlsPrefix}-popup-menu`"
          >
            <template #content>
              <DropdownMenu>
                <DropdownItem
                  v-for="option in state.playbackRateList"
                  :key="option.value"
                  :class="`${controlsPrefix}-popup-menu-item`"
                  :active="option.value === state.playbackRate"
                  @click="handleRateChange(option)"
                >
                  {{ option.label }}
                </DropdownItem>
              </DropdownMenu>
            </template>
            <div :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-popup`]">
              {{
                state.playbackRateList.find((option) => option.value === state.playbackRate)?.label
              }}
            </div>
          </Dropdown>
        </div>

        <div :class="`${controlsPrefix}-menu-right`">
          <Dropdown
            v-if="
              props.qualityList?.length &&
              foundation.shouldShowControlItem(videoPlayerStrings.QUALITY)
            "
            position="top"
            :class="`${controlsPrefix}-popup-menu`"
          >
            <template #content>
              <DropdownMenu>
                <DropdownItem
                  v-for="option in props.qualityList"
                  :key="option.value"
                  :class="`${controlsPrefix}-popup-menu-item`"
                  :active="option.value === state.currentQuality"
                  @click="handleQualityChange(option)"
                >
                  {{ option.label }}
                </DropdownItem>
              </DropdownMenu>
            </template>
            <div :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-popup`]">
              {{ props.qualityList.find((option) => option.value === state.currentQuality)?.label }}
            </div>
          </Dropdown>
          <Dropdown
            v-if="
              props.routeList?.length && foundation.shouldShowControlItem(videoPlayerStrings.ROUTE)
            "
            position="top"
            :class="`${controlsPrefix}-popup-menu`"
          >
            <template #content>
              <DropdownMenu>
                <DropdownItem
                  v-for="option in props.routeList"
                  :key="option.value"
                  :class="`${controlsPrefix}-popup-menu-item`"
                  :active="option.value === state.currentRoute"
                  @click="handleRouteChange(option)"
                >
                  {{ option.label }}
                </DropdownItem>
              </DropdownMenu>
            </template>
            <div :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-popup`]">
              {{ props.routeList.find((option) => option.value === state.currentRoute)?.label }}
            </div>
          </Dropdown>
          <Button
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.MIRROR)"
            theme="borderless"
            :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-menu-button`]"
            @click="handleMirror"
          >
            <template #icon><IconFlipHorizontal /></template>
          </Button>
          <Button
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.FULLSCREEN)"
            theme="borderless"
            :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-menu-button`]"
            @click="handleFullscreen"
          >
            <template #icon
              ><IconMinimize v-if="state.isFullscreen" /><IconMaximize v-else
            /></template>
          </Button>
          <Button
            v-if="foundation.shouldShowControlItem(videoPlayerStrings.PICTURE_IN_PICTURE)"
            theme="borderless"
            :class="[`${controlsPrefix}-menu-item`, `${controlsPrefix}-menu-button`]"
            @click="handlePictureInPicture"
          >
            <template #icon><IconMiniPlayer /></template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
