# Table React → Vue 迁移

| React v2.102.0                                       | Vue                                                                              | 说明                                                         |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `import { Table } from '@douyinfe/semi-ui'`          | `import { Table } from '@aifuxi/semi-ui-vue'`                                    | 根导出与 `table` 子路径同名；default 与 named 一致           |
| `<Table.Column />` / `<Column />`                    | `Table.Column`、`TableColumn` 或默认 slot 中声明                                 | 复合静态成员由公开入口锁定                                   |
| `columns[].render(text, record, index)`              | 同签名函数；或用 `#cell="{ column, record, rowIndex, text }"`                    | 列级 render 优先于表格级 slot                                |
| ReactNode `children`                                 | 默认 slot / `empty` / `title` / `footer` slot                                    | VNodeChild 语义不变                                          |
| `rowSelection.onChange` / `onSelect` / `onSelectAll` | `@selectChange` / `@select` / `@selectAll` 或配置内同名回调                      | 事件载荷与顺序保持固定 Adapter                               |
| `onChange(pagination, filters, sorter, extra)`       | `@change(changeInfo)`，`changeInfo` 携带 `pagination`/`filters`/`sorter`/`extra` | 查询对象保留原声明 key 与自定义字段                          |
| `onRow` / `onHeaderRow`                              | 同名回调，返回行属性                                                             | class/style/事件合并顺序不变                                 |
| `expandedRowRender`                                  | 同名；对象结果把除 `children` 外的 ColumnProps 应用到展开单元格                  | `fixed` 仅作元数据，折叠行不调用、每次渲染每条展开行调用一次 |
| `rowKey`                                             | `string \| number \| (record) => key`                                            | 缺省读取 `key` 字段                                          |
| `pagination`（对象/布尔）                            | 同名，配置对象加 `position`/`formatPageText`/`onChange`                          | 受控分页不再二次 slice                                       |
| `scroll={{ x, y }}` / `sticky` / `virtualized`       | 同名 prop                                                                        | 固定列、吸顶表头与虚拟窗口契约不变                           |
| `components`                                         | 同名 `TableComponents`                                                           | 可替换 table/header/body/footer 的承载元素                   |
| `className` / `style`                                | Vue 原生 `class`/`style` 与兼容 prop                                             | 根节点合并，不产生额外包装                                   |
| `ref` 实例方法（`getCurrentPageData`）               | 组件 ref 暴露 `getCurrentPageData()`                                             | React class 实例语义映射为 Vue `expose`                      |
| 泛型 `<Table<T>>`                                    | 泛型由 `columns`/`dataSource` 推断，公开类型不暴露 React 泛型参数                | 类型化 API 用 Vue 原生写法表达                               |

Vue 追加的原生能力（不改变固定基线行为）：

- `@change(changeInfo)` 的对象形态在 Vue 中保持不变，同时保留 `pageChange`/`select` 等细分事件，便于模板直接绑定。
- `#cell`/`#headerCell`/`#expandedRow`/`#groupSection` 等 scoped slot 与同名函数 prop 并存，模板与脚本写法都可定制渲染。

样式、选择、展开、固定列、虚拟化、ARIA 与发布契约不随迁移改变；逐项证据见[对齐矩阵](./alignment.md)。
