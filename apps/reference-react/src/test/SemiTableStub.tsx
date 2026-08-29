import React from 'react';
import type { TableProps } from '@semi-v2.102.0/table';

export default function SemiTableStub(props: TableProps): React.ReactElement {
  const columns = props.columns ?? [];
  const data = props.dataSource ?? [];
  const selected = new Set(props.rowSelection?.selectedRowKeys ?? []);
  const dataAttrs = Object.fromEntries(
    Object.entries(props).filter(([key]) => key.startsWith('data-')),
  );
  return (
    <div className="semi-table-wrapper">
      <table className="semi-table" {...dataAttrs}>
        <thead className="semi-table-thead">
          <tr className="semi-table-row">
            <th className="semi-table-row-head semi-table-column-selection" />
            {columns.map((column) => (
              <th key={column.key} className="semi-table-row-head">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="semi-table-tbody">
          {data.map((record, index) => {
            const key = (record as Record<string, unknown>).key as string | number;
            return (
              <tr
                key={key}
                className={`semi-table-row${selected.has(key) ? ' semi-table-row-selected' : ''}`}
              >
                <td className="semi-table-row-cell semi-table-column-selection" />
                {columns.map((column) => {
                  const value = (record as Record<string, unknown>)[column.dataIndex ?? ''];
                  return (
                    <td key={column.key} className="semi-table-row-cell">
                      {column.render ? column.render(value, record, index) : String(value ?? '')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
