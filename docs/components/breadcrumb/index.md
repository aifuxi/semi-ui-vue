# Breadcrumb 面包屑

Breadcrumb 用于展示当前页面在层级结构中的位置，并允许返回上级页面。本实现以本地 Semi Design v2.102.0 为唯一基线。

## 基本用法

```vue
<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/breadcrumb.css';
</script>

<template>
  <Breadcrumb aria-label="文档路径">
    <BreadcrumbItem href="/">首页</BreadcrumbItem>
    <BreadcrumbItem href="/components">组件</BreadcrumbItem>
    <BreadcrumbItem>面包屑</BreadcrumbItem>
  </Breadcrumb>
</template>
```

也可以使用复合组件写法：`<Breadcrumb.Item>内容</Breadcrumb.Item>`。

## 图标、尺寸与分隔符

```vue
<Breadcrumb :compact="false">
  <template #separator><IconChevronRight size="small" /></template>
  <BreadcrumbItem>
    <template #icon><IconHome /></template>
    首页
  </BreadcrumbItem>
  <BreadcrumbItem>详情</BreadcrumbItem>
</Breadcrumb>
```

## routes 与自定义渲染

```vue
<Breadcrumb :routes="routes">
  <template #item="{ route }">
    <strong>{{ route.name }}</strong>
  </template>
</Breadcrumb>
```

`routes` 接受字符串或 `{ name, path, href, icon }` 对象，并保留对象上的额外业务字段。`#item` 是 React `renderItem` 的 Vue 原生映射；同时保留 `renderItem` 函数 prop 供程序化调用。

## 折叠与 Popover

路径数量超过 `maxItemCount` 时默认折叠中间项。`moreType="default"` 点击或按 Enter 展开，`moreType="popover"` 悬浮展示隐藏项。

```vue
<Breadcrumb :max-item-count="4" more-type="popover">
  <BreadcrumbItem v-for="item in paths" :key="item">{{ item }}</BreadcrumbItem>
</Breadcrumb>
```

可用 `#more="{ items, expand }"` 自定义省略区域；它对应 React `renderMore(restItem)`。`items` 是已经注入 active/separator 状态的隐藏 BreadcrumbItem VNode。

## API

### Breadcrumb

| 属性                  | 说明                    | 类型                               | 默认值                               |
| --------------------- | ----------------------- | ---------------------------------- | ------------------------------------ |
| `activeIndex`         | 受控激活项索引          | `number`                           | 最后一项                             |
| `autoCollapse`        | 超出最大项数时自动折叠  | `boolean`                          | `true`                               |
| `compact`             | 是否使用紧凑尺寸        | `boolean`                          | `true`                               |
| `maxItemCount`        | 开始折叠的最大项数      | `number`                           | `4`                                  |
| `moreType`            | 省略区域类型            | `'default' \| 'popover'`           | `'default'`                          |
| `routes`              | 路由字符串/对象数组     | `Array<BreadcrumbRoute \| string>` | `[]`                                 |
| `separator`           | 父级分隔符              | `VNodeChild`                       | `'/'`                                |
| `showTooltip`         | 单行截断及 Tooltip 配置 | `boolean \| BreadcrumbShowTooltip` | `{ width: 150, ellipsisPos: 'end' }` |
| `className` / `style` | 兼容类名与样式          | `string` / `CSSProperties`         | -                                    |

事件：`click(item, event)`。默认 slot 放置 BreadcrumbItem；`#separator`、`#item`、`#more` 分别映射分隔符、route 渲染和省略区域。

### BreadcrumbItem / Breadcrumb.Item

| 属性        | 说明                                | 类型             | 默认值  |
| ----------- | ----------------------------------- | ---------------- | ------- |
| `href`      | 链接目标；激活项仍渲染 span         | `string \| null` | -       |
| `icon`      | 图标内容，也可用 `#icon`            | `VNodeChild`     | -       |
| `noLink`    | 移除 hover/active 链接样式          | `boolean`        | `false` |
| `separator` | 覆盖父级分隔符，也可用 `#separator` | `VNodeChild`     | -       |

事件：`click(item, event)`，先于父 Breadcrumb 的 `click` 发出。

## 可访问性与 SSR

- 根节点是 `nav`，缺省 `aria-label="Breadcrumb"`；建议按业务提供更具体标签。
- 当前项 wrapper 设置 `aria-current="page"`。
- 折叠按钮具有 `role="button"`、`tabindex="0"`，并响应 Enter。
- SSR 输出静态列表或折叠 DOM，不创建 Portal；根入口和 `breadcrumb` 子路径均可安全导入。

## React → Vue 迁移

| React v2.102.0         | Vue                                        |
| ---------------------- | ------------------------------------------ |
| `<Breadcrumb.Item>`    | `<BreadcrumbItem>` 或 `<Breadcrumb.Item>`  |
| `children`             | 默认 slot                                  |
| `icon={<IconHome />}`  | `#icon`，或 `:icon="h(IconHome)"`          |
| `separator={<Icon />}` | `#separator`，或 `:separator="h(Icon)"`    |
| `renderItem(route)`    | `#item="{ route, index }"`，兼容同名 prop  |
| `renderMore(restItem)` | `#more="{ items, expand }"`，兼容同名 prop |
| `onClick(item, event)` | `@click="(item, event) => ..."`            |

完整源码证据、事件顺序、VNode/Portal 门禁与 deviation 见 `alignment.md`。
