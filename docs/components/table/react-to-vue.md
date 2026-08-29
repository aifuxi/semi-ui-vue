# Table React → Vue 迁移

| React v2.102.0                                   | Vue                                                       |
| ------------------------------------------------ | --------------------------------------------------------- |
| `<Table dataSource={data} columns={columns} />`  | `<Table :data-source="data" :columns="columns" />`        |
| `<Table.Column title="Name" dataIndex="name" />` | `<Table.Column title="Name" data-index="name" />`         |
| `children` 中的 `Table.Column`                   | 默认插槽中的真实 `Table.Column`；其他 VNode 会被忽略      |
| `column.render(text, record, index)`             | 同名函数，或 `#cell="{ text, record, rowIndex, column }"` |
| `column.title={<Title />}`                       | `title` prop，或 `#headerCell`                            |
| `expandedRowRender`                              | 同名函数，或 `#expandedRow`                               |
| `renderGroupSection`                             | 同名函数，或 `#groupSection`                              |
| `title/footer/empty`                             | 同名 prop，或 `#title/#footer/#empty`                     |
| `renderPagination`                               | 同名函数，或 `#pagination`                                |
| `onChange(info)`                                 | `onChange` prop 或 `@change`                              |
| `rowSelection.onChange(keys, rows)`              | 同名配置回调或 `@select-change`                           |
| `ref.current.getCurrentPageData()`               | 模板 ref 的 `getCurrentPageData()`                        |
| `className` / React `CSSProperties`              | `class`（仍兼容 `className`）/ Vue `StyleValue`           |

受控 props 保持单向：Vue 不会通过 `v-model` 暗中改写 `selectedRowKeys`、`expandedRowKeys`、`sortOrder`、`filteredValue` 或分页状态。ReactNode 与 render props 被映射为 `VNodeChild`、函数和具名插槽，这是框架原生映射，不是能力删减。
