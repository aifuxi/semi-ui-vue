# Descriptions

Descriptions presents object details as stable key/value structures. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue';

const data = [
  { key: 'User', value: 'Semi' },
  { key: 'Role', value: 'Designer' },
];
</script>

<template>
  <Descriptions :data="data" />
</template>
```

The compound Item API also has native Vue slots:

```vue
<Descriptions align="plain">
  <Descriptions.Item item-key="User">Semi</Descriptions.Item>
  <Descriptions.Item>
    <template #key><strong>Role</strong></template>
    Designer
  </Descriptions.Item>
</Descriptions>
```

## Double-row and horizontal layouts

```vue
<Descriptions row size="large" :data="data" />

<Descriptions layout="horizontal" :column="3">
  <Descriptions.Item item-key="Project" :span="2">Semi UI Vue</Descriptions.Item>
  <Descriptions.Item item-key="Status">Ready</Descriptions.Item>
  <Descriptions.Item item-key="Owner">Chen</Descriptions.Item>
</Descriptions>
```

Horizontal layout filters hidden items before accumulating `span`. If the last row is short, its last Item fills the remaining columns when no explicit `span` was supplied.

## API

### Descriptions

| Property              | Description                                                   | Type                                         | Default      |
| --------------------- | ------------------------------------------------------------- | -------------------------------------------- | ------------ |
| `align`               | Key/value alignment                                           | `'center' \| 'justify' \| 'left' \| 'plain'` | `'center'`   |
| `row`                 | Enables double-row display                                    | `boolean`                                    | `false`      |
| `size`                | Double-row size                                               | `'small' \| 'medium' \| 'large'`             | `'medium'`   |
| `data`                | Items; a non-empty array takes priority over the default slot | `readonly DescriptionsDataItem[]`            | `[]`         |
| `layout`              | List layout                                                   | `'vertical' \| 'horizontal'`                 | `'vertical'` |
| `column`              | Total columns per horizontal row                              | `number`                                     | `3`          |
| `className` / `style` | Root class and style                                          | Vue class / `StyleValue`                     | -            |

The default slot accepts `Descriptions.Item`. The root also accepts native Vue `class` / `style` and `data-*` attributes.

### DescriptionsDataItem

| Property   | Description                  | Type                               | Default |
| ---------- | ---------------------------- | ---------------------------------- | ------- |
| `key`      | Key content                  | `VNodeChild`                       | -       |
| `value`    | Value or lazy value function | `VNodeChild \| (() => VNodeChild)` | -       |
| `hidden`   | Hides the item               | `boolean`                          | `false` |
| `span`     | Horizontal column span       | `number`                           | `1`     |
| `keyStyle` | Key style                    | `StyleValue`                       | -       |

### Descriptions.Item

| Property / slot       | Description                                | Type                     | Default |
| --------------------- | ------------------------------------------ | ------------------------ | ------- |
| `itemKey` / `#key`    | Key content; the slot wins                 | `VNodeChild`             | -       |
| default slot          | Value content                              | `VNodeChild`             | -       |
| `hidden`              | Hides the item                             | `boolean`                | `false` |
| `span`                | Horizontal column span                     | `number`                 | `1`     |
| `keyStyle`            | Key style                                  | `StyleValue`             | -       |
| `className` / `style` | Item tr class and style in vertical layout | Vue class / `StyleValue` | -       |

The component is a static semantic table. It adds no keyboard, focus, ARIA role, Portal, or locale text. RTL is driven by `ConfigProvider` / `.semi-rtl`.
