# TreeSelect React → Vue 迁移

| React v2.102.0                                     | Vue                                                   | 说明                              |
| -------------------------------------------------- | ----------------------------------------------------- | --------------------------------- |
| `<TreeSelect value={value} onChange={setValue} />` | `<TreeSelect v-model="value" />`                      | 仍可单独使用 `value` 与 `@change` |
| `treeData` / `multiple` / `leafOnly`               | 同名 kebab-case props                                 | 数据结构与枚举保持不变            |
| `expandedKeys` / `onExpand`                        | `:expanded-keys` / `@expand` / `v-model:expandedKeys` | Vue 增加原生双向绑定              |
| `renderLabel={fn}`                                 | `#label="scope"`                                      | 同名函数 prop 仍保留              |
| `renderFullLabel={fn}`                             | `#fullLabel="scope"`                                  | scope 与 Tree 一致                |
| `renderSelectedItem={fn}`                          | `#selectedItem="{ node, index, onClose }"`            | 多选可自定义标签或内容            |
| `searchRender={fn}`                                | `#search="inputProps"`                                | 显式 `false` 隐藏搜索框           |
| `triggerRender={fn}`                               | `#trigger="scope"`                                    | scope 保留 value 与操作函数       |
| `prefix` / `suffix` / `insetLabel`                 | 同名 prop 或 slot                                     | slot 优先                         |
| `outerTopSlot` / `outerBottomSlot`                 | `#outerTop` / `#outerBottom`                          | 同名 VNode prop 仍保留            |
| `onVisibleChange`                                  | `@visibleChange`                                      | 布尔参数不变                      |
| `ref.current.close()` / `search(value)`            | `treeSelectRef.close()` / `search(value)`             | 通过 `defineExpose` 提供          |
| ReactNode                                          | `VNodeChild` / slot                                   | Vue 原生节点映射                  |

React 的受控 `value` 可迁移为 `modelValue`/`v-model`；为减少迁移成本，本实现仍支持 `value` 并同时发出 `update:value`。回调顺序、节点对象和值语义与固定 Adapter/Foundation 保持一致，不向公开 `.d.ts` 暴露 React 或私有 Foundation 类型。
