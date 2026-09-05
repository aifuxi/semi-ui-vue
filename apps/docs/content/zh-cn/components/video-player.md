---
title: '视频播放器'
description: '用于播放视频'
locale: 'zh-CN'
slug: 'video-player'
category: 'plus'
order: 99
englishTitle: 'VideoPlayer'
icon: 'doc-videoplayer'
upstream: 'plus/videoPlayer'
---

`VideoPlayer` 对齐 Semi Design v2.102.0 的视频播放、章节进度、音量、倍速、清晰度、
线路、镜像、全屏和画中画能力。组件只在浏览器挂载后访问媒体 API，可安全进行 SSR import。

::demo-block{demo="video-player/zh-CN/Example1" title="视频播放器"}
::

## 清晰度与线路

`qualityList` / `routeList` 只负责菜单与事件；调用方在事件中切换 `src`。组件会在新资源
触发 `loadeddata` 后恢复切换前的播放位置和播放状态。

```vue
<VideoPlayer
  :src="src"
  default-quality="1080p"
  default-route="line-1"
  :quality-list="[
    { label: '1080p', value: '1080p' },
    { label: '480p', value: '480p' },
  ]"
  :route-list="[
    { label: '线路一', value: 'line-1' },
    { label: '线路二', value: 'line-2' },
  ]"
  @quality-change="(quality) => switchSource(quality, route)"
  @route-change="(route) => switchSource(quality, route)"
/>
```

## API

| Prop                              | 类型                                     | 默认值     | 说明                                     |
| --------------------------------- | ---------------------------------------- | ---------- | ---------------------------------------- |
| `src`                             | `string`                                 | -          | 视频地址；缺省时显示 Locale 的无资源文案 |
| `poster`                          | `string`                                 | -          | 暂停海报                                 |
| `autoPlay`                        | `boolean`                                | `false`    | 原生自动播放                             |
| `clickToPlay`                     | `boolean`                                | `true`     | 点击视频切换播放/暂停                    |
| `controlsList`                    | `VideoPlayerControl[]`                   | 全部控制项 | 控制可见菜单项                           |
| `captionsSrc`                     | `string`                                 | -          | captions track 地址                      |
| `crossOrigin`                     | `'' \| 'anonymous' \| 'use-credentials'` | -          | 原生跨域属性                             |
| `defaultPlaybackRate`             | `number`                                 | `1`        | 初始倍速                                 |
| `playbackRateList`                | `Array<{ label; value: number }>`        | 固定五项   | 倍速列表                                 |
| `defaultQuality` / `defaultRoute` | `string`                                 | `''`       | 初始清晰度/线路                          |
| `qualityList` / `routeList`       | `Array<{ label; value: string }>`        | -          | 清晰度/线路列表                          |
| `markers`                         | `Array<{ start; title }>`                | -          | 章节起点与标题                           |
| `seekTime`                        | `number`                                 | `10`       | 左右方向键跳转秒数                       |
| `muted`                           | `boolean`                                | `false`    | 初始静音                                 |
| `volume`                          | `number`                                 | `100`      | 初始音量（0–100）                        |
| `loop`                            | `boolean`                                | `false`    | 原生循环播放                             |
| `theme`                           | `'dark' \| 'light'`                      | `'dark'`   | 播放器底色主题                           |
| `width` / `height`                | `number \| string`                       | -          | 根容器尺寸                               |

事件：`play`、`pause`、`rateChange(number)`、`qualityChange(string)`、
`routeChange(string)`、`volumeChange(number)`。组件 ref 暴露只读 `element`，指向原生 video。

## 键盘与服务端渲染

当焦点位于播放器内部时，Space 切换播放，ArrowLeft / ArrowRight 按 `seekTime` 跳转。
SSR 会输出静态 video、track、章节进度和控制栏；媒体事件与 document 监听仅在 hydration
后注册，并在卸载时清理。

React 迁移差异见 [react-to-vue.md](#react-vue)，完整证据见
[alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/video-player/alignment.md)。

## React → Vue

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
[alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/video-player/alignment.md)。
