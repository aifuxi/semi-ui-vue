import { describe, expect, it, vi } from 'vitest';
import { createSSRApp, defineComponent, h, nextTick, shallowRef, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';

import LocaleConsumer from './LocaleConsumer.vue';
import LocaleProvider from './LocaleProvider.vue';
import type { LocaleConsumerSlotProps } from './types';

describe('Locale hydration', () => {
  it('hydration 保持透明 DOM、响应式 locale 且无 warning', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const locale = shallowRef({ code: 'first', Widget: { label: 'First' } });
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            LocaleProvider,
            { locale: locale.value },
            {
              default: () =>
                h(
                  LocaleConsumer as Component,
                  { componentName: 'Widget' },
                  {
                    default: (payload: LocaleConsumerSlotProps<{ label: string }>) =>
                      h('span', { class: 'hydrated-locale' }, payload.localeData.label),
                  },
                ),
            },
          );
      },
    });
    const container = document.createElement('div');
    container.innerHTML = await renderToString(h(Host));
    const app = createSSRApp(Host);
    app.mount(container);
    expect(container.innerHTML).toBe(
      '<!--[--><!--[--><span class="hydrated-locale">First</span><!--]--><!--]-->',
    );
    expect(error).not.toHaveBeenCalled();

    locale.value = { code: 'second', Widget: { label: 'Second' } };
    await nextTick();
    expect(container.textContent).toBe('Second');
    app.unmount();
  });
});
