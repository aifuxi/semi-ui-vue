import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { AIChatDialogue } from './index';

describe('AIChatDialogue SSR', () => {
  it('SSR import/render 不访问浏览器 API，并输出消息、loading、hint 与操作区外壳', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(AIChatDialogue, {
            roleConfig: { assistant: { name: 'Assistant' }, user: { name: 'User' } },
            chats: [
              { id: 'one', role: 'assistant', status: 'in_progress' },
              { id: 'two', role: 'user', content: 'question', status: 'completed' },
            ],
            hints: ['Next'],
          }),
      }),
    );
    expect(html).toContain('semi-ai-chat-dialogue-list');
    expect(html).toContain('semi-ai-chat-dialogue-content-loading');
    expect(html).toContain('semi-ai-chat-dialogue-hint-item');
    expect(html).toContain('Assistant');
    expect(html).not.toContain('semi-portal');
  });
});
