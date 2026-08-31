import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import UserGuide from './UserGuide.vue';

describe('UserGuide SSR', () => {
  it('does not access DOM or create a Portal while hidden', async () => {
    const popup = await renderToString(
      createSSRApp({
        render: () => h(UserGuide, { steps: [{ title: 'Popup SSR' }], visible: false }),
      }),
    );
    const modal = await renderToString(
      createSSRApp({
        render: () =>
          h(UserGuide, { mode: 'modal', steps: [{ title: 'Modal SSR' }], visible: false }),
      }),
    );
    expect(popup).not.toContain('semi-userGuide');
    expect(modal).not.toContain('semi-portal');
  });

  it('hydrates without warnings and measures only after the client opens', async () => {
    const target = document.createElement('button');
    target.getBoundingClientRect = () => new DOMRect(80, 100, 120, 40);
    document.body.append(target);
    const visible = ref(false);
    const Host = defineComponent({
      render: () =>
        h(UserGuide, {
          steps: [{ target, title: 'Hydrated guide' }],
          visible: visible.value,
        }),
    });
    const serverHtml = await renderToString(createSSRApp(Host));
    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.append(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const app = createSSRApp(Host);
    app.mount(container);
    await nextTick();
    visible.value = true;
    await nextTick();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await nextTick();

    expect(consoleError).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Hydrated guide');
    expect(document.querySelector('.semi-userGuide-spotlight')).not.toBeNull();
    app.unmount();
    await nextTick();
    expect(document.querySelector('.semi-userGuide-spotlight')).toBeNull();
    target.remove();
    container.remove();
    consoleError.mockRestore();
  });
});
