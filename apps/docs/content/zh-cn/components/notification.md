---
title: '通知'
description: '通知用于主动向用户发出消息通知'
locale: 'zh-CN'
slug: 'notification'
category: 'feedback'
order: 88
englishTitle: 'Notification'
icon: 'doc-notification'
upstream: 'feedback/notification'
---

Notification 用于主动向用户展示较完整的异步结果或状态提醒。Vue 版本对齐 Semi Design v2.102.0 的命令式 API、六种位置、自动关闭、更新、主题、动效、ARIA 与局部上下文 holder。

## 代码演示

### 如何引入

```ts
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/notification.css';
```

### 普通通知

最基本的用法，3 秒后自动关闭。

::demo-block{demo="notification/zh-CN/Basic" title="普通通知"}
::

### 不同位置弹出

可以从六个位置弹出，默认位置是右上角 `topRight`。

::demo-block{demo="notification/zh-CN/Position" title="不同位置弹出"}
::

### 带有图标的通知

`success`、`info`、`warning`、`error` 提供默认状态图标；也可以传入 Vue VNode 自定义图标。

::demo-block{demo="notification/zh-CN/Icons" title="带有图标的通知"}
::

### 多色样式

使用 `theme="light"` 设置浅色填充背景，提高通知与页面的对比；默认是 `normal` 白色模式。

::demo-block{demo="notification/zh-CN/Colored" title="多色样式"}
::

### 链接文本

配合 Typography 可以在正文中加入操作链接，以覆盖更复杂的通知场景。

::demo-block{demo="notification/zh-CN/Links" title="链接文本"}
::

### 修改延时

使用 `duration` 自定义关闭延时。本例 10 秒后关闭，默认时长为 3 秒。

::demo-block{demo="notification/zh-CN/Delay" title="修改延时"}
::

### 手动关闭

设置 `duration: 0` 后通知不会自动关闭。示例保存每次展示返回的 id，并按创建顺序关闭最早的一条。

::demo-block{demo="notification/zh-CN/ManualClose" title="手动关闭"}
::

### 更新内容

再次传入已有 id 会更新原通知，而不是新建另一条，并从更新时刻重新计算关闭时间。

::demo-block{demo="notification/zh-CN/Update" title="更新内容"}
::

中英文固定上游均有八项 live 示例，顺序一致，没有语言独有示例或多文件依赖。英文上游前两项误写了 `with` 与 `Position`；Vue 示例按实际公开 API 修正为 `duration` 与 `position`。按照仓库独立品牌约束，示例中的 Bytedance 文案与 Toutiao/Vigo 品牌图标替换为 AIFUXI 文案和通用 Bell/Star 图标，同时保留自定义图标与颜色的演示意图。更新示例会在卸载时清理尚未触发的定时器。本批只验证基础运行，不代表严格 React/Vue 视觉与行为验收。

## API 参考

展示方法直接接收 options，并返回通知 id：

- `Notification.open(options)`
- `Notification.info(options)`
- `Notification.error(options)`
- `Notification.warning(options)`
- `Notification.success(options)`

使用 `Notification.close(id)` 手动关闭单条通知，使用 `Notification.destroyAll()` 销毁全部通知及命令式 wrapper。

| 属性                | 类型                   | 默认值          | 说明                           |
| ------------------- | ---------------------- | --------------- | ------------------------------ |
| `content`           | `VNodeChild`           | `''`            | 通知正文                       |
| `duration`          | `number`               | `3`             | 自动关闭秒数；0 表示不自动关闭 |
| `getPopupContainer` | `() => HTMLElement`    | `document.body` | 首个命令式 wrapper 的父节点    |
| `icon`              | `VNodeChild`           | -               | 自定义左侧图标                 |
| `id`                | `string`               | 自动生成        | 复用 id 可更新通知             |
| `position`          | `NotificationPosition` | `topRight`      | 弹出位置                       |
| `showClose`         | `boolean`              | `true`          | 是否显示关闭按钮               |
| `theme`             | `'normal' \| 'light'`  | `normal`        | 背景填充样式                   |
| `title`             | `VNodeChild`           | `''`            | 通知标题                       |
| `zIndex`            | `number`               | `1010`          | 首个 wrapper 的层级            |
| `onClick`           | `(event) => void`      | -               | 点击卡片回调                   |
| `onClose`           | `() => void`           | -               | 自动或按钮关闭回调             |
| `onCloseClick`      | `(id) => void`         | -               | 点击关闭按钮回调               |

