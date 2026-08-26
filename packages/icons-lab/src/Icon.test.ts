import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import * as labPackage from './index';
import { IconAvatar } from './icons';

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

  it('彩色图标可用服务端 HTML 无警告 hydration', async () => {
    const renderIcon = () => h(IconAvatar, { 'aria-label': '头像', size: 'large' });
    const serverApp = createSSRApp({ render: renderIcon });
    const host = document.createElement('div');
    host.innerHTML = await renderToString(serverApp);

    const warnings: string[] = [];
    const clientApp = createSSRApp({ render: renderIcon });
    clientApp.config.warnHandler = (message) => warnings.push(message);
    clientApp.mount(host);

    expect(warnings).toEqual([]);
    expect(host.querySelector('.semi-icon-avatar')).not.toBeNull();
    clientApp.unmount();
  });
});
