# Table 表格

根据 [版本查证流程](../SKILL.md#查证与验证) 核对安装包的 `/table` 导出与类型。

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

示例用 `TableColumnProps[]` 和 `TableChangeInfo<Record<string, unknown>>` 对齐采用通用行类型的 `<Table>` 声明。安装包提供其他行类型时，以该声明为准。

需要局部自定义单元格时可用 `#cell="{ column, record, rowIndex, text }"`。该列配置了 `render` 时，列级 `render` 优先。

[可运行示例 TableExample.vue](../assets/TableExample.vue) 演示数字排序、分页和统一 `@change`。运行后点击「分数」列标题，表格下方应显示 `sorter`。切换页码后应显示 `pagination`。

仓库中的 Table 契约和迁移说明位于 `docs/components/table/`，文档站示例可从 `apps/docs/content/zh-CN/show/table.md` 查找。
