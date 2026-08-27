// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import AutoComplete from './AutoComplete.vue';

describe('AutoComplete SSR', () => {
  it('服务端渲染默认值、输入框与 ARIA，不创建 Portal 或 DOM 副作用', async () => {
    const html = await renderToString(
      h(AutoComplete, {
        id: 'ssr-autocomplete',
        data: ['semi', 'design'],
        defaultValue: 'semi',
        placeholder: '搜索',
      }),
    );
    expect(html).toContain('id="ssr-autocomplete"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('value="semi"');
    expect(html).toContain('placeholder="搜索"');
    expect(html).not.toContain('semi-portal');
  });
});
