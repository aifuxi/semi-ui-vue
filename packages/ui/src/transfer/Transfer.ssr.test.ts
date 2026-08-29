import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import { ConfigProvider } from '../config-provider';
import Transfer from './Transfer.vue';

const data = [
  { key: 'a', label: 'Alpha', value: 'alpha' },
  { key: 'b', label: 'Beta', value: 'beta' },
];

describe('Transfer SSR', () => {
  it('无 browser global 时输出 list、搜索、ARIA、选中项与 data/style', async () => {
    const html = await renderToString(
      h(Transfer, {
        className: 'ssr-transfer',
        dataSource: data,
        defaultValue: ['alpha'],
        'data-kind': 'ssr',
        style: { width: '520px' },
      }),
    );
    expect(html).toContain('semi-transfer ssr-transfer');
    expect(html).toContain('data-kind="ssr"');
    expect(html).toContain('width:520px');
    expect(html).toContain('role="search"');
    expect(html).toContain('aria-label="Option list"');
    expect(html).toContain('aria-label="Selected list"');
    expect(html).toContain('Alpha');
  });

  it('输出 group/tree/loading/disabled、locale/RTL 与虚拟列表静态窗口', async () => {
    const group = await renderToString(
      h(Transfer, {
        dataSource: [{ title: 'SSR Group', children: data }],
        disabled: true,
        type: 'groupList',
      }),
    );
    expect(group).toContain('semi-transfer-disabled');
    expect(group).toContain('semi-transfer-group-title');
    expect(group).toContain('SSR Group');

    const tree = await renderToString(
      h(Transfer, {
        dataSource: [{ key: 'root', label: 'Root', value: 'root', children: data }],
        type: 'treeList',
      }),
    );
    expect(tree).toContain('semi-tree');

    const loading = await renderToString(h(Transfer, { dataSource: data, loading: true }));
    expect(loading).toContain('semi-spin');

    const localized = await renderToString(
      h(
        ConfigProvider,
        {
          direction: 'rtl',
          locale: {
            code: 'en-US',
            Transfer: { emptyLeft: 'SSR empty', emptyRight: 'SSR selected empty' },
          },
        },
        () => h(Transfer, { dataSource: [] }),
      ),
    );
    expect(localized).toContain('semi-rtl');
    expect(localized).toContain('SSR empty');
    expect(localized).toContain('SSR selected empty');

    const virtual = await renderToString(
      h(Transfer, {
        dataSource: data,
        defaultValue: ['alpha', 'beta'],
        virtualize: { height: 36, itemSize: 36 },
      }),
    );
    expect(virtual).toContain('semi-transfer-right-virtual-list');
    expect(virtual).toContain('role="listitem"');
  });

  it('hydration 无警告并保留受控 DOM', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = { render: () => h(Transfer, { dataSource: data, value: ['alpha'] }) };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    expect(container.querySelectorAll('.semi-transfer-right-item')).toHaveLength(1);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
  });
});
