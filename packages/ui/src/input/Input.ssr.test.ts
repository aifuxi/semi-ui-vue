import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Input, { InputGroup, TextArea } from './index';

describe('Input SSR', () => {
  it('渲染 Input/TextArea/InputGroup DOM、ARIA 与 slots，且不创建浏览器副作用', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(
              Input,
              {
                value: 'Semi',
                addonBefore: 'https://',
                ariaLabel: '网址',
                showClear: true,
              },
              { suffix: () => '.com' },
            ),
            h(TextArea, {
              defaultValue: '第一行\n第二行',
              showCounter: true,
              showLineNumber: true,
            }),
            h(InputGroup, { label: { text: '分组', name: 'group' }, size: 'large' }, () =>
              h(Input, { defaultValue: 'child' }),
            ),
          ]),
      }),
    );
    expect(html).toContain('semi-input-wrapper');
    expect(html).toContain('aria-label="网址"');
    expect(html).toContain('semi-input-textarea-lineNumber');
    expect(html).toContain('semi-input-textarea-counter');
    expect(html).toContain('semi-input-group-wrapper');
    expect(html).toContain('semi-form-field-label-text');
    expect(html).toContain('semi-input-large');
  });
});
