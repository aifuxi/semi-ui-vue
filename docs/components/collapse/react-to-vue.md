# Collapse React -> Vue 迁移

| React v2.102.0                                | Vue                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| `<Collapse defaultActiveKey="one">`           | `<Collapse default-active-key="one">`                                   |
| `<Collapse.Panel itemKey="one" header="One">` | `<CollapsePanel item-key="one" header="One">` 或 `<Collapse.Panel ...>` |
| `activeKey={keys}` + `onChange={setKeys}`     | `v-model:active-key="keys"`，或 `:active-key` + `@change`               |
| `onChange={(keys, event) => ...}`             | `@change="(keys, event) => ..."`                                        |
| `expandIcon={<Icon />}`                       | `:expand-icon="h(Icon)"` 或 `#expandIcon`                               |
| `collapseIcon={<Icon />}`                     | `:collapse-icon="h(Icon)"` 或 `#collapseIcon`                           |
| Panel `header={<Header />}`                   | `#header` 或 `:header="h(Header)"`                                      |
| Panel `extra={<Extra />}`                     | `#extra` 或 `:extra="h(Extra)"`                                         |
| Panel `onMotionEnd`                           | `@motion-end`                                                           |
| `children`                                    | 默认 slot                                                               |
| `className="panel"`                           | `class="panel"` 或 `class-name="panel"`                                 |

其余可自然保留的 prop 名和值不变，SFC 模板使用 kebab-case，例如 `clickHeaderToExpand` 写作 `click-header-to-expand`，`expandIconPosition` 写作 `expand-icon-position`，`keepDOM` 写作 `keep-d-o-m`，`reCalcKey` 写作 `re-calc-key`。

## 受控状态

React 的 `activeKey` + `onChange` 对应 Vue 的 `activeKey` + `change`。Vue 额外提供 `update:activeKey` 以支持 `v-model:active-key`。一次交互的事件顺序是：

1. `change(activeKey, MouseEvent)`；
2. `update:activeKey(activeKey)`。

固定 Foundation 始终发出数组，不因 `accordion` 改为单个 string。受控组件必须等父级回传新 `activeKey` 后才更新 DOM。

## ReactNode 与 slot

ReactNode 映射为 Vue `VNodeChild` prop 或 slot。字符串 `header` 继续使用 Semi 的标准标题/右侧区 DOM；使用 `#header` 时，调用方负责完整标题节点，`extra` 不会自动附加。自定义图标优先使用 slot，动态 render function 场景可传 `h()` 创建的 VNode。

## 键盘与 ARIA

固定 v2.102.0 给 header 添加 `role="button"`、`tabIndex=0`、`aria-expanded`、`aria-disabled` 和 `aria-owns`，但没有 Enter/Space handler。Vue 复刻保留该行为，不额外引入与基线不同的键盘切换。若业务需要修复这一上游无障碍缺口，应在业务层明确评估，而不是把差异隐藏在迁移适配中。
