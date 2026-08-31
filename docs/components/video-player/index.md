# VideoPlayer 视频播放器

`VideoPlayer` 对齐 Semi Design v2.102.0 的视频播放、章节进度、音量、倍速、清晰度、
线路、镜像、全屏和画中画能力。组件只在浏览器挂载后访问媒体 API，可安全进行 SSR import。

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
      { start: 0, title: '片头' },
      { start: 30, title: '功能介绍' },
    ]"
    @play="console.log('play')"
    @pause="console.log('pause')"
  />
</template>
```

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

React 迁移差异见 [react-to-vue.md](./react-to-vue.md)，完整证据见
[alignment.md](./alignment.md)。
