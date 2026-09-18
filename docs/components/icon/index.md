# Icon 图标

图标包对齐 Semi Design v2.102.0：`@aifuxi/semi-icons-vue` 提供 `Icon` 基类与 523 个稳定图标，`@aifuxi/semi-icons-lab-vue` 提供 `Icon` 基类与 84 个 Lab 彩色图标；主 UI 包根入口与 `@aifuxi/semi-ui-vue/icon` 子路径都转发稳定 `Icon` 基类。图标保留固定 `<span role="img">` + `<svg>` 结构、class、尺寸 Token、旋转与双色契约。

## 基础使用

```vue
<script setup lang="ts">
import { IconHome, IconDelete } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <IconHome />
  <IconHome size="small" style="color: var(--semi-color-primary)" />
  <IconDelete aria-label="删除" />
</template>
```

根节点是 `span.semi-icon[role="img"]`，`aria-label` 缺省取图标 `type`（如 `home`）；内部 `svg` 固定 `viewBox="0 0 24 24"`、`width/height=1em`、`focusable="false"`、`aria-hidden="true"`，路径 `fill="currentColor"`，因此图标颜色跟随文字 `color`。

## 旋转、尺寸与动画

| 需求        | 写法                                                                 | 结果                                                   |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| 尺寸        | `size="extra-small" / "small" / "default" / "large" / "extra-large"` | 追加 `semi-icon-{size}`；`inherit` 不追加尺寸 class    |
| 旋转        | `:rotate="90"`                                                       | 根节点内联 `transform: rotate(90deg)`                  |
| 旋转动画    | `spin`                                                               | 追加 `semi-icon-spinning`（固定 `1s linear infinite`） |
| 颜色        | `style="color: …"` 或 `fill`                                         | `currentColor` 跟随文字色；`fill` 覆盖路径填充         |
| 双色 / 多色 | `:fill="['#0064fa', '#15c39a']"`                                     | 依次覆盖生成 SVG 的 path 填充                          |

## 自定义图标

```vue
<script setup lang="ts">
import { h } from 'vue';
import { Icon, convertIcon } from '@aifuxi/semi-icons-vue';

const CustomDot = convertIcon(
  ({ fill }) => h('circle', { cx: 12, cy: 12, fill, r: 4 }),
  'custom_dot',
);
</script>

<template>
  <Icon type="custom-dot" :svg="h('circle', { cx: 12, cy: 12, r: 4, fill: 'currentColor' })" />
  <CustomDot />
</template>
```

- `Icon` 基类的默认 slot / `svg` prop 接收自定义 SVG 节点，`type` 决定追加的图标 class 与缺省 `aria-label`。
- `convertIcon(renderSvg, iconType)` 生成一个继承 `Icon` 全部 props 的组件；`renderSvg` 接收 `{ fill }` 并返回 `VNode`，是稳定图标与 Lab 图标的生成方式。
- `prefixCls` 缺省 `semi`；自定义前缀时 class 变为 `{prefixCls}-icon*`。

## API

### Icon

| Prop        | 类型                                                                             | 默认值      |
| ----------- | -------------------------------------------------------------------------------- | ----------- |
| `fill`      | `string \| string[]`                                                             | -           |
| `prefixCls` | `string`                                                                         | `'semi'`    |
| `rotate`    | `number`                                                                         | -           |
| `size`      | `'inherit' \| 'extra-small' \| 'small' \| 'default' \| 'large' \| 'extra-large'` | `'default'` |
| `spin`      | `boolean`                                                                        | `false`     |
| `svg`       | `VNodeChild`                                                                     | -           |
| `type`      | `string`                                                                         | -           |

Slots：`default`（自定义 SVG 内容）。Exposed：`element`（根 `span` 的 ref）。

### convertIcon

`convertIcon(renderSvg: (props: { fill?: string | string[] }) => VNode, iconType: string)` 返回继承 `Icon` props 的组件，组件名由 `iconType` 转成 PascalCase。

### 图标导出

- `@aifuxi/semi-icons-vue`：default `Icon`、`convertIcon` 与 523 个命名图标（如 `IconHome`、`IconDelete`）。
- `@aifuxi/semi-icons-lab-vue`：default `Icon` 与 84 个 Lab 彩色图标。
- `@aifuxi/semi-ui-vue` 根入口与 `@aifuxi/semi-ui-vue/icon` 子路径转发稳定 `Icon` 基类，default 与 named 导出一致。

## 可访问性、主题与 SSR

- 语义图标通过 `role="img"` + `aria-label` 暴露名称；纯装饰图标应显式传 `aria-hidden="true"`，组件不擅自移除调用方的 ARIA 属性。
- 图标颜色使用 `currentColor`，light/dark 与主题 Token 通过文字色与 `--semi-*` 变量驱动；图标自身没有方向性行为，RTL 由父级排版决定。
- 图标是纯函数式渲染，无 Observer、Portal 或全局监听；导入与 SSR render 均不访问 DOM 全局。

## React → Vue

见 [React → Vue 迁移表](./react-to-vue.md)。完整公开行为、视觉与发布证据见[对齐矩阵](./alignment.md)。
