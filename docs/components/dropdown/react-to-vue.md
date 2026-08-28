# Dropdown React → Vue 迁移

| React v2.102.0                                            | Vue                                                                               |
| --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `<Dropdown render={<Dropdown.Menu />}>trigger</Dropdown>` | `<Dropdown><trigger /><template #content><Dropdown.Menu /></template></Dropdown>` |
| `children` trigger                                        | 默认 slot                                                                         |
| `render` popup content                                    | `#content`（同时兼容 `render` prop）                                              |
| `visible` + `onVisibleChange`                             | `v-model:visible` 或 `visible` + `@visible-change`                                |
| `className`                                               | Vue 原生 `class`                                                                  |
| `onClickOutSide`                                          | `@click-outside`                                                                  |
| `onEscKeyDown`                                            | `@esc-keydown`                                                                    |
| `icon={<Icon />}`                                         | `:icon="h(Icon)"` 或 `#icon`                                                      |
| React ref                                                 | Vue component ref，公开 `focusTrigger/getPopupId/rePosition`                      |

`Dropdown.Menu/Item/Title/Divider` 的复合调用形式保持不变。Vue 事件使用模板 kebab-case；`menu` 数组中的监听器使用 `onClick` 等 VNode prop 形式。

固定 React 文档把 Item `type` 标为默认 `tertiary`，但 v2.102.0 Adapter 没有设置该默认值；Vue 实现以运行时源码为准，未传时使用 `.semi-dropdown-item` 的基础文本 Token。
