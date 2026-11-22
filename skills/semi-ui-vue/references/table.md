# Table 表格

以下用法按 `@aifuxi/semi-ui-vue@2.2.5` 核对。

```ts
import { Table, type TableChangeInfo, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
```

也可以从根入口 `@aifuxi/semi-ui-vue` 导入 `Table`。通过 `:columns` 和 `:data-source` 分别传入列配置和行数据。默认从行的 `key` 取标识，也可以通过 `row-key` 指定字段名或函数。声明式 `Table.Column` 适合把列写在模板里，使用时省略 `columns`。

| Vue 模板事件     | 参数                                                  | 触发时机         |
| ---------------- | ----------------------------------------------------- | ---------------- |
| `@change`        | `changeInfo: TableChangeInfo<Row>`                    | 排序、筛选或分页 |
| `@page-change`   | `currentPage: number, pageSize: number`               | 分页变化         |
| `@select-change` | `selectedRowKeys: TableRowKey[], selectedRows: Row[]` | 启用行选择后变更 |

`@change` 接收一个对象，`pagination`、`filters`、`sorter` 和 `extra` 是其中的可选字段。通过 `extra?.changeType` 可以区分 `'sorter'`、`'filter'` 和 `'pagination'`。需要分页、筛选和排序共同触发一次查询时，可集中监听 `@change`。行选择通过 `:row-selection` 开启，受控选中项写入 `rowSelection.selectedRowKeys`。

`2.2.5` 的 `<Table>` 组件声明中，表内的 `Row` 是 `Record<string, unknown>`。在严格 TypeScript 项目中，示例使用 `TableColumnProps[]` 和 `TableChangeInfo<Record<string, unknown>>` 对齐组件声明，应用自身的行模型仍可以单独定义。

需要局部自定义单元格时可用 `#cell="{ column, record, rowIndex, text }"`。该列配置了 `render` 时，列级 `render` 优先。

[可运行示例 TableExample.vue](../assets/TableExample.vue) 使用默认主题，演示数字排序、分页和统一 `@change`。运行后点击「分数」列标题，表格下方应显示 `sorter`。切换页码后应显示 `pagination`。

[Vue 组件契约](https://github.com/aifuxi/semi-ui-vue/blob/ea1d94ff/docs/components/table/index.md) · [React → Vue 迁移说明](https://github.com/aifuxi/semi-ui-vue/blob/ea1d94ff/docs/components/table/react-to-vue.md) · [文档站 Vue 示例](https://github.com/aifuxi/semi-ui-vue/tree/ea1d94ff/apps/docs/.vitepress/theme/demo/examples/t5/table/zh-cn)
