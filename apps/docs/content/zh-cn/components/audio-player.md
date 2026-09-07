---
title: '音频播放器'
description: '用于播放音频'
locale: 'zh-CN'
slug: 'audio-player'
category: 'plus'
order: 98
englishTitle: 'AudioPlayer'
icon: 'doc-audioplayer'
upstream: 'plus/audioPlayer'
---

AudioPlayer 用于播放单个音频或循环播放音频列表。实现以本地 Semi Design v2.102.0
源码为唯一基线，保留暗色/亮色主题、进度、倍速、音量、跳转、封面和错误状态。

## 基本用法

::demo-block{demo="audio-player/zh-CN/Example1" title="基本用法"}
::

`audioUrl` 支持字符串、`AudioInfo`、字符串数组和对象数组。数组会显示上一首/下一首，
播放结束后循环进入下一首；单曲播放结束后停在暂停状态。

## 主题与工具栏

```vue
<AudioPlayer audio-url="/audio/demo.mp3" theme="light" :show-toolbar="false" />
```

`theme` 支持 `dark` 和 `light`。工具栏默认显示音量、后退、前进、倍速和刷新；
`showToolbar=false` 会完整移除工具栏，`skipDuration` 默认 10 秒。

## 固定上游示例

音频与封面替换为仓库自有的本地短音频和插画；保留四种输入形式、曲目切换和工具栏配置。

### 基本用法

::demo-block{demo="audio-player/zh-CN/Basic" title="基本用法"}
::

### 隐藏工具栏

::demo-block{demo="audio-player/zh-CN/NoToolbar" title="隐藏工具栏"}
::

### 主题

::demo-block{demo="audio-player/zh-CN/Theme" title="主题"}
::

基础示例在窄编辑预览中可横向滚动，以完整展示桌面播放器。

## API

| 属性                  | 说明                                | 类型                | 默认值   |
| --------------------- | ----------------------------------- | ------------------- | -------- |
| `audioUrl`            | 音频源或音频列表                    | `AudioUrl`          | 必填     |
| `autoPlay`            | metadata 就绪后是否处于自动播放状态 | `boolean`           | `false`  |
| `showToolbar`         | 是否显示工具栏                      | `boolean`           | `true`   |
| `skipDuration`        | 前进/后退秒数                       | `number`            | `10`     |
| `theme`               | 播放器主题                          | `'dark' \| 'light'` | `'dark'` |
| `className` / `class` | 根容器 class                        | Vue class value     | -        |
| `style`               | 根容器样式                          | Vue style value     | -        |

`AudioInfo` 包含必填 `src` 与可选 `title`、`cover`。组件 ref 暴露只读 `element`，其值为
原生 `HTMLAudioElement`，适合读取媒体状态；业务控制优先使用组件自带 UI。

## Locale、可访问性与 SSR

上一首、下一首、音量、跳转和错误文案读取 ConfigProvider 的 `AudioPlayer` Locale。
Button、Tooltip、Popover 和 Dropdown 保留各自键盘、焦点及 Portal 合同。服务端会输出
静态播放器 DOM，但只在 hydration 后读取媒体属性和注册事件。根入口及
`@aifuxi/semi-ui-vue/audio-player` 均支持 SSR-safe import。

完整 API、状态、DOM、视觉与 deviation 证据见[对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/audio-player/alignment.md)，React 迁移见
[React → Vue](#react-vue)。
