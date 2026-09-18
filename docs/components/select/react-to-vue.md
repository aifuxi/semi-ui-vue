# Select React → Vue 迁移

| React v2.102.0                                          | Vue                                                                                 | 说明                                                         |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `import { Select } from '@douyinfe/semi-ui'`            | `import { Select } from '@aifuxi/semi-ui-vue'`                                      | 根导出与 `select` 子路径同名；默认导出与命名导出一致         |
| `<Select.Option />` / `<Select.OptGroup />`             | 同名复合静态成员，也可导入 `SelectOption` / `SelectOptionGroup`                     | 声明式候选项不拥有选择状态                                   |
| `value` + `onChange`                                    | `v-model`，或 `:value` + `@change` / `@update:model-value`                          | 受控语义不变；`value` 优先于 `modelValue`                    |
| `onChange(value)`                                       | `@change(value)`                                                                    | `onChangeWithObject` 时同样返回完整 option 对象              |
| `onSelect` / `onDeselect`                               | `@select(value, option)` / `@deselect(value, option)`                               | 事件载荷与顺序不变                                           |
| `onClear` / `onCreate` / `onExceed`                     | `@clear` / `@create(option)` / `@exceed(option)`                                    | 名字去掉 `on` 前缀，载荷不变                                 |
| `onFocus` / `onBlur`                                    | `@focus` / `@blur`                                                                  | 事件为原生 `FocusEvent`；v2.17.0 后单选关闭浮层不触发 `blur` |
| `onSearch` / `onListScroll` / `onDropdownVisibleChange` | `@search` / `@listScroll` / `@dropdownVisibleChange`                                | 搜索还额外提供 Vue 更新事件                                  |
| `triggerRender`                                         | `#trigger="{ value, inputValue, disabled, onSearch, onClear, onRemove }"`           | 自定义触发器；同名函数 prop 仍可用                           |
| `renderOptionItem`                                      | `#option="{ option, focused, selected, inputValue, onClick, onMouseenter }"`        | scoped slot 提供与固定 render 入参一致的字段                 |
| `renderSelectedItem`                                    | `#selectedItem="{ option, index }"`                                                 | 多选已选项标签渲染                                           |
| `renderCreateItem`                                      | `#createItem="{ inputValue, focused, style }"`                                      | 虚拟化场景需把 `style` 透传到自定义节点                      |
| `arrowIcon` / `clearIcon`                               | `#arrowIcon` / `#clearIcon`                                                         | 也可用同名 VNode prop                                        |
| `prefix` / `suffix`                                     | `#prefix` / `#suffix` 或同名 prop                                                   | 前缀/后缀标签                                                |
| `outerTopSlot` / `outerBottomSlot`                      | `#outerTop` / `#outerBottom`                                                        | 与列表平级的附加项                                           |
| `innerTopSlot` / `innerBottomSlot`                      | `#innerTop` / `#innerBottom`                                                        | 列表内部附加项                                               |
| `emptyContent`                                          | `#emptyContent` 或同名 prop                                                         | 显式 `null` 不展示空态                                       |
| `className` / `style`                                   | Vue 原生 `class` / `style`，并保留同名兼容 prop                                     | 根节点 class 与 Token 不变                                   |
| `ref.current.open()` 等实例方法                         | 组件 ref 暴露 `open/close/focus/search/clearInput/selectAll/deselectAll/rePosition` | React class 实例语义映射为 Vue `expose`                      |
| 泛型 `Select<OptionType>`                               | 泛型通过 `optionList`/`change` 载荷类型推断，公开类型不暴露 React 泛型参数          | 类型化 API 用 Vue 原生写法表达                               |

Vue 追加的原生能力（不改变固定基线行为）：

- `update:modelValue` 与 `update:value`，用于 `v-model` 与显式回写；`change` 顺序与载荷保持 Semi 契约。
- `ariaLabelledby` / `ariaDescribedby` / `ariaErrormessage` / `ariaInvalid` / `ariaRequired` / `id` 等透传 props，用于把 ARIA 直接写在 Select 上。
- `selectAll` / `deselectAll` 等多选方法沿用 `SelectExposed` 命名，仅通过 ref 暴露。

样式、Portal、键盘与 ARIA 的固定契约不随迁移改变；逐项证据见[对齐矩阵](./alignment.md)。
