# Navigation React → Vue 迁移

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
