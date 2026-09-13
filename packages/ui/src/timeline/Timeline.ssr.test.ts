import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';

import { Timeline, TimelineItem } from './index';

describe('Timeline SSR', () => {
  it('渲染 slot、固定 DOM/class 与 ARIA', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Timeline, { ariaLabel: '部署时间线', mode: 'center' }, () => [
            h(TimelineItem, { time: h('time', '10:00'), type: 'success' }, () => '已部署'),
            h(TimelineItem, { position: 'right', extra: '详情' }, () => '验证中'),
          ]),
      }),
    );

    expect(html).toContain(
      '<ul aria-label="部署时间线" class="semi-timeline semi-timeline-center"',
    );
    expect(html).toContain('semi-timeline-item-left');
    expect(html).toContain('semi-timeline-item-right');
    expect(html).toContain('semi-timeline-item-head-success');
    expect(html).toContain('<time>10:00</time>');
    expect(html).toContain('aria-hidden="true"');
  });

  it('渲染 dataSource 的自定义 VNode 与 data 属性', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Timeline, {
            dataSource: [
              {
                content: h('strong', '创建服务现场'),
                dot: h('span', '!'),
                extra: '辅助说明',
                time: '2019-07-14 10:35',
                'data-row': 'first',
              },
            ],
          }),
      }),
    );

    expect(html).toContain('data-row="first"');
    expect(html).toContain('semi-timeline-item-head-custom');
    expect(html).toContain('<strong>创建服务现场</strong>');
    expect(html).toContain('辅助说明');
    expect(html).toContain('2019-07-14 10:35');
  });
});
