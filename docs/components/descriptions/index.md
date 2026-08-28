# Descriptions 描述列表

Descriptions 用稳定的键值结构展示对象详情。本实现只以本地 Semi Design v2.102.0 为对齐基线。

## 基础用法

```vue
<script setup lang="ts">
import { Descriptions } from '@workspace/ui';

const data = [
  { key: '用户名', value: 'Semi' },
  { key: '角色', value: '设计师' },
];
</script>

<template>
  <Descriptions :data="data" />
</template>
```

也可以使用复合组件和 Vue slots：

```vue
<Descriptions align="plain">
  <Descriptions.Item item-key="用户名">Semi</Descriptions.Item>
  <Descriptions.Item>
    <template #key><strong>角色</strong></template>
    设计师
  </Descriptions.Item>
</Descriptions>
```

## 双行与横向布局

```vue
<Descriptions row size="large" :data="data" />

<Descriptions layout="horizontal" :column="3">
  <Descriptions.Item item-key="项目" :span="2">Semi UI Vue</Descriptions.Item>
  <Descriptions.Item item-key="状态">Ready</Descriptions.Item>
  <Descriptions.Item item-key="负责人">Chen</Descriptions.Item>
</Descriptions>
```

横向布局先过滤 `hidden` 项，再按 `span` 累加分行。末行不足时，最后一个未显式设置 `span` 的 Item 会自动补满剩余列。

## API

### Descriptions

| 属性                  | 说明                          | 类型                                         | 默认值       |
| --------------------- | ----------------------------- | -------------------------------------------- | ------------ |
| `align`               | 键值对齐方式                  | `'center' \| 'justify' \| 'left' \| 'plain'` | `'center'`   |
| `row`                 | 是否双行显示                  | `boolean`                                    | `false`      |
| `size`                | 双行尺寸                      | `'small' \| 'medium' \| 'large'`             | `'medium'`   |
| `data`                | 描述项；非空时优先于默认 slot | `readonly DescriptionsDataItem[]`            | `[]`         |
| `layout`              | 列表布局                      | `'vertical' \| 'horizontal'`                 | `'vertical'` |
| `column`              | 横向布局每行总列数            | `number`                                     | `3`          |
| `className` / `style` | 根节点类名与样式              | Vue class / `StyleValue`                     | -            |

默认 slot 接收 `Descriptions.Item`。根节点还接收 Vue 原生 `class` / `style` 与 `data-*`。

### DescriptionsDataItem

| 属性       | 说明           | 类型                               | 默认值  |
| ---------- | -------------- | ---------------------------------- | ------- |
| `key`      | 键             | `VNodeChild`                       | -       |
| `value`    | 值或延迟值函数 | `VNodeChild \| (() => VNodeChild)` | -       |
| `hidden`   | 是否隐藏       | `boolean`                          | `false` |
| `span`     | 横向布局跨列数 | `number`                           | `1`     |
| `keyStyle` | 键样式         | `StyleValue`                       | -       |

### Descriptions.Item

| 属性 / slot           | 说明                                | 类型                     | 默认值  |
| --------------------- | ----------------------------------- | ------------------------ | ------- |
| `itemKey` / `#key`    | 键；slot 优先                       | `VNodeChild`             | -       |
| 默认 slot             | 值                                  | `VNodeChild`             | -       |
| `hidden`              | 是否隐藏                            | `boolean`                | `false` |
| `span`                | 横向布局跨列数                      | `number`                 | `1`     |
| `keyStyle`            | 键样式                              | `StyleValue`             | -       |
| `className` / `style` | vertical 模式 Item 的 tr 类名与样式 | Vue class / `StyleValue` | -       |

组件是静态语义 table，不注入键盘、焦点、ARIA role、Portal 或 Locale 文案。RTL 由 `ConfigProvider` / `.semi-rtl` 驱动。
