import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { h, type Component } from 'vue';

import { IconSpin } from './icons';
import * as iconPackage from './index';

describe('Icon', () => {
  it('完整导出并可服务端渲染 523 个固定稳定图标', async () => {
    const components = Object.entries(iconPackage).filter(([name]) => /^Icon[A-Z]/.test(name));
    expect(components).toHaveLength(523);
    expect(IconSpin.elementType).toBe('Icon');

    const rendered = await Promise.all(
      components.map(async ([name, component]) => ({
        name,
        html: await renderToString(h(component as Component)),
      })),
    );
    expect(rendered.every(({ html }) => html.includes('class="semi-icon'))).toBe(true);
    expect(rendered.every(({ html }) => html.includes('<svg'))).toBe(true);
  });
});
