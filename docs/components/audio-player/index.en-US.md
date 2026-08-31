# AudioPlayer

AudioPlayer plays one audio source or loops through a playlist. It follows the pinned local Semi
Design v2.102.0 source and preserves dark/light themes, progress, rate, volume, seeking, covers,
and error states.

## Basic usage

```vue
<script setup lang="ts">
import { AudioPlayer } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/audio-player.css';

const tracks = [
  { src: '/audio/intro.mp3', title: 'Introduction', cover: '/images/intro.webp' },
  { src: '/audio/details.mp3', title: 'Details', cover: '/images/details.webp' },
];
</script>

<template>
  <AudioPlayer :audio-url="tracks" :auto-play="false" />
</template>
```

`audioUrl` accepts a string, an `AudioInfo`, or an array mixing both forms. A playlist shows
previous/next controls and advances cyclically when a track ends. A single track stops playing at
the end.

## Theme and toolbar

```vue
<AudioPlayer audio-url="/audio/demo.mp3" theme="light" :show-toolbar="false" />
```

`theme` accepts `dark` and `light`. The toolbar contains volume, backward, forward, playback rate,
and refresh controls by default. Set `showToolbar` to `false` to remove it. `skipDuration` defaults
to 10 seconds.

## API

| Property              | Description                                    | Type                | Default  |
| --------------------- | ---------------------------------------------- | ------------------- | -------- |
| `audioUrl`            | One audio source or a playlist                 | `AudioUrl`          | required |
| `autoPlay`            | Playing state after metadata becomes available | `boolean`           | `false`  |
| `showToolbar`         | Show the toolbar                               | `boolean`           | `true`   |
| `skipDuration`        | Backward/forward step in seconds               | `number`            | `10`     |
| `theme`               | Player theme                                   | `'dark' \| 'light'` | `'dark'` |
| `className` / `class` | Root classes                                   | Vue class value     | -        |
| `style`               | Root style                                     | Vue style value     | -        |

`AudioInfo` has a required `src` and optional `title` and `cover`. A component ref exposes a
readonly `element` whose value is the native `HTMLAudioElement`; prefer the built-in controls for
normal application actions.

## Locale, accessibility, and SSR

Previous, next, volume, seek, and error labels use the ConfigProvider `AudioPlayer` locale. Button,
Tooltip, Popover, and Dropdown retain their keyboard, focus, and Portal contracts. SSR outputs the
static player DOM and reads media properties or registers events only after hydration. Both the
root package and `@aifuxi/semi-ui-vue/audio-player` are SSR-safe to import.

See the [alignment matrix](./alignment.md) for complete API, state, DOM, visual, and deviation
evidence, and [React → Vue](./react-to-vue.md) for migration details.
