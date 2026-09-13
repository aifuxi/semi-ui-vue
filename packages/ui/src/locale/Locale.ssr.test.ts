import { describe, expect, it } from 'vitest';
import { h, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';

import LocaleConsumer from './LocaleConsumer.vue';
import LocaleProvider from './LocaleProvider.vue';
import type { LocaleConsumerSlotProps } from './types';

describe('Locale SSR', () => {
  it('Provider/Consumer 服务端透明输出 slot DOM', async () => {
    const html = await renderToString(
      h(
        LocaleProvider,
        { locale: { code: 'ssr', currency: 'SSR', Widget: { label: 'Rendered' } } },
        {
          default: () =>
            h(
              LocaleConsumer as Component,
              { componentName: 'Widget' },
              {
                default: (payload: LocaleConsumerSlotProps<{ label: string }>) =>
                  h('output', { 'data-locale': payload.localeCode }, payload.localeData.label),
              },
            ),
        },
      ),
    );

    expect(html).toBe(
      '<!--[--><!--[--><output data-locale="ssr">Rendered</output><!--]--><!--]-->',
    );
  });
});
