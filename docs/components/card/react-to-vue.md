# Card React → Vue 迁移

| React v2.102.0              | Vue                                                                |
| --------------------------- | ------------------------------------------------------------------ |
| `<Card>children</Card>`     | `<Card>默认 slot</Card>`                                           |
| `title={node}`              | `title` prop 或 `#title`（slot 优先）                              |
| `headerExtraContent={node}` | prop 或 `#headerExtraContent`                                      |
| `header={node}`             | prop 或 `#header`；仍覆盖 title/extra                              |
| `cover={node}`              | prop 或 `#cover`                                                   |
| `footer={node}`             | prop 或 `#footer`                                                  |
| `actions={[a, b]}`          | render function 可继续传数组；模板使用 `#actions` 放置多个顶层节点 |
| `<Card.Meta ... />`         | `<CardMeta ... />` 或 `<Card.Meta ... />`                          |
| `<CardGroup spacing={16}>`  | `<CardGroup :spacing="16">`                                        |
| `className` / `style`       | 兼容同名 prop，也支持 Vue 原生 `class` / `style`                   |
| `aria-label` / DOM props    | 原生 attrs 直接落在根节点                                          |

Boolean 属性遵循 Vue 原生语法：缺省 `bordered` 和 `headerLine` 为 true；使用 `:bordered="false"` / `:header-line="false"` 显式关闭。`footerLine` 与 `loading` 默认为 false，可用裸属性开启。

Card 内置 loading 的公开行为保持不变；Skeleton 仍是后续独立组件，本切片不会提前暴露不完整的 Skeleton API。
