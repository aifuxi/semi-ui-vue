# Navigation 导航

`Navigation` 用于组织站点或应用的一级、二级入口。本实现以本地只读 Semi Design v2.102.0 为唯一基线，保留 `.semi-navigation-*` DOM/class、状态、主题与键盘语义，并用 Vue 的 props、slots、emits 和 `v-model` 表达公开契约。

## 基础用法

```vue
<script setup lang="ts">
import { Nav } from '@aifuxi/semi-ui-vue/navigation';

const items = [
  { itemKey: 'home', text: '首页' },
  { itemKey: 'manage', text: '管理', items: [{ itemKey: 'users', text: '用户' }] },
];
</script>

<template>
  <Nav
    :items="items"
    :default-selected-keys="['home']"
    :default-open-keys="['manage']"
    :header="{ text: '控制台' }"
    :footer="{ collapseButton: true }"
  />
</template>
```

也可以用组合组件：`Nav.Item`、`Nav.Sub`、`Nav.Header`、`Nav.Footer`；独立导出名为 `NavItem` 与 `SubNav`。

## 受控状态

```vue
<Nav
  v-model:selected-keys="selectedKeys"
  v-model:open-keys="openKeys"
  v-model:is-collapsed="collapsed"
  :items="items"
/>
```

受控 prop 出现时，组件只发送对应 `update:*` 和公开事件，视图等待父级回写。`select` 先于 `click`；SubNav 的 `openChange` 先于 `click`。

## slots

- `#default`：`NavItem`、`SubNav` 或自定义列表内容。
- `#header` / `#footer`：头尾内容。
- `#item-wrapper="{ itemElement, isSubNav, isInSubNav, props }"`：包装每个条目。
- `NavItem` 支持 `#icon`、`#text`；`SubNav` 额外支持 `#expandIcon`。

## 关键 API

| Prop                                   | 类型                         | 默认值         | 说明                 |
| -------------------------------------- | ---------------------------- | -------------- | -------------------- |
| `items`                                | `NavigationItems`            | -              | 字符串或递归对象数组 |
| `mode`                                 | `'vertical' \| 'horizontal'` | `'vertical'`   | 导航方向             |
| `selectedKeys` / `defaultSelectedKeys` | `ItemKey[]`                  | `[]`           | 受控/默认选择        |
| `openKeys` / `defaultOpenKeys`         | `ItemKey[]`                  | `[]`           | 受控/默认展开        |
| `isCollapsed` / `defaultIsCollapsed`   | `boolean`                    | `false`        | 受控/默认收起        |
| `limitIndent`                          | `boolean`                    | `true`         | 限制层级缩进         |
| `subNavMotion`                         | `boolean`                    | `true`         | 子导航动效           |
| `toggleIconPosition`                   | `'left' \| 'right'`          | `'right'`      | 展开图标位置         |
| `getPopupContainer`                    | `() => HTMLElement`          | ConfigProvider | 收起/水平浮层容器    |

`NavItem` 的 `itemKey` 必填，支持 `text`、`icon`、`disabled`、`link`、`linkOptions`；`SubNav` 增加 `expandIcon`、`dropdownProps` 与 `dropdownStyle`。

## 可访问性、主题与 SSR

根列表输出 `role="menu"` 和 `aria-orientation`，条目使用 `role="menuitem"`、`aria-disabled`/`aria-expanded`，Enter 与点击等价。默认主题入口为 `@aifuxi/semi-theme-default/navigation.css`，覆盖 light/dark、RTL、Dropdown Portal 与 Collapsible。组件可 SSR import/render/hydrate；Portal 和监听仅在客户端生命周期创建并清理。

完整证据见 [alignment.md](./alignment.md) 与 [React 到 Vue 迁移](./react-to-vue.md)。
