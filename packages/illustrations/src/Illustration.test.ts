import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';

import { IllustrationNoContent } from './illustrations';

describe('Semi Illustrations', () => {
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
