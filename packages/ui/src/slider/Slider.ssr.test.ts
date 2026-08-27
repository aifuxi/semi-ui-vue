// @vitest-environment node

import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import Slider from './index';

describe('Slider SSR', () => {
  it('输出默认/range/vertical/disabled/marks/ARIA，且不创建 Portal 或浏览器副作用', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h('div', [
            h(Slider, { defaultValue: 30, 'aria-label': '音量' }),
            h(Slider, { range: true, defaultValue: [20, 60], marks: { 20: '低', 60: '高' } }),
            h(Slider, { vertical: true, verticalReverse: true, disabled: true }),
          ]),
      }),
    );
    expect(html).toContain('semi-slider-wrapper');
    expect(html).toContain('semi-slider-vertical-wrapper');
    expect(html).toContain('semi-slider-reverse');
    expect(html).toContain('semi-slider-disabled');
    expect(html).toContain('role="slider"');
    expect(html).toContain('aria-orientation="vertical"');
    expect(html).toContain('semi-slider-mark');
    expect(html).not.toContain('semi-portal');
  });
});
