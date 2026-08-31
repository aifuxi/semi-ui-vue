# AudioPlayer React → Vue 迁移

## 导入与音频源

```tsx
// React
import { AudioPlayer } from '@douyinfe/semi-ui';

<AudioPlayer audioUrl={tracks} autoPlay={false} showToolbar />;
```

```vue
<!-- Vue -->
<script setup lang="ts">
import { AudioPlayer } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <AudioPlayer :audio-url="tracks" :auto-play="false" show-toolbar />
</template>
```

属性名和枚举值保持一致；Vue 模板中按 kebab-case 书写。`audioUrl` 是单向 prop，不映射
为 `v-model`。播放进度、音量、倍速和曲目索引由播放器内部及原生媒体事件管理。

## Boolean 与默认值

`autoPlay=false`、`showToolbar=true`、`skipDuration=10`、`theme='dark'` 与固定上游一致。
显式 `:show-toolbar="false"` 不会被缺省值或 ConfigProvider 全局覆盖重新打开。

## React ref → Vue template ref

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { AudioPlayerExposed } from '@aifuxi/semi-ui-vue';

const player = useTemplateRef<AudioPlayerExposed>('player');
</script>

<template>
  <AudioPlayer ref="player" audio-url="/audio/demo.mp3" />
  <button @click="player?.element.value?.pause()">暂停</button>
</template>
```

Vue 不复制 React class 实例、ReactNode 或 setState。只暴露原生 audio 元素的只读引用；
组件本身没有 slots、emits 或 `v-model`。

## 类型映射

| React v2.102.0     | Vue 公开类型       |
| ------------------ | ------------------ |
| `AudioPlayerProps` | `AudioPlayerProps` |
| 内部 `AudioInfo`   | `AudioInfo`        |
| 内部 `AudioUrl`    | `AudioUrl`         |
| `AudioPlayerState` | `AudioPlayerState` |
| `AudioPlayerTheme` | `AudioPlayerTheme` |

主题样式可用默认根入口或 `@aifuxi/semi-theme-default/audio-player.css`。SSR 无需条件导入
组件；媒体方法只应在 mounted/hydration 后通过模板 ref 调用。
