# Tag React → Vue 迁移

| React v2.102.0                        | Vue                                                 |
| ------------------------------------- | --------------------------------------------------- |
| `<Tag>内容</Tag>`                     | 默认 slot，不变                                     |
| `children` in `tagList`               | `content`                                           |
| `onClose(value, event, key)`          | `@close="(value, event, key) => ..."`               |
| `visible` + `onClose`                 | `v-model:visible` 或 `:visible` + `@update:visible` |
| `prefixIcon` / `suffixIcon` ReactNode | 同名 `VNodeChild` prop 或 `#prefixIcon/#suffixIcon` |
| `onTagClose`                          | `@tag-close`                                        |
| `onPlusNMouseEnter`                   | `@plus-n-mouseenter`                                |
| `className` / `style`                 | `class` / `style`，仍兼容 `className`               |

`TagGroup` 不修改传入的 `tagList`。`SplitTagGroup` 会展开 Vue 模板产生的 Fragment，再为第一/最后一个直接可见 VNode 合并 `.semi-tag-first/.semi-tag-last`。
