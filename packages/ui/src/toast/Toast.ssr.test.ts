import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import { useToast } from './index';

describe('Toast SSR', () => {
  it('根入口导入不访问 DOM，空 holder 可服务端渲染', async () => {
    const Root = defineComponent({
      setup() {
        const [, Holder] = useToast();
        return () => h('main', [h(Holder)]);
      },
    });
    await expect(renderToString(createSSRApp(Root))).resolves.toContain('semi-toast-innerWrapper');
  });
});
