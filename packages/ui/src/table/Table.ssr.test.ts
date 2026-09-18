import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import { Table } from './index';

const props = {
  columns: [
    { dataIndex: 'name', key: 'name', title: 'Name' },
    { dataIndex: 'value', key: 'value', title: 'Value' },
  ],
  dataSource: [{ key: 'one', name: 'One', value: 1 }],
  pagination: false,
};

describe('Table SSR', () => {
  it('无 DOM 环境输出稳定 table/thead/tbody 与公开内容', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(Table, props) }));
    expect(html).toContain('semi-table-wrapper-ltr');
    expect(html).toContain('role="columnheader"');
    expect(html).toContain('role="gridcell"');
    expect(html).toContain('One');
  });

  it('空态、选择与展开 SSR 不读取浏览器全局', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Table, {
            columns: props.columns,
            dataSource: [],
            empty: 'Empty',
            pagination: false,
            rowSelection: true,
          }),
      }),
    );
    expect(html).toContain('semi-table-placeholder');
    expect(html).toContain('Empty');
    expect(html).toContain('column-selection');
  });
});
