import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Radio, { RadioGroup } from './index';

describe('Radio SSR', () => {
  it('渲染单项、options/slot Group、类型、状态与 ARIA 且不创建客户端副作用', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(Radio, { checked: true, extra: '说明', ariaLabel: '选中项' }, () => '标题'),
            h(RadioGroup, {
              defaultValue: 'b',
              options: ['a', 'b'],
              type: 'button',
              buttonSize: 'small',
              ariaLabel: '按钮组',
            }),
            h(RadioGroup, { defaultValue: 1, type: 'pureCard', direction: 'vertical' }, () =>
              h(Radio, { value: 1 }, () => '卡片'),
            ),
          ]),
      }),
    );
    expect(html).toContain('semi-radio-checked');
    expect(html).toContain('semi-radio-extra');
    expect(html).toContain('aria-label="选中项"');
    expect(html).toContain('semi-radioGroup-buttonRadio');
    expect(html).toContain('semi-radio-buttonRadioGroup-small');
    expect(html).toContain('semi-radio-inner-pureCardRadio');
    expect(html.match(/type="radio"/g)).toHaveLength(4);
  });
});
