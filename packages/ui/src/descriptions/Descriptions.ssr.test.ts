import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';

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
});
