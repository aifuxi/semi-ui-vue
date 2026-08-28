// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import TagInput from './index';

describe('TagInput SSR', () => {
  it('输出默认、禁用、校验、折叠与 slot DOM，且不创建 Portal', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(TagInput, {
              'aria-label': 'tags',
              defaultValue: ['Semi', 'Vue', 'SSR'],
              maxTagCount: 1,
              placeholder: '请输入',
            }),
            h(
              TagInput,
              { defaultValue: ['disabled'], disabled: true, validateStatus: 'error' },
              { tag: ({ value }: { value: string }) => h('strong', value) },
            ),
          ]),
      }),
    );
    expect(html).toContain('class="semi-tagInput');
    expect(html).toContain('semi-tagInput-wrapper-n');
    expect(html).toContain('+2');
    expect(html).toContain('semi-tagInput-disabled');
    expect(html).toContain('semi-tagInput-error');
    expect(html).toContain('<strong>disabled</strong>');
    expect(html).toContain('aria-label="input value"');
    expect(html).not.toContain('semi-portal');
    expect(html).not.toContain('vendor/semi-design');
  });
});
