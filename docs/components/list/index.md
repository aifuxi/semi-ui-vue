# List 列表

List 用于连续展示同类数据。本实现只以本地 Semi Design v2.102.0 为对齐基线，保留固定 `.semi-list*` DOM/class、Grid、loading、Locale、暗色和 RTL 契约。

## 基础用法

```vue
<script setup lang="ts">
import { List, ListItem } from '@workspace/ui';

const users = ['Alice', 'Bob'];
</script>

<template>
  <List :data-source="users" bordered>
    <template #item="{ item, index }">
      <ListItem :header="`${index + 1}.`" :main="item" />
    </template>
  </List>
</template>
```

也可以使用声明式默认 slot：

```vue
<List size="small">
  <ListItem>第一项</ListItem>
  <ListItem>第二项</ListItem>
</List>
```

## 区域、Grid 与 loading

```vue
<List :data-source="users" :grid="{ gutter: 12, span: 12 }" loading>
  <template #header>成员</template>
  <template #item="{ item }"><ListItem>{{ item }}</ListItem></template>
  <template #footer>共 {{ users.length }} 项</template>
  <template #loadMore><button>加载更多</button></template>
</List>
```

## List API

| 属性                  | 类型                          | 默认值        | 说明                                        |
| --------------------- | ----------------------------- | ------------- | ------------------------------------------- |
| `bordered`            | `boolean`                     | `false`       | 是否显示边框                                |
| `dataSource`          | `readonly T[]`                | -             | 数据源；非空时逐项调用 item slot/renderItem |
| `emptyContent`        | `VNodeChild`                  | Locale 文案   | 自定义空态；也可用 `#emptyContent`          |
| `footer` / `header`   | `VNodeChild`                  | -             | 顶/底部内容；也可用同名 slot                |
| `grid`                | `ListGrid`                    | -             | Row/Col 栅格配置                            |
| `layout`              | `'vertical'                   | 'horizontal'` | `'vertical'`                                | 列表方向    |
| `loading`             | `boolean`                     | `false`       | 显示 large Spin 并降低内容透明度            |
| `loadMore`            | `VNodeChild`                  | -             | 根底部加载更多内容；也可用 `#loadMore`      |
| `renderItem`          | `(item, index) => VNodeChild` | -             | 函数式渲染；模板优先使用 `#item`            |
| `size`                | `'small'                      | 'default'     | 'large'`                                    | `'default'` | 尺寸 |
| `split`               | `boolean`                     | `true`        | 是否显示分割线                              |
| `className` / `style` | Vue class / style             | -             | 兼容 class 与内联样式                       |

事件：`click(event)`、`rightClick(event)`。它们在没有 ListItem 本地同名监听时接收条目事件。

Slots：`default`、`item({ item, index })`、`header`、`footer`、`loadMore`、`emptyContent`。

## ListItem API

| 属性                        | 类型              | 默认值     | 说明                      |
| --------------------------- | ----------------- | ---------- | ------------------------- |
| `align`                     | `'flex-start'     | 'flex-end' | 'center'                  | 'baseline' | 'stretch'` | `'flex-start'` | header/main 垂直对齐 |
| `header` / `main` / `extra` | `VNodeChild`      | -          | 分区内容；也可用同名 slot |
| `className` / `style`       | Vue class / style | -          | 条目样式                  |

事件：`click`、`rightClick`、`mouseEnter`、`mouseLeave`。默认 slot 位于 body 后、extra 前。

## 无障碍与 SSR

普通模式保持 `ul/li` 语义，不额外发明 listbox、tabindex 或键盘状态机；loading SVG 为 `aria-hidden`。组件导入、SSR render 与 hydration 均不访问浏览器全局。

完整源码证据、Boolean/slot 门禁、视觉矩阵和 deviation 见 [对齐矩阵](./alignment.md)。
