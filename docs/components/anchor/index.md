# Anchor 锚点

Anchor 为长页面提供章节导航，并在滚动时同步当前章节。本实现以本地 Semi Design v2.102.0 为唯一基线。

## 基本用法

```vue
<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/anchor.css';
</script>

<template>
  <Anchor aria-label="文章目录">
    <AnchorLink href="#overview" title="概览" />
    <AnchorLink href="#usage" title="用法">
      <AnchorLink href="#api" title="API" />
    </AnchorLink>
  </Anchor>
</template>
```

也可以使用复合组件写法：`<Anchor.Link href="#overview" title="概览" />`。

## 滚动容器、折叠与提示

```vue
<script setup lang="ts">
const getContainer = () => document.querySelector<HTMLElement>('.article')!;
</script>

<template>
  <Anchor
    auto-collapse
    scroll-motion
    show-tooltip
    position="right"
    rail-theme="tertiary"
    :get-container="getContainer"
    :offset-top="80"
    :target-offset="80"
    :max-width="180"
    @change="(current, previous) => console.log(current, previous)"
    @click="(event, current) => console.log(event, current)"
  >
    <AnchorLink href="#one" title="第一章">
      <AnchorLink href="#one-detail" title="第一章详情" />
    </AnchorLink>
    <AnchorLink disabled href="#disabled" title="不可跳转" />
  </Anchor>
</template>
```

`getContainer` 必须返回实际发生滚动的 Element 或 Window。`offsetTop` 用于判断当前章节，`targetOffset` 用于点击后的目标位置。

## API

### Anchor

| 属性                | 说明                              | 类型                                 | 默认值      |
| ------------------- | --------------------------------- | ------------------------------------ | ----------- |
| `autoCollapse`      | 仅展开当前链接所在的嵌套链        | `boolean`                            | `false`     |
| `className`         | Semi 兼容类名；也支持 Vue `class` | `string`                             | `''`        |
| `defaultAnchor`     | 客户端挂载后的初始高亮锚点        | `string`                             | `''`        |
| `getContainer`      | 获取滚动容器                      | `() => HTMLElement \| Window`        | `window`    |
| `maxHeight`         | 根节点最大高度，数值按 px         | `string \| number`                   | `'750px'`   |
| `maxWidth`          | 根节点最大宽度，数值按 px         | `string \| number`                   | `'200px'`   |
| `offsetTop`         | 滚动激活判定的顶部偏移            | `number`                             | `0`         |
| `position`          | Tooltip 位置                      | `AnchorPosition`                     | -           |
| `railTheme`         | 滑轨主题                          | `'primary' \| 'tertiary' \| 'muted'` | `'primary'` |
| `scrollMotion`      | 点击时使用平滑滚动                | `boolean`                            | `false`     |
| `showTooltip`       | 省略标题的 Tooltip 开关或配置     | `boolean \| TypographyShowTooltip`   | `false`     |
| `size`              | 尺寸                              | `'small' \| 'default'`               | `'default'` |
| `style`             | 根节点样式                        | `CSSProperties`                      | -           |
| `targetOffset`      | 点击滚动的顶部偏移                | `number`                             | `0`         |
| `aria-*` / `data-*` | 透传到 `role=navigation` 根节点   | 对应 HTML 属性                       | -           |

| 事件     | 载荷                          | 说明                                     |
| -------- | ----------------------------- | ---------------------------------------- |
| `change` | `(currentLink, previousLink)` | 当前锚点变化；重复点击同一链接不重复触发 |
| `click`  | `(event, currentLink)`        | 点击或 keypress 可用链接                 |

### AnchorLink / Anchor.Link

| 属性        | 说明                            | 类型            | 默认值  |
| ----------- | ------------------------------- | --------------- | ------- |
| `href`      | 目标 CSS selector，通常为 `#id` | `string`        | `'#'`   |
| `title`     | 标题；Vue 模板推荐同名 slot     | `VNodeChild`    | `''`    |
| `disabled`  | 禁止激活和滚动                  | `boolean`       | `false` |
| `className` | 链接项类名；也支持 Vue `class`  | `string`        | `''`    |
| `style`     | 链接项样式                      | `CSSProperties` | -       |

| Slot                 | 说明            |
| -------------------- | --------------- |
| `Anchor.default`     | 顶层 AnchorLink |
| `AnchorLink.default` | 嵌套 AnchorLink |
| `AnchorLink.title`   | 自定义标题内容  |

## React → Vue 迁移

| React v2.102.0                     | Vue                                         |
| ---------------------------------- | ------------------------------------------- |
| `<Anchor><Anchor.Link /></Anchor>` | 原样支持；也可显式导入 `AnchorLink`         |
| `children`                         | 默认 slot                                   |
| `title={<Custom />}`               | `#title` slot 或 `VNodeChild` prop          |
| `onChange` / `onClick`             | `@change` / `@click`                        |
| `className` / `style`              | 保留兼容 prop，也支持 Vue `class` / `style` |

完整源码证据、事件顺序、滚动、RTL、SSR 与 deviation 见 [对齐矩阵](./alignment.md)。
