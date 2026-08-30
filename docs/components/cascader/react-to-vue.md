# Cascader React → Vue 迁移

| React v2.102.0                                   | Vue                                    | 说明                                        |
| ------------------------------------------------ | -------------------------------------- | ------------------------------------------- |
| `<Cascader value={value} onChange={setValue} />` | `<Cascader v-model="value" />`         | 仍支持 `value`、`@change` 与 `update:value` |
| `treeData` / `multiple` / `keyMaps`              | 同名 kebab-case props                  | 数据与枚举保持不变                          |
| `triggerRender={fn}`                             | `#trigger="scope"`                     | scope 保留搜索、清除和移除方法              |
| `displayRender={fn}`                             | `#display="scope"`                     | 单选路径或多选实体按原语义传入              |
| `filterRender={fn}`                              | `#filter="scope"`                      | scope 提供 class、状态与事件                |
| `prefix` / `suffix`                              | `#prefix` / `#suffix`                  | 同名 VNode prop 仍保留                      |
| `arrowIcon` / `clearIcon` / `expandIcon`         | 同名 slot                              | slot 优先于节点 prop                        |
| `topSlot` / `bottomSlot` / `emptyContent`        | `#top` / `#bottom` / `#empty`          | ReactNode 映射为 Vue slot                   |
| `onVisibleChange` / `onListScroll`               | `@visibleChange` / `@listScroll`       | 参数与顺序保持 Foundation 契约              |
| `ref.current.open()` / `search(value)`           | `cascaderRef.open()` / `search(value)` | 通过 `defineExpose` 提供                    |
| `ReactNode`                                      | `VNodeChild` / slot                    | 公开类型不暴露 React 或私有 Foundation 类型 |

Vue 的 `modelValue`/`v-model` 是推荐受控写法。Boolean 默认值为 `true` 的 `autoAdjustOverflow`、`autoClearSearchValue`、`autoMergeValue`、`filterLeafOnly`、`motion` 与 `stopPropagation` 会区分缺省、显式 `false` 和显式 `true`；自定义触发器仅在值真实存在时收到 `value` 字段。
