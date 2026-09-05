---
title: '通知横幅'
description: '横幅通常用于标识全页的状态或通知等。它通常是常驻的，需要用户主动将其关闭。'
locale: 'zh-CN'
slug: 'banner'
category: 'feedback'
order: 87
englishTitle: 'Banner'
icon: 'doc-banner'
upstream: 'feedback/banner'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import '@aifuxi/semi-theme-default/banner.css';
</script>
```

### 基本用法

::demo-block{demo="banner/zh-cn/Basic" title="基本用法"}
::

### 不同类型

支持4种类型：`info`、`warning`、`danger`、`success`。默认为 `info`。

::demo-block{demo="banner/zh-cn/Types" title="不同类型"}
::

### 非全屏模式

可以设置 `:full-mode="false"` 使用非全屏模式的 banner 样式。
通过 `bordered` 属性可以设置边框。

::demo-block{demo="banner/zh-cn/Container" title="非全屏模式"}
::

```
.components-banner-demo {
    .semi-banner-info.semi-banner-bordered {
        border: 1px solid var(--semi-color-primary-disabled);
    }
    .semi-banner-warning.semi-banner-bordered {
        border: 1px solid var(--semi-color-warning-light-active);
    }
    .semi-banner-danger.semi-banner-bordered {
        border: 1px solid var(--semi-color-danger-light-active);
    }
    .semi-banner-success.semi-banner-bordered {
        border: 1px solid var(--semi-color-success-light-active);
    }
}
```

### 自定义内容

可以通过默认插槽自定义其他渲染内容。
::demo-block{demo="banner/zh-cn/Custom" title="自定义内容"}
::

## API 参考

### Banner

| 属性                | 说明                            | 类型                      | 默认值      |
| ------------------- | ------------------------------- | ------------------------- | ----------- |
| `bordered`          | 容器模式下显示边框              | `boolean`                 | `false`     |
| `class / className` | Vue class 与兼容类名            | `HTMLAttributes["class"]` | `—`         |
| `style`             | 根节点样式                      | `StyleValue`              | `—`         |
| `closeIcon`         | 关闭图标；null 隐藏整个关闭按钮 | `VNodeChild`              | `IconClose` |
| `description`       | 内容说明                        | `VNodeChild`              | `—`         |
| `fullMode`          | 全屏模式                        | `boolean`                 | `true`      |
| `icon`              | 状态图标；null 隐藏图标         | `VNodeChild`              | `by type`   |
| `title`             | 标题                            | `VNodeChild`              | `—`         |
| `type`              | info、success、danger、warning  | `BannerType`              | `info`      |

插槽：title、description、icon、closeIcon，以及承载额外内容的 default；命名插槽优先于同名 prop。`@close(event: MouseEvent)` 在横幅隐藏前触发。没有 visible prop 或 v-model，关闭后需要通过父层 v-if 重新挂载新横幅。

## Accessibility

### ARIA

- 组件的 `role` 为 'alert'
- 关闭按钮的 `aria-label` 为 'Close'

### 键盘和焦点

- Banner 的关闭按钮可以使用 `Tab` 键聚焦，按钮聚焦后，敲击 `Enter` 键或 `Space` 键可以关闭 banner

## 文案规范

- 全屏 Banner
  - 尽量保持内容一行展示完全
  - 使用正确的标点符号，句子内使用逗号，句子间使用句号
- 非全屏 Banner
  - 标题
    - 使用精简的语言进行说明
    - 标题上尽量避免使用逗号，句号等标点符号，有且只有是疑问句的时候，支持使用问号结尾
  - 正文
    - 在信息传递完整的前提下，尽可能地将正文压缩至 1 -2 句话
    - 对标题进行详尽地描述或者解释，而不是对标题的重复说明
    - 使用正确的标点符号，句子内使用逗号，句子间使用句号

## 设计变量

::token-table{component="banner"}
::

## FAQ

**关闭后如何重新显示？** 通过父层 v-if 重新挂载。

**如何隐藏图标或关闭按钮？** 分别向 icon、closeIcon 传入 null。

**为什么 bordered 没有显示？** 边框仅作用于容器模式，需要 fullMode=false。

**能否取消 close？** close 是通知事件，event.preventDefault() 不会阻止隐藏；需要限制关闭时应隐藏关闭按钮。

## React → Vue

| React                                              | Vue                     |
| -------------------------------------------------- | ----------------------- |
| `children`                                         | default slot            |
| `title / description / icon / closeIcon ReactNode` | 同名插槽或 VNodeChild   |
| `onClose`                                          | @close                  |
| `React conditional rendering`                      | 父层 v-if               |
| `className`                                        | class（兼容 className） |
