import { Comment, Fragment, Text, type VNode } from 'vue';

import { TABLE_COLUMN_MARK, TableColumnComponent } from './TableColumn';
import type { TableColumn as TableColumnType, TableFixed, TableRowKey } from './types';

export interface NormalizedTableColumn<
  RecordType extends Record<string, unknown>,
> extends TableColumnType<RecordType> {
  key: TableRowKey;
  children?: NormalizedTableColumn<RecordType>[] | undefined;
  __width?: string | number | undefined;
  __kind?: 'expand' | 'selection' | undefined;
}

export interface TableHeaderCell<RecordType extends Record<string, unknown>> {
  column: NormalizedTableColumn<RecordType>;
  colSpan: number;
  rowSpan: number;
}

export interface FlatTableRecord<RecordType> {
  index: number;
  key: TableRowKey;
  level: number;
  parentKey?: TableRowKey | undefined;
  record: RecordType;
  group?: RecordType[] | undefined;
  groupKey?: TableRowKey | undefined;
  sectionRow?: boolean | undefined;
}

export function toCssSize(value?: string | number): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

export function getByPath(record: Record<string, unknown>, path?: string): unknown {
  if (!path) return record;
  return path.split('.').reduce<unknown>((value, part) => {
    if (value == null || typeof value !== 'object') return undefined;
    return (value as Record<string, unknown>)[part];
  }, record);
}

export function getRecordKey<RecordType extends Record<string, unknown>>(
  record: RecordType,
  rowKey: string | number | ((record?: RecordType) => TableRowKey) = 'key',
  fallback = 0,
): TableRowKey {
  const value = typeof rowKey === 'function' ? rowKey(record) : getByPath(record, String(rowKey));
  return typeof value === 'string' || typeof value === 'number' ? value : fallback;
}

function vnodePropsToColumn<RecordType extends Record<string, unknown>>(
  node: VNode,
  index: number,
): NormalizedTableColumn<RecordType> {
  const raw = { ...(node.props ?? {}) } as Record<string, unknown>;
  delete raw.key;
  const slots = typeof node.children === 'object' && node.children ? node.children : {};
  const slotRecord = slots as Record<string, (() => unknown) | undefined>;
  const nested = normalizeColumnVNodes<RecordType>(slotRecord.default?.());
  const key = (node.key as TableRowKey | null) ?? (raw.dataIndex as string | undefined);
  const title = (slotRecord.title?.() ?? raw.title) as TableColumnType<RecordType>['title'];
  return normalizeColumn<RecordType>(
    {
      ...(raw as TableColumnType<RecordType>),
      ...(key === undefined ? {} : { key }),
      ...(title === undefined ? {} : { title }),
      ...(nested.length ? { children: nested } : {}),
    },
    index,
  );
}

function visitColumnVNodes<RecordType extends Record<string, unknown>>(
  value: unknown,
  output: NormalizedTableColumn<RecordType>[],
): void {
  if (Array.isArray(value)) {
    value.forEach((item) => visitColumnVNodes(item, output));
    return;
  }
  if (!value || typeof value !== 'object' || !('__v_isVNode' in value)) return;
  const node = value as unknown as VNode;
  if (node.type === Fragment) {
    visitColumnVNodes(node.children, output);
    return;
  }
  if (node.type === Text || node.type === Comment) return;
  const type = node.type as Record<PropertyKey, unknown>;
  if (
    node.type === TableColumnComponent ||
    type?.[TABLE_COLUMN_MARK] === true ||
    type?.name === 'TableColumn'
  ) {
    output.push(vnodePropsToColumn<RecordType>(node, output.length));
  }
}

export function normalizeColumnVNodes<RecordType extends Record<string, unknown>>(
  value: unknown,
): NormalizedTableColumn<RecordType>[] {
  const output: NormalizedTableColumn<RecordType>[] = [];
  visitColumnVNodes<RecordType>(value, output);
  return output;
}

export function normalizeColumn<RecordType extends Record<string, unknown>>(
  source: TableColumnType<RecordType>,
  index: number,
  level = 0,
): NormalizedTableColumn<RecordType> {
  const { children: sourceChildren, ...rest } = source;
  const children = Array.isArray(sourceChildren)
    ? sourceChildren.map((child, childIndex) => normalizeColumn(child, childIndex, level + 1))
    : undefined;
  return {
    ...rest,
    key: source.key ?? source.dataIndex ?? `${level}-${index}`,
    ...(children?.length ? { children } : {}),
  };
}

