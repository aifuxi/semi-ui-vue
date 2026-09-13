import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import List from './List.vue';
import ListItem from './ListItem.vue';

describe('List SSR', () => {
  it('稳定输出 dataSource、header/footer、Grid 与 loading DOM', async () => {
    const html = await renderToString(
      h(
        List,
        {
          bordered: true,
          dataSource: ['A', 'B'],
          grid: { gutter: 12, span: 12 },
          header: 'Header',
          footer: 'Footer',
          loading: true,
        },
        {
          item: ({ item, index }: { item: unknown; index: number }) =>
            h(ListItem, { 'data-index': index }, () => String(item)),
        },
      ),
    );
    expect(html).toContain('semi-list-bordered');
    expect(html).toContain('semi-list-grid');
    expect(html).toContain('semi-spin-large semi-spin-block');
    expect(html).toContain('semi-row-flex');
    expect(html.match(/semi-col-12/g)).toHaveLength(2);
    expect(html).toContain('data-index="0"');
    expect(html).toContain('Header');
    expect(html).toContain('Footer');
  });

  it('无数据时稳定输出 locale empty DOM', async () => {
    const html = await renderToString(h(List, { dataSource: [] }));
    expect(html).toContain('semi-list-items');
    expect(html).toContain('semi-list-empty');
    expect(html).toContain('暂无数据');
  });
});
