import VideoPlayerBase from './VideoPlayer.vue';

export const VideoPlayer = VideoPlayerBase;

export { formatVideoTime } from './utils';
export type {
  VideoPlayerControl,
  VideoPlayerCrossOrigin,
  VideoPlayerEmits,
  VideoPlayerExposed,
  VideoPlayerLocale,
  VideoPlayerMarker,
  VideoPlayerOption,
  VideoPlayerProps,
  VideoPlayerState,
  VideoPlayerTheme,
} from './types';

export default VideoPlayer;
