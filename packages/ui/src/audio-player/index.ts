import AudioPlayerBase from './AudioPlayer.vue';

export const AudioPlayer = AudioPlayerBase;

export { formatAudioTime } from './utils';
export type {
  AudioInfo,
  AudioPlayerExposed,
  AudioPlayerLocale,
  AudioPlayerProps,
  AudioPlayerState,
  AudioPlayerTheme,
  AudioRate,
  AudioSrc,
  AudioUrl,
  AudioUrlArray,
} from './types';

export default AudioPlayer;
