---
title: 'AudioPlayer 音频播放器'
description: '用于播放音频'
type: 'plus'
order: 98
icon: 'doc-audioplayer'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/audio-player` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-plus-audioPlayer-1" title="如何引入" kind="import" />

### 基本用法

基本使用，通过`audioUrl`传入音频地址
audioUrl 可以传入字符串，字符串数组，对象，对象数组， 具体参数参考 [AudioPlayer](#AudioPlayer)

<DemoBlock id="zh-CN-plus-audioPlayer-2" title="基本用法" kind="live" />

### 隐藏工具栏

showToolbar 设置为false，则隐藏工具栏

<DemoBlock id="zh-CN-plus-audioPlayer-3" title="隐藏工具栏" kind="live" />

### 主题

通过 `theme` 设置音频播放器主题，支持 `light` 和 `dark`，默认 `dark`

<DemoBlock id="zh-CN-plus-audioPlayer-4" title="主题" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/audio-player/types.ts`、`packages/ui/src/audio-player/index.ts` 的公开类型为准。

#### Vue 用法

- 播放进度、音量、倍速和曲目索引由组件内部与浏览器原生媒体事件管理；组件不宣声 emits。
- SSR 只输出静态结构；媒体方法需在 mounted/hydration 后通过模板 ref 调用。

#### Vue 实例方法

**AudioPlayer ref**

| 方法      | 签名                                                | 说明                      |
| --------- | --------------------------------------------------- | ------------------------- |
| `element` | Readonly&lt;{ value: HTMLAudioElement \| null }&gt; | 原生 audio 元素的只读引用 |

### AudioPlayer

| 属性         | 说明                           | 类型                    | 默认值 |
| ------------ | ------------------------------ | ----------------------- | ------ |
| audioUrl     | 音频地址                       | AudioUrl（必填）        | -      |
| autoPlay     | 自动播放                       | boolean                 | false  |
| showToolbar  | 是否显示工具栏                 | boolean                 | true   |
| skipDuration | 跳转时间                       | number                  | 10     |
| theme        | 主题,可选值：`dark` 和 `light` | AudioPlayerTheme        | `dark` |
| class        | Vue 原生类名                   | HTMLAttributes['class'] | —      |
| className    | 样式类名                       | HTMLAttributes['class'] | -      |
| style        | 内联样式                       | StyleValue              | -      |

### AudioInfo

| 属性  | 说明     | 类型           | 默认值 |
| ----- | -------- | -------------- | ------ |
| title | 音频标题 | string         | -      |
| cover | 封面图片 | string         | -      |
| src   | 音频地址 | string（必填） | -      |
