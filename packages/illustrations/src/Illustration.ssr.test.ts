import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { h, type Component } from 'vue';

import {
  IllustrationFailure,
  IllustrationNoContent,
  IllustrationNoContentDark,
} from './illustrations';
import * as illustrations from './index';

describe('Semi Illustrations', () => {
  it('完整导出并可服务端渲染 16 个固定插画', async () => {
    const components = Object.entries(illustrations).filter(([name]) =>
      /^Illustration[A-Z]/.test(name),
    );
    expect(components).toHaveLength(16);

    const html = await Promise.all(
      components.map(([, component]) => renderToString(h(component as Component))),
    );
    expect(html.every((item) => item.includes('<svg'))).toBe(true);
    expect(html.every((item) => item.includes('viewBox="0 0 200 200"'))).toBe(true);
    expect(html.every((item) => item.includes('aria-hidden="true"'))).toBe(true);
  });

  it('保留默认画布、light/dark 多色和固定 defs 引用', async () => {
    const light = await renderToString(h(IllustrationNoContent));
    const dark = await renderToString(h(IllustrationNoContentDark));
    const failure = await renderToString(h(IllustrationFailure));

    expect(light).toContain('width="200"');
    expect(light).toContain('height="200"');
    expect(light).toContain('fill="#E6E8EA"');
    expect(light).toContain('var(--semi-color-primary-light-default)');
    expect(dark).toContain('fill="#888D92"');
    expect(dark).toContain('fill="#1C1F23"');
    expect(failure).toContain('id="clip_failure_96_39_65"');
    expect(failure).toContain('clip-path="url(#clip_failure_96_39_65)"');
  });
});
