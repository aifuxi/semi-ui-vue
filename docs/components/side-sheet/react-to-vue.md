# SideSheet React → Vue 迁移

| React v2.102.0                                                     | Vue                                       |
| ------------------------------------------------------------------ | ----------------------------------------- |
| `<SideSheet visible={visible} onCancel={() => setVisible(false)}>` | `<SideSheet v-model:visible="visible">`   |
| `children`                                                         | 默认插槽                                  |
| `title={<Title />}`                                                | `#title`（也保留 `title` prop）           |
| `footer={<Actions />}`                                             | `#footer`（也保留 `footer` prop）         |
| `closeIcon={<Icon />}`                                             | `#closeIcon`（也保留 `closeIcon` prop）   |
| `onCancel(event)`                                                  | `@cancel="handler"`；原始事件保持不变     |
| `afterVisibleChange(visible)`                                      | 同名 prop 或 `@after-visible-change`      |
| `className`                                                        | `class`；仍兼容 `className`               |
| `getPopupContainer`                                                | 同名函数 prop；也可由 ConfigProvider 提供 |

`placement`、`size`、`width`、`height`、`mask`、`maskClosable`、`closable`、`closeOnEsc`、`disableScroll`、`motion`、`keepDOM`、`zIndex` 以及 style props 保持同名。Vue 版本额外提供类型化 props/emits/slots 和 `v-model:visible`，不会把 React children/render 语义字面搬入公开 API。
