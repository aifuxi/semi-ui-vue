# Tooltip 文字提示

Tooltip 在悬停、聚焦、点击或右键时展示补充信息。本实现以本地 Semi Design v2.102.0 为唯一基线，保留固定 DOM class、Portal、方位、延迟、键盘与 ARIA 契约。

## 基本用法

```vue
<script setup lang="ts">
import { Tooltip, Button } from '@workspace/ui';
import '@workspace/theme-default/tooltip.css';
</script>

<template>
  <Tooltip content="复制链接">
    <Button>Hover me</Button>
  </Tooltip>
</template>
```

## 受控显示与内容插槽

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';

const visible = shallowRef(false);
</script>

<template>
  <Tooltip v-model:visible="visible" trigger="click" position="bottomRight">
    <template #content="{ initialFocusRef }">
      <button :ref="initialFocusRef">首个操作</button>
    </template>
    <button>打开</button>
  </Tooltip>
</template>
```

## API

| 属性                                  | 说明                                   | 类型                                                         | 默认值                  |
| ------------------------------------- | -------------------------------------- | ------------------------------------------------------------ | ----------------------- |
| `content`                             | 提示内容；复杂内容推荐 `content` slot  | `VNodeChild`                                                 | -                       |
| `visible`                             | 受控可见状态，支持 `v-model:visible`   | `boolean`                                                    | -                       |
| `trigger`                             | 触发方式                               | `'hover' \| 'focus' \| 'click' \| 'custom' \| 'contextMenu'` | `'hover'`               |
| `position`                            | 12 个常规方位及 4 个 `*Over` 方位      | `TooltipPosition`                                            | `'top'`                 |
| `mouseEnterDelay` / `mouseLeaveDelay` | 悬停显示/隐藏延迟（毫秒）              | `number`                                                     | `50`                    |
| `showArrow`                           | 是否显示默认箭头，也可传 VNode         | `boolean \| VNodeChild`                                      | `true`                  |
| `spacing`                             | trigger 与弹层间距                     | `number \| { x; y }`                                         | `8`                     |
| `margin`                              | 定位边距                               | `number \| TooltipMargin`                                    | `0`                     |
| `autoAdjustOverflow`                  | 越界时自动翻转/收缩 placement          | `boolean`                                                    | `true`                  |
| `getPopupContainer`                   | 返回 Portal 容器                       | `() => HTMLElement`                                          | ConfigProvider / `body` |
| `keepDOM`                             | 关闭后保留弹层 DOM 并隐藏              | `boolean`                                                    | `false`                 |
| `closeOnEsc` / `guardFocus`           | Escape 关闭与弹层焦点循环              | `boolean`                                                    | `false`                 |
| `role`                                | 弹层角色；`dialog` 会改变 trigger ARIA | `string`                                                     | `'tooltip'`             |
| `class` / `style`                     | 弹层 wrapper 的 class/style            | Vue class / style                                            | -                       |
| `wrapperClassName`                    | 特殊 trigger 外层 span class           | Vue class                                                    | -                       |
| `wrapperId`                           | 稳定 popup id                          | `string`                                                     | 自动生成                |
| `zIndex`                              | Portal 层级                            | `number`                                                     | `1060`                  |

| 事件             | 载荷                     | 说明                    |
| ---------------- | ------------------------ | ----------------------- |
| `visibleChange`  | `(visible: boolean)`     | 可见状态变化            |
| `update:visible` | `(visible: boolean)`     | `v-model:visible` 更新  |
| `clickOutside`   | `(event: MouseEvent)`    | 点击弹层与 trigger 之外 |
| `escKeydown`     | `(event: KeyboardEvent)` | Escape 关闭通知         |
| `afterClose`     | `()`                     | 退出动效和 DOM 处理完成 |

| Slot      | 说明                             |
| --------- | -------------------------------- |
| `default` | trigger 内容                     |
| `content` | 提示内容，接收 `initialFocusRef` |
| `arrow`   | 自定义箭头                       |

组件实例公开 `focusTrigger()`、`rePosition()` 与 `getPopupId()`。完整源码证据、事件顺序、SSR 和 React→Vue 迁移见 [对齐矩阵](./alignment.md)。
