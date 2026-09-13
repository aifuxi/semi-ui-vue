import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import Notification, { useNotification } from './index';

describe('Notification SSR', () => {
  it('根导出和子路径 import 不访问 document', () => {
    expect(typeof Notification.info).toBe('function');
    expect(typeof Notification.destroyAll).toBe('function');
    expect(typeof useNotification).toBe('function');
  });

  it('空 context holder 输出稳定空 DOM', async () => {
    const App = defineComponent({
      setup() {
        const [, Holder] = useNotification();
        return () => h('section', { 'data-ssr': 'notification' }, [h(Holder)]);
      },
    });
    const first = await renderToString(createSSRApp(App));
    const second = await renderToString(createSSRApp(App));
    expect(first).toBe(second);
    expect(first).toContain('<section data-ssr="notification">');
    expect(first).not.toContain('role="alert"');
  });
});
