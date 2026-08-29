# Notification 通知

Notification 用于主动向用户展示较完整的异步结果或状态提醒。Vue 版本对齐 Semi Design v2.102.0 的命令式 API、六种位置、自动关闭、更新、主题、动效、ARIA 与局部上下文 holder。

## 基础用法

```ts
import { Notification } from '@workspace/ui';
import '@workspace/theme-default/notification.css';

const id = Notification.info({
  title: '任务已完成',
  content: '400 个任务成功，600 个任务失败。',
});

Notification.close(id);
```

`open` 展示 default 类型；`info`、`success`、`warning` 和 `error` 提供对应的默认图标与状态色。所有展示方法都返回通知 id。

## 更新同一条通知

传入已有 id 会更新原通知而不是创建新 DOM，并从更新时刻重新计算自动关闭时间。

```ts
const id = Notification.open({ title: '处理中', content: '正在同步数据', duration: 10 });

Notification.open({ id, title: '同步完成', content: '数据已经更新', duration: 3 });
```

## 位置、主题与容器

```ts
Notification.warning({
  title: '配置即将过期',
  content: '请在四天内更新访问凭证。',
  position: 'bottomLeft',
  theme: 'light',
  getPopupContainer: () => document.querySelector('#notification-root')!,
});
```

支持 `top`、`topLeft`、`topRight`、`bottom`、`bottomLeft`、`bottomRight`。命令式通知共享首个 wrapper：`getPopupContainer` 与 `zIndex` 只在第一次创建 wrapper 时生效；`destroyAll()` 后再次展示会重新解析容器。

## 全局配置

```ts
Notification.config({ position: 'top', top: 24, duration: 5, zIndex: 1200 });
```

单次 options 的优先级高于 `semiGlobal.config.overrideDefaultProps.Notification`，后者高于 `Notification.config` 和内置默认值。

## 局部上下文

```vue
<script setup lang="ts">
import { Notification } from '@workspace/ui';

const [notification, NotificationHolder] = Notification.useNotification();

function show() {
  notification.success({ title: '保存成功', content: '设置已经生效。' });
}
</script>

<template>
  <NotificationHolder />
  <button type="button" @click="show">保存</button>
</template>
```

holder 放在 `ConfigProvider` 内时会继承 direction 等 Vue 上下文。固定 v2.102.0 默认配置已经写入 `topRight`；RTL 会改变卡片方向，但如果希望位置镜像到左侧，应显式传 `topLeft`。

## API

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

静态方法：`open`、`info`、`success`、`warning`、`error`、`close`、`destroyAll`、`config`、`useNotification`。

## 可访问性与服务端渲染

每条通知使用 `role="alert"`，存在标题时通过 `aria-labelledby` 关联标题。close Button 可通过键盘聚焦和激活。模块和空 holder 支持 SSR-safe import/render；命令式展示只能在浏览器执行。

完整证据、事件顺序和差异裁决见 [对齐矩阵](./alignment.md) 与 [React → Vue 迁移](./react-to-vue.md)。
