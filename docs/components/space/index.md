# Space 间距

用于在一组同级内容之间建立一致间距。实现基线为 Semi Design v2.102.0，并保留 `.semi-space-*` 与 `--semi-*` 样式兼容契约。

## 引入

```ts
import { Space } from '@workspace/ui';
import '@workspace/theme-default/space.css';
```

## 基本用法

```vue
<template>
  <Space>
    <button>确认</button>
    <button>取消</button>
  </Space>
</template>
```

## 间距、方向与换行

```vue
<Space spacing="medium">
  <ItemA />
  <ItemB />
</Space>

<Space :spacing="12" vertical>
  <ItemA />
  <ItemB />
</Space>

<Space :spacing="[12, 20]" wrap>
  <ItemA />
  <ItemB />
  <ItemC />
</Space>
```

数组的第 0 项控制水平间距，第 1 项控制垂直间距。`wrap` 只在水平方向生效；`vertical` 为 true 时不会输出换行 class。

## 对齐

```vue
<Space align="start">...</Space>
<Space align="center">...</Space>
<Space align="end">...</Space>
<Space align="baseline">...</Space>
```

## API

| 属性       | 类型                                                   | 默认值   | 说明                            |
| ---------- | ------------------------------------------------------ | -------- | ------------------------------- |
| `align`    | `start \| center \| end \| baseline`                   | `center` | 交叉轴对齐方式                  |
| `spacing`  | `tight \| medium \| loose \| number \| SpaceSpacing[]` | `tight`  | 间距预设、自定义值或水平/垂直值 |
| `vertical` | `boolean`                                              | `false`  | 是否使用垂直方向                |
| `wrap`     | `boolean`                                              | `false`  | 水平方向是否允许换行            |

原生 `class`、`style`、`id`、`role`、`aria-*` 和 `data-*` 通过 attrs 传给根 div。数字 spacing 会覆盖调用方 `style` 中同轴的 `column-gap` / `row-gap`，与固定 React Adapter 一致。

### Slots

| Slot      | 说明                                                  |
| --------- | ----------------------------------------------------- |
| `default` | 参与 flex 布局的同级内容；Fragment 会展开为直接子节点 |

## React → Vue 迁移

| React                 | Vue                          |
| --------------------- | ---------------------------- |
| `children`            | 默认 slot                    |
| `className` / `style` | 原生 `class` / `style` attrs |
| React ref             | Vue template ref             |

其余 prop 名、枚举值、数组顺序和默认值保持不变。
