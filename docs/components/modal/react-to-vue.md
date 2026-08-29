# Modal React → Vue 迁移

| Semi React v2.102.0                                      | Vue                                                                               |
| -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `<Modal visible={visible} onCancel={close}>body</Modal>` | `<Modal v-model:visible="visible">body</Modal>`                                   |
| `title` / `content` / `footer` / `header`                | 同名 prop，或 `#title/#body/#footer/#header`                                      |
| `closeIcon` / `icon`                                     | 同名 prop，或 `#closeIcon/#icon`                                                  |
| `onOk` / `onCancel`                                      | `@ok` / `@cancel`，并由 `update:visible` 支持 `v-model`                           |
| `Modal.confirm(config)`                                  | `Modal.confirm(config)`                                                           |
| `const [modal, contextHolder] = Modal.useModal()`        | `const [modal, ContextHolder] = Modal.useModal()`；模板中渲染 `<ContextHolder />` |
| ReactNode / render props                                 | Vue `VNodeChild`、slots；`modalRender` 保留函数式 VNode 包装                      |

默认值为 true 的 Boolean prop 会区分缺省、显式 false 和显式 true；全局 `overrideDefaultProps.Modal` 只在局部 prop 缺省时生效。`footer=null` 与“未传 footer”不同：前者移除 footer，后者渲染 Locale 驱动的默认按钮。

Vue 不复制 React `children`、ref 或 contextHolder 节点语法；这些能力映射为默认 slot、组件公开 API 和可渲染的 holder 组件，最终 DOM、事件顺序、Portal 与焦点行为仍以 v2.102.0 为准。
