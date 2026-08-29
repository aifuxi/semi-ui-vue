# Transfer React → Vue 迁移

| React v2.102.0                                   | Vue                                                | 说明                                          |
| ------------------------------------------------ | -------------------------------------------------- | --------------------------------------------- |
| `<Transfer value={value} onChange={setValue} />` | `<Transfer v-model="value" />`                     | 仍可单独使用 `value` 与 `@change`             |
| `dataSource` / `defaultValue` / `type`           | 同名 kebab-case props                              | 数据结构与枚举不变                            |
| `renderSourceItem={fn}`                          | `#sourceItem="scope"`                              | 同名函数 prop 仍保留                          |
| `renderSelectedItem={fn}`                        | `#selectedItem="scope"`                            | `onRemove` 保留；拖拽时提供 `dragHandleProps` |
| `renderSourcePanel` / `renderSelectedPanel`      | `#sourcePanel` / `#selectedPanel`                  | actions 与数据均在 slot scope 中              |
| `emptyContent`                                   | 同名 prop 或 `#emptyLeft/#emptyRight/#emptySearch` | slot 优先                                     |
| `ref.current.search(value)`                      | `transferRef.search(value)`                        | 不触发 search 事件                            |
| ReactNode                                        | `VNodeChild` / slot                                | Vue 原生节点映射                              |

React 的 `sortableHandle(render)` 在函数 prop 中仍可用；模板 slot 推荐把 `dragHandleProps` 绑定到自定义拖拽节点。HTML5 拖拽和 Vue 固定行高 windowing 分别替代 dnd-kit 与 react-window，不把 React 专属类型暴露到公开声明。
