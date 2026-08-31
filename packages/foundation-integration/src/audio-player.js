// Keep the pinned AudioPlayer state machine behind this private boundary.
// @ts-expect-error -- vendor TypeScript is compiled only through the private integration package.
export { default as AudioPlayerFoundation } from '../../../vendor/semi-design/packages/semi-foundation/audioPlayer/foundation';
// @ts-expect-error -- public declarations expose a local facade instead of this vendor path.
export { cssClasses as audioPlayerCssClasses } from '../../../vendor/semi-design/packages/semi-foundation/audioPlayer/constants';
