# VideoPlayer

`VideoPlayer` aligns video playback, chapter progress, volume, playback rate, quality, route,
mirror, fullscreen, and picture-in-picture behavior with Semi Design v2.102.0. Media APIs are
only accessed after browser mount, so importing and rendering the static shell is SSR-safe.

```vue
<script setup lang="ts">
import { VideoPlayer } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/video-player.css';
</script>

<template>
  <VideoPlayer
    src="/demo.mp4"
    poster="/poster.webp"
    :width="800"
    :height="450"
    :markers="[
      { start: 0, title: 'Intro' },
      { start: 30, title: 'Features' },
    ]"
    @play="console.log('play')"
    @pause="console.log('pause')"
  />
</template>
```

## Quality and route switching

`qualityList` and `routeList` provide menus and events. The consumer changes `src` from those
events; after the new resource emits `loadeddata`, the player restores the previous position and
playing state.

## API

| Prop                              | Type                                     | Default            | Description                                                      |
| --------------------------------- | ---------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| `src`                             | `string`                                 | -                  | Video URL; the localized no-resource state is shown when omitted |
| `poster`                          | `string`                                 | -                  | Poster displayed while paused                                    |
| `autoPlay`                        | `boolean`                                | `false`            | Native autoplay                                                  |
| `clickToPlay`                     | `boolean`                                | `true`             | Toggle playback by clicking the video                            |
| `controlsList`                    | `VideoPlayerControl[]`                   | all controls       | Visible control items                                            |
| `captionsSrc`                     | `string`                                 | -                  | Captions track URL                                               |
| `crossOrigin`                     | `'' \| 'anonymous' \| 'use-credentials'` | -                  | Native CORS attribute                                            |
| `defaultPlaybackRate`             | `number`                                 | `1`                | Initial playback rate                                            |
| `playbackRateList`                | `Array<{ label; value: number }>`        | five fixed options | Rate options                                                     |
| `defaultQuality` / `defaultRoute` | `string`                                 | `''`               | Initial quality/route                                            |
| `qualityList` / `routeList`       | `Array<{ label; value: string }>`        | -                  | Quality/route options                                            |
| `markers`                         | `Array<{ start; title }>`                | -                  | Chapter starts and labels                                        |
| `seekTime`                        | `number`                                 | `10`               | Arrow-key seek distance in seconds                               |
| `muted`                           | `boolean`                                | `false`            | Initial mute state                                               |
| `volume`                          | `number`                                 | `100`              | Initial volume from 0 to 100                                     |
| `loop`                            | `boolean`                                | `false`            | Native loop playback                                             |
| `theme`                           | `'dark' \| 'light'`                      | `'dark'`           | Player surface theme                                             |
| `width` / `height`                | `number \| string`                       | -                  | Root dimensions                                                  |

Events are `play`, `pause`, `rateChange(number)`, `qualityChange(string)`,
`routeChange(string)`, and `volumeChange(number)`. A component ref exposes the readonly `element`
ref for the native video.

With focus inside the player, Space toggles playback and ArrowLeft / ArrowRight seek by
`seekTime`. SSR emits the static video, track, progress, and control DOM; global and media
listeners are registered after hydration and removed on unmount.

See [react-to-vue.md](./react-to-vue.md) for migration details and
[alignment.md](./alignment.md) for the complete evidence matrix.
