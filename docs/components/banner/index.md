# Banner 通知横幅

Banner 用于展示全页或容器级状态与通知。本实现以本地 Semi Design v2.102.0 为唯一基线，保留四种类型、固定 DOM/class、关闭行为、主题、RTL 和无障碍契约。

## 基本用法

```vue
<script setup lang="ts">
import { Banner } from '@workspace/ui';
import '@workspace/theme-default/banner.css';
</script>

<template>
  <Banner description="新版本已经可用" @close="handleClose" />
</template>
```

## 容器模式与自定义内容

```vue
<template>
  <Banner :full-mode="false" bordered type="warning">
    <template #title>配置尚未完成</template>
    <template #description>请补充应用标识后再发布。</template>
    <button>立即配置</button>
  </Banner>
</template>
```

`:icon="null"` 会移除状态图标，`:close-icon="null"` 会移除整个关闭按钮。

## API

| 属性                  | 说明                                  | 类型                                           | 默认值      |
| --------------------- | ------------------------------------- | ---------------------------------------------- | ----------- |
| `type`                | 通知类型                              | `'info' \| 'success' \| 'danger' \| 'warning'` | `'info'`    |
| `fullMode`            | 是否使用全屏模式                      | `boolean`                                      | `true`      |
| `bordered`            | 非全屏模式下是否显示边框              | `boolean`                                      | `false`     |
| `title`               | 标题内容；同名 slot 优先              | `VNodeChild`                                   | -           |
| `description`         | 描述内容；同名 slot 优先              | `VNodeChild`                                   | -           |
| `icon`                | 自定义状态图标；`null` 时隐藏         | `VNodeChild`                                   | 按 type     |
| `closeIcon`           | 自定义关闭图标；`null` 时隐藏关闭按钮 | `VNodeChild`                                   | `IconClose` |
| `class` / `className` | 根 alert 的 Vue/兼容 class            | Vue class                                      | -           |
| `style`               | 根 alert 的内联样式                   | `StyleValue`                                   | -           |

| 事件    | 载荷                  | 说明                                      |
| ------- | --------------------- | ----------------------------------------- |
| `close` | `(event: MouseEvent)` | 点击关闭按钮时触发；回调后移除 Banner DOM |

| Slot          | 说明                            |
| ------------- | ------------------------------- |
| `default`     | 额外操作或自定义内容            |
| `title`       | 标题，覆盖 `title` prop         |
| `description` | 描述，覆盖 `description` prop   |
| `icon`        | 状态图标，覆盖 `icon` prop      |
| `closeIcon`   | 关闭图标，覆盖 `closeIcon` prop |

## 无障碍与 SSR

- 根节点固定为 `role="alert"`。
- 默认关闭按钮的 `aria-label` 为 `Close`，支持 Tab 聚焦以及 Enter/Space 激活。
- SSR 输出完整初始 Banner；Foundation 仅在客户端挂载后初始化，不在 import 阶段访问 DOM。

## React → Vue

完整迁移映射见 [react-to-vue.md](./react-to-vue.md)，源码证据和验收矩阵见 [alignment.md](./alignment.md)。
