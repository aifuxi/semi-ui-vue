# Popover React → Vue 迁移

| React v2.102.0                                     | Vue                                                                   |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| `<Popover content={<Card />}><Button /></Popover>` | `<Popover><template #content><Card /></template><Button /></Popover>` |
| `content={({ initialFocusRef }) => ...}`           | `#content="{ initialFocusRef }"`                                      |
| `visible={open} onVisibleChange={setOpen}`         | `v-model:visible="open"`                                              |
| `onClickOutSide={handler}`                         | `@click-outside="handler"`                                            |
| `onEscKeyDown={handler}`                           | `@esc-keydown="handler"`                                              |
| `afterClose={handler}`                             | `@after-close="handler"`                                              |
| `className`                                        | `class`（同时兼容 `className`）                                       |
| `ref.current.focusTrigger()`                       | `popoverRef.focusTrigger()`                                           |

自然可保留的 prop 名、placement 和 trigger 枚举值保持一致。Vue 的 `#content` 优先于 `content` prop；它取代 React render function，同时保留 `initialFocusRef` 能力。
