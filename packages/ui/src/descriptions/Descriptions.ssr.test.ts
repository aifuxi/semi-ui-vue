import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';

import Descriptions from './Descriptions.vue';
import DescriptionsItem from './DescriptionsItem.vue';

describe('Descriptions SSR', () => {
  it('无 browser global 时稳定输出 vertical data、plain、class/style/data attrs', async () => {
    const html = await renderToString(
      h(Descriptions, {
        align: 'plain',
        className: 'ssr-descriptions',
        data: [{ key: '键', value: () => h('strong', '值') }],
        'data-kind': 'ssr',
        style: { width: '320px' },
      }),
    );
    expect(html).toContain('semi-descriptions-plain');
    expect(html).toContain('ssr-descriptions');
    expect(html).toContain('data-kind="ssr"');
    expect(html).toContain('width:320px');
    expect(html).toContain('semi-descriptions-key');
    expect(html).toContain('键');
    expect(html).toContain('<strong>值</strong>');
  });

  it('稳定输出 horizontal Item slot、hidden 过滤与补齐 colspan', async () => {
    const html = await renderToString(
      h(
        Descriptions,
        { column: 3, layout: 'horizontal' },
        {
          default: () => [
            h(DescriptionsItem, { itemKey: 'A', span: 2 }, () => '1'),
            h(DescriptionsItem, { hidden: true, itemKey: '隐藏' }, () => 'x'),
            h(DescriptionsItem, { itemKey: 'B' }, () => '2'),
          ],
        },
      ),
    );
    expect(html.match(/<tr/g)).toHaveLength(1);
    expect(html).toContain('colspan="3"');
    expect(html).toContain('colspan="1"');
    expect(html).not.toContain('隐藏');
  });

  it('hydration 无警告且保留固定 table DOM', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Host = {
      render: () => h(Descriptions, { data: [{ key: 'Hydrate', value: 'ok' }] }),
    };
    const html = await renderToString(h(Host));
    const container = document.createElement('div');
    container.innerHTML = html;
    const app = createSSRApp(Host);
    app.mount(container);
    expect(container.querySelectorAll('.semi-descriptions table tbody tr')).toHaveLength(1);
    expect(error).not.toHaveBeenCalled();
    app.unmount();
    error.mockRestore();
  });
});