全局配置需在首次展示前调用：

```ts
Notification.config({ position: 'top', top: 24, duration: 5, zIndex: 1200 });
```

| 配置项     | 类型                   | 默认值     | 说明           |
| ---------- | ---------------------- | ---------- | -------------- |
| `bottom`   | `number \| string`     | -          | bottom 偏移    |
| `duration` | `number`               | `3`        | 自动关闭秒数   |
| `left`     | `number \| string`     | -          | left 偏移      |
| `position` | `NotificationPosition` | `topRight` | 默认弹出位置   |
| `right`    | `number \| string`     | -          | right 偏移     |
| `top`      | `number \| string`     | -          | top 偏移       |
| `zIndex`   | `number`               | `1010`     | wrapper 的层级 |

命令式通知共享首个 wrapper：`getPopupContainer` 与 `zIndex` 只在第一次创建 wrapper 时生效；`destroyAll()` 后再次展示会重新解析容器。

### 局部上下文

`Notification.useNotification()` 返回 `[notification, NotificationHolder]`。holder 放在 `ConfigProvider` 内时会继承 direction 等 Vue 上下文。

```vue
<script setup lang="ts">
import { Notification } from '@aifuxi/semi-ui-vue/notification';

const [notification, NotificationHolder] = Notification.useNotification();
</script>

<template>
  <NotificationHolder />
  <button @click="notification.success({ title: '保存成功' })">保存</button>
</template>
```

## Accessibility

### ARIA

- 每条通知使用 `role="alert"`。
- 存在标题时，`aria-labelledby` 指向对应的标题 id。
- 关闭按钮可通过 `Tab` 聚焦，并使用 `Enter` 或 `Space` 激活。

模块与空 holder 支持 SSR-safe import/render；命令式展示方法只能在浏览器中调用。

## 文案规范

- 标题使用简洁明确的语言，避免不必要的逗号、句号等标点。
- 正文在信息完整的前提下压缩为一至两句话，解释标题而不是重复标题，并使用正确标点。
- 操作文案应明确说明操作的具体结果，例如“查看失败任务”，而不是泛化的“查看”。

固定上游在本节使用内部 `NotificationCard` 作静态排版示意；它不是公开导出，因此本站保留文案规则，不伪造公开组件示例。

## 设计变量

::token-table{component="notification"}
::

## React → Vue

| Semi React v2.102.0                                    | Vue 对齐 API                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| `Notification.info(options)`                           | `Notification.info(options)`                                    |
| `Notification.open/success/warning/error`              | 同名静态方法                                                    |
| `Notification.close(id)` / `destroyAll()`              | 同名静态方法                                                    |
| `Notification.config(options)`                         | 同名静态方法                                                    |
| `const [api, holder] = Notification.useNotification()` | 同样的 tuple；holder 是 Vue `Component`                         |
| `ReactNode` title/content/icon                         | Vue `VNodeChild`                                                |
| JSX `<>{holder}</>`                                    | 模板 `<NotificationHolder />` 或 render `h(NotificationHolder)` |
| React context inherited at holder                      | Vue provide/inject context inherited at holder                  |

命令式 API 不转换成 `v-model` 或组件 slots。`onCloseClick(id)` 先于 `onClose()`；关闭按钮会阻止卡片 `onClick` 冒泡。调用 `close(id)` 和 `destroyAll()` 是外部移除，不额外触发单条通知的 `onClose`，与固定 Adapter 一致。完整证据与差异裁决见 [对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/notification/alignment.md)。
