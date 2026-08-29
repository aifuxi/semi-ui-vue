import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

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

  it('hydration 无警告并保留语义 ul/li', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () => h(List, null, () => h(ListItem, null, () => 'Hydrate')),
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    expect(container.querySelectorAll('ul.semi-list-items > li.semi-list-item')).toHaveLength(1);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
  });
});
