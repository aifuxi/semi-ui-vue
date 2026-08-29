import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';

import Tag, { SplitTagGroup, TagGroup } from './index';

describe('Tag SSR', () => {
  it('SSR 渲染 Tag、TagGroup 与 SplitTagGroup 且不访问浏览器全局', async () => {
    const html = await renderToString(
      h('section', [
        h(Tag, { color: 'blue', visible: false }, () => 'SSR Tag'),
        h(TagGroup, { maxTagCount: 1, tagList: [{ content: 'A' }, { content: 'B' }] }),
        h(SplitTagGroup, { 'aria-label': 'split' }, () => [
          h(Tag, { color: 'cyan' }, () => 'One'),
          h(Tag, { color: 'teal' }, () => 'Two'),
        ]),
      ]),
    );
    expect(html).toContain('semi-tag-blue-light semi-tag-invisible');
    expect(html).toContain('semi-tag-group-max');
    expect(html).toContain('+1');
    expect(html).toContain('semi-tag-first');
    expect(html).toContain('semi-tag-last');
    expect(html).toContain('role="group"');
  });
});
