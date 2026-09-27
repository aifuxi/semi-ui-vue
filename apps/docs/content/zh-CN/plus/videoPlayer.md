---
title: 'VideoPlayer 视频播放器'
description: '用于播放视频'
type: 'plus'
order: 99
icon: 'doc-videoplayer'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/video-player` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-plus-videoPlayer-1" title="如何引入" kind="import" />

### 基本用法

基本使用，通过 `src` 传入视频地址， 通过 `poster` 传入视频封面地址

<DemoBlock id="zh-CN-plus-videoPlayer-2" title="基本用法" kind="live" />

### 设置菜单栏功能

通过 `controlsList` 设置菜单栏的展示项，该项接受值为数组，默认值为`['play', 'next', 'time', 'volume', 'playbackRate', 'quality', 'route', 'mirror', 'fullscreen', 'pictureInPicture']`

<DemoBlock id="zh-CN-plus-videoPlayer-3" title="设置菜单栏功能" kind="live" />

### 循环播放

通过 `loop` 设置循环播放

<DemoBlock id="zh-CN-plus-videoPlayer-4" title="循环播放" kind="live" />

### 快进快退

通过 `seekTime` 设置快进快退时间，通过键盘左右键执行快进快退

<DemoBlock id="zh-CN-plus-videoPlayer-5" title="快进快退" kind="live" />

### 播放速率

通过 `playbackRateList` 设置速率选择列表

<DemoBlock id="zh-CN-plus-videoPlayer-6" title="播放速率" kind="live" />

### 音量设置

通过 `volume` 设置初始音量，值区间为 0 - 100， 设置 `muted` 为 `true` 可以静音播放

<DemoBlock id="zh-CN-plus-videoPlayer-7" title="音量设置" kind="live" />

### 清晰度切换

通过 `qualityList` 设置清晰度列表，`defaultQuality` 设置初始值，并监听 `qualityChange` 事件更新 `src`。

线路切换同理：通过 `routeList` 设置线路列表、`defaultRoute` 设置初始值，并监听 `routeChange` 事件更新 `src`。

<DemoBlock id="zh-CN-plus-videoPlayer-8" title="清晰度切换" kind="live" />

### 章节标记

通过 `markers` 设置章节标记点

<DemoBlock id="zh-CN-plus-videoPlayer-9" title="章节标记" kind="live" />

### 主题

通过 `theme` 设置主题， 主题仅影响背景色

<DemoBlock id="zh-CN-plus-videoPlayer-10" title="主题" kind="live" />

### 使用模板 ref 控制

通过模板 ref 的 `element` 获取原生 video 元素，可以实现多个视频同步播放或暂停。

<DemoBlock id="zh-CN-plus-videoPlayer-11" title="使用 ref 控制" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/video-player/types.ts` 的公开类型为准。

#### Vue 用法

- 模板 ref 暴露只读 `element: Ref<HTMLVideoElement | null>`，用于访问原生 video 元素。
- `qualityList` 与 `routeList` 只描述选项；监听对应事件后由调用方更新 src。

#### Vue 事件

**VideoPlayer**

| 事件          | 参数              | 说明           |
| ------------- | ----------------- | -------------- |
| pause         | []                | 视频暂停       |
| play          | []                | 视频播放       |
| qualityChange | [quality: string] | 清晰度选项变化 |
| rateChange    | [rate: number]    | 播放速率变化   |
| routeChange   | [route: string]   | 线路选项变化   |
| volumeChange  | [volume: number]  | 音量变化       |

| 属性                | 说明                                                                                                                                              | 类型                                         | 默认值                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| autoPlay            | 是否自动播放                                                                                                                                      | boolean                                      | false                                                                                          |
| captionsSrc         | 字幕资源                                                                                                                                          | string                                       | -                                                                                              |
| class               | Vue 原生类名                                                                                                                                      | HTMLAttributes['class']                      | —                                                                                              |
| className           | 样式类名                                                                                                                                          | HTMLAttributes['class']                      | -                                                                                              |
| clickToPlay         | 是否启用点击以播放                                                                                                                                | boolean                                      | true                                                                                           |
| controlsList        | 设置菜单栏展示控件，默认展示所有控件                                                                                                              | VideoPlayerControl[]                         | `play, next, time, volume, playbackRate, quality, route, mirror, fullscreen, pictureInPicture` |
| crossOrigin         | 该枚举属性指明是否使用 CORS 来获取相关视频。允许 CORS 的资源可在 'canvas' 元素中被重用，而不会被污染。允许的值有 'anonymous' 和 'use-credentials' | VideoPlayerCrossOrigin                       | -                                                                                              |
| defaultPlaybackRate | 初始播放速率                                                                                                                                      | number                                       | 1                                                                                              |
| defaultQuality      | 初始清晰度                                                                                                                                        | string                                       | —                                                                                              |
| defaultRoute        | 初始线路                                                                                                                                          | string                                       | -                                                                                              |
| height              | 高度                                                                                                                                              | number \| string                             | -                                                                                              |
| loop                | 是否启用循环播放                                                                                                                                  | boolean                                      | false                                                                                          |
| markers             | 节点标记                                                                                                                                          | VideoPlayerMarker[]                          | -                                                                                              |
| muted               | 是否静音播放                                                                                                                                      | boolean                                      | false                                                                                          |
| playbackRateList    | 播放速率选项                                                                                                                                      | Array&lt;VideoPlayerOption&lt;number&gt;&gt; | `2, 1.5, 1.25, 1, 0.75`                                                                        |
| poster              | 封面图                                                                                                                                            | string                                       | -                                                                                              |
| qualityList         | 清晰度列表                                                                                                                                        | Array&lt;VideoPlayerOption&lt;string&gt;&gt; | -                                                                                              |
| routeList           | 线路列表                                                                                                                                          | Array&lt;VideoPlayerOption&lt;string&gt;&gt; | -                                                                                              |
| seekTime            | 快进快退时间                                                                                                                                      | number                                       | 10                                                                                             |
| src                 | 视频播放地址                                                                                                                                      | string                                       | -                                                                                              |
| style               | 样式                                                                                                                                              | StyleValue                                   | -                                                                                              |
| theme               | 主题设置，不同主题组件的背景色不同                                                                                                                | VideoPlayerTheme                             | `dark`                                                                                         |
| volume              | 默认音量                                                                                                                                          | number                                       | 100                                                                                            |
| width               | 宽度                                                                                                                                              | number \| string                             | -                                                                                              |

#### Marker

| 属性  | 说明       | 类型           | 默认值 |
| ----- | ---------- | -------------- | ------ |
| start | 起始时间点 | number（必填） | —      |
| title | 标题       | string（必填） | —      |
