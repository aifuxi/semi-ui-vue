# Tree React → Vue 迁移

| Semi React v2.102.0                          | Vue                                                        |
| -------------------------------------------- | ---------------------------------------------------------- |
| `<Tree value={value} onChange={setValue} />` | `<Tree v-model="value" />`                                 |
| `expandedKeys` + `onExpand`                  | `v-model:expanded-keys` + `@expand`                        |
| `onSelect(key, selected, node)`              | `@select="(key, selected, node) => ..."`                   |
| `onSearch(input, keys)`                      | `@search="(input, keys) => ..."`                           |
| `renderLabel(label, node, word)`             | 同名 prop，或 `#label="{ label, node, searchWord }"`       |
| `renderFullLabel(props)`                     | 同名 prop，或 `#fullLabel="props"`                         |
| `searchRender(props)`                        | 同名 prop，或 `#search="props"`；显式 `false` 仍隐藏搜索框 |
| `icon` / `expandIcon` ReactNode/function     | 同名 VNode/function，或 `#icon` / `#expandIcon`            |
| `emptyContent` ReactNode                     | 同名 VNode prop，或 `#empty`                               |
| `ref.current.search(value)`                  | `treeRef.search(value)`                                    |
| `ref.current.scrollTo(data)`                 | `treeRef.scrollTo(data)`                                   |

Vue 不发布 ReactNode、render props、SyntheticEvent 或 React ref 类型。事件采用原生 `MouseEvent`、`KeyboardEvent`、`DragEvent`；数据、顺序与可见行为保持固定基线。默认 true 的 `showClear`、`blockNode`、`motion`、`autoExpandWhenDragEnter` 与 `autoMergeValue` 保留“缺省 / 显式 false / 显式 true”三态，不要用普通 truthiness 代替 prop 存在性。
