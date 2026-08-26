# Divider 分割线

用于有逻辑地组织内容与页面区域。实现基线为 Semi Design v2.102.0，并保留 `.semi-divider-*` 与 `--semi-*` 样式兼容契约。

## 引入

```ts
import { Divider } from '@workspace/ui';
import '@workspace/theme-default/divider.css';
```

## 基本用法

```vue
<template>
  <span>上方内容</span>
  <Divider margin="12px" role="separator" aria-label="章节分隔" />
  <span>下方内容</span>

  <span>左</span>
  <Divider layout="vertical" dashed margin="12px" role="separator" aria-orientation="vertical" />
  <span>右</span>
</template>
```

## 包含内容

```vue
<Divider align="left" margin="12px">这是居左文字</Divider>
<Divider align="center" margin="12px">这是居中文字</Divider>
<Divider align="right" margin="12px">这是居右文字</Divider>

<Divider margin="12px">
  <StatusIcon />
</Divider>
```

垂直模式不渲染默认 slot，与固定 React Adapter 一致。

## API

| 属性     | 类型                      | 默认值       | 说明                               |
| -------- | ------------------------- | ------------ | ---------------------------------- |
| `align`  | `left \| right \| center` | `center`     | 水平且有内容时的内容对齐方式       |
| `dashed` | `boolean`                 | `false`      | 是否使用虚线                       |
| `layout` | `horizontal \| vertical`  | `horizontal` | 分割线方向                         |
| `margin` | `number \| string`        | -            | 水平模式上下间距、垂直模式左右间距 |

原生 `class`、`style`、`id`、`role`、`aria-*` 和 `data-*` 通过 attrs 传给根 div。调用方 `style` 会覆盖 `margin` 生成的同名轴向值。

### Slots

| Slot      | 说明                                                           |
| --------- | -------------------------------------------------------------- |
| `default` | 水平分割线内容；纯文本使用上游内部 span，自定义 VNode 直接输出 |

## React → Vue 迁移

| React                 | Vue                          |
| --------------------- | ---------------------------- |
| `children`            | 默认 slot                    |
| `className` / `style` | 原生 `class` / `style` attrs |
| React ref             | Vue template ref             |

其余 prop 名、枚举值和默认值保持不变。
