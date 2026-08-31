import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Feedback from './Feedback.vue';

describe('Feedback SSR', () => {
  it('不可见 popup/modal 都不在服务端创建 Portal 或访问 DOM', async () => {
    const popup = await renderToString(
      createSSRApp({ render: () => h(Feedback, { title: 'Popup SSR', visible: false }) }),
    );
    const modal = await renderToString(
      createSSRApp({
        render: () => h(Feedback, { mode: 'modal', title: 'Modal SSR', visible: false }),
      }),
    );
    expect(popup).not.toContain('semi-portal');
    expect(popup).not.toContain('Popup SSR');
    expect(modal).not.toContain('semi-portal');
    expect(modal).not.toContain('Modal SSR');
  });

  it('hydration 无 warning，客户端打开后进入稳定自定义容器并完整清理', async () => {
    const portal = document.createElement('div');
    document.body.appendChild(portal);
    const visible = ref(false);
    const Host = defineComponent({
      render: () =>
        h(Feedback, {
          getPopupContainer: () => portal,
          motion: false,
          title: 'Hydration Feedback',
          visible: visible.value,
        }),
    });
    const serverHtml = await renderToString(createSSRApp(Host));
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();
    visible.value = true;
    await nextTick();
    await nextTick();

    expect(consoleError).not.toHaveBeenCalled();
    expect(portal.querySelector('.semi-feedback')?.textContent).toContain('Hydration Feedback');
    app.unmount();
    await nextTick();
    expect(portal.querySelector('.semi-portal')).toBeNull();
    portal.remove();
    container.remove();
    consoleError.mockRestore();
  });
});
