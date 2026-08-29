export const tableCssClasses: {
  PREFIX: 'semi-table';
  TABLE: 'semi-table';
  WRAP: 'semi-table-wrapper';
  THEAD: 'semi-table-thead';
  TR: 'semi-table-row';
  TH: 'semi-table-row-head';
  TD: 'semi-table-row-cell';
};

export const tableStrings: {
  SIZES: readonly ['small', 'default', 'middle'];
  PAGINATION_POSITIONS: readonly ['bottom', 'top', 'both'];
  SORT_DIRECTIONS: readonly ['ascend', 'descend'];
  DEFAULT_KEY_COLUMN_SELECTION: 'column-selection';
  DEFAULT_KEY_COLUMN_EXPAND: 'column-expand';
  DEFAULT_KEY_COLUMN_TITLE: 'column-title';
  DEFAULT_KEY_COLUMN_SORTER: 'column-sorter';
  DEFAULT_KEY_COLUMN_FILTER: 'column-filter';
  DEFAULT_KEY_COLUMN_SCROLLBAR: 'column-scrollbar';
  [key: string]: unknown;
};

export const tableNumbers: {
  DEFAULT_PAGE_SIZE: number;
  DEFAULT_WIDTH_COLUMN_EXPAND: number;
  DEFAULT_WIDTH_COLUMN_SELECTION: number;
  DEFAULT_INDENT_WIDTH: number;
  DEFAULT_VIRTUALIZED_BODY_HEIGHT: number;
  DEFAULT_VIRTUALIZED_ROW_HEIGHT: number;
  DEFAULT_VIRTUALIZED_ROW_MIDDLE_HEIGHT: number;
  DEFAULT_VIRTUALIZED_ROW_SMALL_HEIGHT: number;
  [key: string]: number;
};
