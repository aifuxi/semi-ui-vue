# Switch 开关

Switch 用于在两个互斥状态之间切换。本实现以本地 Semi Design v2.102.0 为唯一基线，保留原生 checkbox、键盘和 ARIA 行为。

## 基本用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Switch } from '@workspace/ui';
import '@workspace/theme-default/switch.css';

const enabled = shallowRef(false);
</script>

<template>
  <Switch v-model="enabled" aria-label="启用通知" />
</template>
```

也可以保留 Semi 的受控写法：

```vue
<Switch :checked="enabled" @change="(checked) => (enabled = checked)" />
```

## 尺寸、文本与状态

```vue
<template>
  <Switch size="small" aria-label="小尺寸" />
  <Switch default-checked checked-text="开" unchecked-text="关" />
  <Switch size="large" default-checked>
    <template #checkedText>ON</template>
    <template #uncheckedText>OFF</template>
  </Switch>
  <Switch disabled aria-label="不可修改" />
  <Switch loading default-checked aria-label="正在保存" />
</template>
```

`small` 尺寸不会渲染内嵌文本。较长说明应放在 Switch 外部。

## API

| 属性             | 说明                                                  | 类型                              | 默认值      |
| ---------------- | ----------------------------------------------------- | --------------------------------- | ----------- |
| `modelValue`     | `v-model` 当前状态                                    | `boolean`                         | -           |
| `checked`        | Semi 兼容的受控状态；与 `modelValue` 同时存在时优先   | `boolean`                         | -           |
| `defaultChecked` | 非受控初始状态                                        | `boolean`                         | `false`     |
| `disabled`       | 是否禁用                                              | `boolean`                         | `false`     |
| `loading`        | 是否显示加载状态并禁用 input                          | `boolean`                         | `false`     |
| `size`           | 尺寸                                                  | `'large' \| 'default' \| 'small'` | `'default'` |
| `checkedText`    | 开启时内容，Vue 模板推荐同名 slot                     | `VNodeChild`                      | -           |
| `uncheckedText`  | 关闭时内容，Vue 模板推荐同名 slot                     | `VNodeChild`                      | -           |
| `id`             | 原生 input id                                         | `string`                          | -           |
| `aria-*`         | label、labelledby、describedby、invalid、errormessage | 对应 ARIA 类型                    | -           |

| 事件                | 载荷                               | 说明                   |
| ------------------- | ---------------------------------- | ---------------------- |
| `change`            | `(checked: boolean, event: Event)` | 状态请求变化           |
| `update:checked`    | `(checked: boolean)`               | `v-model:checked` 更新 |
| `update:modelValue` | `(checked: boolean)`               | 默认 `v-model` 更新    |

| Slot            | 说明             |
| --------------- | ---------------- |
| `checkedText`   | 开启时的内嵌内容 |
| `uncheckedText` | 关闭时的内嵌内容 |

完整源码、DOM、事件顺序、RTL、SSR 与 React→Vue 迁移见 [对齐矩阵](./alignment.md)。
