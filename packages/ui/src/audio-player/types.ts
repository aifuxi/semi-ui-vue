import type { HTMLAttributes, StyleValue } from 'vue';

export type AudioPlayerTheme = 'dark' | 'light';
export type AudioSrc = string;

export interface AudioInfo {
  title?: string;
  cover?: string;
  src: string;
}

export type AudioUrlArray = Array<AudioInfo | AudioSrc>;
export type AudioUrl = AudioSrc | AudioInfo | AudioUrlArray;

export interface AudioRate {
  label: string;
  value: number;
}

export interface AudioPlayerProps {
  audioUrl: AudioUrl;
  autoPlay?: boolean;
  showToolbar?: boolean;
  skipDuration?: number;
  theme?: AudioPlayerTheme;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentIndex: number;
  totalTime: number;
  currentTime: number;
  currentRate: AudioRate;
  volume: number;
  error: boolean;
}

export interface AudioPlayerLocale {
  backward: string;
  forward: string;
  prev: string;
  next: string;
  loop: string;
  volume: string;
  mediaError: string;
}

export interface AudioPlayerExposed {
  element: Readonly<{ value: HTMLAudioElement | null }>;
}
