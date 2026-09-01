import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';

import { Chat } from './index';

describe('Chat SSR', () => {
  it('SSR-safe import 并输出稳定消息、hint 与输入区外壳', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Chat, {
            chats: [{ id: 'ssr', role: 'assistant', content: '**SSR ready**' }],
            hints: ['Continue'],
            enableUpload: false,
          }),
      }),
    );
    expect(html).toContain('semi-chat');
    expect(html).toContain('semi-chat-chatBox');
    expect(html).toContain('<strong>SSR ready</strong>');
    expect(html).toContain('semi-chat-hint-item');
    expect(html).toContain('semi-chat-inputBox');
  });
});
