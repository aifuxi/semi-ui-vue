# Button 按钮

Button 对齐 Semi Design v2.102.0，保留 `.semi-button*` DOM/class、状态、图标/加载布局、主题 Token、RTL 与可访问性契约。公开入口为 `@aifuxi/semi-ui-vue` 根导出与 `@aifuxi/semi-ui-vue/button` 子路径，命名导出 `Button`、`ButtonGroup`、`SplitButtonGroup` 与 `BUTTON_*` 枚举常量。

## 基础使用

```vue
<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Button type="primary" theme="solid" @click="onSave">保存</Button>
  <Button type="danger" theme="light" disabled>删除</Button>
  <Button type="tertiary" theme="borderless">取消</Button>
</template>
```

`type` 缺省 `primary`（可选 `primary`/`secondary`/`tertiary`/`warning`/`danger`），`theme` 缺省 `light`（可选 `solid`/`borderless`/`light`/`outline`），`size` 缺省 `default`（可选 `default`/`small`/`large`）。

## 图标、加载与块级按钮

- 图标通过 `#icon` slot 或组件图标传入；`iconPosition`（`left`/`right`，缺省 `left`）控制图标与文字的相对位置，`icon-only` 场景由调用方提供 `aria-label`。
- `loading` 渲染固定 Spin 图标并自动禁用交互；`disabled` 同时输出原生 `disabled` 与 `aria-disabled="true"`，鼠标事件被抑制。
- `block` 撑满父级宽度；`circle` 输出圆形按钮；`noHorizontalPadding` 接受 `boolean` 或 `'left'`/`'right'` 及其数组，去掉对应方向的内边距。
- `colorful` 打开多彩 AI 风格，`type="primary"` 时使用固定渐变 Token；`contentClass` 作用于内容容器。
- `htmlType` 写到原生 `type` 属性，缺省 `button`（可选 `button`/`reset`/`submit`）。

## 按钮组合

```vue
<template>
  <ButtonGroup size="small" type="tertiary">
    <Button>复制</Button>
    <Button>粘贴</Button>
    <Button disabled>删除</Button>
  </ButtonGroup>
</template>
```

`ButtonGroup` 向直接子 `Button` 合并 `size`/`type`/`theme`/`colorful`/`disabled` 并在按钮之间插入固定分隔线；子按钮显式传入的同名 prop 优先，非 Button 子节点原样渲染。`theme="outline"` 时不插入分隔线（与固定 Adapter 一致）。

## 分裂按钮组

```vue
<template>
  <SplitButtonGroup aria-label="更多操作">
    <Button type="primary" theme="solid">保存</Button>
    <Button type="primary" theme="solid" icon="chevron-down" />
  </SplitButtonGroup>
</template>
```

`SplitButtonGroup` 输出 `role="group"` 的容器，并在挂载后监听子节点变化以合并相邻按钮的圆角与边框；`prefixCls` 缺省 `semi-button`。

## API

### Button

| Prop                   | 类型                                                                             | 默认值          |
| ---------------------- | -------------------------------------------------------------------------------- | --------------- |
| `type`                 | `'primary' \| 'secondary' \| 'tertiary' \| 'warning' \| 'danger'`                | `'primary'`     |
| `theme`                | `'solid' \| 'borderless' \| 'light' \| 'outline'`                                | `'light'`       |
| `size`                 | `'default' \| 'small' \| 'large'`                                                | `'default'`     |
| `block` / `circle`     | `boolean`                                                                        | `false`         |
| `loading` / `disabled` | `boolean`                                                                        | `false`         |
| `colorful`             | `boolean`                                                                        | `false`         |
| `iconPosition`         | `'left' \| 'right'`                                                              | `'left'`        |
| `iconSize`             | `'inherit' \| 'extra-small' \| 'small' \| 'default' \| 'large' \| 'extra-large'` | -               |
| `iconStyle`            | `StyleValue`                                                                     | -               |
| `noHorizontalPadding`  | `boolean \| 'left' \| 'right' \| 数组`                                           | `false`         |
| `contentClass`         | class                                                                            | -               |
| `htmlType`             | `'button' \| 'reset' \| 'submit'`                                                | `'button'`      |
| `prefixCls`            | `string`                                                                         | `'semi-button'` |

Slots：`default`（按钮内容）、`icon`（scoped，提供 `fill`/`iconSize`/`iconStyle`）。Events：`click`、`mousedown`、`mouseenter`、`mouseleave`，均携带原生 `MouseEvent`。

### ButtonGroup

| Prop                      | 类型                   | 默认值          |
| ------------------------- | ---------------------- | --------------- |
| `size` / `theme` / `type` | 与 Button 同名枚举一致 | -               |
| `colorful` / `disabled`   | `boolean`              | -               |
| `prefixCls`               | `string`               | `'semi-button'` |

### SplitButtonGroup

| Prop        | 类型     | 默认值          |
| ----------- | -------- | --------------- |
| `prefixCls` | `string` | `'semi-button'` |

## 可访问性与键盘

- 根节点是原生 `button`，键盘行为、焦点环与 `Enter`/`Space` 触发由浏览器提供；组件不额外添加 role 或 tabindex。
- `disabled` 会阻止点击与鼠标事件；图标按钮必须由调用方提供 `aria-label`，组件不猜测可访问名称。
- `ButtonGroup`/`SplitButtonGroup` 输出 `role="group"`，`aria-label` 透传到容器。

## 主题、RTL、SSR 与加载动效

- class 与 Token 沿用固定 `.semi-button*`；逐组件样式入口为 `@aifuxi/semi-theme-default/button.css`，编译顺序为 theme index → global → animation → button → iconButton → icons。
- RTL 由 ConfigProvider 的 `.semi-rtl` 控制图标间距与分隔线方向；按钮之间的分隔线不因方向改变宽度契约。
- 加载图标为固定 `600ms linear infinite` 旋转；`pnpm check:artifacts` 验证根/子路径 ESM、声明、`button.css`、SSR-safe import 与真实 tarball。

## React → Vue

见 [React → Vue 迁移表](./react-to-vue.md)。完整公开行为、视觉与发布证据见[对齐矩阵](./alignment.md)。
