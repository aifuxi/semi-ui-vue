import { createSSRApp, defineComponent } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import { ConfigProvider } from '../config-provider';
import Badge from './index';

describe('Badge SSR', () => {
  it('服务端渲染计数、自定义 slot、attrs 与 RTL 缺省位置', async () => {
    const app = createSSRApp(
      defineComponent({
        components: { Badge, ConfigProvider },
        template: `
          <ConfigProvider direction="rtl">
            <Badge :count="120" :overflow-count="99" aria-label="未读消息"><i>base</i></Badge>
            <Badge><template #count><strong>VIP</strong></template><i>base</i></Badge>
            <Badge count="NEW" />
          </ConfigProvider>
        `,
      }),
    );
    const html = await renderToString(app);
    expect(html).toContain('class="semi-rtl"');
    expect(html).toContain('aria-label="未读消息"');
    expect(html).toContain('semi-badge-leftTop');
    expect(html).toContain('semi-badge-count');
    expect(html).toContain('99+');
    expect(html).toContain('semi-badge-custom');
    expect(html).toContain('<strong>VIP</strong>');
    expect(html).toContain('semi-badge-block');
  });
});
