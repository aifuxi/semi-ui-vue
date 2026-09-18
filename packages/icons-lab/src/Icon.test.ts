import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import { IconAvatar } from './icons';

describe('Icon Lab', () => {
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
