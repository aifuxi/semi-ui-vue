# DatePicker React → Vue 迁移

| React v2.102.0                                      | Vue                                                            |
| --------------------------------------------------- | -------------------------------------------------------------- |
| `value={value}` + `onChange={setValue}`             | `v-model="value"`；也可保留 `:value` + `@change`               |
| `defaultValue={value}`                              | `:default-value="value"`                                       |
| `open={open}` + `onOpenChange`                      | `v-model:open="open"`                                          |
| `triggerRender={props => ...}`                      | `#trigger="props"`；函数 prop 仍可用                           |
| `renderDate` / `renderFullDate`                     | `#date` / `#fullDate`；函数 prop 仍可用                        |
| `prefix` / `clearIcon` / `rangeSeparatorNode`       | `#prefix` / `#clearIcon` / `#rangeSeparator`                   |
| `topSlot` / `bottomSlot` / `leftSlot` / `rightSlot` | `#top` / `#bottom` / `#left` / `#right`                        |
| `ref.current.open()`                                | 模板 ref 后调用 `open()`；同样提供 `close/focus/blur/input`    |
| `onChange(date, dateString)`                        | `@change="handler"`，另有 `update:modelValue` / `update:value` |

ReactNode 与 render prop 使用 Vue slot 表达，日期状态、默认值和事件参数保持固定版本语义。公开声明仅引用 UI 自有类型，不泄漏只读 vendor 或私有 Foundation 类型。

默认值为 `true` 的 `showClear`、`motion`、`onChangeWithDateFirst`、`stopPropagation` 必须区分缺省、显式 `false` 和显式 `true`；模板裸属性等价于显式 `true`。
