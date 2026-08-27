# Checkbox 复选框

Checkbox 用于在两个相反状态之间选择；CheckboxGroup 用于管理一组可多选项。Vue 版本对齐固定 Semi Design v2.102.0 的 DOM、状态、键盘、ARIA、卡片样式和事件顺序。

## 基本用法

```vue
<script setup lang="ts">
import { Checkbox, type CheckboxChangeEvent } from '@workspace/ui';

function changed(event: CheckboxChangeEvent) {
  console.log(event.target.checked);
}
</script>

<template>
  <Checkbox aria-label="Checkbox 示例" @change="changed">Semi Design</Checkbox>
</template>
```

`defaultChecked` 创建非受控状态；`v-model`、`modelValue` 或 `checked` 创建受控状态，`checked` 的兼容优先级最高。

```vue
<Checkbox default-checked>默认选中</Checkbox>
<Checkbox v-model="accepted">接受协议</Checkbox>
<Checkbox disabled>禁用</Checkbox>
<Checkbox indeterminate>部分选中</Checkbox>
```

## 辅助文本与卡片

```vue
<Checkbox extra="这是一段辅助说明">标题</Checkbox>

<CheckboxGroup type="card" :default-value="['design']">
  <Checkbox value="design" extra="设计系统">Semi Design</Checkbox>
  <Checkbox value="vue" extra="Vue 组件实现">Semi UI Vue</Checkbox>
</CheckboxGroup>
```

`pureCard` 隐藏可见方框，但保留原生 input、键盘焦点与无障碍语义。

## CheckboxGroup

```vue
<CheckboxGroup
  v-model="selected"
  :options="['Semi UI', 'Semi DSM', 'Semi D2C']"
  direction="horizontal"
  aria-label="产品选择"
/>
```

也可以在默认 slot 中声明 Checkbox；只有显式提供 `value` 的 Checkbox 才加入最近的 Group。`0`、`false` 和空字符串都是有效组值。

## React → Vue

| React v2.102.0                     | Vue                                                 |
| ---------------------------------- | --------------------------------------------------- |
| `checked` / `onChange`             | `v-model` 或 `:checked` + `@change`                 |
| `defaultChecked`                   | `default-checked`                                   |
| `children`                         | 默认 slot                                           |
| `extra`                            | `extra` prop 或 `#extra` slot                       |
| `<Checkbox.Group>`                 | `<CheckboxGroup>`；脚本中也保留 `Checkbox.Group`    |
| Group `value` / `onChange`         | `v-model` 或 `:value` + `@change`                   |
| option `label` / `extra` ReactNode | VNodeChild；复杂内容优先写默认/extra slot           |
| `className` / `style`              | Vue 原生 `class` / `style`                          |
| `ref.current.focus()`              | 组件 ref 的 `focus()`；同时公开 `blur()` 和 `input` |

## 公开类型

Checkbox 提供 `checked/modelValue/defaultChecked/disabled/indeterminate/value/type/extra/addonId/extraId/preventScroll` 与 ARIA props，发出 `change`、`update:checked`、`update:modelValue`。CheckboxGroup 提供 `value/modelValue/defaultValue/options/disabled/name/direction/type`，发出 `change`、`update:value`、`update:modelValue`。

完整源码证据、事件顺序、VNode 门禁、SSR 与视觉矩阵见 [对齐矩阵](./alignment.md)。
