import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import { IconAvatar } from './icons';
import * as labPackage from './index';

describe('Icon Lab', () => {
  it('保留彩色图标的固定颜色、mask 与尺寸契约', async () => {
    const html = await renderToString(h(IconAvatar, { size: 'large' }));

    expect(html).toContain('semi-icon-large');
    expect(html).toContain('semi-icon-avatar');
    expect(html).toContain('fill="#FBCD2C"');
    expect(html).toContain('<mask');
  });

  it('完整导出并可服务端渲染 84 个固定 Lab 图标', async () => {
    const components = Object.entries(labPackage).filter(([name]) => /^Icon[A-Z]/.test(name));
    expect(components).toHaveLength(84);

    const html = await Promise.all(components.map(([, component]) => renderToString(h(component))));
    expect(html.every((item) => item.includes('class="semi-icon'))).toBe(true);
    expect(html.every((item) => item.includes('<svg'))).toBe(true);
  });
});
