# ColorPicker React → Vue 迁移

| React v2.102.0                          | Vue                                                              |
| --------------------------------------- | ---------------------------------------------------------------- |
| `value={value}` + `onChange={setValue}` | `v-model="value"`，也可保留 `:value` + `@change`                 |
| `defaultValue={value}`                  | `:default-value="value"`                                         |
| `topSlot={<Header />}`                  | `#top`；`topSlot` VNode prop 仍可用                              |
| `bottomSlot={<Footer />}`               | `#bottom`；`bottomSlot` VNode prop 仍可用                        |
| `children` 作为 Popover trigger         | 默认 slot                                                        |
| `usePopover` / `popoverProps`           | `use-popover` / `:popover-props`                                 |
| `ColorPicker.colorStringToValue(raw)`   | 同名静态方法；也可 `import { colorStringToValue }`               |
| `onChange(value)`                       | `@change="handler"`，并提供 `update:modelValue` / `update:value` |

`ColorValue`、`HsvaColor`、`RgbaColor` 等类型可从 `@workspace/ui/color-picker` 导入。Vue 声明只引用 UI 自有类型，不暴露固定 vendor 或私有 Foundation 路径。

固定 React Adapter 的文档把 `alpha` 写为默认 `true`，但 class `defaultProps` 没有该字段；Vue 按公开文档使用默认 `true`。若旧 React 代码依赖实际缺省为 false，请迁移时显式传 `:alpha="false"`。
