# VideoPlayer React → Vue 迁移

## 属性、事件与 ref

| React v2.102.0                        | Vue                                        |
| ------------------------------------- | ------------------------------------------ |
| `<VideoPlayer src={src} />`           | `<VideoPlayer :src="src" />`               |
| `className` / `style`                 | `class` / `style`（也兼容 `className`）    |
| `onPlay` / `onPause`                  | `@play` / `@pause`                         |
| `onRateChange`                        | `@rate-change`                             |
| `onQualityChange`                     | `@quality-change`                          |
| `onRouteChange`                       | `@route-change`                            |
| `onVolumeChange`                      | `@volume-change`                           |
| `forwardRef` / React `ref` 指向 video | Vue 组件 ref 的 `element.value` 指向 video |

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { VideoPlayer, type VideoPlayerExposed } from '@aifuxi/semi-ui-vue';

const player = useTemplateRef<VideoPlayerExposed>('player');
onMounted(() => player.value?.element.value?.pause());
</script>

<template><VideoPlayer ref="player" src="/demo.mp4" /></template>
```

## Vue 原生语义

- `clickToPlay` 缺省为 `true`；显式 `:click-to-play="false"` 不会被全局默认值覆盖。
- 清晰度和线路仍由调用方在 change 事件中更新 `src`，不是内建播放列表。
- `controlsList` 的枚举值与 v2.102.0 相同，class 与 `--semi-*` Token 保持兼容。
- Locale 通过 `ConfigProvider` 的 `VideoPlayer` 字段传入；浮层容器沿用
  `getPopupContainer`。

## 已接受差异

- 固定 React Adapter 声明了 `clickToPlay`，但源码无条件处理 video click；Vue 按公开
  API 真正支持显式关闭。
- 固定 Foundation 的 keydown remove 使用了不同函数引用，并遗漏临时通知 timer 清理；
  Vue 使用稳定引用并在卸载时完整清理。
- 固定 Adapter 声明 `onVolumeChange` 但 Foundation 未调用；Vue 在真实音量变化时触发
  `volumeChange`。

这些差异不会改变默认场景的 DOM 或视觉，完整依据与验收结论见
[alignment.md](./alignment.md)。
