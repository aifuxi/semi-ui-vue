# Card 卡片

Card 是承载标题、封面、正文、操作和页脚的容器。本实现对齐本地 Semi Design `v2.102.0`，保留 `.semi-card*` DOM/class、默认值、loading、暗色与 RTL 契约。

## 基础用法

```vue
<script setup lang="ts">
import { Card, Text } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/card.css';
</script>

<template>
  <Card title="Semi Design" :style="{ maxWidth: '360px' }">
    <template #headerExtraContent><Text link>更多</Text></template>
    Semi Design 帮助设计师与开发者打造高质量、体验一致的 Web 应用。
  </Card>
</template>
```

## 完整内容与 Meta

```vue
<Card footer-line shadows="always">
  <template #title>
    <CardMeta title="Semi Doc" description="全面、易用、优质">
      <template #avatar><Avatar color="blue">SD</Avatar></template>
    </CardMeta>
  </template>
  <template #cover><img src="/cover.png" alt="示例封面" /></template>
  卡片正文
  <template #actions>
    <Button theme="borderless">查看详情</Button>
    <Button theme="solid">开始使用</Button>
  </template>
  <template #footer>页脚</template>
</Card>
```

`#header` 会覆盖 `#title` 与 `#headerExtraContent`。`#actions` 的每个顶层节点都会获得固定操作项包装和 12px 间距。

## 加载与卡片组

```vue
<Card :loading="loading">加载完成后的正文</Card>

<CardGroup :spacing="[12, 20]">
  <Card title="A">内容 A</Card>
  <Card title="B">内容 B</Card>
</CardGroup>

<CardGroup type="grid">
  <Card title="A">内容 A</Card>
  <Card title="B">内容 B</Card>
</CardGroup>
```

`loading` 只替换存在的正文，操作组仍保留。`type="grid"` 会覆盖 `spacing` 并以 -1px 边距合并相邻边框。

## Card API

| 属性                 | 类型                    | 默认值    | 说明                                              |
| -------------------- | ----------------------- | --------- | ------------------------------------------------- |
| `actions`            | `readonly VNodeChild[]` | -         | render function 操作数组；模板优先使用 `#actions` |
| `bodyStyle`          | `StyleValue`            | -         | 正文 style                                        |
| `bordered`           | `boolean`               | `true`    | 外边框                                            |
| `cover`              | `VNodeChild`            | -         | 封面；`#cover` 优先                               |
| `footer`             | `VNodeChild`            | -         | 页脚；`#footer` 优先                              |
| `footerLine`         | `boolean`               | `false`   | 页脚分隔线                                        |
| `footerStyle`        | `StyleValue`            | -         | 页脚 style                                        |
| `header`             | `VNodeChild`            | -         | 完整头部；`#header` 优先且覆盖标题/额外内容       |
| `headerExtraContent` | `VNodeChild`            | -         | 标题额外内容；同名 slot 优先                      |
| `headerLine`         | `boolean`               | `true`    | 标题分隔线                                        |
| `headerStyle`        | `StyleValue`            | -         | 标题区 style                                      |
| `loading`            | `boolean`               | `false`   | 正文内置占位与 `aria-busy`                        |
| `shadows`            | `'hover'                | 'always'` | -                                                 | 悬浮或常驻阴影 |
| `title`              | `VNodeChild`            | -         | 标题；`#title` 优先                               |

根节点同时接收 Vue `class`、`style`、`aria-*`、`data-*` 和原生事件。

## CardMeta / CardGroup API

- `CardMeta`：`avatar`、`title`、`description` props 或同名 slots；也可通过 `Card.Meta` 使用。
- `CardGroup`：`spacing?: number | readonly number[]`，Adapter 源码默认值为 `16`；`type?: 'grid'`。上游文档表格写 12px，但固定运行时源码是 16，本实现以源码为准。

## 无障碍、RTL 与 SSR

Card 支持原生 `aria-label`，loading 时输出 `aria-busy="true"`。容器本身不增加 tabindex 或键盘状态机，内部交互元素遵循各自契约。组件支持 light/dark、`.semi-rtl`，且导入与服务端渲染不访问 DOM。
