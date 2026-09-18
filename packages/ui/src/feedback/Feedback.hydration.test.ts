import { renderToString } from '@vue/server-renderer';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue';

import Feedback from './index';

describe('Feedback hydration', () => {
  it.each(['popup', 'modal'] as const)('%s hydration 后可关闭重开并继续提交', async (mode) => {
    const portal = document.createElement('div');
    document.body.appendChild(portal);
    const visible = ref(false);
    const Host = defineComponent({
      render: () =>
        h(Feedback, {
          getPopupContainer: () => portal,
          mode,
          onOk: () => {
            visible.value = false;
          },
          motion: true,
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
    onTestFinished(async () => {
      app.unmount();
      await nextTick();
      portal.remove();
      container.remove();
      consoleError.mockRestore();
      expect(portal.querySelector('.semi-portal')).toBeNull();
    });
    app.mount(container);
    await nextTick();
    visible.value = true;
    await nextTick();
    await nextTick();

    expect(consoleError).not.toHaveBeenCalled();
    expect(portal.querySelector('.semi-feedback')?.textContent).toContain('Hydration Feedback');
    portal.querySelector<HTMLElement>('.semi-feedback-emoji-item:last-child')!.click();
    await nextTick();
    const submitSelector =
      mode === 'popup' ? '.semi-feedback-footer button:last-child' : '[aria-label="confirm"]';
    portal.querySelector<HTMLButtonElement>(submitSelector)!.click();
    await nextTick();
    await nextTick();
    portal
      .querySelector('.semi-sidesheet-inner, .semi-modal-content')!
      .dispatchEvent(new Event('animationend'));
    await nextTick();
    expect(portal.querySelector('.semi-feedback')).toBeNull();
    visible.value = true;
    await nextTick();
    await nextTick();
    expect(portal.querySelectorAll('.semi-feedback-emoji-item')).toHaveLength(3);
    const submit = portal.querySelector<HTMLButtonElement>(submitSelector)!;
    expect(submit.disabled).toBe(true);
    portal.querySelector<HTMLElement>('.semi-feedback-emoji-item:last-child')!.click();
    await nextTick();
    expect(submit.disabled).toBe(false);
    submit.click();
    await nextTick();
    await nextTick();
    portal
      .querySelector('.semi-sidesheet-inner, .semi-modal-content')!
      .dispatchEvent(new Event('animationend'));
    await nextTick();
    expect(portal.querySelector('.semi-feedback')).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
  });
});
