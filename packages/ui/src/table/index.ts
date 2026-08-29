import type { DefineComponent } from 'vue';

import TableBase from './Table.vue';
import { TableColumnComponent } from './TableColumn';
import { tableStrings } from '@workspace/foundation-integration';
import type { TableColumn as TableColumnProps, TableExposed, TableProps } from './types';

export const DEFAULT_KEY_COLUMN_SELECTION = tableStrings.DEFAULT_KEY_COLUMN_SELECTION;
export const DEFAULT_KEY_COLUMN_EXPAND = tableStrings.DEFAULT_KEY_COLUMN_EXPAND;

export type TableComponent = DefineComponent<TableProps, TableExposed> & {
  Column: DefineComponent<TableColumnProps>;
  DEFAULT_KEY_COLUMN_SELECTION: typeof DEFAULT_KEY_COLUMN_SELECTION;
  DEFAULT_KEY_COLUMN_EXPAND: typeof DEFAULT_KEY_COLUMN_EXPAND;
};

export const TableColumn = TableColumnComponent as unknown as DefineComponent<TableColumnProps>;
export const Table = Object.assign(TableBase, {
  Column: TableColumn,
  DEFAULT_KEY_COLUMN_SELECTION,
  DEFAULT_KEY_COLUMN_EXPAND,
}) as unknown as TableComponent;

export default Table;
export type {
  TableAlign,
  TableCellAttributes,
  TableChangeInfo,
  TableCheckRelation,
  TableColumn as TableColumnProps,
  TableColumnRender,
  TableColumnTitleProps,
  TableComponents,
  TableDirection,
  TableEmits,
  TableExposed,
  TableFilter,
  TableFilterConfirmMode,
  TableFixed,
  TableLocale,
  TablePaginationConfig,
  TableProps,
  TableRenderOptions,
  TableRenderReturnObject,
  TableResizable,
  TableRowAttributes,
  TableRowKey,
  TableRowSelection,
  TableRowSelectionRenderCellArgs,
  TableScroll,
  TableSize,
  TableSlots,
  TableSortOrder,
  TableSticky,
  TableVirtualized,
  TableVirtualizedItemSize,
  TableVirtualizedItemRow,
  TableVirtualizedListRef,
  TableVirtualizedOnScrollArgs,
  TableVirtualizedProps,
} from './types';
