import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';

import { Sidebar, SidebarFileItem } from './index';

describe('Sidebar SSR', () => {
  it('visible=false 不输出容器，visible=true 输出稳定主视图', async () => {
    const hidden = await renderToString(createSSRApp(() => h(Sidebar, { visible: false })));
    expect(hidden).not.toContain('semi-sidebar-container');

    const visible = await renderToString(
      createSSRApp(() =>
        h(Sidebar, {
          visible: true,
          motion: false,
          resizable: false,
          title: 'Workspace',
          activeKey: 'code',
          options: [{ key: 'code', icon: 'C', name: 'Code' }],
          renderMainContent: () => h('strong', 'Preview'),
        }),
      ),
    );
    expect(visible).toContain('semi-sidebar-main');
    expect(visible).toContain('semi-sidebar-options');
    expect(visible).toContain('Preview');
  });

  it('FileItem SSR 不访问浏览器对象并输出富文本降级内容', async () => {
    const html = await renderToString(
      createSSRApp(() =>
        h(SidebarFileItem, {
          editable: false,
          content: '<p>Server preview</p>',
        }),
      ),
    );
    expect(html).toContain('semi-sidebar-file');
    expect(html).toContain('Server preview');
  });
});
