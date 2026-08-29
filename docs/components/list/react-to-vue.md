# List React → Vue 迁移

| Semi React v2.102.0                                                                      | Vue                                                                                                             |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `<List dataSource={data} renderItem={(item, index) => <List.Item>{item}</List.Item>} />` | `<List :data-source="data"><template #item="{ item, index }"><ListItem>{{ item }}</ListItem></template></List>` |
| `<List.Item header={header} main={main} extra={extra} />`                                | `<ListItem :header="header" :main="main" :extra="extra" />`，或 `#header/#main/#extra`                          |
| `<List header={...} footer={...} loadMore={...} />`                                      | 同名 props，或 `#header/#footer/#loadMore`                                                                      |
| `onClick` / `onRightClick`                                                               | `@click` / `@right-click`                                                                                       |
| `onMouseEnter` / `onMouseLeave`                                                          | `@mouse-enter` / `@mouse-leave`                                                                                 |
| `<List.Item>`                                                                            | `List.Item` 复合 API 或命名导出 `ListItem`；SFC 模板推荐 `ListItem`                                             |

`split` 默认为 true；Vue 中使用 `:split="false"` 显式关闭，裸 `split` 表示 true。`bordered` 与 `loading` 默认为 false，裸属性可开启。

Vue 额外提供 typed scoped `#item`，它优先于 `renderItem` prop；这是 React render prop 的原生模板映射，不改变最终 DOM。Grid、size、layout、空态、loading 与 RTL 枚举/行为保持固定 v2.102.0 契约。
