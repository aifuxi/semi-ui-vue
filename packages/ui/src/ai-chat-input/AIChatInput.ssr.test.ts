import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import { describe, expect, it } from 'vitest';

import AIChatInput from './AIChatInput.vue';

describe('AIChatInput SSR', () => {
  it('imports and renders without creating a browser editor', async () => {
    const app = createSSRApp({
      render: () =>
        h(AIChatInput, {
          placeholder: 'Ask anything',
          immediatelyRender: false,
          references: [{ id: 'ssr', type: 'text', content: 'SSR reference' }],
        }),
    });
    const html = await renderToString(app);
    expect(html).toContain('semi-aiChatInput');
    expect(html).toContain('SSR reference');
    expect(html).not.toContain('contenteditable');
  });
});
