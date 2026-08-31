// Keep the pinned VideoPlayer state machines behind this private boundary.
// @ts-expect-error -- vendor TypeScript is compiled only through the private integration package.
export { default as VideoPlayerFoundation } from '../../../vendor/semi-design/packages/semi-foundation/videoPlayer/foundation';
// @ts-expect-error -- vendor TypeScript is compiled only through the private integration package.
export { default as VideoProgressFoundation } from '../../../vendor/semi-design/packages/semi-foundation/videoPlayer/progressFoundation';
// @ts-expect-error -- public declarations expose a local facade instead of this vendor path.
export {
  cssClasses as videoPlayerCssClasses,
  DEFAULT_PLAYBACK_RATE as videoPlayerDefaultPlaybackRate,
  numbers as videoPlayerNumbers,
  strings as videoPlayerStrings,
} from '../../../vendor/semi-design/packages/semi-foundation/videoPlayer/constants';
