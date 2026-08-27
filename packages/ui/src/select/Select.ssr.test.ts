// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import Select from './Select.vue';
import SelectOption from './SelectOption.vue';

describe('Select SSR', () => {
  it('服务端渲染声明式选项、缺省选择与 ARIA，不创建 DOM 副作用', async () => {
    const html = await renderToString(
      h(Select, { defaultValue: 'douyin', id: 'ssr-select' }, () => [
        h(SelectOption, { value: 'douyin' }, () => '抖音'),
        h(SelectOption, { value: 'ulikecam' }, () => '轻颜相机'),
      ]),
    );

    expect(html).toContain('id="ssr-select"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('抖音');
    expect(html).not.toContain('semi-portal');
  });
});
