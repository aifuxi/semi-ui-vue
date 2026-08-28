import { renderToString } from '@vue/server-renderer';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Carousel from './Carousel.vue';

describe('Carousel SSR', () => {
  it('服务端渲染基础 DOM、默认箭头/指示器、动画 style 与原生 attrs，不创建 timer', async () => {
    const interval = vi.spyOn(globalThis, 'setInterval');
    const html = await renderToString(
      h(
        Carousel,
        { autoPlay: true, className: 'ssr-carousel', 'aria-label': 'SSR carousel' },
        {
          default: () => [
            h('section', { class: 'first', style: { color: 'red' } }, 'one'),
            h('section', 'two'),
          ],
        },
      ),
    );
    expect(html).toContain('semi-carousel ssr-carousel');
    expect(html).toContain('aria-label="SSR carousel"');
    expect(html).toContain('semi-carousel-content-item-current');
    expect(html).toContain('animation-duration:300ms');
    expect(html).toContain('semi-carousel-indicator-dot');
    expect(html).toContain('semi-carousel-arrow-prev');
    expect(html).toContain('Previous index');
    expect(interval).not.toHaveBeenCalled();
    interval.mockRestore();
  });

  it('服务端尊重显式 false 与单项边界，并渲染自定义箭头 slot', async () => {
    const hidden = await renderToString(
      h(
        Carousel,
        { autoPlay: false, showArrow: false, showIndicator: false },
        { default: () => [h('div', 'one'), h('div', 'two')] },
      ),
    );
    expect(hidden).not.toContain('semi-carousel-arrow');
    expect(hidden).not.toContain('semi-carousel-indicator');

    const custom = await renderToString(
      h(
        Carousel,
        { autoPlay: false },
        {
          default: () => [h('div', 'one'), h('div', 'two')],
          leftArrow: () => h('span', 'custom-left'),
          rightArrow: () => h('span', 'custom-right'),
        },
      ),
    );
    expect(custom).toContain('custom-left');
    expect(custom).toContain('custom-right');

    const single = await renderToString(
      h(Carousel, null, { default: () => h('article', 'single') }),
    );
    expect(single).not.toContain('semi-carousel-arrow');
    expect(single).not.toContain('semi-carousel-indicator');
  });
});
