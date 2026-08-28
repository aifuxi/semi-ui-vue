import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import { createSSRApp, h, type Component } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import * as illustrations from './index';
import {
  IllustrationFailure,
  IllustrationNoContent,
  IllustrationNoContentDark,
} from './illustrations';

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

  it('把 class/style/ARIA/data 与原生事件透传到根 SVG并允许覆盖默认值', async () => {
    const click = vi.fn();
    const wrapper = mount(IllustrationNoContent, {
      attrs: {
        'aria-hidden': 'false',
        class: 'consumer-illustration',
        'data-probe': 'illustration',
        height: 96,
        onClick: click,
        style: { color: 'red' },
        width: 128,
      },
    });
    const svg = wrapper.get('svg');

    expect(svg.attributes()).toMatchObject({
      'aria-hidden': 'false',
      class: 'consumer-illustration',
      'data-probe': 'illustration',
      height: '96',
      width: '128',
    });
    expect(svg.attributes('style')).toContain('color: red');
    await svg.trigger('click');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('可用服务端 HTML 无警告 hydration', async () => {
    const renderIllustration = () =>
      h(IllustrationNoContent, { class: 'hydrated-illustration', width: 150 });
    const serverApp = createSSRApp({ render: renderIllustration });
    const host = document.createElement('div');
    host.innerHTML = await renderToString(serverApp);

    const warnings: string[] = [];
    const clientApp = createSSRApp({ render: renderIllustration });
    clientApp.config.warnHandler = (message) => warnings.push(message);
    clientApp.mount(host);

    expect(warnings).toEqual([]);
    expect(host.querySelector('svg.hydrated-illustration')).not.toBeNull();
    clientApp.unmount();
  });
});
