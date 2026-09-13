import { createSSRApp, defineComponent } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import { Card, CardGroup, CardMeta } from './index';

describe('Card SSR', () => {
  it('服务端渲染 Card、Meta、Group、命名 slots、loading 与 ARIA', async () => {
    const app = createSSRApp(
      defineComponent({
        components: { Card, CardGroup, CardMeta },
        template: `
          <CardGroup type="grid" data-probe="group">
            <Card title="默认标题" aria-label="默认卡片"><CardMeta title="Meta" description="描述" /></Card>
            <Card :bordered="false" :header-line="false" footer-line loading aria-label="加载卡片">
              <template #header><strong>自定义头部</strong></template>
              <template #cover><div>封面</div></template>
              <template #actions><button>操作</button></template>
              <template #footer>页脚</template>
              正文
            </Card>
          </CardGroup>
        `,
      }),
    );
    const html = await renderToString(app);
    expect(html).toContain('semi-card-group-grid');
    expect(html).toContain('data-probe="group"');
    expect(html).toContain('semi-card-bordered');
    expect(html).toContain('aria-label="默认卡片"');
    expect(html).toContain('aria-busy="false"');
    expect(html).toContain('semi-typography-h6');
    expect(html).toContain('semi-card-meta-wrapper-description');
    expect(html).toContain('aria-label="加载卡片"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('semi-skeleton-active');
    expect(html).toContain('semi-card-footer-bordered');
    expect(html).not.toContain('>正文<');
  });
});
