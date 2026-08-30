# Collapse 折叠面板

`Collapse` 用于把相关内容分组为可展开面板。它支持同时展开多项、手风琴模式、受控状态、禁用项、左右图标与延迟渲染。

## 基本用法

```vue
<script setup lang="ts">
import { Collapse, CollapsePanel } from '@workspace/ui/collapse';
import '@workspace/theme-default/collapse.css';
</script>

<template>
  <Collapse default-active-key="overview">
    <CollapsePanel item-key="overview" header="概览"> 概览内容 </CollapsePanel>
    <CollapsePanel item-key="quality" header="质量门禁"> 质量门禁内容 </CollapsePanel>
  </Collapse>
</template>
```

也可以使用 compound API：`<Collapse.Panel />`。在 Vue SFC 模板中，具名导出的 `CollapsePanel` 对类型检查更直接。

## 手风琴与受控状态

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Collapse, CollapsePanel } from '@workspace/ui/collapse';

const activeKeys = ref<string[]>(['one']);
</script>

<template>
  <Collapse v-model:active-key="activeKeys" accordion>
    <CollapsePanel item-key="one" header="第一项">内容一</CollapsePanel>
    <CollapsePanel item-key="two" header="第二项">内容二</CollapsePanel>
  </Collapse>
</template>
```

交互时先触发 `change`，再触发 `update:activeKey`。与固定 React 基线一致，事件值始终是 key 数组，即使启用了 `accordion`。

## 自定义标题和图标

```vue
<Collapse expand-icon-position="left" :click-header-to-expand="false">
  <template #expandIcon>+</template>
  <template #collapseIcon>−</template>

  <CollapsePanel item-key="details">
    <template #header><strong>详情</strong></template>
    <p>只有图标热区负责切换。</p>
  </CollapsePanel>
</Collapse>
```

字符串 `header` 会自动生成右侧区域并显示 `extra`。使用 `#header` 或 VNode `header` 时，标题节点由调用方完整控制；固定 v2.102.0 不会自动插入 `extra`。

## Collapse API

| 属性                          | 说明                                  | 类型                 | 默认值       |
| ----------------------------- | ------------------------------------- | -------------------- | ------------ |
| `activeKey`                   | 当前展开项；支持 `v-model:active-key` | `string \| string[]` | -            |
| `defaultActiveKey`            | 非受控初始展开项                      | `string \| string[]` | `''`         |
| `accordion`                   | 是否最多展开一项                      | `boolean`            | `false`      |
| `clickHeaderToExpand`         | 是否允许点击整行标题切换              | `boolean`            | `true`       |
| `expandIcon` / `collapseIcon` | 展开/收起图标，也可使用同名 slot      | `VNodeChild`         | Chevron 图标 |
| `expandIconPosition`          | 图标位置                              | `'left' \| 'right'`  | `'right'`    |
| `keepDOM`                     | 收起后是否保留内容 DOM                | `boolean`            | `false`      |
| `motion`                      | 是否启用高度过渡                      | `boolean`            | `true`       |
| `lazyRender`                  | 与 `keepDOM` 配合，首次展开前不渲染   | `boolean`            | `false`      |
| `className` / `style`         | 根节点 class 与样式                   | Vue class/style      | -            |

| 事件               | 说明                      | 参数                                       |
| ------------------ | ------------------------- | ------------------------------------------ |
| `change`           | 展开集合发生交互变化      | `(activeKey: string[], event: MouseEvent)` |
| `update:activeKey` | `v-model:active-key` 更新 | `(activeKey: string[])`                    |

默认 slot 放置 `CollapsePanel`。

## CollapsePanel API

| 属性                  | 说明                                      | 类型               | 默认值  |
| --------------------- | ----------------------------------------- | ------------------ | ------- |
| `itemKey`             | 面板唯一 key                              | `string`           | 必填    |
| `header`              | 标题，也可使用 `#header`                  | `VNodeChild`       | -       |
| `extra`               | 字符串标题右侧附加内容，也可使用 `#extra` | `VNodeChild`       | -       |
| `showArrow`           | 是否显示箭头                              | `boolean`          | `true`  |
| `disabled`            | 是否禁用切换                              | `boolean`          | `false` |
| `reCalcKey`           | 变化时让内容重新测量高度                  | `number \| string` | -       |
| `className` / `style` | Panel 根节点 class 与样式                 | Vue class/style    | -       |

`motion-end` 在内容高度过渡结束后触发。默认 slot 是面板内容；组件保留固定基线的 `role="button"`、`tabindex="0"` 和 ARIA 属性。v2.102.0 本身没有 Enter/Space 切换处理，Vue 版本不额外改变这一行为。
