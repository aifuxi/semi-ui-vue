import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { ConfigProvider } from '../config-provider';
import { Pagination } from '../pagination';
import { LocaleProvider } from './index';
import enGB from './source/en_GB';
import jaJP from './source/ja_JP';

const pagination = () => h(Pagination, { total: 100, showTotal: true, showSizeChanger: true });

describe('Locale 文档消费者', () => {
  it('SSR 保留 ConfigProvider 优先级与缺 code 整体回退', async () => {
    const html = await renderToString(
      createSSRApp(() =>
        h('div', [
          h(LocaleProvider, { locale: jaJP }, () =>
            h(ConfigProvider, { locale: enGB }, pagination),
          ),
          h(
            LocaleProvider,
            { locale: { Pagination: { pageSize: '', jumpTo: '', page: '', total: 'wrong' } } },
            pagination,
          ),
        ]),
      ),
    );
    expect(html).toContain('Total pages: 10');
    expect(html).toContain('总页数：10');
    expect(html).not.toContain('wrong');
  });
});