export function normalizeColumns<RecordType extends Record<string, unknown>>(
  columns?: TableColumnType<RecordType>[],
): NormalizedTableColumn<RecordType>[] {
  return Array.isArray(columns)
    ? columns.map((column, index) => normalizeColumn(column, index))
    : [];
}

export function flattenColumns<RecordType extends Record<string, unknown>>(
  columns: NormalizedTableColumn<RecordType>[],
): NormalizedTableColumn<RecordType>[] {
  return columns.flatMap((column) =>
    column.children?.length ? flattenColumns(column.children) : [column],
  );
}

function columnDepth<RecordType extends Record<string, unknown>>(
  column: NormalizedTableColumn<RecordType>,
): number {
  return column.children?.length
    ? 1 + Math.max(...column.children.map((child) => columnDepth(child)))
    : 1;
}

export function buildHeaderRows<RecordType extends Record<string, unknown>>(
  columns: NormalizedTableColumn<RecordType>[],
): TableHeaderCell<RecordType>[][] {
  const depth = columns.length ? Math.max(...columns.map((column) => columnDepth(column))) : 1;
  const rows = Array.from({ length: depth }, () => [] as TableHeaderCell<RecordType>[]);
  const visit = (column: NormalizedTableColumn<RecordType>, level: number): number => {
    const colSpan = column.children?.length
      ? column.children.reduce((total, child) => total + visit(child, level + 1), 0)
      : 1;
    rows[level]!.push({
      column,
      colSpan: column.colSpan ?? colSpan,
      rowSpan: column.children?.length ? 1 : depth - level,
    });
    return colSpan;
  };
  columns.forEach((column) => visit(column, 0));
  return rows;
}

export function flattenRecords<RecordType extends Record<string, unknown>>(
  records: RecordType[],
  options: {
    childrenRecordName: string;
    expandedKeys: ReadonlySet<TableRowKey>;
    rowKey: string | number | ((record?: RecordType) => TableRowKey);
  },
  level = 0,
  parentKey?: TableRowKey,
  indexOffset = { value: 0 },
): FlatTableRecord<RecordType>[] {
  const output: FlatTableRecord<RecordType>[] = [];
  records.forEach((record) => {
    const index = indexOffset.value++;
    const key = getRecordKey(record, options.rowKey, index);
    output.push({ record, key, level, parentKey, index });
    const children = record[options.childrenRecordName];
    if (options.expandedKeys.has(key) && Array.isArray(children)) {
      output.push(
        ...flattenRecords(children as RecordType[], options, level + 1, key, indexOffset),
      );
    }
  });
  return output;
}

export function fixedOffsets<RecordType extends Record<string, unknown>>(
  columns: NormalizedTableColumn<RecordType>[],
): Map<TableRowKey, { side: 'left' | 'right'; value: number; edge: boolean }> {
  const output = new Map<TableRowKey, { side: 'left' | 'right'; value: number; edge: boolean }>();
  let left = 0;
  const leftColumns = columns.filter((column) => column.fixed === true || column.fixed === 'left');
  leftColumns.forEach((column, index) => {
    output.set(column.key, { side: 'left', value: left, edge: index === leftColumns.length - 1 });
    left +=
      typeof column.__width === 'number'
        ? column.__width
        : typeof column.width === 'number'
          ? column.width
          : 0;
  });
  let right = 0;
  const rightColumns = columns.filter((column) => column.fixed === 'right').reverse();
  rightColumns.forEach((column, reverseIndex) => {
    output.set(column.key, {
      side: 'right',
      value: right,
      edge: reverseIndex === rightColumns.length - 1,
    });
    right +=
      typeof column.__width === 'number'
        ? column.__width
        : typeof column.width === 'number'
          ? column.width
          : 0;
  });
  return output;
}

export function normalizeFixed(value?: TableFixed): 'left' | 'right' | undefined {
  return value === true || value === 'left' ? 'left' : value === 'right' ? 'right' : undefined;
}
