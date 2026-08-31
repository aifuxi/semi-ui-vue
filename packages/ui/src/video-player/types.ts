import type { HTMLAttributes, Ref, StyleValue } from 'vue';

export type VideoPlayerTheme = 'dark' | 'light';
export type VideoPlayerCrossOrigin = '' | 'anonymous' | 'use-credentials';
export type VideoPlayerControl =
  | 'play'
  | 'next'
  | 'time'
  | 'volume'
  | 'playbackRate'
  | 'quality'
  | 'route'
  | 'mirror'
  | 'fullscreen'
  | 'pictureInPicture';

export interface VideoPlayerOption<Value extends string | number = string | number> {
  label: string;
  value: Value;
}

export interface VideoPlayerMarker {
  start: number;
  title: string;
}

export interface VideoPlayerProps {
  autoPlay?: boolean;
  captionsSrc?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  clickToPlay?: boolean;
  controlsList?: VideoPlayerControl[];
  crossOrigin?: VideoPlayerCrossOrigin;
  defaultPlaybackRate?: number;
  defaultQuality?: string;
  defaultRoute?: string;
  height?: number | string;
  loop?: boolean;
  markers?: VideoPlayerMarker[];
  muted?: boolean;
  playbackRateList?: Array<VideoPlayerOption<number>>;
  poster?: string;
  qualityList?: Array<VideoPlayerOption<string>>;
  routeList?: Array<VideoPlayerOption<string>>;
  seekTime?: number;
  src?: string;
  style?: StyleValue;
  theme?: VideoPlayerTheme;
  volume?: number;
  width?: number | string;
}

export interface VideoPlayerEmits {
  pause: [];
  play: [];
  qualityChange: [quality: string];
  rateChange: [rate: number];
  routeChange: [route: string];
  volumeChange: [volume: number];
}

export interface VideoPlayerState {
  bufferedValue: number;
  currentQuality: string;
  currentRoute: string;
  currentTime: number;
  isError: boolean;
  isFullscreen: boolean;
  isMirror: boolean;
  isPlaying: boolean;
  muted: boolean;
  notificationContent: string;
  playbackRate: number;
  playbackRateList: Array<VideoPlayerOption<number>>;
  showControls: boolean;
  showNotification: boolean;
  src: string;
  totalTime: number;
  volume: number;
}

export interface VideoPlayerLocale {
  rateChange: string;
  qualityChange: string;
  routeChange: string;
  mirror: string;
  cancelMirror: string;
  loading: string;
  stall: string;
  noResource: string;
  videoError: string;
}

export interface VideoPlayerExposed {
  element: Readonly<Ref<HTMLVideoElement | null>>;
}
