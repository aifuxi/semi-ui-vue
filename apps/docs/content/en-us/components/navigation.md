---
title: 'Navigation'
description: 'A menu list that provides navigation for pages and features.'
locale: 'en-US'
slug: 'navigation'
category: 'navigation'
order: 57
englishTitle: 'Navigation'
icon: 'doc-navigation'
upstream: 'navigation/navigation'
---

`Navigation` organizes application destinations. This Vue adapter is aligned to the pinned local Semi Design v2.102.0 source and preserves the `.semi-navigation-*` DOM/classes, states, theme, keyboard behavior, and ARIA contract.

::demo-block{demo="navigation/en-US/Example1" title="Navigation"}
::

Use `v-model:selected-keys`, `v-model:open-keys`, and `v-model:is-collapsed` for controlled state. Controlled views wait for the parent to feed the update back. `select` precedes `click`; a SubNav `openChange` precedes `click`.

The compound API exposes `Nav.Item`, `Nav.Sub`, `Nav.Header`, and `Nav.Footer`; `NavItem` and `SubNav` are also named exports. Slots include `default`, `header`, `footer`, `itemWrapper`, item `icon`/`text`, and SubNav `expandIcon`.

Important defaults are `mode="vertical"`, `limitIndent=true`, `subNavMotion=true`, `toggleIconPosition="right"`, and collapse/open/select state false or empty. Use `getPopupContainer` for collapsed or horizontal sub-navigation portals. Import standalone styles from `@aifuxi/semi-theme-default/navigation.css`.

The list uses `role="menu"`, items use `role="menuitem"`, and Enter follows click behavior. Imports and initial render are SSR-safe; portals and listeners are client-only and cleaned up on unmount.

See [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/navigation/alignment.md) and [React-to-Vue migration](#react-vue) for the full contract.

## React → Vue

| React v2.102.0                     | Vue                                                                   |
| ---------------------------------- | --------------------------------------------------------------------- |
| `<Navigation items={items} />`     | `<Nav :items="items" />`                                              |
| `<Navigation.Item />`              | `<NavItem />` 或 `<Nav.Item />`                                       |
| `<Navigation.Sub />`               | `<SubNav />` 或 `<Nav.Sub />`                                         |
| `children`                         | 默认 slot                                                             |
| `onSelect={fn}`                    | `@select="fn"`                                                        |
| `onOpenChange={fn}`                | `@open-change="fn"`                                                   |
| `onCollapseChange={fn}`            | `@collapse-change="fn"`                                               |
| `selectedKeys` + `onSelect`        | `v-model:selected-keys` 或 `:selected-keys` + `@update:selected-keys` |
| `openKeys` + `onOpenChange`        | `v-model:open-keys`                                                   |
| `isCollapsed` + `onCollapseChange` | `v-model:is-collapsed`                                                |
| `renderWrapper(info)`              | `#item-wrapper="info"` 或 `renderWrapper`                             |
| ReactNode `icon` / `text`          | VNode/function prop 或 `#icon` / `#text`                              |
| React ref / `forwardRef`           | Vue template ref；`NavItem.forwardRef` 仅作 DOM 回调兼容              |

Vue 不复制 `children`、React render props 或 ref 对象语义。默认值为 `true` 的 `limitIndent` / `subNavMotion` 会区分缺省、显式 `false` 与显式 `true`。Portal 容器应在首次打开前稳定存在。

`multiple`、`deselect` 与 `SubNav.isOpen` 在固定 v2.102.0 类型中可见，但该版本 Adapter/Foundation 没有形成独立公开行为；迁移时不要据此依赖额外多选能力。
